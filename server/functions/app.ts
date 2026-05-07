import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env — try multiple locations to support different run contexts:
// 1. ../  → when running via "npm --prefix server" (cwd = server/)
// 2. ./  → when running from the project root
// 3. Netlify Functions: env vars are injected by the platform, no .env needed
const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { sendContactEmail } from './contact.js';

const app = express();

app.use(express.json({
    limit: '50mb',
    type: (req) => {
        const ct = req.headers['content-type'] || '';
        return ct.includes('json');
    },
}));
app.use(cors());

// Health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Contact / inquiry
app.post('/api/contact/send', sendContactEmail);

// Standalone mode — active when running directly with tsx
if (process.env.NODE_ENV !== 'production') {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export const handler = serverless(app);
