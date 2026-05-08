import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI ?? '';
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const DEFAULT_CATS = ['Бани', 'Кухни', 'Тераси', 'Спални', 'Хол'];

const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    const cats = client.db('topfinish').collection('categories');
    let added = 0;
    for (const name of DEFAULT_CATS) {
        const existing = await cats.findOne({ name });
        if (existing) { console.log(`  ~ "${name}" already exists — skipping`); continue; }
        await cats.insertOne({ _id: uuidv4(), name, createdAt: new Date() } as never);
        console.log(`  ✓ "${name}" added`);
        added++;
    }
    console.log(`\nDone. ${added} categories added.`);
} finally {
    await client.close();
}
