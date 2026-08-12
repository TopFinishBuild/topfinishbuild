import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { SectionLabel } from '../common/SectionLabel';
import { publicSrcSet } from '../../utils/image';

const IMG = '/dining-room-with-table-chairs-tv.webp';
const IMG_BASE = IMG.replace(/\.webp$/, '');

const NAVY = '#0f1f3d';
const ORANGE = '#f07420';
const ORANGE_DK = '#d4601a';
const GRAY = '#6b7280';
const FH = "'Manrope',sans-serif";

const PATHS: Record<string, string> = {
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
};

function Ic({ name }: { name: string }) {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: PATHS[name] ?? '' }} />;
}

const FEATS = [
  ['wrench', 'Технически опит', 'Сертифицирани майстори с дългогодишен опит'],
  ['zap', 'Аварийни ремонти', 'Бързо реагиране при спешни случаи'],
  ['home', 'Интериорен дизайн', 'Работим с интериорен дизайнер — можем да препоръчаме'],
];

interface AboutPreviewProps {
  onNavigate?: (href: string) => void;
}

export default function AboutPreview({ onNavigate }: AboutPreviewProps = {}) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  return (
    <section id="about-preview" style={{ background: '#fff', padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 24px' : '0 48px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 80, alignItems: 'center' }}>

        {/* Image with offset box */}
        <div style={{ position: 'relative', marginRight: isMobile ? 0 : 20, marginBottom: isMobile ? 20 : 0 }}>
          <div style={{ background: ORANGE, borderRadius: 20, position: 'absolute', top: 20, left: isMobile ? 10 : 20, right: isMobile ? -10 : -20, bottom: isMobile ? -10 : -20, zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
            <img
              src={`${IMG_BASE}-1200.webp`}
              srcSet={publicSrcSet(IMG)}
              // Half of the 1280px container on desktop, full width on mobile
              sizes="(max-width: 768px) 100vw, 600px"
              width={4000}
              height={2667}
              alt="Екипът на TopFinish Build при довършителни работи на обект в София"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: isMobile ? 260 : 420, objectFit: 'cover', display: 'block' }}
            />
          </div>
          {/* Badge */}
          <div style={{ position: 'absolute', top: -10, right: isMobile ? -10 : -30, zIndex: 2, background: NAVY, color: ORANGE, padding: '12px 16px', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: FH, fontSize: isMobile ? 24 : 32, fontWeight: 900, lineHeight: 1 }}>12+</div>
            <div style={{ fontFamily: FH, fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>години</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <SectionLabel>За нас</SectionLabel>
          <h2 className="section-title">
            Вашият надежден<br />партньор за ремонт
          </h2>
          <div className="divider" style={{ margin: '12px 0' }} />
          <p style={{ fontFamily: FH, fontSize: 18, color: GRAY, lineHeight: 1.8, marginBottom: 32 }}>
            Предоставяме цялостни ремонтни решения за домове, офиси и индустриални пространства. Всеки проект изпълняваме с прецизност, надеждност и безупречно качество.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
            {FEATS.map(([ic, t, d]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, background: ORANGE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ic name={ic} />
                </div>
                <div>
                  <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 800, color: NAVY }}>{t}</div>
                  <div style={{ fontFamily: FH, fontSize: 15, color: GRAY }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="#about"
            style={{ background: hover ? ORANGE_DK : ORANGE, color: '#fff', padding: '14px 32px', fontFamily: FH, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 50, display: 'inline-block', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={e => { e.preventDefault(); onNavigate?.('#about'); }}>
            Научете повече →
          </a>
        </div>

      </div>
    </section>
  );
}
