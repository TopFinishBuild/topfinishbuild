import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { nextOrder } from './order.js';
import { uploadToS3WithVariants, deleteFromS3 } from '../aws.js';
import type { BeforeAfterPair } from '../types.js';

export async function listBeforeAfter(_req: Request, res: Response): Promise<void> {
    try {
        const pairs = await MongoDB.collection('beforeafter')
            .find({})
            .sort({ order: 1, createdAt: 1 })
            .toArray();
        res.json({ pairs });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function createBeforeAfterPair(req: Request, res: Response): Promise<void> {
    try {
        const { title, beforeFile, afterFile } = req.body as {
            title?: string;
            beforeFile?: { base64: string; name: string; type: string };
            afterFile?: { base64: string; name: string; type: string };
        };

        if (!title || !beforeFile || !afterFile) {
            res.status(400).json({ error: 'title, beforeFile, and afterFile are required' });
            return;
        }

        const [beforeResult, afterResult] = await Promise.all([
            uploadToS3WithVariants(beforeFile, 'beforeafter', { full: 1200, small: 600 }),
            uploadToS3WithVariants(afterFile, 'beforeafter', { full: 1200, small: 600 }),
        ]);

        const order = await nextOrder('beforeafter');
        const pair: BeforeAfterPair & { _id: string } = {
            _id: uuidv4(),
            title,
            beforeKey: beforeResult.key,
            beforeKeySmall: beforeResult.keySmall,
            beforeUrl: beforeResult.url,
            beforeUrlSmall: beforeResult.urlSmall,
            afterKey: afterResult.key,
            afterKeySmall: afterResult.keySmall,
            afterUrl: afterResult.url,
            afterUrlSmall: afterResult.urlSmall,
            order,
            createdAt: new Date(),
        };

        await MongoDB.collection('beforeafter').insertOne(pair as unknown as Document);
        res.status(201).json({ pair });
    } catch (err) {
        console.error('Create before/after error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function updateBeforeAfterPair(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { title, beforeFile, afterFile } = req.body as {
            title?: string;
            beforeFile?: { base64: string; name: string; type: string };
            afterFile?: { base64: string; name: string; type: string };
        };

        const filter = { _id: id } as unknown as Filter<Document>;
        const existing = await MongoDB.collection('beforeafter').findOne(filter) as (BeforeAfterPair & { _id: string }) | null;
        if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

        const update: Partial<BeforeAfterPair> = {};
        if (title !== undefined) update.title = title;

        if (beforeFile) {
            const result = await uploadToS3WithVariants(beforeFile, 'beforeafter', { full: 1200, small: 600 });
            await Promise.all([
                deleteFromS3(existing.beforeKey),
                existing.beforeKeySmall ? deleteFromS3(existing.beforeKeySmall) : Promise.resolve(),
            ]);
            update.beforeKey = result.key;
            update.beforeKeySmall = result.keySmall;
            update.beforeUrl = result.url;
            update.beforeUrlSmall = result.urlSmall;
        }

        if (afterFile) {
            const result = await uploadToS3WithVariants(afterFile, 'beforeafter', { full: 1200, small: 600 });
            await Promise.all([
                deleteFromS3(existing.afterKey),
                existing.afterKeySmall ? deleteFromS3(existing.afterKeySmall) : Promise.resolve(),
            ]);
            update.afterKey = result.key;
            update.afterKeySmall = result.keySmall;
            update.afterUrl = result.url;
            update.afterUrlSmall = result.urlSmall;
        }

        await MongoDB.collection('beforeafter').updateOne(filter, { $set: update });
        res.json({ ok: true });
    } catch (err) {
        console.error('Update before/after error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deleteBeforeAfterPair(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;

        const pair = await MongoDB.collection('beforeafter').findOne(filter) as (BeforeAfterPair & { _id: string }) | null;
        if (!pair) { res.status(404).json({ error: 'Not found' }); return; }

        await Promise.all([
            deleteFromS3(pair.beforeKey),
            pair.beforeKeySmall ? deleteFromS3(pair.beforeKeySmall) : Promise.resolve(),
            deleteFromS3(pair.afterKey),
            pair.afterKeySmall ? deleteFromS3(pair.afterKeySmall) : Promise.resolve(),
        ]);

        await MongoDB.collection('beforeafter').deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        console.error('Delete before/after error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function reorderBeforeAfter(req: Request, res: Response): Promise<void> {
    try {
        const { order } = req.body as { order: { _id: string; order: number }[] };
        if (!Array.isArray(order)) { res.status(400).json({ error: 'order array required' }); return; }
        await Promise.all(
            order.map(({ _id, order: o }) =>
                MongoDB.collection('beforeafter').updateOne(
                    { _id } as unknown as Filter<Document>,
                    { $set: { order: o } }
                )
            )
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
