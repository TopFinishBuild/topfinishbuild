import type { Request } from 'express';

const MAX_LIMIT = 100;

/**
 * `?limit=N` for list endpoints. Returns 0 when absent or malformed, which
 * callers treat as "no limit" — public sections ask for a few, admin asks for all.
 */
export function parseLimit(req: Request): number {
    const raw = Number(req.query.limit);
    return Number.isInteger(raw) && raw > 0 ? Math.min(raw, MAX_LIMIT) : 0;
}
