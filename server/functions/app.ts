import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const envPaths = [resolve(process.cwd(), '..', '.env'), resolve(process.cwd(), '.env')];
const envPath = envPaths.find(p => existsSync(p));
if (envPath) dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { sendContactEmail } from './contact.js';
import { login } from './user.js';
import { listGallery, uploadGalleryImage, deleteGalleryImage } from './gallery.js';
import { getCalendar, setCalendar } from './calendar.js';
import { listCategories, addCategory, deleteCategory } from './categories.js';
import { authorizeAdmin } from './auth.js';

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

// Auth
app.post('/api/auth/login', login);

// Contact
app.post('/api/contact/send', sendContactEmail);

// Categories — public read, admin write
app.get('/api/categories', listCategories);
app.post('/api/categories', authorizeAdmin, addCategory);
app.delete('/api/categories/:id', authorizeAdmin, deleteCategory);

// Gallery — public read, admin write
app.get('/api/gallery', listGallery);
app.post('/api/gallery', authorizeAdmin, uploadGalleryImage);
app.delete('/api/gallery/:id', authorizeAdmin, deleteGalleryImage);

// Calendar — public read, admin write
app.get('/api/calendar', getCalendar);
app.put('/api/calendar', authorizeAdmin, setCalendar);

if (process.env.NODE_ENV !== 'production') {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export const handler = serverless(app);
