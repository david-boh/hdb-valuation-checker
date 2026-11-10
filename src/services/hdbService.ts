import { FlatType, HdbRecord, RawHdbApiRecord } from '../types/hdb';
import { SEED_HDB_TRANSACTIONS, parseRawApiRecord } from '../data/seedTransactions';

export interface ApiFilterParams {
  town?: string[];
  flatType?: FlatType[];
}

export interface ApiConfig {
  customEndpointUrl: string;
  apiKey: string;
  simulateLatencyMs: number;
  useLiveSeed: boolean;
}

const DEFAULT_CONFIG: ApiConfig = {
  customEndpointUrl: '',
  apiKey: '',
  simulateLatencyMs: 80,
  useLiveSeed: true,
};

let currentConfig: ApiConfig = { ...DEFAULT_CONFIG };
let customLoadedRecords: HdbRecord[] | null = null;

export function getApiConfig(): ApiConfig {
  return { ...currentConfig };
}

export function updateApiConfig(updates: Partial<ApiConfig>): ApiConfig {
  currentConfig = { ...currentConfig, ...updates };
  return { ...currentConfig };
}

export function setCustomLoadedRecords(records: HdbRecord[] | null) {
  customLoadedRecords = records;
}

export function getCustomLoadedRecords(): HdbRecord[] | null {
  return customLoadedRecords;
}

export { parseRawApiRecord };

/**
 * Service function to fetch HDB transactions.
 * Designed to mirror the upcoming HDB API contract:
 * - Accepts filtering by `town` (array of town names) and `flatType` (array of flat types).
 * - Normalizes the expected API response schema (_id, string floor_area_sqm, string resale_price, etc.)
 * - All other multi-dimensional filters and analytics are computed in-memory by the frontend.
 */
export async function fetchHdbTransactions(params?: ApiFilterParams): Promise<HdbRecord[]> {
  // Simulate network latency if configured
  if (currentConfig.simulateLatencyMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, currentConfig.simulateLatencyMs));
  }

  // If user pasted or imported custom raw JSON data in the UI
  if (customLoadedRecords && customLoadedRecords.length > 0) {
    let list = [...customLoadedRecords];
    if (params?.town && params.town.length > 0) {
      const townSet = new Set(params.town.map((t) => t.toUpperCase()));
      list = list.filter((item) => townSet.has(item.town.toUpperCase()));
    }
    if (params?.flatType && params.flatType.length > 0) {
      const ftSet = new Set(params.flatType.map((f) => f.toUpperCase()));
      list = list.filter((item) => ftSet.has(item.flat_type.toUpperCase()));
    }
    return list;
  }

  // If a custom external endpoint URL is provided, attempt live fetch
  if (currentConfig.customEndpointUrl && currentConfig.customEndpointUrl.trim() !== '') {
    try {
      const url = new URL(currentConfig.customEndpointUrl);
      if (params?.town && params.town.length > 0) {
        url.searchParams.set('town', params.town.join(','));
      }
      if (params?.flatType && params.flatType.length > 0) {
        url.searchParams.set('flat_type', params.flatType.join(','));
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (currentConfig.apiKey) {
        headers['Authorization'] = `Bearer ${currentConfig.apiKey}`;
      }

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const rawJson = await response.json();
      let rawArray: any[] = [];
      if (Array.isArray(rawJson)) {
        rawArray = rawJson;
      } else if (Array.isArray(rawJson.records)) {
        rawArray = rawJson.records;
      } else if (Array.isArray(rawJson.result?.records)) {
        rawArray = rawJson.result.records;
      }

      if (rawArray.length > 0) {
        return rawArray.map(parseRawApiRecord);
      }
    } catch (err) {
      console.warn('Custom API fetch failed, falling back to local dataset:', err);
    }
  }

  // Local data engine with server-like filtering on town and flatType
  let filtered = [...SEED_HDB_TRANSACTIONS];

  if (params?.town && params.town.length > 0) {
    const townSet = new Set(params.town.map((t) => t.toUpperCase()));
    filtered = filtered.filter((item) => townSet.has(item.town.toUpperCase()));
  }

  if (params?.flatType && params.flatType.length > 0) {
    const ftSet = new Set(params.flatType.map((f) => f.toUpperCase()));
    filtered = filtered.filter((item) => ftSet.has(item.flat_type.toUpperCase()));
  }

  return filtered;
}
