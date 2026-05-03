import { useState, useEffect, useRef } from 'react';
import './design7.css';

import Hero           from '../Hero';
import D7StatsLine    from './D7StatsLine';
import D7Partner      from './D7Partner';
import D7Services     from './D7Services';
import D7BeforeAfter  from './D7BeforeAfter';
import D7Testimonials from './D7Testimonials';
import D7TeamBusy     from './D7TeamBusy';
import D7Footer       from './D7Footer';
import D7Projects     from './D7Projects';
import D7PricingPage  from './D7PricingPage';
import D7GalleryPage  from './D7GalleryPage';
import Partners from '../Partners';
import Header from '../Header';

type Page = 'home' | 'pricing' | 'gallery';

const SECTION_IDS = ['#services', '#before-after', '#calendar', '#partners'];

export default function Design7() {
  const [page, setPage] = useState<Page>('home');
  const [activeSection, setActiveSection] = useState('');
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

  // Track active section while on home page
  useEffect(() => {
    if (page !== 'home') { setActiveSection(''); return; }

    const onScroll = () => {
      const triggerY = window.scrollY + window.innerHeight * 0.35;
      let current = '';
      for (const id of SECTION_IDS) {
        const el = document.querySelector(id) as HTMLElement | null;
        if (el && el.offsetTop <= triggerY) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  const navigate = (href: string) => {
    if (href === '#prices') {
      setPage('pricing'); window.scrollTo(0, 0);
    } else if (href === '#gallery') {
      setPage('gallery'); window.scrollTo(0, 0);
    } else if (href === '#home') {
      setPage('home'); window.scrollTo(0, 0);
    } else {
      if (page !== 'home') {
        pendingAnchor.current = href;
        setPage('home');
        window.scrollTo(0, 0);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="d7-root">
      <Header onNavigate={navigate} activePage={page} activeSection={activeSection} />
      {page === 'pricing' ? (
        <D7PricingPage />
      ) : page === 'gallery' ? (
        <D7GalleryPage />
      ) : (
        <>
          <Hero />
          <D7StatsLine />
          <D7Partner />
          <D7Services />
          <D7BeforeAfter />
          <D7Projects onViewAll={() => { setPage('gallery'); window.scrollTo(0, 0); }} />
          <D7Testimonials />
          <D7TeamBusy />
          <Partners />
        </>
      )}
      <D7Footer />
    </div>
  );
}
