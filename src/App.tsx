import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import './styles/app.css';
import { prefetchCategories } from './api/categoryCache';
import { fetchSettings } from './api/settingsCache';

// Above-fold — eager (needed for LCP)
import Hero            from './components/sections/Hero';
import StatsBar        from './components/sections/StatsBar';
import Header          from './components/layout/Header';
import Footer          from './components/layout/Footer';
import SkeletonFallback from './components/sections/SkeletonFallback';

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
const calendarPageImport    = () => import('./components/pages/CalendarPage');
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
const CalendarPage    = lazy(calendarPageImport);
const BeforeAfterPage = lazy(beforeAfterPageImport);

export type Page = 'home' | 'pricing' | 'gallery' | 'about' | 'calendar' | 'beforeafter' | 'admin';

interface Route { page: Page; slug?: string; }

// Scroll-only anchors — these never change the URL
const SCROLL_ANCHORS = new Set(['#services', '#partners', '#contact', '#about-preview']);
const SECTION_IDS    = ['#services', '#calendar', '#partners'];

function parsePathname(path: string): Route {
    if (path.startsWith('/admin'))        return { page: 'admin' };
    if (path.startsWith('/galeria/'))     return { page: 'gallery', slug: path.slice(9) || undefined };
    if (path === '/galeria')              return { page: 'gallery' };
    if (path === '/calendar')             return { page: 'calendar' };
    if (path === '/prices')               return { page: 'pricing' };
    if (path === '/about')                return { page: 'about' };
    if (path === '/predi-i-sled')         return { page: 'beforeafter' };
    return { page: 'home' };
}

function pageToPath(page: Page): string {
    if (page === 'gallery')     return '/galeria';
    if (page === 'calendar')    return '/calendar';
    if (page === 'pricing')     return '/prices';
    if (page === 'about')       return '/about';
    if (page === 'beforeafter') return '/predi-i-sled';
    return '/';
}

function push(path: string) {
    if (window.location.pathname !== path) history.pushState(null, '', path);
}

export default function App() {
    const [route, setRoute]               = useState<Route>(() => parsePathname(window.location.pathname));
    const [calendarVisible, setCalendarVisible] = useState(true);

    // Preload chunks + prefetch data after first paint
    useEffect(() => {
        void Promise.all([
            aboutPreviewImport(), servicesImport(), beforeAfterImport(),
            projectsImport(), testimonialsImport(), teamScheduleImport(),
            partnersImport(), pricingPageImport(), galleryPageImport(),
            aboutPageImport(), calendarPageImport(), beforeAfterPageImport(),
        ]);
        // Fetch settings eagerly — needed to conditionally show calendar
        void fetchSettings().then(s => {
            setCalendarVisible(s.calendarVisible);
            // If user landed on /calendar but it's hidden, redirect home
            if (!s.calendarVisible && route.page === 'calendar') {
                history.replaceState(null, '', '/');
                setRoute({ page: 'home' });
            }
        });
        const id = typeof requestIdleCallback !== 'undefined'
            ? requestIdleCallback(prefetchCategories, { timeout: 2000 })
            : setTimeout(prefetchCategories, 0) as unknown as number;
        return () => {
            typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(id) : clearTimeout(id);
        };
    }, []);

    // Browser back/forward
    useEffect(() => {
        const onPop = () => setRoute(parsePathname(window.location.pathname));
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
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
        // Scroll-only anchors — no URL change
        if (SCROLL_ANCHORS.has(href)) {
            if (route.page !== 'home') {
                pendingAnchor.current = href;
                push('/');
                setRoute({ page: 'home' });
            } else {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        // Named page routes
        const next: Record<string, Page> = {
            '#gallery': 'gallery', '#calendar': 'calendar',
            '#prices': 'pricing', '#about': 'about', '#home': 'home',
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
            {page === 'admin' ? (
                <Suspense fallback={null}><AdminPage onNavigate={navigate} /></Suspense>
            ) : (<>
                <Header onNavigate={navigate} activePage={page} activeSection={activeSection} calendarVisible={calendarVisible} />
                {page === 'pricing' ? (
                    <Suspense fallback={null}><PricingPage onNavigate={navigate} /></Suspense>
                ) : page === 'gallery' ? (
                    <Suspense fallback={null}><GalleryPage onNavigate={navigate} initialSlug={slug} /></Suspense>
                ) : page === 'about' ? (
                    <Suspense fallback={null}><AboutPage onNavigate={navigate} /></Suspense>
                ) : page === 'beforeafter' ? (
                    <Suspense fallback={null}><BeforeAfterPage /></Suspense>
                ) : page === 'calendar' && calendarVisible ? (
                    <Suspense fallback={null}><CalendarPage onNavigate={navigate} /></Suspense>
                ) : page === 'calendar' && !calendarVisible ? null : (
                    <>
                        <Hero />
                        <StatsBar />
                        <Suspense fallback={<SkeletonFallback />}>
                            <AboutPreview onNavigate={navigate} />
                            <Services />
                            <BeforeAfter onNavigate={navigate} />
                            <Projects onViewAll={() => { push('/galeria'); setRoute({ page: 'gallery' }); window.scrollTo(0, 0); }} />
                            <Testimonials />
                            {calendarVisible && <TeamSchedule />}
                            <Partners />
                        </Suspense>
                    </>
                )}
                <Footer onNavigate={navigate} />
            </>)}
        </div>
    );
}
