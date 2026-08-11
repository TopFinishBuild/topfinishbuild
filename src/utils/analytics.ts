/**
 * GA4 page views for a pushState app.
 *
 * `gtag('config')` in index.html fires exactly one page_view — the initial load.
 * Every navigation after that only rewrites the URL, so without this the whole
 * site reports as a single page and /prices, /about, /remont-snimki show zero traffic.
 */

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

/** Seeded with the loaded URL so the config-fired page_view is never counted twice. */
let lastPath = typeof window !== 'undefined' ? window.location.pathname : '';

export function trackPageView(path: string, title: string): void {
    if (path === lastPath) return;   // same URL from a second caller — one view, not two
    lastPath = path;
    window.gtag?.('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.origin + path,
    });
}
