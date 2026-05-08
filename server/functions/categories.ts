import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

export async function listCategories(_req: Request, res: Response): Promise<void> {
    try {
        const cats = await MongoDB.collection('categories')
            .find({})
            .sort({ createdAt: 1 })
            .toArray();
        res.json({ categories: cats.map((c: any) => ({ _id: c._id, name: c.name })) });
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
        const doc = { _id: uuidv4(), name: name.trim(), createdAt: new Date() };
        await MongoDB.collection('categories').insertOne(doc as unknown as Document);
        res.status(201).json({ category: { _id: doc._id, name: doc.name } });
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
