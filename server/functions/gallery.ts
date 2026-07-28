import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { nextOrder } from './order.js';
import { uploadToS3WithVariants, deleteFromS3 } from '../aws.js';
import type { GalleryImage } from '../types.js';

export async function listGallery(_req: Request, res: Response): Promise<void> {
    try {
        const images = await MongoDB.collection('gallery')
            .find({ deleted: { $ne: true } })
            .sort({ order: 1, createdAt: -1 })
            .toArray();
        res.json({ images });
    } catch (err) {
        console.error('List gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function listAdminGallery(_req: Request, res: Response): Promise<void> {
    try {
        const images = await MongoDB.collection('gallery')
            .find({})
            .sort({ order: 1, createdAt: -1 })
            .toArray();
        res.json({ images });
    } catch (err) {
        console.error('List admin gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function uploadGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { file, label, category, duration, city, area } = req.body as {
            file?: { base64: string; name: string; type: string };
            label?: string;
            category?: string;
            duration?: string;
            city?: string;
            area?: string;
        };

        if (!file || !label || !category) {
            res.status(400).json({ error: 'file, label, category required' });
            return;
        }

        const result = await uploadToS3WithVariants(file);

        // Assign next order value
        const order = await nextOrder('gallery');
        const image: GalleryImage & { _id: string } = {
            _id: uuidv4(),
            label,
            category,
            duration: duration ?? '',
            city: city ?? '',
            area: area ?? '',
            key: result.key,
            keySmall: result.keySmall,
            url: result.url,
            urlSmall: result.urlSmall,
            order,
            createdAt: new Date(),
        };

        await MongoDB.collection('gallery').insertOne(image as unknown as Document);
        res.status(201).json({ image });
    } catch (err) {
        console.error('Upload gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function softDeleteGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;
        const image = await MongoDB.collection('gallery').findOne(filter);
        if (!image) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }
        await MongoDB.collection('gallery').updateOne(filter, { $set: { deleted: true } });
        res.json({ ok: true });
    } catch (err) {
        console.error('Soft delete gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function restoreGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;
        await MongoDB.collection('gallery').updateOne(filter, { $unset: { deleted: '' } });
        res.json({ ok: true });
    } catch (err) {
        console.error('Restore gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function hardDeleteGalleryImage(req: Request, res: Response): Promise<void> {
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
        console.error('Hard delete gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function reorderGallery(req: Request, res: Response): Promise<void> {
    try {
        const { items } = req.body as { items: Array<{ _id: string; order: number }> };
        if (!Array.isArray(items)) {
            res.status(400).json({ error: 'items array required' });
            return;
        }
        await Promise.all(
            items.map(item =>
                MongoDB.collection('gallery').updateOne(
                    { _id: item._id } as unknown as Filter<Document>,
                    { $set: { order: item.order } }
                )
            )
        );
        res.json({ ok: true });
    } catch (err) {
        console.error('Reorder gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
