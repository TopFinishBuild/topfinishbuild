import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
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

function parsePathname(path: string): Route {
    if (path.startsWith('/admin'))        return { page: 'admin' };
    if (path.startsWith('/remont-snimki/')) return { page: 'gallery', slug: path.slice(16) || undefined };
    if (path === '/remont-snimki')          return { page: 'gallery' };
    if (path === '/prices')               return { page: 'pricing' };
    if (path === '/about')                return { page: 'about' };
    if (path === '/predi-i-sled')         return { page: 'beforeafter' };
    return { page: 'home' };
}

function pageToPath(page: Page): string {
    if (page === 'gallery')     return '/remont-snimki';
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

    // Browser back/forward
    useEffect(() => {
        const onPop = () => setRoute(parsePathname(window.location.pathname));
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    // Scroll to hash on initial load / refresh (e.g. /#partniori)
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const tryScroll = (attempts = 0) => {
            const el = document.querySelector(hash);
            if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
            if (attempts < 10) setTimeout(() => tryScroll(attempts + 1), 150);
        };
        tryScroll();
    }, []);

    const [scrollSection, setScrollSection] = useState('');
    const activeSection = useMemo(
        () => route.page !== 'home' ? (route.page === 'about' ? '#about' : '') : scrollSection,
        [route, scrollSection]
    );
    const pendingAnchor = useRef<string | null>(null);

    // Scroll anchor after returning to home
    useEffect(() => {
        if (route.page === 'home' && pendingAnchor.current) {
            const anchor = pendingAnchor.current;
            pendingAnchor.current = null;
            setTimeout(() => {
                document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', anchor);
            }, 50);
        }
    }, [route]);

    // Track scroll only on home
    useEffect(() => {
        if (route.page !== 'home') return;
        const onScroll = () => {
            const triggerY = window.scrollY + window.innerHeight * 0.35;
            let current = '';
            for (const id of SECTION_IDS) {
                const el = document.querySelector(id) as HTMLElement | null;
                if (el && el.offsetTop <= triggerY) current = id;
            }
            setScrollSection(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [route.page]);

    useEffect(() => { window.scrollTo(0, 0); }, [route.page]);

    const navigate = (href: string) => {
        // Scroll anchors — scroll + update hash in URL
        if (SCROLL_ANCHORS.has(href)) {
            if (route.page !== 'home') {
                pendingAnchor.current = href;
                push('/');
                setRoute({ page: 'home' });
            } else {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', href);
            }
            return;
        }
        // Direct gallery slug links e.g. /remont-snimki/cat/city-label
        if (href.startsWith('/remont-snimki')) {
            const slug = href.startsWith('/remont-snimki/') ? href.slice(16) : undefined;
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
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
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
                                onViewAll={() => { push('/remont-snimki'); setRoute({ page: 'gallery' }); window.scrollTo(0, 0); }}
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
