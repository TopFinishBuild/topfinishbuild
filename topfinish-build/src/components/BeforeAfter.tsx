import { useState, useRef, useEffect } from 'react';
import { beforeImage, afterImage } from '../data';

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging,  setDragging]  = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)));
  };
  const stopDrag = () => setDragging(false);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [dragging]);

  const onTouch = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const r = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.min(100, Math.max(0, (e.touches[0].clientX - r.left) / r.width * 100)));
  };

  return (
    <section id="before-after" style={{ padding: '5rem 0', background: '#fff' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Нашата Работа</span>
          <h2 className="section-title">Преди и След</h2>
          <div className="divider" />
          <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1.0625rem' }}>Вижте трансформацията с ваши очи</p>
        </div>

        <div>
          <div
            ref={sliderRef}
            onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
            onTouchMove={onTouch}
            className="before-after-slider"
            style={{ position: 'relative', width: '100%', height: '38rem', overflow: 'hidden', borderRadius: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', cursor: 'ew-resize', userSelect: 'none' }}
          >
            <img src={afterImage}  alt="След ремонт"  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src={beforeImage} alt="Преди ремонт" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>

            {/* Divider line */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`, width: '3px', background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.4)', transform: 'translateX(-50%)' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '3rem', height: '3rem', background: '#fff', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/>
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(30,58,138,0.85)', backdropFilter: 'blur(4px)', color: '#fff', padding: '0.35rem 0.9rem', borderRadius: '0.5rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em' }}>ПРЕДИ</div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(249,115,22,0.85)', backdropFilter: 'blur(4px)', color: '#fff', padding: '0.35rem 0.9rem', borderRadius: '0.5rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em' }}>СЛЕД</div>
          </div>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.875rem' }}>Плъзнете наляво и надясно за да видите разликата</p>
        </div>
      </div>
    </section>
  );
}
