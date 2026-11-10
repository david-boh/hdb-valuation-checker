import type { Request, Response } from 'express';
import { SEED_HDB_TRANSACTIONS } from '../src/data/seedTransactions';

const DATA_GOV_SG_ENDPOINT = 'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc';

// In-memory cache for 15 minutes
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export default async function handler(req: Request, res: Response) {
  const accountKey =
    (req.headers['accountkey'] as string) ||
    process.env.ACCOUNT_KEY ||
    process.env.DATA_GOV_SG_ACCOUNT_KEY ||
    '';

  const townParam = req.query.town as string;
  const flatTypeParam = req.query.flat_type as string;
  const limitParam = parseInt((req.query.limit as string) || '500', 10);
  const offsetParam = parseInt((req.query.offset as string) || '0', 10);
  const qParam = req.query.q as string;

  const cacheKey = `${townParam || ''}_${flatTypeParam || ''}_${limitParam}_${offsetParam}_${qParam || ''}`;
  const now = Date.now();

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached.data);
    }
  }

  try {
    const targetUrl = new URL(DATA_GOV_SG_ENDPOINT);
    targetUrl.searchParams.set('limit', String(limitParam));
    targetUrl.searchParams.set('offset', String(offsetParam));

    if (qParam) {
      targetUrl.searchParams.set('q', qParam);
    }

    // Build filters object for CKAN datastore search
    const filters: Record<string, any> = {};
    if (townParam) {
      const towns = townParam.split(',').map((t) => t.trim().toUpperCase());
      if (towns.length === 1) {
        filters['town'] = towns[0];
      }
    }
    if (flatTypeParam) {
      const types = flatTypeParam.split(',').map((f) => f.trim().toUpperCase());
      if (types.length === 1) {
        filters['flat_type'] = types[0];
      }
    }

    if (Object.keys(filters).length > 0) {
      targetUrl.searchParams.set('filters', JSON.stringify(filters));
    }

    // Set request headers including mandatory AccountKey
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'HDB-Resale-Analytics/1.0',
    };
    if (accountKey) {
      headers['AccountKey'] = accountKey;
    }

    const apiResponse = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (apiResponse.ok) {
      const json = await apiResponse.json();
      if (json.success && json.result?.records) {
        const records = json.result.records;

        // Post-filter if multiple towns/flatTypes were passed
        let finalRecords = records;
        if (townParam && townParam.includes(',')) {
          const townSet = new Set(townParam.split(',').map((t) => t.trim().toUpperCase()));
          finalRecords = finalRecords.filter((r: any) => townSet.has(String(r.town).toUpperCase()));
        }
        if (flatTypeParam && flatTypeParam.includes(',')) {
          const ftSet = new Set(flatTypeParam.split(',').map((f) => f.trim().toUpperCase()));
          finalRecords = finalRecords.filter((r: any) => ftSet.has(String(r.flat_type).toUpperCase()));
        }

        const payload = {
          success: true,
          source: 'data.gov.sg',
          resource_id: 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc',
          accountKeyProvided: Boolean(accountKey),
          total: json.result.total || finalRecords.length,
          count: finalRecords.length,
          records: finalRecords,
        };

        cache.set(cacheKey, { timestamp: now, data: payload });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Cache', 'MISS');
        return res.status(200).json(payload);
      }
    }
  } catch (err: any) {
    console.warn('Failed to query data.gov.sg, using fallback dataset:', err?.message || err);
  }

  // Graceful fallback to rich local HDB seed dataset
  let fallbackRecords = [...SEED_HDB_TRANSACTIONS];

  if (townParam) {
    const townSet = new Set(townParam.split(',').map((t) => t.trim().toUpperCase()));
    fallbackRecords = fallbackRecords.filter((r) => townSet.has(r.town.toUpperCase()));
  }

  if (flatTypeParam) {
    const ftSet = new Set(flatTypeParam.split(',').map((f) => f.trim().toUpperCase()));
    fallbackRecords = fallbackRecords.filter((r) => ftSet.has(r.flat_type.toUpperCase()));
  }

  const pagedFallback = fallbackRecords.slice(offsetParam, offsetParam + limitParam);

  // Map to raw API format matching the email response
  const rawFormattedRecords = pagedFallback.map((r) => ({
    _id: r.raw_id || parseInt(r.id.replace(/\D/g, ''), 10) || 238977,
    month: r.month,
    town: r.town,
    flat_type: r.flat_type,
    block: r.block,
    street_name: r.street_name,
    storey_range: r.storey_range,
    floor_area_sqm: r.floor_area_sqm.toFixed(2),
    flat_model: r.flat_model,
    lease_commence_date: String(r.lease_commence_date),
    remaining_lease: r.remaining_lease,
    resale_price: String(r.resale_price),
  }));

  const fallbackPayload = {
    success: true,
    source: 'local_seed_fallback',
    resource_id: 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc',
    accountKeyProvided: Boolean(accountKey),
    total: fallbackRecords.length,
    count: rawFormattedRecords.length,
    records: rawFormattedRecords,
  };

  cache.set(cacheKey, { timestamp: now, data: fallbackPayload });
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(fallbackPayload);
}
