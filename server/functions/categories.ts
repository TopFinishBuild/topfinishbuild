import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { nextOrder } from './order.js';
import type { Category } from '../types.js';

const categories = () => MongoDB.collection<Category>('categories');

export async function listCategories(_req: Request, res: Response): Promise<void> {
    try {
        const cats = await categories()
            .find({})
            .sort({ order: 1, createdAt: 1 })
            .toArray();
        res.json({ categories: cats.map(c => ({ _id: c._id, name: c.name, order: c.order })) });
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
        const existing = await categories().findOne({ name: name.trim() });
        if (existing) {
            res.status(409).json({ error: 'Категорията вече съществува' });
            return;
        }
        const order = await nextOrder('categories');
        const doc = { _id: uuidv4(), name: name.trim(), order, createdAt: new Date() };
        await categories().insertOne(doc);
        res.status(201).json({ category: { _id: doc._id, name: doc.name, order: doc.order } });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id };
        const cat = await categories().findOne(filter);
        if (!cat) {
            res.status(404).json({ error: 'Категорията не е намерена' });
            return;
        }
        await categories().deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function renameCategory(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name } = req.body as { name?: string };
        if (!name?.trim()) { res.status(400).json({ error: 'name required' }); return; }

        const filter = { _id: id };
        const cat = await categories().findOne(filter);
        if (!cat) { res.status(404).json({ error: 'Категорията не е намерена' }); return; }

        const oldName = cat.name;
        const newName = name.trim();

        // Rename category + migrate all gallery images in one transaction-like batch
        await Promise.all([
            categories().updateOne(filter, { $set: { name: newName } }),
            MongoDB.collection('gallery').updateMany(
                { category: oldName } as unknown as Filter<Document>,
                { $set: { category: newName } }
            ),
        ]);

        res.json({ ok: true, oldName, newName });
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
                categories().updateOne(
                    { _id: item._id },
                    { $set: { order: item.order } }
                )
            )
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
