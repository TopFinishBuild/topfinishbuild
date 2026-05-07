import { useState, useEffect, useRef, useCallback } from 'react';
import ServiceCard from '../sections/ServiceCard';
import { useSwipe } from '../../hooks/useSwipe';

const SERVICES = [
  { icon: 'bath', title: 'Баня / WC', desc: 'Пълна реновация на бани — плочки, санитария, ВиК, шпакловка и бои.' },
  { icon: 'layers', title: 'Настилки', desc: 'Полагане на ламинат, паркет, гранитогрес и всякакъв вид подови настилки.' },
  { icon: 'brush', title: 'Боядисване', desc: 'Прецизно боядисване на стени и тавани — разнообразие от бои и техники.' },
  { icon: 'wrench', title: 'ВиК Инсталации', desc: 'Изграждане и ремонт на водопроводни и канализационни инсталации.' },
  { icon: 'zap', title: 'Електро Работи', desc: 'Електрически инсталации, табла и разклонения от сертифицирани майстори.' },
  { icon: 'grid', title: 'Гипсокартон', desc: 'Монтаж на гипсокартонени стени, тавани и декоративни ниши.' },
];

const N = SERVICES.length;
function wrap(i: number, n: number) { return ((i % n) + n) % n; }

/* ── Mobile carousel ── */
function MobileCarousel() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setActive(a => wrap(a + 1, N)), 3200);
  }, []);

  useEffect(() => { resetTimer(); return () => { if (timer.current) clearInterval(timer.current); }; }, [resetTimer]);

  const advance = (d: number) => { setActive(a => wrap(a + d, N)); resetTimer(); };
  const goTo = (i: number) => { setActive(i); resetTimer(); };
  const { setNode: swipeSetNode } = useSwipe(() => advance(1), () => advance(-1));

  return (
    <>
      {/* 3-D Coverflow — всички картички са в DOM за плавна анимация и в двете посоки */}
      <div ref={swipeSetNode} style={{ position: 'relative', perspective: '1200px', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto', maxWidth: 900 }}>
        {SERVICES.map((s, i) => {
          let pos = wrap(i - active, N);
          if (pos > N / 2) pos -= N;

          const isCenter = pos === 0;
          const isVisible = pos >= -1 && pos <= 1;
          // картичките на pos ±2 стоят скрити точно извън видимата зона — готови да се анимират
          const clampedPos = Math.max(-2, Math.min(2, pos));

          const tx = clampedPos * 280;
          const tz = isCenter ? 0 : -120;
          const ry = clampedPos * -16;
          const sc = isCenter ? 1 : 0.78;
          const op = isCenter ? 1 : isVisible ? 0.55 : 0;

          return (
            <div
              key={s.title}
              onClick={() => !isCenter && isVisible && goTo(i)}
              style={{
                position: 'absolute',
                width: 300,
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
                opacity: op,
                transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
                cursor: isCenter ? 'default' : isVisible ? 'pointer' : 'default',
                pointerEvents: isVisible ? 'auto' : 'none',
                zIndex: isCenter ? 2 : 1,
              }}
            >
              <ServiceCard icon={s.icon} title={s.title} desc={s.desc} noHover={!isCenter} />
            </div>
          );
        })}
      </div>

      {/* Arrows + dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 48 }}>
        <button aria-label="Предишна услуга" onClick={() => advance(-1)} style={{ background: 'none', border: '2px solid #e5e7eb', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', fontFamily: "'Manrope',sans-serif", fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        {SERVICES.map((_, i) => (
          <button
            key={i}
            aria-label={`Услуга ${i + 1}`}
            onClick={() => goTo(i)}
            style={{ width: i === active ? 28 : 10, height: 10, borderRadius: 5, background: i === active ? '#f07420' : '#d1d5db', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
          />
        ))}
        <button aria-label="Следваща услуга" onClick={() => advance(1)} style={{ background: 'none', border: '2px solid #e5e7eb', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', fontFamily: "'Manrope',sans-serif", fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>
    </>
  );
}

/* ── Desktop grid ── */
function DesktopGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
      {SERVICES.map(s => (
        <ServiceCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} noHover={false} />
      ))}
    </div>
  );
}

export default function Services() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="services" className="services">
      <div className="container">

        <div className="services__header">
          <div>
            <span className="section-label">Услуги</span>
            <h2 className="section-title">
              ВСИЧКО ЗА<br />ВАШИЯ <em>РЕМОНТ</em>
            </h2>
            <div className="divider" style={{ margin: '12px 0' }} />
          </div>
          <a href="#calendar" style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0f1f3d', borderBottom: '2px solid #f07420', paddingBottom: 4, whiteSpace: 'nowrap' }}>
            Заявете оферта →
          </a>
        </div>

        {isMobile ? <MobileCarousel /> : <DesktopGrid />}

      </div>
    </section>
  );
}
