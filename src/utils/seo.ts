/**
 * Per-route <head>: title, description, canonical, robots.
 *
 * The app navigates with `history.pushState`, so nothing in <head> changes by itself —
 * without this every URL would report the homepage title to Google and the five routes
 * would look like one duplicated page. Netlify's prerender bakes whatever we set here
 * into the HTML that crawlers get.
 */
import { toSlug } from './slug';

/** Canonical host. Netlify serves the same build on .com and on *.netlify.app — one origin wins. */
export const SITE_URL = 'https://topfinishbuild.bg';

const BRAND = 'TopFinish Build';

export interface PageMeta {
    title: string;
    description: string;
    /** Path only, e.g. `/prices`. The canonical is always built on SITE_URL. */
    path: string;
    noindex?: boolean;
}

function metaTag(name: string): HTMLMetaElement {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
    }
    return el;
}

function canonicalTag(): HTMLLinkElement {
    let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
    }
    return el;
}

export function applyMeta({ title, description, path, noindex }: PageMeta): void {
    document.title = title;
    metaTag('description').content = description;
    metaTag('robots').content = noindex ? 'noindex, nofollow' : 'index, follow';
    canonicalTag().href = SITE_URL + path;
}

/** Static routes. Gallery is dynamic — see `galleryMeta` / `galleryImageMeta`. */
export const ROUTE_META: Record<string, PageMeta> = {
    home: {
        path: '/',
        title: `Довършителни ремонти в София – ${BRAND}`,
        description: 'Топ Финиш Билд – довършителни ремонти в София. Шпакловка, боядисване, теракота, гипсокартон, ВиК и електро. 12+ години опит, 350+ завършени обекта.',
    },
    pricing: {
        path: '/prices',
        title: `Цени за довършителни ремонти – ${BRAND}`,
        description: 'Цени за довършителни ремонти в София. Изготвяме индивидуална оферта за вашия обект – отговаряме до 24 часа.',
    },
    about: {
        path: '/about',
        title: `За нас – екип с 12+ години опит | ${BRAND}`,
        description: 'Екипът на TopFinish Build – сертифицирани специалисти по довършителни ремонти в жилищни, офис и индустриални пространства. 350+ завършени обекта в София.',
    },
    beforeafter: {
        path: '/predi-i-sled',
        title: `Преди и след ремонт – реални трансформации | ${BRAND}`,
        description: 'Реални трансформации на апартаменти, бани и офиси в София. Плъзнете, за да видите състоянието преди и след ремонта от екипа на TopFinish Build.',
    },
    admin: {
        path: '/admin',
        title: `Админ панел – ${BRAND}`,
        description: '',
        noindex: true,
    },
};

/** `/remont-snimki` and `/remont-snimki/{category}`. */
export function galleryMeta(category?: string): PageMeta {
    if (!category) {
        return {
            path: '/remont-snimki',
            title: `Галерия – снимки от завършени ремонти | ${BRAND}`,
            description: 'Снимки от завършени довършителни ремонти в София – бани, кухни, настилки, боядисване и гипсокартон. Реални обекти на TopFinish Build.',
        };
    }
    return {
        path: `/remont-snimki/${toSlug(category)}`,
        title: `${category} – снимки от ремонти в София | ${BRAND}`,
        description: `Снимки от завършени обекти в категория „${category}“. Реални ремонти, изпълнени от екипа на TopFinish Build в София и страната.`,
    };
}

export interface GalleryImageInfo {
    label: string;
    cat: string;
    city?: string;
    area?: string;
}

export interface GalleryImageMeta extends GalleryImageInfo {
    slug: string;
}

/** `/remont-snimki/{category}/{image}` — a deep link to one open photo. */
export function galleryImageMeta(item: GalleryImageMeta): PageMeta {
    const where = item.city ? ` в ${item.city}` : '';
    const size  = item.area ? `, ${item.area}` : '';
    return {
        path: `/remont-snimki/${item.slug}`,
        title: `${item.label}${where} – ${item.cat} | ${BRAND}`,
        description: `${item.label}${where}${size} – завършен обект от категория „${item.cat}“, изпълнен от TopFinish Build.`,
    };
}

/** Alt text for a gallery photo: what it shows, where, how big. */
export function galleryImageAlt(item: GalleryImageInfo): string {
    const parts = [item.label, item.cat];
    if (item.city) parts.push(item.city);
    if (item.area) parts.push(item.area);
    return `${parts.join(' – ')} | ремонт от TopFinish Build`;
}

/**
 * The phone lives in the DB, so the LocalBusiness JSON-LD in index.html ships without it.
 * Fill it in once settings arrive — the prerendered HTML then carries a complete listing.
 */
export function setBusinessPhone(phone: string): void {
    if (!phone) return;
    const el = document.getElementById('ld-business');
    if (!el?.textContent) return;
    try {
        const data = JSON.parse(el.textContent) as Record<string, unknown>;
        if (data.telephone === phone) return;
        data.telephone = phone;
        el.textContent = JSON.stringify(data);
    } catch { /* malformed JSON-LD — leave it alone */ }
}

