export interface UploadFile {
    base64: string;
    name: string;
    type: string;
}

/** Widths emitted by scripts/optimize-images.mjs for every file in public/ */
const PUBLIC_WIDTHS = [480, 768, 1200, 1600];

/**
 * srcSet for a static image in public/ — lets the browser pick a variant that
 * matches the rendered box instead of always downloading the full-size file.
 * `/hero.webp` → "/hero-480.webp 480w, /hero-768.webp 768w, …"
 */
export const publicSrcSet = (src: string, widths: number[] = PUBLIC_WIDTHS): string => {
    const base = src.replace(/\.webp$/i, '');
    return widths.map(w => `${base}-${w}.webp ${w}w`).join(', ');
};

interface PrepareOpts {
    maxDim?: number;
    quality?: number;
    /** Use 'image/png' for logos — lossy WebP muddies hard edges and flat color. */
    format?: 'image/webp' | 'image/png';
}

const readAsDataURL = (file: File): Promise<string> =>
    new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
    });

const asIs = async (file: File): Promise<UploadFile> => ({
    base64: await readAsDataURL(file),
    name: file.name,
    type: file.type,
});

/**
 * Compress + convert an image to WebP in the browser before upload.
 * Honors EXIF orientation (from-image) so phone photos are not rotated.
 * Keeps payload small so it fits Netlify's ~6MB function body limit.
 * Vectors/animations and unsupported files are sent unchanged.
 */
export async function prepareImage(
    file: File,
    { maxDim = 1600, quality = 0.85, format = 'image/webp' }: PrepareOpts = {}
): Promise<UploadFile> {
    if (/svg|gif/.test(file.type)) return asIs(file);

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        return asIs(file);
    }

    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        bitmap.close();
        return asIs(file);
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const base64 = canvas.toDataURL(format, quality);
    // Fallback: browsers without WebP encoding return a PNG data URL.
    const type = base64.startsWith('data:image/webp') ? 'image/webp' : 'image/png';
    const ext = type === 'image/webp' ? 'webp' : 'png';
    const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
    return { base64, name, type };
}
