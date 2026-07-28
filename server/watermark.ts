import sharp from 'sharp';
import MongoDB from './functions/db.js';
import type { WatermarkSettings, WatermarkPosition, SiteSettings } from './types.js';

export const WATERMARK_DEFAULTS: WatermarkSettings = {
    enabled: false,
    position: 'bottom-right',
    opacity: 0.6,
    size: 22,
    margin: 3,
};

export const settings = () => MongoDB.collection<SiteSettings>('settings');
export const SETTINGS_FILTER = { _id: 'main' };

export async function getWatermarkSettings(): Promise<WatermarkSettings> {
    try {
        const doc = await settings().findOne(SETTINGS_FILTER);
        return { ...WATERMARK_DEFAULTS, ...(doc?.watermark ?? {}) };
    } catch {
        return WATERMARK_DEFAULTS;
    }
}

/** Logo bytes are reused across warm invocations — it changes only on re-upload. */
let logoCache: { url: string; buf: Buffer } | null = null;

async function loadLogo(url: string): Promise<Buffer | null> {
    if (logoCache?.url === url) return logoCache.buf;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        logoCache = { url, buf };
        return buf;
    } catch {
        return null;
    }
}

type Box = { baseW: number; baseH: number; wmW: number; wmH: number; margin: number };

const PLACERS: Record<WatermarkPosition, (b: Box) => { left: number; top: number }> = {
    'top-left':      b => ({ left: b.margin,                            top: b.margin }),
    'top-center':    b => ({ left: (b.baseW - b.wmW) / 2,               top: b.margin }),
    'top-right':     b => ({ left: b.baseW - b.wmW - b.margin,          top: b.margin }),
    'middle-left':   b => ({ left: b.margin,                            top: (b.baseH - b.wmH) / 2 }),
    'center':        b => ({ left: (b.baseW - b.wmW) / 2,               top: (b.baseH - b.wmH) / 2 }),
    'middle-right':  b => ({ left: b.baseW - b.wmW - b.margin,          top: (b.baseH - b.wmH) / 2 }),
    'bottom-left':   b => ({ left: b.margin,                            top: b.baseH - b.wmH - b.margin }),
    'bottom-center': b => ({ left: (b.baseW - b.wmW) / 2,               top: b.baseH - b.wmH - b.margin }),
    'bottom-right':  b => ({ left: b.baseW - b.wmW - b.margin,          top: b.baseH - b.wmH - b.margin }),
};

/**
 * Build the composite overlay for an image of the given rendered size.
 * Returns null when no watermark should be drawn.
 */
export async function buildOverlay(
    baseW: number,
    baseH: number,
    s: WatermarkSettings,
): Promise<{ input: Buffer; left: number; top: number } | null> {
    if (!s.enabled || !s.url) return null;

    const logo = await loadLogo(s.url);
    if (!logo) return null;

    const wmW = Math.max(1, Math.round(baseW * (s.size / 100)));
    if (wmW > baseW || wmW < 8) return null;

    // `dest-in` multiplies the logo's alpha by the tile's alpha — sharp's opacity idiom.
    const alpha = Math.max(0, Math.min(255, Math.round(255 * s.opacity)));
    const wm = await sharp(logo)
        .resize({ width: wmW, withoutEnlargement: false })
        .ensureAlpha()
        .composite([{
            input: Buffer.from([255, 255, 255, alpha]),
            raw: { width: 1, height: 1, channels: 4 },
            tile: true,
            blend: 'dest-in',
        }])
        .png()
        .toBuffer();

    const wmMeta = await sharp(wm).metadata();
    const wmH = wmMeta.height ?? 0;
    if (!wmH || wmH > baseH) return null;

    const margin = Math.round(baseW * (s.margin / 100));
    const { left, top } = PLACERS[s.position]?.(({ baseW, baseH, wmW, wmH, margin })) ?? { left: 0, top: 0 };

    return {
        input: wm,
        left: Math.max(0, Math.min(baseW - wmW, Math.round(left))),
        top:  Math.max(0, Math.min(baseH - wmH, Math.round(top))),
    };
}

/**
 * Rendered size of a variant, accounting for EXIF orientation swap and
 * `withoutEnlargement` (small originals keep their own size).
 */
export function renderedSize(
    meta: sharp.Metadata,
    targetWidth: number,
): { width: number; height: number } | null {
    const swap = (meta.orientation ?? 1) >= 5;
    const ow = swap ? meta.height : meta.width;
    const oh = swap ? meta.width  : meta.height;
    if (!ow || !oh) return null;
    const width = Math.min(ow, targetWidth);
    return { width, height: Math.round(oh * (width / ow)) };
}
