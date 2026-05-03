import { useState, useEffect, useRef } from 'react';
import { testimonials } from '../../data';
import D7TestimonialCard from './D7TestimonialCard';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwipe } from '../../hooks/useSwipe';

export default function D7Testimonials() {
  const shown = testimonials.slice(0, 3);
  const isMobile = useIsMobile();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (i: number) => {
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  const swipe = useSwipe(
    () => { if (timerRef.current) clearInterval(timerRef.current); setDir(1);  setIdx(i => (i + 1) % shown.length); },
    () => { if (timerRef.current) clearInterval(timerRef.current); setDir(-1); setIdx(i => (i - 1 + shown.length) % shown.length); }
  );

  useEffect(() => {
    if (!isMobile) return;
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx(i => (i + 1) % shown.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isMobile, shown.length]);

  return (
    <section id="d7-testimonials" className="d7-testimonials">
      <div className="d7-container">

        <div className="d7-testimonials__header">
          <span className="d7-label">Отзиви</span>
          <h2 className="d7-section-title">Доволни клиенти</h2>
          <div className="d7-divider" />
          <p style={{ fontFamily:'var(--d7-fb)', fontSize:16, color:'var(--d7-gray)', marginTop:8 }}>
            Доверието на нашите клиенти е най-голямата ни награда
          </p>
        </div>

        {/* Desktop — grid */}
        <div className="d7-testimonials__grid">
          {shown.map(t => (
            <D7TestimonialCard key={t.name} text={t.text} name={t.name} subtitle={t.subtitle} initials={t.initials} />
          ))}
        </div>

        {/* Mobile — slide carousel */}
        <div className="d7-testimonials__carousel">
          <div style={{ overflow: 'hidden', borderRadius: 12 }} {...swipe}>
            <div
              key={`${idx}-${dir}`}
              style={{ animation: `${dir > 0 ? 'd7-slide-from-right' : 'd7-slide-from-left'} 0.32s ease` }}
            >
              <D7TestimonialCard
                text={shown[idx].text}
                name={shown[idx].name}
                subtitle={shown[idx].subtitle}
                initials={shown[idx].initials}
              />
            </div>
          </div>

          {/* Dots — always below card, never overlapping */}
          <div className="d7-testimonials__dots">
            {shown.map((_, i) => (
              <button
                key={i}
                className={`d7-testimonials__dot${i === idx ? ' d7-testimonials__dot--active' : ''}`}
                onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i); }}
                aria-label={`Отзив ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
