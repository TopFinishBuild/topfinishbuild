import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import type { S3UploadResult, S3UploadWithVariantsResult } from './types.js';

const REGION = process.env.MY_AWS_REGION || 'eu-central-1';
export const S3_BUCKET = process.env.MY_AWS_S3_BUCKET || '';

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
    },
});

export const getFromS3 = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const uploadToS3 = async (
    key: string,
    body: Buffer,
    contentType: string
): Promise<S3UploadResult> => {
    await s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: body, ContentType: contentType }));
    return { key, url: `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}` };
};

export const uploadToS3WithVariants = async (file: {
    base64: string;
    name: string;
    type: string;
}): Promise<S3UploadWithVariantsResult> => {
    const buffer = Buffer.from(file.base64.replace(/^data:.+;base64,/, ''), 'base64');
    const id = uuidv4();
    const ext = file.name.split('.').pop() || 'jpg';

    const [buf800, buf300] = await Promise.all([
        sharp(buffer).resize(800, null, { withoutEnlargement: true }).toBuffer(),
        sharp(buffer).resize(300, null, { withoutEnlargement: true }).toBuffer(),
    ]);

    const key = `gallery/${id}.${ext}`;
    const keySmall = `gallery/${id}_small.${ext}`;

    await Promise.all([
        s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: buf800, ContentType: file.type })),
        s3.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: keySmall, Body: buf300, ContentType: file.type })),
    ]);

    const base = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com`;
    return { key, keySmall, url: `${base}/${key}`, urlSmall: `${base}/${keySmall}` };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
};
