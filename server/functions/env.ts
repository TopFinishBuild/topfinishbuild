import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });
