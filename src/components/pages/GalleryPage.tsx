import { useState, useEffect, useCallback } from 'react';
import ProjectCard from '../sections/ProjectCard';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwipe } from '../../hooks/useSwipe';
import { api } from '../../api/client';
import { fetchCategories } from '../../api/categoryCache';

interface GalleryItem {
  _id?: string;
  cat: string;
  label: string;
  src: string;
  srcFull?: string;
  materials?: string;
  duration?: string;
}

interface GalleryPageProps {
  onNavigate: (href: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [tab, setTab]         = useState('Всички');
  const [cats, setCats]       = useState<string[]>(['Всички']);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      api.get<{ images: { _id: string; label: string; category: string; url: string; urlSmall?: string; materials?: string; duration?: string }[] }>('/gallery'),
    ]).then(([cats, galleryRes]) => {
      setCats(['Всички', ...cats.map(c => c.name)]);
      setAllItems(galleryRes.images.map(img => ({
        _id: img._id,
        cat: img.category,
        label: img.label,
        src: img.urlSmall ?? img.url,
        srcFull: img.url,
        materials: img.materials,
        duration: img.duration,
      })));
    }).catch(() => { /* leave empty */ })
      .finally(() => setLoading(false));
  }, []);

  const items = tab === 'Всички' ? allItems : allItems.filter(i => i.cat === tab);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + items.length) % items.length);
  }, [lightbox, items.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % items.length);
  }, [lightbox, items.length]);

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
      <div className="page-hero">
        <div className="container">
          <span className="section-label" style={{ marginTop: 16, display: 'inline-block' }}>Галерия</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 10 }}>
            НАШИТЕ <em>ПРОЕКТИ</em>
          </h1>
        </div>
      </div>

      <div className="gallery-page__content">
        <div className="container">
          <div className="gallery-page__filters">
            {cats.map(c => (
              <button key={c}
                className={`gallery-page__filter-btn${tab === c ? ' active' : ''}`}
                onClick={() => setTab(c)}
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
          {/* Modal — strictly fixed size, nothing inside can change it */}
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
            {/* Image zone — fixed 62% height on mobile, 65% width on desktop */}
            <div style={{
              flexShrink: 0,
              flexGrow: 0,
              width: isMobile ? '100%' : '65%',
              height: isMobile ? '49%' : '100%',
              background: '#000',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img
                src={current.srcFull ?? current.src}
                alt={current.label}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Close — inside image zone top-right */}
              <button
                onClick={e => { e.stopPropagation(); closeLightbox(); }}
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, background: 'rgba(0,0,0,0.65)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '50%', width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Затвори"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              {/* Arrows always on image */}
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
              {/* Counter on image */}
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 12, fontFamily: 'Manrope,sans-serif', padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                {lightbox + 1} / {items.length}
              </div>
            </div>

            {/* Info panel — fills remaining space, scrolls internally */}
            <div style={{
              flexShrink: 0,
              flexGrow: 0,
              width: isMobile ? '100%' : '35%',
              height: isMobile ? '52%' : '100%',
              background: '#fff',
              padding: isMobile ? '16px 16px 20px' : '40px 36px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 12 : 20,
            }}>
              <div>
                <span style={{ display: 'inline-block', background: '#f07420', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 12px', borderRadius: 50, fontFamily: 'Manrope,sans-serif', marginBottom: 8 }}>{current.cat}</span>
                <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 17 : 22, fontWeight: 800, color: '#0f1f3d', lineHeight: 1.2, margin: 0 }}>{current.label}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f07420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <div>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', margin: 0 }}>Срок</p>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>{current.duration}</p>
                </div>
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
