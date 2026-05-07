import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

type sType = { target: number, suffix: string, label: string, mobileLabel?: string };
const STATS = [
  { target: 350, suffix: '+', label: 'Завършени обекта' },
  { target: 12,  suffix: '',  label: 'Години опит', mobileLabel: 'Години\nОпит' },
  // { target: 3,   suffix: 'г.',label: 'Гаранция' },
  { target: 100, suffix: '%', label: 'Доволни клиенти' },
];

export default function StatsBar() {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const isMobile = useIsMobile();
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
    <div className="stats-bar" ref={ref}>
      <div className="stats-bar__grid">
        {STATS.map((s, i) => (
          <div key={s.label} className="stats-bar__item">
            <div className="stats-bar__number">{counts[i]}{s.suffix}</div>
            <div className="stats-bar__label">{isMobile && 'mobileLabel' in s ? (s as sType).mobileLabel : s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
