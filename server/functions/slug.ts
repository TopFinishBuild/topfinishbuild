/**
 * Mirror of src/utils/slug.ts — the sitemap has to emit the exact URLs the client
 * builds, otherwise a crawled link opens the gallery without finding the photo.
 * Kept as a copy because the server is its own package (own tsconfig rootDir).
 * Change one, change both.
 */
const BG: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': '', 'ю': 'yu', 'я': 'ya',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ж': 'zh', 'З': 'z',
    'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p',
    'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'ts', 'Ч': 'ch',
    'Ш': 'sh', 'Щ': 'sht', 'Ъ': 'a', 'Ь': '', 'Ю': 'yu', 'Я': 'ya',
};

export function toSlug(s: string): string {
    return s
        .split('')
        .map(c => BG[c] ?? c)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** /remont-snimki/{cat}/{city?-}{label} */
export function buildSlug(category: string, label: string, city?: string): string {
    const cat = toSlug(category || '');
    const lbl = toSlug(label || '');
    const name = city ? `${toSlug(city)}-${lbl}` : lbl;
    return cat ? `${cat}/${name}` : name;
}
