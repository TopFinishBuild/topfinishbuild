import type { Filter, Document } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { nextOrder } from './order.js';
import type { Testimonial } from '../types.js';

export async function listTestimonials(_req: Request, res: Response): Promise<void> {
    try {
        const testimonials = await MongoDB.collection('testimonials')
            .find({})
            .sort({ order: 1, createdAt: 1 })
            .toArray();
        res.json({ testimonials });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function createTestimonial(req: Request, res: Response): Promise<void> {
    try {
        const { text, name, subtitle, initials, stars } = req.body as {
            text?: string; name?: string; subtitle?: string; initials?: string; stars?: number;
        };
        if (!text || !name || !subtitle || !initials) {
            res.status(400).json({ error: 'text, name, subtitle, initials required' });
            return;
        }

        const order = await nextOrder('testimonials');
        const doc: Testimonial & { _id: string } = {
            _id: uuidv4(),
            text: text.trim(),
            name: name.trim(),
            subtitle: subtitle.trim(),
            initials: initials.trim().slice(0, 3).toUpperCase(),
            stars: typeof stars === 'number' && stars >= 1 && stars <= 5 ? stars : 5,
            order,
            createdAt: new Date(),
        };

        await MongoDB.collection('testimonials').insertOne(doc as unknown as Document);
        res.status(201).json({ testimonial: doc });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function updateTestimonial(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { text, name, subtitle, initials, stars } = req.body as {
            text?: string; name?: string; subtitle?: string; initials?: string; stars?: number;
        };
        if (!text || !name || !subtitle || !initials) {
            res.status(400).json({ error: 'text, name, subtitle, initials required' });
            return;
        }

        const filter = { _id: id } as unknown as Filter<Document>;
        const existing = await MongoDB.collection('testimonials').findOne(filter);
        if (!existing) {
            res.status(404).json({ error: 'Not found' });
            return;
        }

        await MongoDB.collection('testimonials').updateOne(filter, {
            $set: {
                text: text.trim(),
                name: name.trim(),
                subtitle: subtitle.trim(),
                initials: initials.trim().slice(0, 3).toUpperCase(),
                stars: typeof stars === 'number' && stars >= 1 && stars <= 5 ? stars : 5,
                updatedAt: new Date(),
            }
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const filter = { _id: id } as unknown as Filter<Document>;
        const existing = await MongoDB.collection('testimonials').findOne(filter);
        if (!existing) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        await MongoDB.collection('testimonials').deleteOne(filter);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
