import nodemailer from 'nodemailer';
import type { Request, Response } from 'express';
import MongoDB from './db.js';
import type { ContactInquiry } from '../types.js';

interface ContactBody {
    name: string;
    phone?: string;
    email?: string;
    message: string;
    service?: string;
}

const getTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, email, message, service } = req.body as ContactBody;

        if (!name || !message) {
            res.status(400).json({ error: 'name and message are required' });
            return;
        }

        // Save inquiry to MongoDB
        const inquiriesCollection = MongoDB.collection<ContactInquiry>('inquiries');
        await inquiriesCollection.insertOne({
            name,
            phone,
            email,
            message,
            service,
            status: 'new',
            createdAt: new Date(),
        });

        const recipientEmail = process.env.CONTACT_RECIPIENT;

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('[contact] SMTP not configured. Would have sent to:', recipientEmail);
            res.status(200).json({ message: 'ok' });
            return;
        }

        if (!recipientEmail) {
            res.status(500).json({ error: 'CONTACT_RECIPIENT not configured' });
            return;
        }

        const transporter = getTransporter();

        await transporter.sendMail({
            from: `"Запитване от сайта" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: `Ново запитване${service ? ` - ${service}` : ''}`,
            html: `
                <h2>Ново запитване от сайта</h2>
                ${service ? `<p><strong>Услуга:</strong> ${service}</p><hr/>` : ''}
                <p><strong>От:</strong> ${name}</p>
                ${phone ? `<p><strong>Телефон:</strong> ${phone}</p>` : ''}
                ${email ? `<p><strong>Имейл:</strong> ${email}</p>` : ''}
                <p><strong>Съобщение:</strong></p>
                <p>${message}</p>
            `,
        });

        res.status(200).json({ message: 'ok' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
