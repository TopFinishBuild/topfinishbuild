import { useState, useEffect, useCallback } from 'react';
import D7ProjectCard from './D7ProjectCard';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwipe } from '../../hooks/useSwipe';

interface GalleryItem {
  cat: string;
  label: string;
  src: string;
  materials: string;
  duration: string;
}

const CATS = ['Всички', 'Бани', 'Кухни', 'Тераси', 'Спални', 'Хол'];
const ITEMS: GalleryItem[] = [
  { cat: 'Бани',   label: 'Луксозна баня',          src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Испански плочки 60×60 Porcelanosa, смесители Hansgrohe, силикон Ceresit', duration: '12 дни' },
  { cat: 'Кухни',  label: 'Модерна кухня',           src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'МДФ фасади, гранитна плоча, LED осветление Ikea, смесители Grohe', duration: '18 дни' },
  { cat: 'Тераси', label: 'Тераса с настилка',       src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Гранитогрес 60×60 Lasselsberger, фугиращ разтвор Ceresit, хидроизолация Knauf', duration: '8 дни' },
  { cat: 'Спални', label: 'Спалня — гипсокартон',    src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Гипсокартон Knauf, финна шпакловка Vetonit, боя Dulux Velvet Touch', duration: '7 дни' },
  { cat: 'Хол',    label: 'Хол — цялостен ремонт',   src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Ламиниран паркет Swiss Krono, боя Dulux, корнизи от полистирол', duration: '14 дни' },
  { cat: 'Бани',   label: 'Баня — микроцимент',      src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Микроцимент Topcret, импрегнатор Woca, смесители Roca', duration: '10 дни' },
  { cat: 'Кухни',  label: 'Кухня — окачен таван',    src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Гипсокартон Knauf, профили Gyproc, LED лента Philips', duration: '5 дни' },
  { cat: 'Тераси', label: 'Тераса — гранитогрес',    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Gres Porcellanato 80×80, лепило Weber, силикон Ceresit CS 25', duration: '9 дни' },
  { cat: 'Спални', label: 'Спалня — боя',            src: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Шпакловка Knauf Multifinish, боя Dulux Ambiance, лак Teknos', duration: '4 дни' },
  { cat: 'Хол',    label: 'Хол — декоративна стена', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Декоративна мазилка Caparol, пигменти Colorex, грунд Ceresit CT 17', duration: '6 дни' },
  { cat: 'Бани',   label: 'Баня — черно-бяла',       src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Черни плочки 30×60 Aparici, бели плочки 60×60, месингов смесител Gessi', duration: '11 дни' },
  { cat: 'Кухни',  label: 'Кухня — плочки',          src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Метро плочки бяло 10×20, фугиращ разтвор Weber joint, епоксиден силикон', duration: '3 дни' },
  { cat: 'Хол',    label: 'Хол — паркет',            src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80',  materials: 'Дъбов паркет 14мм, лепило Bostik, лак Loba 2K WS', duration: '10 дни' },
  { cat: 'Бани',   label: 'Баня — мозайка',          src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Стъклена мозайка 2.5×2.5 Ezarri, бяла фуга Mapei Ultracolor', duration: '8 дни' },
  { cat: 'Кухни',  label: 'Кухня — остров',          src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80', materials: 'Акрилни фасади, плот от компакт HPL, смесители Blanco', duration: '20 дни' },
];

interface D7GalleryPageProps {
  onNavigate: (href: string) => void;
}

export default function D7GalleryPage({ onNavigate }: D7GalleryPageProps) {
  const [tab, setTab] = useState('Всички');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const items = tab === 'Всички' ? ITEMS : ITEMS.filter(i => i.cat === tab);

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

  return (
    <div className="d7-gallery-page">
      <div className="d7-page-hero">
        <div className="d7-container">
          <span className="d7-label" style={{ marginTop: 16, display: 'inline-block' }}>Галерия</span>
          <h1 className="d7-section-title" style={{ color: '#fff', marginTop: 10 }}>
            НАШИТЕ <em>ПРОЕКТИ</em>
          </h1>
        </div>
      </div>

      <div className="d7-gallery-page__content">
        <div className="d7-container">
          <div className="d7-gallery-page__filters">
            {CATS.map(c => (
              <button key={c}
                className={`d7-gallery-page__filter-btn${tab === c ? ' active' : ''}`}
                onClick={() => setTab(c)}
              >{c}</button>
            ))}
          </div>
          <div className={`d7-projects__grid${isMobile ? ' d7-projects__grid--mobile' : ''}`}>
            {items.map((it, i) => (
              <div key={`${tab}-${i}`} onClick={() => openLightbox(i)} style={{ cursor: 'pointer' }}>
                <D7ProjectCard label={it.label} src={it.src} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {current && lightbox !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,18,40,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={closeLightbox}
          {...swipe}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, lineHeight: 1 }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Modal — strictly fixed size, nothing inside can change it */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              width: isMobile ? '92vw' : 'min(90vw, 1200px)',
              height: isMobile ? '86vh' : 'min(88vh, 780px)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Image zone — fixed 62% height on mobile, 65% width on desktop */}
            <div style={{
              flexShrink: 0,
              flexGrow: 0,
              width: isMobile ? '100%' : '65%',
              height: isMobile ? '62%' : '100%',
              background: '#000',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <img
                src={current.src.replace('w=600&h=450', 'w=1400&h=1050')}
                alt={current.label}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Arrows always on image */}
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                aria-label="Предишна снимка"
              >
                <svg width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                aria-label="Следваща снимка"
              >
                <svg width={isMobile ? 18 : 22} height={isMobile ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
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
              height: isMobile ? '38%' : '100%',
              background: '#fff',
              padding: isMobile ? '14px 16px' : '40px 36px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 12 : 20,
            }}>
              <div>
                <span style={{ display: 'inline-block', background: '#f07420', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 12px', borderRadius: 50, fontFamily: 'Manrope,sans-serif', marginBottom: 8 }}>{current.cat}</span>
                <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 17 : 22, fontWeight: 800, color: '#0f1f3d', lineHeight: 1.2, margin: 0 }}>{current.label}</h2>
              </div>
              <div>
                <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', margin: '0 0 6px' }}>Материали</p>
                <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 13 : 15, color: '#374151', lineHeight: 1.6, margin: 0 }}>{current.materials}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f07420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', margin: 0 }}>Срок</p>
                  <p style={{ fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 15 : 17, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>{current.duration}</p>
                </div>
              </div>
              <button onClick={() => { closeLightbox(); onNavigate('#calendar'); }} style={{ marginTop: 'auto', display: 'block', width: '100%', background: '#f07420', color: '#fff', fontFamily: 'Manrope,sans-serif', fontSize: isMobile ? 13 : 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: isMobile ? '11px 20px' : '13px 24px', borderRadius: 6, textAlign: 'center', border: 'none', cursor: 'pointer' }}>
                Заявете подобен проект
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
