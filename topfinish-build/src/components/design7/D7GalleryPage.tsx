import { useState } from 'react';
import D7ProjectCard from './D7ProjectCard';
import { useIsMobile } from '../../hooks/useIsMobile';

const CATS = ['Всички', 'Бани', 'Кухни', 'Тераси', 'Спални', 'Хол'];
const ITEMS = [
  { cat: 'Бани',   label: 'Луксозна баня',          src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Кухни',  label: 'Модерна кухня',           src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Тераси', label: 'Тераса с настилка',       src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Спални', label: 'Спалня — гипсокартон',    src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Хол',    label: 'Хол — цялостен ремонт',   src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Бани',   label: 'Баня — микроцимент',      src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Кухни',  label: 'Кухня — окачен таван',    src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Тераси', label: 'Тераса — гранитогрес',    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Спални', label: 'Спалня — боя',            src: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Хол',    label: 'Хол — декоративна стена', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Бани',   label: 'Баня — черно-бяла',       src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Кухни',  label: 'Кухня — плочки',          src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Хол',    label: 'Хол — паркет',            src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Бани',   label: 'Баня — мозайка',          src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80' },
  { cat: 'Кухни',  label: 'Кухня — остров',          src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80' },
];

interface D7GalleryPageProps {
  onBack: () => void;
}

export default function D7GalleryPage({ onBack }: D7GalleryPageProps) {
  const [tab, setTab] = useState('Всички');
  const isMobile = useIsMobile();
  const items = tab === 'Всички' ? ITEMS : ITEMS.filter(i => i.cat === tab);

  return (
    <div className="d7-gallery-page">
      {/* Hero strip — navy, with back button */}
      <div className="d7-page-hero">
        <div className="d7-container">
          <button className="d7-page-hero__back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Назад
          </button>
          <span className="d7-label" style={{ marginTop: 16, display: 'inline-block' }}>Галерия</span>
          <h1 className="d7-section-title" style={{ color: '#fff', marginTop: 10 }}>
            НАШИТЕ <em>ПРОЕКТИ</em>
          </h1>
        </div>
      </div>

      {/* Content — light */}
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
              <D7ProjectCard key={`${tab}-${i}`} label={it.label} src={it.src} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
