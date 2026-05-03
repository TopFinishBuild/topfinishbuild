import { useState, useEffect } from 'react';
import { testimonials } from '../../data';
import D7TestimonialCard from './D7TestimonialCard';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function D7Testimonials() {
  const shown = testimonials.slice(0, 3);
  const isMobile = useIsMobile();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const t = setInterval(() => setIdx(i => (i + 1) % shown.length), 4000);
    return () => clearInterval(t);
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

        {/* Mobile — carousel */}
        <div className="d7-testimonials__carousel">
          <div style={{ position: 'relative', minHeight: 290 }}>
            <div key={idx} style={{ animation: 'd7-card-fade-in 0.4s ease', position: 'absolute', top: 0, left: 0, right: 0 }}>
              <D7TestimonialCard
                text={shown[idx].text}
                name={shown[idx].name}
                subtitle={shown[idx].subtitle}
                initials={shown[idx].initials}
              />
            </div>
          </div>
          <div className="d7-testimonials__dots">
            {shown.map((_, i) => (
              <button
                key={i}
                className={`d7-testimonials__dot${i === idx ? ' d7-testimonials__dot--active' : ''}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
