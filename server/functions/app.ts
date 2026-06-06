import './env.js';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { sendContactEmail } from './contact.js';
import { login, changePassword, createUser } from './user.js';
import {
    listGallery, listAdminGallery, uploadGalleryImage,
    softDeleteGalleryImage, restoreGalleryImage, hardDeleteGalleryImage,
    reorderGallery,
} from './gallery.js';
import { getCalendar, setCalendar } from './calendar.js';
import { listCategories, addCategory, deleteCategory, reorderCategories, renameCategory } from './categories.js';
import { getSettings, updateSettings } from './settings.js';
import { listPartners, uploadPartner, deletePartner } from './partners.js';
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from './testimonials.js';
import { listBeforeAfter, createBeforeAfterPair, updateBeforeAfterPair, deleteBeforeAfterPair, reorderBeforeAfter } from './beforeafter.js';
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
app.put('/api/auth/password', authorizeAdmin, changePassword);
app.post('/api/auth/users', authorizeAdmin, createUser);

// Contact
app.post('/api/contact/send', sendContactEmail);

// Categories — public read, admin write
app.get('/api/categories', listCategories);
app.post('/api/categories', authorizeAdmin, addCategory);
app.put('/api/categories/reorder', authorizeAdmin, reorderCategories);
app.put('/api/categories/:id', authorizeAdmin, renameCategory);
app.delete('/api/categories/:id', authorizeAdmin, deleteCategory);

// Gallery — public read, admin write
app.get('/api/gallery', listGallery);
app.get('/api/gallery/admin', authorizeAdmin, listAdminGallery);
app.post('/api/gallery', authorizeAdmin, uploadGalleryImage);
app.put('/api/gallery/reorder', authorizeAdmin, reorderGallery);
app.delete('/api/gallery/:id', authorizeAdmin, softDeleteGalleryImage);
app.patch('/api/gallery/:id/restore', authorizeAdmin, restoreGalleryImage);
app.delete('/api/gallery/:id/hard', authorizeAdmin, hardDeleteGalleryImage);

// Partners — public read, admin write
app.get('/api/partners', listPartners);
app.post('/api/partners', authorizeAdmin, uploadPartner);
app.delete('/api/partners/:id', authorizeAdmin, deletePartner);

// Testimonials — public read, admin write
app.get('/api/testimonials', listTestimonials);
app.post('/api/testimonials', authorizeAdmin, createTestimonial);
app.put('/api/testimonials/:id', authorizeAdmin, updateTestimonial);
app.delete('/api/testimonials/:id', authorizeAdmin, deleteTestimonial);

// Before/After — public read, admin write
app.get('/api/beforeafter', listBeforeAfter);
app.post('/api/beforeafter', authorizeAdmin, createBeforeAfterPair);
app.put('/api/beforeafter/reorder', authorizeAdmin, reorderBeforeAfter);
app.put('/api/beforeafter/:id', authorizeAdmin, updateBeforeAfterPair);
app.delete('/api/beforeafter/:id', authorizeAdmin, deleteBeforeAfterPair);

// Calendar — public read, admin write
app.get('/api/calendar', getCalendar);
app.put('/api/calendar', authorizeAdmin, setCalendar);

// Settings — public read, admin write
app.get('/api/settings', getSettings);
app.put('/api/settings', authorizeAdmin, updateSettings);

if (process.env.NODE_ENV !== 'production') {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export const handler = serverless(app);
