import type { Request, Response } from 'express';
import handler from './transactions';

export default async function hdbTransactionsHandler(req: Request, res: Response) {
  return handler(req, res);
}
