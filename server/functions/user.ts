import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import MongoDB from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const user = await MongoDB.collection<{ _id: string; email: string; password: string; name: string; role: string }>('users').findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password ?? ''))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, name: user.name });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
