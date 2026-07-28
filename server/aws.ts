import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { getWatermarkSettings, buildOverlay, renderedSize } from './watermark.js';
import type { S3UploadResult, S3UploadWithVariantsResult } from './types.js';

const cfg = () => ({
    region: process.env.MY_AWS_REGION     || 'eu-central-1',
    bucket: process.env.MY_AWS_S3_BUCKET  || '',
    key:    process.env.MY_AWS_ACCESS_KEY_ID     || '',
    secret: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
});

let _s3: S3Client | null = null;
const s3 = () => {
    if (!_s3) {
        const c = cfg();
        _s3 = new S3Client({ region: c.region, credentials: { accessKeyId: c.key, secretAccessKey: c.secret } });
    }
    return _s3;
};

export const getFromS3 = async (key: string): Promise<string> => {
    const { bucket } = cfg();
    return getSignedUrl(s3(), new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
};

export const uploadToS3 = async (key: string, body: Buffer, contentType: string): Promise<S3UploadResult> => {
    const { bucket, region } = cfg();
    await s3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
    return { key, url: `https://${bucket}.s3.${region}.amazonaws.com/${key}` };
};

export const uploadToS3WithVariants = async (
    file: { base64: string; name: string; type: string },
    folder = 'gallery',
    sizes = { full: 800, small: 300 },
    opts: { watermark?: boolean } = {}
): Promise<S3UploadWithVariantsResult> => {
    const { bucket, region } = cfg();
    const buffer = Buffer.from(file.base64.replace(/^data:.+;base64,/, ''), 'base64');
    const id = uuidv4();

    const wm = opts.watermark === false ? null : await getWatermarkSettings();
    const meta = wm?.enabled ? await sharp(buffer).metadata() : null;

    // Watermark is sized per variant so it stays proportional on both.
    const render = async (targetWidth: number, quality: number): Promise<Buffer> => {
        let pipeline = sharp(buffer).rotate().resize(targetWidth, null, { withoutEnlargement: true });
        if (wm && meta) {
            const size = renderedSize(meta, targetWidth);
            const overlay = size && await buildOverlay(size.width, size.height, wm);
            if (overlay) pipeline = pipeline.composite([overlay]);
        }
        return pipeline.webp({ quality }).toBuffer();
    };

    const [bufFull, bufSmall] = await Promise.all([
        render(sizes.full,  85),
        render(sizes.small, 82),
    ]);

    const key      = `${folder}/${id}.webp`;
    const keySmall = `${folder}/${id}_small.webp`;

    await Promise.all([
        s3().send(new PutObjectCommand({ Bucket: bucket, Key: key,      Body: bufFull,  ContentType: 'image/webp' })),
        s3().send(new PutObjectCommand({ Bucket: bucket, Key: keySmall, Body: bufSmall, ContentType: 'image/webp' })),
    ]);

    const base = `https://${bucket}.s3.${region}.amazonaws.com`;
    return { key, keySmall, url: `${base}/${key}`, urlSmall: `${base}/${keySmall}` };
};

/** Stored as PNG so the logo keeps a clean alpha channel for compositing. */
export const uploadWatermarkLogo = async (file: { base64: string }): Promise<S3UploadResult> => {
    const { bucket, region } = cfg();
    const buffer = Buffer.from(file.base64.replace(/^data:.+;base64,/, ''), 'base64');
    const png = await sharp(buffer).rotate().resize(600, null, { withoutEnlargement: true }).png().toBuffer();

    const key = `watermark/${uuidv4()}.png`;
    await s3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: png, ContentType: 'image/png' }));
    return { key, url: `https://${bucket}.s3.${region}.amazonaws.com/${key}` };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
    await s3().send(new DeleteObjectCommand({ Bucket: cfg().bucket, Key: key }));
};
