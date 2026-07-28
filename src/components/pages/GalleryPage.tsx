import { useState, useEffect, useCallback } from 'react';
import ProjectCard from '../sections/ProjectCard';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwipe } from '../../hooks/useSwipe';
import { api } from '../../api/client';
import { fetchCategories } from '../../api/categoryCache';
import { toSlug, buildSlug } from '../../utils/slug';
import { PageHero } from '../common/PageHero';

interface GalleryItem {
  _id?: string;
  cat: string;
  label: string;
  src: string;
  srcFull?: string;
  duration?: string;
  city?: string;
  area?: string;
  slug: string;
}

interface GalleryPageProps {
  onNavigate: (href: string) => void;
  initialSlug?: string;
}

export default function GalleryPage({ onNavigate, initialSlug }: GalleryPageProps) {
  const [tab, setTab]           = useState('Всички');
  const [cats, setCats]         = useState<string[]>(['Всички']);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      api.get<{ images: { _id: string; label: string; category: string; url: string; urlSmall?: string; materials?: string; duration?: string; city?: string; area?: string }[] }>('/gallery'),
    ]).then(([catsData, galleryRes]) => {
      setCats(['Всички', ...catsData.map(c => c.name)]);
      const mapped = galleryRes.images.map(img => ({
        _id: img._id,
        cat: img.category,
        label: img.label,
        src: img.urlSmall ?? img.url,
        srcFull: img.url,
        duration: img.duration,
        city: img.city,
        area: img.area,
        slug: buildSlug(img.category, img.label, img.city),
      }));
      setAllItems(mapped);

      // initialSlug with '/' = image, without = category filter
      if (initialSlug) {
        if (initialSlug.includes('/')) {
          const idx = mapped.findIndex(i => i.slug === initialSlug);
          if (idx !== -1) setLightbox(idx);
        } else {
          const catMatch = catsData.find(c => toSlug(c.name) === initialSlug);
          if (catMatch) setTab(catMatch.name);
        }
      }
    }).catch(() => { /* leave empty */ })
      .finally(() => setLoading(false));
  }, []);

  const items = tab === 'Всички' ? allItems : allItems.filter(i => i.cat === tab);

  const openLightbox = (idx: number) => {
    setLightbox(idx);
    history.pushState(null, '', `/remont-snimki/${items[idx].slug}`);
  };

  const closeLightbox = () => {
    setLightbox(null);
    history.pushState(null, '', tab === 'Всички' ? '/remont-snimki' : `/remont-snimki/${toSlug(tab)}`);
  };

  const prev = useCallback(() => {
    if (lightbox === null) return;
    const next = (lightbox - 1 + items.length) % items.length;
    setLightbox(next);
    history.replaceState(null, '', `/remont-snimki/${items[next].slug}`);
  }, [lightbox, items]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    const nxt = (lightbox + 1) % items.length;
    setLightbox(nxt);
    history.replaceState(null, '', `/remont-snimki/${items[nxt].slug}`);
  }, [lightbox, items]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  const current = lightbox !== null ? items[lightbox] : null;
  const swipe = useSwipe(next, prev);
  const { setNode: swipeSetNode } = swipe;

  return (
    <div className="gallery-page">
      <PageHero label="Галерия" title={<>НАШИТЕ <em>ПРОЕКТИ</em></>} />

      <div className="gallery-page__content">
        <div className="container">
          <div className="gallery-page__filters">
            {cats.map(c => (
              <button key={c}
                className={`gallery-page__filter-btn${tab === c ? ' active' : ''}`}
                onClick={() => {
                  setTab(c);
                  history.pushState(null, '', c === 'Всички' ? '/remont-snimki' : `/remont-snimki/${toSlug(c)}`);
                }}
              >{c}</button>
            ))}
          </div>
          {loading && <p style={{ color: '#6b7280', padding: '40px 0' }}>Зареждане...</p>}
          {!loading && items.length === 0 && <p style={{ color: '#6b7280', padding: '40px 0' }}>Няма снимки в тази категория.</p>}
          <div className={`projects__grid${isMobile ? ' projects__grid--mobile' : ''}`}>
            {items.map((it, i) => (
              <div key={`${tab}-${i}`} onClick={() => openLightbox(i)} style={{ cursor: 'pointer' }}>
                <ProjectCard label={it.label} src={it.src} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {current && lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,18,40,0.96)', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center', paddingTop: isMobile ? 'env(safe-area-inset-top, 8px)' : 0 }}
          onClick={closeLightbox}
          ref={swipeSetNode}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '100vw' : 'min(90vw, 1200px)',
              height: isMobile ? 'calc(100dvh - env(safe-area-inset-top, 8px))' : 'min(88vh, 780px)',
              borderRadius: isMobile ? 0 : 12,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Image zone */}
            <div style={{ flexShrink: 0, flexGrow: 0, width: isMobile ? '100%' : '65%', height: isMobile ? '49%' : '100%', background: '#000', position: 'relative', overflow: 'hidden' }}>
              <img
                src={current.srcFull ?? current.src}
                alt={current.label}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={e => { e.stopPropagation(); closeLightbox(); }}
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, background: 'rgba(0,0,0,0.65)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '50%', width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Затвори"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                aria-label="Предишна снимка"
              >
                <svg width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                aria-label="Следваща снимка"
              >
                <svg width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 15, fontFamily: 'Manrope,sans-serif', fontWeight: 600, padding: '6px 18px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                {lightbox + 1} / {items.length}
              </div>
            </div>

            {/* Info panel */}
            <div style={{ flexShrink: 0, flexGrow: 0, width: isMobile ? '100%' : '35%', height: isMobile ? '52%' : '100%', background: '#fff', padding: isMobile ? '20px 18px 24px' : '44px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>
              <div>
                <span style={{ display: 'inline-block', background: '#f07420', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 12px', borderRadius: 50, fontFamily: 'Manrope,sans-serif', marginBottom: 10 }}>{current.cat}</span>
                <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 18 : 23, fontWeight: 800, color: '#0f1f3d', lineHeight: 1.25, margin: 0 }}>{current.label}</h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                {current.area && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f8fafc', border: '1px solid #e9eef4', borderRadius: 8, padding: '8px 14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f07420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f1f3d' }}>{current.area} кв.м.</span>
                  </div>
                )}
                {current.city && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f8fafc', border: '1px solid #e9eef4', borderRadius: 8, padding: '8px 14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f07420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f1f3d' }}>{current.city}</span>
                  </div>
                )}
                {current.duration && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f8fafc', border: '1px solid #e9eef4', borderRadius: 8, padding: '8px 14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f07420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontSize: 14, fontWeight: 700, color: '#0f1f3d' }}>{current.duration} дни</span>
                  </div>
                )}
              </div>
              <button onClick={() => { closeLightbox(); onNavigate('#calendar'); }} style={{ marginTop: 'auto', display: 'block', width: '100%', background: '#f07420', color: '#fff', fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 13 : 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: isMobile ? '14px 20px' : '13px 24px', borderRadius: 6, textAlign: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Заявете подобен проект
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
