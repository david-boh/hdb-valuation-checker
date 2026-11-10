import type { Request, Response } from 'express';

export interface HealthCheckResponse {
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  timestamp: string;
  service: string;
  endpoints: {
    datastoreSearch: string;
    carparkAvailability: string;
  };
  headersConfigured: {
    accountKey: boolean;
  };
}

export default async function handler(req: Request, res: Response) {
  const accountKey = process.env.ACCOUNT_KEY || process.env.DATA_GOV_SG_ACCOUNT_KEY || '';

  const responseData: HealthCheckResponse = {
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'singapore-hdb-analytics-api',
    endpoints: {
      datastoreSearch: 'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc',
      carparkAvailability: 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
    },
    headersConfigured: {
      accountKey: Boolean(accountKey && accountKey.trim() !== ''),
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(responseData);
}
