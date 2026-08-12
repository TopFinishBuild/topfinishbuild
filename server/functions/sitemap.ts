import type { Request, Response } from 'express';
import MongoDB from './db.js';
import { toSlug, buildSlug } from './slug.js';
import type { GalleryImage, Category } from '../types.js';

/**
 * Sitemap built from the DB, so every gallery photo and category is a URL Google can
 * fetch. A static file would only ever list the five hand-written routes.
 *
 * Served at /sitemap.xml through a Netlify rewrite (see netlify.toml).
 */

const SITE = 'https://topfinishbuild.bg';

interface Entry {
    loc: string;
    lastmod?: Date;
    changefreq: string;
    priority: string;
    /** Image search: the photo shown at this URL. */
    image?: { loc: string; title: string };
}

const STATIC_ENTRIES: Entry[] = [
    { loc: '/',               changefreq: 'weekly',  priority: '1.0' },
    { loc: '/remont-snimki',  changefreq: 'weekly',  priority: '0.9' },
    { loc: '/predi-i-sled',   changefreq: 'weekly',  priority: '0.8' },
    { loc: '/about',          changefreq: 'monthly', priority: '0.6' },
    { loc: '/prices',         changefreq: 'monthly', priority: '0.5' },
];

const escapeXml = (s: string): string =>
    s.replace(/[&<>"']/g, c => (
        c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&apos;'
    ));

function urlNode({ loc, lastmod, changefreq, priority, image }: Entry): string {
    const parts = [
        `    <loc>${escapeXml(SITE + loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '',
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        image
            ? `    <image:image>\n      <image:loc>${escapeXml(image.loc)}</image:loc>\n      <image:title>${escapeXml(image.title)}</image:title>\n    </image:image>`
            : '',
    ].filter(Boolean);
    return `  <url>\n${parts.join('\n')}\n  </url>`;
}

function buildXml(entries: Entry[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(urlNode).join('\n')}
</urlset>
`;
}

/** Photos and categories, newest first. Returns [] if the DB is unreachable. */
async function dynamicEntries(): Promise<Entry[]> {
    const [images, categories] = await Promise.all([
        MongoDB.collection<GalleryImage>('gallery')
            .find({ deleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .toArray(),
        MongoDB.collection<Category>('categories').find({}).toArray(),
    ]);

    // Only categories that actually have photos — an empty listing is a thin page.
    const used = new Set(images.map(i => i.category));
    const categoryEntries: Entry[] = categories
        .filter(c => used.has(c.name))
        .map(c => ({
            loc: `/remont-snimki/${toSlug(c.name)}`,
            changefreq: 'weekly',
            priority: '0.7',
        }));

    const imageEntries: Entry[] = images.map(img => ({
        loc: `/remont-snimki/${buildSlug(img.category, img.label, img.city)}`,
        lastmod: img.createdAt ? new Date(img.createdAt) : undefined,
        changefreq: 'monthly',
        priority: '0.6',
        image: { loc: img.url, title: img.label },
    }));

    return [...categoryEntries, ...imageEntries];
}

export async function getSitemap(_req: Request, res: Response): Promise<void> {
    let entries = STATIC_ENTRIES;
    try {
        entries = [...STATIC_ENTRIES, ...await dynamicEntries()];
    } catch (err) {
        // A dead DB must not take the sitemap down — ship the static routes.
        console.error('Sitemap dynamic entries error:', err);
    }

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buildXml(entries));
}
