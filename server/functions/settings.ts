import type { Filter, Document } from 'mongodb';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

const filter = { _id: 'main' } as unknown as Filter<Document>;

export async function getSettings(_req: Request, res: Response): Promise<void> {
    try {
        const doc = await MongoDB.collection('settings').findOne(filter) as any;
        res.json({
            calendarVisible: doc?.calendarVisible ?? true,
            phone1: doc?.phone1 ?? '',
            phone2: doc?.phone2 ?? '',
            email1: doc?.email1 ?? '',
            email2: doc?.email2 ?? '',
        });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
    try {
        const body = req.body as {
            calendarVisible?: boolean;
            phone1?: string;
            phone2?: string;
            email1?: string;
            email2?: string;
        };

        const $set: Record<string, unknown> = { updatedAt: new Date() };

        if (typeof body.calendarVisible === 'boolean') $set.calendarVisible = body.calendarVisible;
        if (body.phone1 !== undefined) $set.phone1 = body.phone1;
        if (body.phone2 !== undefined) $set.phone2 = body.phone2;
        if (body.email1 !== undefined) $set.email1 = body.email1;
        if (body.email2 !== undefined) $set.email2 = body.email2;

        await MongoDB.collection('settings').updateOne(
            filter,
            { $set },
            { upsert: true },
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
