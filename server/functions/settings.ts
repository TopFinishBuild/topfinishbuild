import type { Request, Response } from 'express';
import { uploadWatermarkLogo, deleteFromS3 } from '../aws.js';
import { WATERMARK_DEFAULTS, settings, SETTINGS_FILTER } from '../watermark.js';
import type { WatermarkPosition, WatermarkSettings } from '../types.js';

const filter = SETTINGS_FILTER;

const POSITIONS: WatermarkPosition[] = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right',
];

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export async function getSettings(_req: Request, res: Response): Promise<void> {
    try {
        const doc = await settings().findOne(filter);
        res.json({
            calendarVisible: doc?.calendarVisible ?? true,
            phone1: doc?.phone1 ?? '',
            phone2: doc?.phone2 ?? '',
            email1: doc?.email1 ?? '',
            email2: doc?.email2 ?? '',
            watermark: { ...WATERMARK_DEFAULTS, ...(doc?.watermark ?? {}) },
        });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function updateWatermark(req: Request, res: Response): Promise<void> {
    try {
        const body = req.body as Partial<WatermarkSettings>;
        const doc = await settings().findOne(filter);
        const current: WatermarkSettings = { ...WATERMARK_DEFAULTS, ...(doc?.watermark ?? {}) };

        const next: WatermarkSettings = { ...current };
        if (typeof body.enabled === 'boolean') next.enabled = body.enabled;
        if (body.position && POSITIONS.includes(body.position)) next.position = body.position;
        if (Number.isFinite(body.opacity)) next.opacity = clamp(Number(body.opacity), 0.05, 1);
        if (Number.isFinite(body.size))    next.size    = clamp(Number(body.size), 5, 100);
        if (Number.isFinite(body.margin))  next.margin  = clamp(Number(body.margin), 0, 40);

        await settings().updateOne(
            filter,
            { $set: { watermark: next, updatedAt: new Date() } },
            { upsert: true },
        );
        res.json({ watermark: next });
    } catch (err) {
        console.error('Update watermark error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function uploadWatermarkImage(req: Request, res: Response): Promise<void> {
    try {
        const { file } = req.body as { file?: { base64: string } };
        if (!file?.base64) { res.status(400).json({ error: 'file required' }); return; }

        const doc = await settings().findOne(filter);
        const current: WatermarkSettings = { ...WATERMARK_DEFAULTS, ...(doc?.watermark ?? {}) };

        const result = await uploadWatermarkLogo(file);
        const next: WatermarkSettings = { ...current, key: result.key, url: result.url };

        await settings().updateOne(
            filter,
            { $set: { watermark: next, updatedAt: new Date() } },
            { upsert: true },
        );

        // Old logo is unreferenced now — a failure here must not fail the upload.
        if (current.key) await deleteFromS3(current.key).catch(() => {});

        res.status(201).json({ watermark: next });
    } catch (err) {
        console.error('Upload watermark logo error:', err);
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

        await settings().updateOne(
            filter,
            { $set },
            { upsert: true },
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
