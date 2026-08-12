import { useEffect } from 'react';
import { applyMeta, type PageMeta } from '../utils/seo';
import { trackPageView } from '../utils/analytics';

/**
 * Writes the route's <head> tags and reports the view to GA4.
 *
 * Ownership: App drives every static route and passes `null` for the gallery, which
 * drives its own — the gallery URL also changes on a category tab and on an open photo,
 * neither of which App sees.
 */
export function usePageMeta(meta: PageMeta | null): void {
    const title       = meta?.title;
    const description = meta?.description;
    const path        = meta?.path;
    const noindex     = meta?.noindex;

    useEffect(() => {
        if (title === undefined || description === undefined || path === undefined) return;
        applyMeta({ title, description, path, noindex });
        if (!noindex) trackPageView(path, title);
    }, [title, description, path, noindex]);
}
