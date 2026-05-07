import { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwipe } from '../../hooks/useSwipe';
import ProjectCard from '../sections/ProjectCard';

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
];

interface ProjectsProps {
  onViewAll: () => void;
}

export default function Projects({ onViewAll }: ProjectsProps) {
  const [tab, setTab] = useState('Всички');
  const [slide, setSlide] = useState(0);
  const isMobile = useIsMobile();
  const perSlide = isMobile ? 1 : 3;

  const filtered = (tab === 'Всички' ? ITEMS : ITEMS.filter(i => i.cat === tab)).slice(0, 6);
  const totalSlides = Math.ceil(filtered.length / perSlide);
  const grouped = Array.from({ length: totalSlides }, (_, si) =>
    filtered.slice(si * perSlide, (si + 1) * perSlide)
  );

  // eslint-disable-next-line
  useEffect(() => { setSlide(0); }, [tab, perSlide]);

  const { setNode: swipeSetNode } = useSwipe(
    () => setSlide(s => Math.min(totalSlides - 1, s + 1)),
    () => setSlide(s => Math.max(0, s - 1))
  );

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects__header">
          <span className="section-label">Портфолио</span>
          <h2 className="section-title">НАШИТЕ <em>ПРОЕКТИ</em></h2>
          <div className="divider" />
        </div>

        <div className="projects__filters">
          {CATS.map(c => (
            <button key={c}
              className={`projects__filter-btn${tab === c ? ' active' : ''}`}
              onClick={() => setTab(c)}
            >{c}</button>
          ))}
        </div>

        {/* Carousel with side arrows */}
        <div className="projects-carousel">
          {totalSlides > 1 && (
            <button
              className={`projects-carousel__arrow projects-carousel__arrow--prev${slide === 0 ? ' disabled' : ''}`}
              onClick={() => setSlide(s => Math.max(0, s - 1))}
              aria-label="Предишни"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          <div className="projects-carousel__viewport" ref={swipeSetNode}>
            <div className="projects-carousel__track"
              style={{ transform: `translateX(-${slide * 100}%)` }}>
              {grouped.map((group, si) => (
                <div key={si} className="projects-carousel__slide"
                  style={{ gridTemplateColumns: `repeat(${perSlide}, 1fr)` }}>
                  {group.map((it, i) => (
                    <ProjectCard key={i} label={it.label} src={it.src} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {totalSlides > 1 && (
            <button
              className={`projects-carousel__arrow projects-carousel__arrow--next${slide === totalSlides - 1 ? ' disabled' : ''}`}
              onClick={() => setSlide(s => Math.min(totalSlides - 1, s + 1))}
              aria-label="Следващи"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}
        </div>

        {totalSlides > 1 && (
          <div className="projects-carousel__dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i}
                className={`projects-carousel__dot${i === slide ? ' active' : ''}`}
                aria-label={`Слайд ${i + 1}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        )}

        <div className="projects__cta">
          <button onClick={onViewAll} className="projects__cta-btn">
            Виж всички проекти
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
