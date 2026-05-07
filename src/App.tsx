import { useState, useEffect, useRef, useMemo } from 'react';
import './styles/app.css';

import Hero           from './components/sections/Hero';
import StatsBar       from './components/sections/StatsBar';
import AboutPreview   from './components/sections/AboutPreview';
import Services       from './components/sections/Services';
import BeforeAfter    from './components/sections/BeforeAfter';
import Testimonials   from './components/sections/Testimonials';
import TeamSchedule   from './components/sections/TeamSchedule';
import Footer         from './components/layout/Footer';
import Projects       from './components/sections/Projects';
import PricingPage    from './components/pages/PricingPage';
import GalleryPage    from './components/pages/GalleryPage';
import AboutPage      from './components/pages/AboutPage';
import Partners       from './components/sections/Partners';
import Header         from './components/layout/Header';

type Page = 'home' | 'pricing' | 'gallery' | 'about';

const SECTION_IDS = ['#services', '#before-after', '#calendar', '#partners'];

export default function App() {
  const [page, setPage] = useState<Page>('home');
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
      <Header onNavigate={navigate} activePage={page} activeSection={activeSection} />
      {page === 'pricing' ? (
        <PricingPage onNavigate={navigate} />
      ) : page === 'gallery' ? (
        <GalleryPage onNavigate={navigate} />
      ) : page === 'about' ? (
        <AboutPage onNavigate={navigate} />
      ) : (
        <>
          <Hero />
          <StatsBar />
          <AboutPreview onNavigate={navigate} />
          <Services />
          <BeforeAfter />
          <Projects onViewAll={() => { setPage('gallery'); window.scrollTo(0, 0); }} />
          <Testimonials />
          <TeamSchedule />
          <Partners />
        </>
      )}
      <Footer onNavigate={navigate} />
    </div>
  );
}
