import { useState, useRef, useEffect } from 'react';
import { beforeImage, afterImage } from '../../data';

export default function D7BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging,  setDragging]  = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const calcPos = (clientX: number) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setSliderPos(Math.min(100, Math.max(0, (clientX - r.left) / r.width * 100)));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove  = (e: MouseEvent) => calcPos(e.clientX);
    const onUp    = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [dragging]);

  return (
    <section id="d7-before-after" className="d7-before-after">
      <div className="d7-container">

        <div className="d7-before-after__header">
          <span className="d7-label">Нашата работа</span>
          <h2 className="d7-section-title">Преди и След</h2>
          <div className="d7-divider" />
          <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 16, color: 'var(--d7-gray)', marginTop: 8 }}>
            Вижте трансформацията с ваши очи
          </p>
        </div>

        <div
          ref={wrapRef}
          className="d7-before-after__slider"
          onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
          onTouchMove={(e) => calcPos(e.touches[0].clientX)}
        >
          {/* After image (full width, behind) */}
          <img
            src={afterImage} alt="След ремонт"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Before image (clipped) */}
          <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
            <img
              src={beforeImage} alt="Преди ремонт"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Divider handle */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${sliderPos}%`,
            width: 3,
            background: 'white',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 44, height: 44,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="16" viewBox="0 0 22 18" fill="none"
                stroke="#f07420" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/>
              </svg>
            </div>
          </div>

          <span className="d7-before-after__label d7-before-after__label--before">ПРЕДИ</span>
          <span className="d7-before-after__label d7-before-after__label--after">СЛЕД</span>
        </div>

        <p className="d7-before-after__hint">Плъзнете наляво и надясно за да видите разликата</p>

      </div>
    </section>
  );
}
