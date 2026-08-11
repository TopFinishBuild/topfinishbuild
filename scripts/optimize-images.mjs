/**
 * Convert public/ PNG/JPG images to WebP AND emit responsive widths.
 *
 * Lighthouse flagged 450+ KB wasted because a single full-size file was served
 * into a box a few hundred pixels tall. Each source now produces
 * `<name>-<width>.webp` variants so the markup can hand the browser a srcset.
 *
 * Run: npm run optimize-images   (safe to re-run — existing files are skipped)
 * Requires: sharp (already in devDependencies)
 */
import sharp from 'sharp';
import { readdirSync, existsSync, statSync } from 'fs';
import { join, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

/** Widths that cover mobile → 2x desktop for the layouts on the site */
const WIDTHS = [480, 768, 1200, 1600];
const QUALITY = 82;

const sources = readdirSync(PUBLIC_DIR)
  .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
  // skip files we generated ourselves on a previous run
  .filter(f => !/-\d{3,4}\.webp$/i.test(f))
  .map(f => join(PUBLIC_DIR, f));

const kb = (p) => (statSync(p).size / 1024).toFixed(0);

for (const src of sources) {
  const name = basename(src).replace(/\.(png|jpe?g|webp)$/i, '');

  // 1. Full-size WebP next to the original (unchanged behaviour)
  const full = join(PUBLIC_DIR, `${name}.webp`);
  if (!existsSync(full)) {
    await sharp(src).webp({ quality: QUALITY, effort: 4 }).toFile(full);
    console.log(`webp   ${basename(full)}  ${kb(full)}KB`);
  }

  // 2. Responsive variants — never upscale past the source width
  const { width: srcWidth = 0 } = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (srcWidth && w > srcWidth) continue;
    const dest = join(PUBLIC_DIR, `${name}-${w}.webp`);
    if (existsSync(dest)) {
      console.log(`skip   ${basename(dest)}`);
      continue;
    }
    await sharp(src).resize({ width: w }).webp({ quality: QUALITY, effort: 4 }).toFile(dest);
    console.log(`resize ${basename(dest)}  ${kb(dest)}KB`);
  }
}

console.log('\nDone. Commit the .webp files in public/');
