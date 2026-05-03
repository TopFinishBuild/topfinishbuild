import { useState, useEffect, useRef } from 'react';
import './design7.css';

const STATS = [
  { target: 350, suffix: '+', label: 'Завършени обекта' },
  { target: 12,  suffix: '',  label: 'Години опит' },
  { target: 3,   suffix: 'г.',label: 'Гаранция' },
  { target: 100, suffix: '%', label: 'Доволни клиенти' },
];

export default function D7StatsLine() {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      const duration = 1400;
      const start = performance.now();
      const targets = STATS.map(s => s.target);

      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setCounts(targets.map(t => Math.round(t * eased)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="d7-statsline" ref={ref}>
      <div className="d7-statsline__grid">
        {STATS.map((s, i) => (
          <div key={s.label} className="d7-statsline__item">
            <div className="d7-statsline__number">{counts[i]}{s.suffix}</div>
            <div className="d7-statsline__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
