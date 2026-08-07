import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

const JWT_SECRET = () => process.env.JWT_SECRET || 'default_secret_key';

/** `_id` is a string UUID here, not an ObjectId — always reach the collection as
 *  `collection<UserDoc>('users')` so filters type-check without casts. */
type UserDoc = {
    _id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt?: Date;
};

const users = () => MongoDB.collection<UserDoc>('users');

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const user = await users().findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password ?? ''))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET(), { expiresIn: '2h' });
        res.json({ token, name: user.name });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
    try {
        const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'currentPassword and newPassword required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'Новата парола трябва да е поне 6 символа' });
            return;
        }

        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const filter = { _id: req.userId };
        const user = await users().findOne(filter);
        if (!user || !(await bcrypt.compare(currentPassword, user.password ?? ''))) {
            res.status(401).json({ error: 'Грешна текуща парола' });
            return;
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await users().updateOne(filter, { $set: { password: hashed } });
        res.json({ ok: true });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}

export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, name, password } = req.body as { email?: string; name?: string; password?: string };
        if (!email || !name || !password) {
            res.status(400).json({ error: 'email, name and password required' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Паролата трябва да е поне 6 символа' });
            return;
        }

        const existing = await users().findOne({ email });
        if (existing) {
            res.status(409).json({ error: 'Потребител с този имейл вече съществува' });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        await users().insertOne({
            _id: uuidv4(), email, name, password: hashed, role: 'admin', createdAt: new Date(),
        });

        res.status(201).json({ ok: true, email, name });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
    }
}
