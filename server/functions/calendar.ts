import type { Filter, Document } from 'mongodb';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

const DOC_ID = 'main';
const filter = { _id: DOC_ID } as unknown as Filter<Document>;

export async function getCalendar(_req: Request, res: Response): Promise<void> {
    try {
        const doc = await MongoDB.collection('busy_dates').findOne(filter);
        const dates = (doc as { dates?: string[] } | null)?.dates ?? [];
        res.json({ dates });
    } catch (err) {
        console.error('Get calendar error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function setCalendar(req: Request, res: Response): Promise<void> {
    try {
        const { dates } = req.body as { dates?: string[] };
        if (!Array.isArray(dates)) {
            res.status(400).json({ error: 'dates array required' });
            return;
        }

        await MongoDB.collection('busy_dates').updateOne(
            filter,
            { $set: { dates, updatedAt: new Date() } },
            { upsert: true },
        );

        res.json({ ok: true, dates });
    } catch (err) {
        console.error('Set calendar error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
