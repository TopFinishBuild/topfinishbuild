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
            from: `"TopFinish Build" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            replyTo: email || undefined,
            subject: `📋 Ново запитване${service ? ` — ${service}` : ''} от ${name}`,
            html: `
<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f1f3d;padding:28px 36px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.5);">TopFinish Build</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;color:#ffffff;">Ново запитване от сайта</h1>
            ${service ? `<p style="margin:8px 0 0;display:inline-block;background:#f07420;color:#fff;font-size:12px;font-weight:700;padding:3px 12px;border-radius:50px;">${service}</p>` : ''}
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Клиент</p>
                  <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#0f1f3d;">${name}</p>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Телефон</p>
                  <p style="margin:4px 0 0;font-size:16px;color:#0f1f3d;"><a href="tel:${phone}" style="color:#f07420;text-decoration:none;font-weight:600;">${phone}</a></p>
                </td>
              </tr>` : ''}
              ${email ? `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Имейл</p>
                  <p style="margin:4px 0 0;font-size:16px;"><a href="mailto:${email}" style="color:#f07420;text-decoration:none;font-weight:600;">${email}</a></p>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:16px 0 0;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Съобщение</p>
                  <p style="margin:10px 0 0;font-size:15px;color:#334155;line-height:1.7;background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #f07420;">${message.replace(/\n/g, '<br/>')}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:18px 36px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">topfinishbuild@gmail.com · topfinish.bg</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });

        res.status(200).json({ message: 'ok' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
