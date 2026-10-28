import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { nextOrder } from './order.js';
import { parseLimit } from './query.js';
import { uploadToS3WithVariants, deleteFromS3 } from '../aws.js';
import type { GalleryImage } from '../types.js';

const gallery = () => MongoDB.collection('gallery');
const byId = (id: unknown) => ({ _id: id } as unknown as Filter<Document>);

/** `?favorites=1` — only the „Любими“, in their own order. */
export async function listGallery(req: Request, res: Response): Promise<void> {
    try {
        const limit = parseLimit(req);
        const favorites = req.query.favorites === '1';

        const cursor = gallery()
            .find(favorites ? { deleted: { $ne: true }, favorite: true } : { deleted: { $ne: true } })
            .sort(favorites ? { favoriteOrder: 1 } : { order: 1, createdAt: -1 });
        if (limit) cursor.limit(limit);

        const images = await cursor.toArray();
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
        // A deleted photo can't stay a favorite — restoring it must not create a second one.
        await MongoDB.collection('gallery').updateOne(filter, {
            $set: { deleted: true },
            $unset: { favorite: '', favoriteOrder: '' },
        });
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

export async function updateGalleryImage(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { label, category, duration, city, area } = req.body as {
            label?: string;
            category?: string;
            duration?: string;
            city?: string;
            area?: string;
        };

        if (!label?.trim() || !category?.trim()) {
            res.status(400).json({ error: 'label, category required' });
            return;
        }

        const image = await gallery().findOne(byId(id)) as (GalleryImage & { _id: string }) | null;
        if (!image) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }

        const update: Document = {
            $set: {
                label: label.trim(),
                category: category.trim(),
                duration: duration ?? '',
                city: city ?? '',
                area: area ?? '',
            },
        };

        // Moving a favorite into a category that already has one would make two.
        if (image.favorite && image.category !== category.trim()) {
            const taken = await gallery().findOne({
                category: category.trim(), favorite: true, deleted: { $ne: true },
            });
            if (taken) update.$unset = { favorite: '', favoriteOrder: '' };
        }

        await gallery().updateOne(byId(id), update);
        res.json({ ok: true });
    } catch (err) {
        console.error('Update gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

/**
 * Mark/unmark a favorite. One per category: a new favorite replaces the old one
 * and takes over its position, so the „Любими“ order stays put.
 */
export async function setGalleryFavorite(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { favorite } = req.body as { favorite?: boolean };

        const image = await gallery().findOne(byId(id)) as (GalleryImage & { _id: string }) | null;
        if (!image || image.deleted) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }

        if (!favorite) {
            await gallery().updateOne(byId(id), { $unset: { favorite: '', favoriteOrder: '' } });
            res.json({ ok: true });
            return;
        }

        const current = await gallery().findOne({
            category: image.category, favorite: true, _id: { $ne: id },
        } as unknown as Filter<Document>) as (GalleryImage & { _id: string }) | null;

        let favoriteOrder: number;
        if (current) {
            favoriteOrder = current.favoriteOrder ?? 0;
            await gallery().updateOne(byId(current._id), { $unset: { favorite: '', favoriteOrder: '' } });
        } else {
            const [last] = await gallery()
                .find({ favorite: true })
                .sort({ favoriteOrder: -1 })
                .limit(1)
                .toArray();
            favoriteOrder = last?.favoriteOrder != null ? (last.favoriteOrder as number) + 1 : 0;
        }

        await gallery().updateOne(byId(id), { $set: { favorite: true, favoriteOrder } });
        res.json({ ok: true });
    } catch (err) {
        console.error('Favorite gallery error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

/** `PUT { items: [{ _id, order }] }` — writes `order` to `field`. */
const reorderBy = (field: 'order' | 'favoriteOrder') =>
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { items } = req.body as { items: Array<{ _id: string; order: number }> };
            if (!Array.isArray(items)) {
                res.status(400).json({ error: 'items array required' });
                return;
            }
            await Promise.all(
                items.map(item => gallery().updateOne(byId(item._id), { $set: { [field]: item.order } }))
            );
            res.json({ ok: true });
        } catch (err) {
            console.error(`Reorder gallery (${field}) error:`, err);
            res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
        }
    };

export const reorderGallery   = reorderBy('order');
export const reorderFavorites = reorderBy('favoriteOrder');
