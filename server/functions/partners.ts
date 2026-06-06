import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { uploadToS3WithVariants, deleteFromS3 } from '../aws.js';
import type { Partner } from '../types.js';

export async function listPartners(_req: Request, res: Response): Promise<void> {
    try {
        const partners = await MongoDB.collection('partners')
            .find({})
            .sort({ order: 1, createdAt: 1 })
            .toArray();
        res.json({ partners });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function uploadPartner(req: Request, res: Response): Promise<void> {
    try {
        const { file, name } = req.body as {
            file?: { base64: string; name: string; type: string };
            name?: string;
        };

        if (!file || !name) {
            res.status(400).json({ error: 'file and name required' });
            return;
        }

        const result = await uploadToS3WithVariants(file);

        const last = await MongoDB.collection('partners')
            .find({})
            .sort({ order: -1 })
            .limit(1)
            .toArray();
        const nextOrder = last.length > 0 && (last[0] as any).order != null
            ? (last[0] as any).order + 1
            : 0;

        const partner: Partner & { _id: string } = {
            _id: uuidv4(),
            name,
            key: result.key,
            keySmall: result.keySmall,
            url: result.url,
            urlSmall: result.urlSmall,
            order: nextOrder,
            createdAt: new Date(),
        };

        await MongoDB.collection('partners').insertOne(partner as unknown as Document);
        res.status(201).json({ partner });
    } catch (err) {
        console.error('Upload partner error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deletePartner(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;

        const partner = await MongoDB.collection('partners').findOne(filter) as (Partner & { _id: string }) | null;
        if (!partner) {
            res.status(404).json({ error: 'Partner not found' });
            return;
        }

        await Promise.all([
            deleteFromS3(partner.key),
            partner.keySmall ? deleteFromS3(partner.keySmall) : Promise.resolve(),
        ]);

        await MongoDB.collection('partners').deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        console.error('Delete partner error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
