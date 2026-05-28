import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3WithVariants } from '../aws.js';

const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI ?? '';
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const beforePath = resolve(process.cwd(), '..', 'public', 'before.webp');
const afterPath  = resolve(process.cwd(), '..', 'public', 'after.webp');

if (!existsSync(beforePath) || !existsSync(afterPath)) {
    console.error('Public images not found: public/before.webp or public/after.webp missing');
    process.exit(1);
}

console.log('Reading public/before.webp and public/after.webp...');
const beforeBase64 = `data:image/webp;base64,${readFileSync(beforePath).toString('base64')}`;
const afterBase64  = `data:image/webp;base64,${readFileSync(afterPath).toString('base64')}`;

console.log('Uploading to S3...');
const [beforeResult, afterResult] = await Promise.all([
    uploadToS3WithVariants({ base64: beforeBase64, name: 'before.webp', type: 'image/webp' }, 'beforeafter', { full: 1200, small: 600 }),
    uploadToS3WithVariants({ base64: afterBase64,  name: 'after.webp',  type: 'image/webp' }, 'beforeafter', { full: 1200, small: 600 }),
]);

console.log('Inserting into MongoDB...');
const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    const col = client.db('topfinish').collection('beforeafter');

    const existing = await col.countDocuments();
    if (existing > 0) {
        console.log(`Collection already has ${existing} pairs — skipping seed.`);
        console.log('To force re-seed, drop the collection first.');
    } else {
        await col.insertOne({
            _id: uuidv4(),
            title: 'Цялостен ремонт апартамент',
            beforeKey: beforeResult.key,
            beforeKeySmall: beforeResult.keySmall,
            beforeUrl: beforeResult.url,
            beforeUrlSmall: beforeResult.urlSmall,
            afterKey: afterResult.key,
            afterKeySmall: afterResult.keySmall,
            afterUrl: afterResult.url,
            afterUrlSmall: afterResult.urlSmall,
            order: 0,
            createdAt: new Date(),
        } as never);
        console.log('✓ Seeded 1 before/after pair.');
        console.log(`  Before: ${beforeResult.url}`);
        console.log(`  After:  ${afterResult.url}`);
    }
} finally {
    await client.close();
}
