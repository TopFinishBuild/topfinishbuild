/**
 * Convert public/ PNG/JPG images to WebP.
 * Run once: node scripts/optimize-images.mjs
 * Requires: npm install -D sharp (already in devDependencies)
 */
import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const targets = readdirSync(PUBLIC_DIR)
  .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
  .map(f => join(PUBLIC_DIR, f));

for (const src of targets) {
  const dest = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  if (existsSync(dest)) {
    console.log(`skip  ${basename(dest)} (already exists)`);
    continue;
  }
  await sharp(src)
    .webp({ quality: 82, effort: 4 })
    .toFile(dest);
  console.log(`done  ${basename(src)} → ${basename(dest)}`);
}

console.log('\nAll done. Commit the .webp files to public/');
