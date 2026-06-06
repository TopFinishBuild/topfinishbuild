import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const JWT_SECRET = () => process.env.JWT_SECRET || 'default_secret_key';

const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['x-authorization'];
        if (!authHeader) { res.status(401).json({ error: 'Unauthorized' }); return; }
        const token = (Array.isArray(authHeader) ? authHeader[0] : authHeader).split(' ')[1]?.split(',')[0];
        const decoded = jwt.verify(token, JWT_SECRET()) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['x-authorization'];
        if (!authHeader) { res.status(401).json({ error: 'Unauthorized' }); return; }
        const token = (Array.isArray(authHeader) ? authHeader[0] : authHeader).split(' ')[1]?.split(',')[0];
        const decoded = jwt.verify(token, JWT_SECRET()) as { userId: string; role: string };
        if (decoded.role !== 'admin') { res.status(403).json({ error: 'Forbidden' }); return; }
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export { authenticateUser, authorizeAdmin };
