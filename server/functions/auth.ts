import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['x-authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        const token = headerValue.split(' ')[1]?.split(',')[0];
        const secretKey = process.env.JWT_SECRET || 'default_secret_key';
        const decodedToken = jwt.verify(token, secretKey) as { userId: string };
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['x-authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        const token = headerValue.split(' ')[1]?.split(',')[0];
        const secretKey = process.env.JWT_SECRET || 'default_secret_key';
        const decodedToken = jwt.verify(token, secretKey) as { userId: string; role: string };
        if (decodedToken.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error('Error authorizing admin:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export { authenticateUser, authorizeAdmin };
