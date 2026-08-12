/**
 * Build the browser-tab icons from the logo mark.
 *
 * The old public/favicon.svg was a purple shape left over from a starter template.
 * The mark is drawn white on the brand navy so it stays visible in both a light and
 * a dark browser theme — the navy-on-transparent version disappears on dark tabs.
 *
 * Run: node scripts/make-favicons.mjs   (only needed when the logo changes)
 */
import sharp from 'sharp';

const NAVY = { r: 15, g: 31, b: 61, alpha: 1 };
const SIZES = [
    ['favicon-32.png', 32],
    ['favicon-192.png', 192],
    ['apple-touch-icon.png', 180],
    ['favicon-512.png', 512],
];

const url = (p) => new URL(p, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

// The wordmark sits to the right of the house — keep only the house.
const mark = await sharp(url('../public/logos/topfinish-build-logo-light.png'))
    .extract({ left: 0, top: 0, width: 75, height: 82 })
    .resize({ width: 340, height: 340, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .toBuffer();

const master = await sharp({ create: { width: 512, height: 512, channels: 4, background: NAVY } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();

for (const [name, size] of SIZES) {
    await sharp(master).resize(size, size, { kernel: 'lanczos3' }).png().toFile(url(`../public/${name}`));
    console.log(`public/${name} — ${size}x${size}`);
}
