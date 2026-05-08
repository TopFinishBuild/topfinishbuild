import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { uploadToS3WithVariants, deleteFromS3 } from '../aws.js';
import type { GalleryImage } from '../types.js';

export async function listGallery(_req: Request, res: Response): Promise<void> {
    try {
        const images = await MongoDB.collection('gallery')
            .find({})
            .sort({ order: 1, createdAt: -1 })
            .toArray();
        res.json({ images });
    } catch (err) {
        console.error('List gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function uploadGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { file, label, category, materials, duration } = req.body as {
            file?: { base64: string; name: string; type: string };
            label?: string;
            category?: string;
            materials?: string;
            duration?: string;
        };

        if (!file || !label || !category) {
            res.status(400).json({ error: 'file, label, category required' });
            return;
        }

        const result = await uploadToS3WithVariants(file);

        const image: GalleryImage & { _id: string } = {
            _id: uuidv4(),
            label,
            category,
            materials: materials ?? '',
            duration: duration ?? '',
            key: result.key,
            keySmall: result.keySmall,
            url: result.url,
            urlSmall: result.urlSmall,
            createdAt: new Date(),
        };

        await MongoDB.collection('gallery').insertOne(image as unknown as Document);
        res.status(201).json({ image });
    } catch (err) {
        console.error('Upload gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deleteGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;

        const image = await MongoDB.collection('gallery').findOne(filter) as (GalleryImage & { _id: string }) | null;
        if (!image) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }

        await Promise.all([
            deleteFromS3(image.key),
            image.keySmall ? deleteFromS3(image.keySmall) : Promise.resolve(),
        ]);

        await MongoDB.collection('gallery').deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        console.error('Delete gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
