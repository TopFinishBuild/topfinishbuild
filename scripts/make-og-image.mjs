/**
 * Build public/og-image.jpg — the card Facebook/Messenger/Viber show for a shared link.
 *
 * Without one, the crawler picks whatever image it finds first and crops it to 1.91:1,
 * which is how the logo ended up sliced in half. This composes the intended card:
 * darkened hero photo, white wordmark, orange brand bar.
 *
 * Run: node scripts/make-og-image.mjs   (only needed when the logo or hero changes)
 */
import sharp from 'sharp';
import { statSync } from 'fs';

const W = 1200, H = 630;          // the ratio every social crawler crops to
const NAVY = { r: 15, g: 31, b: 61 };
const ORANGE = { r: 249, g: 115, b: 22 };
/** Sits on the empty wall in the left of the photo, clear of the worker. */
const LOGO_WIDTH = 620;
const LOGO_LEFT = 80;
const BAR_HEIGHT = 12;

const url = (p) => new URL(p, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const background = await sharp(url('../public/hero.webp'))
    .resize(W, H, { fit: 'cover', position: 'right' })
    .toBuffer();

const overlay = await sharp({
    create: { width: W, height: H, channels: 4, background: { ...NAVY, alpha: 0.82 } },
}).png().toBuffer();

// The source wordmark is 321px wide, so it is upscaled — lanczos3 + a light sharpen
// keeps the edges from going mushy at the size a feed actually renders.
const logo = await sharp(url('../public/logos/topfinish-build-logo-light.png'))
    .resize({ width: LOGO_WIDTH, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6 })
    .toBuffer();
const logoHeight = (await sharp(logo).metadata()).height;

const bar = await sharp({
    create: { width: W, height: BAR_HEIGHT, channels: 4, background: { ...ORANGE, alpha: 1 } },
}).png().toBuffer();

await sharp(background)
    .composite([
        { input: overlay, top: 0, left: 0 },
        { input: logo, top: Math.round((H - logoHeight) / 2), left: LOGO_LEFT },
        { input: bar, top: H - BAR_HEIGHT, left: 0 },
    ])
    .jpeg({ quality: 86, progressive: true, mozjpeg: true })
    .toFile(url('../public/og-image.jpg'));

const kb = Math.round(statSync(url('../public/og-image.jpg')).size / 1024);
console.log(`public/og-image.jpg — ${W}x${H}, ${kb} KB`);
