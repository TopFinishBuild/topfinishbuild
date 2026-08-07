import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import './styles/app.css';
import { prefetchCategories } from './api/categoryCache';

// Above-fold — eager (needed for LCP)
import Hero            from './components/sections/Hero';
import StatsBar        from './components/sections/StatsBar';
import Header          from './components/layout/Header';
import Footer          from './components/layout/Footer';
import SkeletonFallback from './components/sections/SkeletonFallback';
import { Toaster }     from './components/common/Toaster';

// Below-fold — lazy
const aboutPreviewImport = () => import('./components/sections/AboutPreview');
const servicesImport     = () => import('./components/sections/Services');
const beforeAfterImport  = () => import('./components/sections/BeforeAfter');
const projectsImport     = () => import('./components/sections/Projects');
const testimonialsImport = () => import('./components/sections/Testimonials');
const teamScheduleImport = () => import('./components/sections/TeamSchedule');
const partnersImport     = () => import('./components/sections/Partners');
const pricingPageImport  = () => import('./components/pages/PricingPage');
const galleryPageImport  = () => import('./components/pages/GalleryPage');
const aboutPageImport    = () => import('./components/pages/AboutPage');
const adminPageImport       = () => import('./components/pages/AdminPage');
const beforeAfterPageImport = () => import('./components/pages/BeforeAfterPage');

const AboutPreview  = lazy(aboutPreviewImport);
const Services      = lazy(servicesImport);
const BeforeAfter   = lazy(beforeAfterImport);
const Projects      = lazy(projectsImport);
const Testimonials  = lazy(testimonialsImport);
const TeamSchedule  = lazy(teamScheduleImport);
const Partners      = lazy(partnersImport);
const PricingPage   = lazy(pricingPageImport);
const GalleryPage   = lazy(galleryPageImport);
const AboutPage     = lazy(aboutPageImport);
const AdminPage       = lazy(adminPageImport);
const BeforeAfterPage = lazy(beforeAfterPageImport);

export type Page = 'home' | 'pricing' | 'gallery' | 'about' | 'beforeafter' | 'admin';

interface Route { page: Page; slug?: string; }

// Scroll-only anchors — these never change the URL
const SCROLL_ANCHORS = new Set(['#uslugi', '#partniori', '#contact', '#calendar', '#contact-form', '#about-preview']);
const SECTION_IDS    = ['#uslugi', '#calendar', '#partniori'];
/** The `#section` the page was opened with, if it looks like a plain anchor. */
const urlHash = (): string => {
    const h = window.location.hash;
    return /^#[\w-]+$/.test(h) ? h : '';
};

/** Must match `html { scroll-padding-top }` in app.css — where an anchor parks. */
const SCROLL_PADDING = 72;
/** Document Y that parks `el` just under the sticky header. */
const anchorTop = (el: Element) =>
    Math.max(0, el.getBoundingClientRect().top + window.scrollY - SCROLL_PADDING);
/** Scroll-spy line, a little below the sticky header. */
const SPY_LINE       = 96;

const GALLERY_PATH = '/remont-snimki';
/** Everything after `/remont-snimki/` — derived, so the offset can't drift out of sync. */
const gallerySlug = (path: string) => path.slice(GALLERY_PATH.length + 1) || undefined;

function parsePathname(path: string): Route {
    if (path.startsWith('/admin'))        return { page: 'admin' };
    if (path.startsWith(`${GALLERY_PATH}/`)) return { page: 'gallery', slug: gallerySlug(path) };
    if (path === GALLERY_PATH)              return { page: 'gallery' };
    if (path === '/prices')               return { page: 'pricing' };
    if (path === '/about')                return { page: 'about' };
    if (path === '/predi-i-sled')         return { page: 'beforeafter' };
    return { page: 'home' };
}

function pageToPath(page: Page): string {
    if (page === 'gallery')     return GALLERY_PATH;
    if (page === 'pricing')     return '/prices';
    if (page === 'about')       return '/about';
    if (page === 'beforeafter') return '/predi-i-sled';
    return '/';
}

function push(path: string) {
    if (window.location.pathname !== path) history.pushState(null, '', path);
}

export default function App() {
    const [route, setRoute] = useState<Route>(() => parsePathname(window.location.pathname));

    // Preload chunks + prefetch data after first paint
    useEffect(() => {
        void Promise.all([
            aboutPreviewImport(), servicesImport(), beforeAfterImport(),
            projectsImport(), testimonialsImport(), teamScheduleImport(),
            partnersImport(), pricingPageImport(), galleryPageImport(),
            aboutPageImport(), beforeAfterPageImport(),
        ]);
        const id = typeof requestIdleCallback !== 'undefined'
            ? requestIdleCallback(prefetchCategories, { timeout: 2000 })
            : setTimeout(prefetchCategories, 0) as unknown as number;
        return () => {
            if (typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(id);
            else clearTimeout(id);
        };
    }, []);

    // Seeded from the URL so a refresh at /#partniori highlights Партньори on first paint.
    const [scrollSection, setScrollSection] = useState(urlHash);
    const activeSection = useMemo(
        () => route.page !== 'home' ? (route.page === 'about' ? '#about' : '') : scrollSection,
        [route, scrollSection]
    );
    const pendingAnchor = useRef<string | null>(null);
    /**
     * While a click-driven scroll is in flight, the pressed link owns the indicator.
     * A smooth scroll is animated and the page can still be settling underneath it,
     * so trusting the scroll position mid-flight lights up whichever section it is
     * passing through. Released as soon as the user scrolls themselves.
     */
    const spyLock = useRef<string | null>(null);

    const scrollToAnchor = (anchor: string) => {
        spyLock.current = anchor;
        setScrollSection(anchor);
        const el = document.querySelector(anchor);
        if (el) window.scrollTo({ top: anchorTop(el), behavior: 'smooth' });
    };

    /**
     * Park the page on an anchor without animating.
     * Sections are lazy and their images stream in, so the page keeps growing after
     * the first paint. A single smooth scroll aims at a target that has since moved —
     * that is how a refresh at #partniori used to land on the reviews instead.
     * So: jump instantly, then keep re-aligning until the anchor stops drifting.
     * Used for fresh loads and for Back/Forward, where a jump is what's expected anyway.
     */
    const settleToAnchor = useCallback((hash: string) => {
        spyLock.current = hash;   // callers own the indicator state

        let cancelled = false;
        let landed = 0;
        const deadline = Date.now() + 6000;

        const tick = () => {
            if (cancelled || spyLock.current !== hash) return;   // user took over

            const el = document.querySelector(hash);
            if (el) {
                const doc = document.documentElement;
                // The last section may sit closer to the end than the header offset allows.
                const reachable = Math.min(anchorTop(el), doc.scrollHeight - window.innerHeight);
                if (Math.abs(window.scrollY - reachable) <= 2) landed++;
                // `instant` on purpose: `html { scroll-behavior: smooth }` would otherwise
                // animate each correction, and an animation is what a growing page invalidates.
                else { landed = 0; window.scrollTo({ top: reachable, behavior: 'instant' }); }
            }

            if (landed < 3 && Date.now() < deadline) setTimeout(tick, 120);
            else if (spyLock.current === hash) spyLock.current = null;   // hand back to the spy
        };

        tick();
        return () => { cancelled = true; };
    }, []);

    // Fresh load / refresh at /#some-section
    useEffect(() => {
        const hash = urlHash();
        if (hash) return settleToAnchor(hash);
    }, [settleToAnchor]);

    // Browser Back / Forward
    useEffect(() => {
        const onPop = () => {
            const next = parsePathname(window.location.pathname);
            setRoute(next);
            if (next.page !== 'home') return;

            // Anchors live in the hash, which `parsePathname` ignores, so stepping through
            // history across them has to move the page and the indicator by hand.
            const hash = urlHash();
            if (hash) { setScrollSection(hash); settleToAnchor(hash); return; }
            spyLock.current = null;
            setScrollSection('');
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [settleToAnchor]);

    // Scroll anchor after returning to home
    useEffect(() => {
        if (route.page === 'home' && pendingAnchor.current) {
            const anchor = pendingAnchor.current;
            pendingAnchor.current = null;
            setTimeout(() => {
                scrollToAnchor(anchor);
                history.replaceState(null, '', anchor);
            }, 50);
        }
    }, [route]);

    // Any real user scroll hands control back to the spy.
    useEffect(() => {
        const release = () => { spyLock.current = null; };
        const opts = { passive: true } as const;
        window.addEventListener('wheel', release, opts);
        window.addEventListener('touchmove', release, opts);
        window.addEventListener('mousedown', release, opts);   // scrollbar drag
        window.addEventListener('keydown', release);
        return () => {
            window.removeEventListener('wheel', release);
            window.removeEventListener('touchmove', release);
            window.removeEventListener('mousedown', release);
            window.removeEventListener('keydown', release);
        };
    }, []);

    // Track scroll only on home
    useEffect(() => {
        if (route.page !== 'home') return;
        const onScroll = () => {
            if (spyLock.current) return;   // a click owns the indicator until the user scrolls

            // Sits just under the sticky header, i.e. where a clicked section lands —
            // so the link you pressed is the one that lights up.
            const line = SPY_LINE;
            const doc = document.documentElement;
            const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;

            // Picked by live position, not array order, so the two can never drift apart.
            let current = '', bestTop = -Infinity;
            let lowest = '', lowestTop = -Infinity;
            for (const id of SECTION_IDS) {
                const el = document.querySelector(id);
                if (!el) continue;
                const top = el.getBoundingClientRect().top;
                if (top <= line && top > bestTop) { bestTop = top; current = id; }
                if (top > lowestTop) { lowestTop = top; lowest = id; }
            }
            // The final section can be too short to ever reach the line.
            if (atBottom && lowest) current = lowest;

            setScrollSection(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [route.page]);

    // Landing on a new page starts fresh; a pending anchor re-arms the lock right after.
    // Keyed off the previous page rather than a mount flag, so StrictMode's double
    // effect run doesn't count as a navigation and wipe the initial `#hash` scroll.
    const prevPage = useRef(route.page);
    useEffect(() => {
        if (prevPage.current === route.page) return;
        prevPage.current = route.page;
        if (urlHash()) return;   // an anchor landing owns the scroll position
        spyLock.current = null;
        window.scrollTo(0, 0);
    }, [route.page]);

    const navigate = (href: string) => {
        // Scroll anchors — scroll + update hash in URL
        if (SCROLL_ANCHORS.has(href)) {
            if (route.page !== 'home') {
                pendingAnchor.current = href;
                push('/');
                setRoute({ page: 'home' });
            } else {
                scrollToAnchor(href);
                history.pushState(null, '', href);
            }
            return;
        }
        // Direct gallery slug links e.g. /remont-snimki/cat/city-label
        if (href.startsWith(GALLERY_PATH)) {
            const slug = href.startsWith(`${GALLERY_PATH}/`) ? gallerySlug(href) : undefined;
            push(href);
            setRoute({ page: 'gallery', slug });
            return;
        }
        // Logo / home click — always scroll to top
        if (href === '#home') {
            if (route.page !== 'home') { push('/'); setRoute({ page: 'home' }); }
            else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
            return;
        }
        // Named page routes
        const next: Record<string, Page> = {
            '#gallery': 'gallery',
            '#prices': 'pricing', '#about': 'about',
            '#predi-i-sled': 'beforeafter',
        };
        const page = next[href];
        if (page) {
            push(pageToPath(page));
            setRoute({ page });
            return;
        }
        // Generic scroll anchor on home
        if (route.page !== 'home') {
            pendingAnchor.current = href;
            push('/');
            setRoute({ page: 'home' });
        } else {
            scrollToAnchor(href);
        }
    };

    const { page, slug } = route;

    return (
        <div className="app-root">
            <Toaster />
            {page === 'admin' ? (
                <Suspense fallback={null}><AdminPage onNavigate={navigate} /></Suspense>
            ) : (<>
                <Header onNavigate={navigate} activePage={page} activeSection={activeSection} />
                <div className="app-root__content">
                    {page === 'pricing' ? (
                        <Suspense fallback={null}><PricingPage onNavigate={navigate} /></Suspense>
                    ) : page === 'gallery' ? (
                        <Suspense fallback={null}><GalleryPage onNavigate={navigate} initialSlug={slug} /></Suspense>
                    ) : page === 'about' ? (
                        <Suspense fallback={null}><AboutPage onNavigate={navigate} /></Suspense>
                    ) : page === 'beforeafter' ? (
                        <Suspense fallback={null}><BeforeAfterPage /></Suspense>
                    ) : (
                        <>
                            <Hero />
                            <StatsBar />
                            <Suspense fallback={<SkeletonFallback />}>
                                <AboutPreview onNavigate={navigate} />
                                <Services />
                                <BeforeAfter onNavigate={navigate} />
                                <Projects
                                onViewAll={() => { push(GALLERY_PATH); setRoute({ page: 'gallery' }); window.scrollTo(0, 0); }}
                                onNavigate={navigate}
                            />
                                <Testimonials />
                                <TeamSchedule />
                                <Partners />
                            </Suspense>
                        </>
                    )}
                </div>
                <Footer onNavigate={navigate} />
            </>)}
        </div>
    );
}
