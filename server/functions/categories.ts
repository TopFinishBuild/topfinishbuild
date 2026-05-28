import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

export async function listCategories(_req: Request, res: Response): Promise<void> {
    try {
        const cats = await MongoDB.collection('categories')
            .find({})
            .sort({ order: 1, createdAt: 1 })
            .toArray();
        res.json({ categories: cats.map((c: any) => ({ _id: c._id, name: c.name, order: c.order })) });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function addCategory(req: Request, res: Response): Promise<void> {
    try {
        const { name } = req.body as { name?: string };
        if (!name?.trim()) {
            res.status(400).json({ error: 'name required' });
            return;
        }
        const existing = await MongoDB.collection('categories').findOne({ name: name.trim() } as unknown as Filter<Document>);
        if (existing) {
            res.status(409).json({ error: 'Категорията вече съществува' });
            return;
        }
        const last = await MongoDB.collection('categories')
            .find({})
            .sort({ order: -1 })
            .limit(1)
            .toArray();
        const nextOrder = last.length > 0 && (last[0] as any).order != null
            ? (last[0] as any).order + 1
            : 0;
        const doc = { _id: uuidv4(), name: name.trim(), order: nextOrder, createdAt: new Date() };
        await MongoDB.collection('categories').insertOne(doc as unknown as Document);
        res.status(201).json({ category: { _id: doc._id, name: doc.name, order: doc.order } });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;
        const cat = await MongoDB.collection('categories').findOne(filter);
        if (!cat) {
            res.status(404).json({ error: 'Категорията не е намерена' });
            return;
        }
        await MongoDB.collection('categories').deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function reorderCategories(req: Request, res: Response): Promise<void> {
    try {
        const { items } = req.body as { items: Array<{ _id: string; order: number }> };
        if (!Array.isArray(items)) {
            res.status(400).json({ error: 'items array required' });
            return;
        }
        await Promise.all(
            items.map(item =>
                MongoDB.collection('categories').updateOne(
                    { _id: item._id } as unknown as Filter<Document>,
                    { $set: { order: item.order } }
                )
            )
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
