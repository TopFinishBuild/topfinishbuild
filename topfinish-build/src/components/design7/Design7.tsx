import { useState } from 'react';
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

export default function Design7() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (href: string) => {
    if (href === '#prices') { setPage('pricing'); window.scrollTo(0, 0); }
    else if (href === '#gallery') { setPage('gallery'); window.scrollTo(0, 0); }
    else setPage('home');
  };

  return (
    <div className="d7-root">
      <Header onNavigate={navigate} />
      {page === 'pricing' ? (
        <D7PricingPage onBack={() => { setPage('home'); window.scrollTo(0, 0); }} />
      ) : page === 'gallery' ? (
        <D7GalleryPage onBack={() => { setPage('home'); window.scrollTo(0, 0); }} />
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
