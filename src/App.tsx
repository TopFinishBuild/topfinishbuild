import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { prefetchCategories } from './api/categoryCache';
import './styles/app.css';

// Above-fold — eager (needed for LCP)
import Hero            from './components/sections/Hero';
import StatsBar        from './components/sections/StatsBar';
import Header          from './components/layout/Header';
import Footer          from './components/layout/Footer';
import SkeletonFallback from './components/sections/SkeletonFallback';

// Below-fold — lazy so they don't block the first paint (LCP)
// Preloaded immediately after mount so chunks are ready before user scrolls
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
const adminPageImport    = () => import('./components/pages/AdminPage');

const AboutPreview = lazy(aboutPreviewImport);
const Services     = lazy(servicesImport);
const BeforeAfter  = lazy(beforeAfterImport);
const Projects     = lazy(projectsImport);
const Testimonials = lazy(testimonialsImport);
const TeamSchedule = lazy(teamScheduleImport);
const Partners     = lazy(partnersImport);
const PricingPage  = lazy(pricingPageImport);
const GalleryPage  = lazy(galleryPageImport);
const AboutPage    = lazy(aboutPageImport);
const AdminPage    = lazy(adminPageImport);

type Page = 'home' | 'pricing' | 'gallery' | 'about' | 'admin';

const SECTION_IDS = ['#services', '#before-after', '#calendar', '#partners'];

export default function App() {
  const [page, setPage] = useState<Page>(() =>
    window.location.pathname.startsWith('/admin') ? 'admin' : 'home'
  );

  // Kick off all below-fold chunk downloads right after first paint.
  // By the time the user scrolls, the chunks are already cached — no pop-in jump.
  useEffect(() => {
    void Promise.all([
      aboutPreviewImport(), servicesImport(), beforeAfterImport(),
      projectsImport(), testimonialsImport(), teamScheduleImport(),
      partnersImport(), pricingPageImport(), galleryPageImport(), aboutPageImport(),
    ]);
    // defer until browser is idle — hero LCP paints first
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(prefetchCategories, { timeout: 2000 })
      : setTimeout(prefetchCategories, 0) as unknown as number;
    return () => {
      typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(id) : clearTimeout(id);
    };
  }, []);
  // For non-home pages derive the active section from page directly
  const [scrollSection, setScrollSection] = useState('');
  const activeSection = useMemo(
    () => page !== 'home' ? (page === 'about' ? '#about' : '') : scrollSection,
    [page, scrollSection]
  );
  const pendingAnchor = useRef<string | null>(null);

  // Scroll anchor after returning to home
  useEffect(() => {
    if (page === 'home' && pendingAnchor.current) {
      const anchor = pendingAnchor.current;
      pendingAnchor.current = null;
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [page]);

  // Track scroll position only while on the home page
  useEffect(() => {
    if (page !== 'home') return;

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
  }, [page]);

  // Scroll to top whenever page changes
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const navigate = (href: string) => {
    if (href === '#prices') {
      setPage('pricing');
    } else if (href === '#gallery') {
      setPage('gallery');
    } else if (href === '#about') {
      setPage('about');
    } else if (href === '#home') {
      setPage('home');
    } else {
      if (page !== 'home') {
        pendingAnchor.current = href;
        setPage('home');
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="app-root">
      {page === 'admin' ? (
        <Suspense fallback={null}><AdminPage onNavigate={navigate} /></Suspense>
      ) : (<>
      <Header onNavigate={navigate} activePage={page} activeSection={activeSection} />
      {page === 'pricing' ? (
        <Suspense fallback={null}><PricingPage onNavigate={navigate} /></Suspense>
      ) : page === 'gallery' ? (
        <Suspense fallback={null}><GalleryPage onNavigate={navigate} /></Suspense>
      ) : page === 'about' ? (
        <Suspense fallback={null}><AboutPage onNavigate={navigate} /></Suspense>
      ) : (
        <>
          {/* Hero + StatsBar are eager — never inside Suspense, no layout shift */}
          <Hero />
          <StatsBar />
          <Suspense fallback={<SkeletonFallback />}>
            <AboutPreview onNavigate={navigate} />
            <Services />
            <BeforeAfter />
            <Projects onViewAll={() => { setPage('gallery'); window.scrollTo(0, 0); }} />
            <Testimonials />
            <TeamSchedule />
            <Partners />
          </Suspense>
        </>
      )}
      <Footer onNavigate={navigate} />
      </>)}
    </div>
  );
}
