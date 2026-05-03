import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// ── THEME ─────────────────────────────────────────────────────────────────────
const C5 = {
  blue:    '#1a56db',
  blueDk:  '#1447c0',
  navy:    '#0f1f3d',
  white:   '#ffffff',
  lightBg: '#f0f4ff',
  gray:    '#64748b',
  border:  '#dde6f9',
  fh:      "'Barlow Condensed', sans-serif",
  fb:      "'Barlow', sans-serif",
};

// ── PHOTOS ────────────────────────────────────────────────────────────────────
const P5 = {
  hero:    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
  worker:  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  worker2: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
  before:  '/before.jpg',
  after:   '/after.jpg',
  bath1:   'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=450&q=80',
  bath2:   'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80',
  bath3:   'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&h=450&q=80',
  kit1:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=450&q=80',
  kit2:    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80',
  kit3:    'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&h=450&q=80',
  ter1:    'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=600&h=450&q=80',
  ter2:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=450&q=80',
  bed1:    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&h=450&q=80',
  bed2:    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&h=450&q=80',
  liv1:    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80',
  liv2:    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=450&q=80',
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
const IC5: Record<string, string> = {
  bath:    '<path d="M2 11h20v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8v-3z"/><path d="M7 11V5a2 2 0 0 1 4 0v1"/>',
  layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  brush:   '<path d="M15.5 2.1L3.2 14.4 2 22l7.6-1.2 12.3-12.3a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.6-0.4z"/>',
  wrench:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap:     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grid:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  phone:   '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  pin:     '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check:   '<polyline points="20 6 9 17 4 12"/>',
  arrow:   '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chevL:   '<polyline points="15 18 9 12 15 6"/>',
  chevR:   '<polyline points="9 18 15 12 9 6"/>',
  shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  award:   '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  clock:   '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  send:    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  star:    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  home:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
};

function Ic5({ name, size=22, color='currentColor', sw=1.5 }: { name:string; size?:number; color?:string; sw?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display:'inline-block', flexShrink:0 }}
      dangerouslySetInnerHTML={{ __html: IC5[name] ?? '' }} />
  );
}

// ── NAV5 ──────────────────────────────────────────────────────────────────────
function Nav5() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links: [string, string][] = [
    ['Услуги', '#d5-услуги'],
    ['Преди/След', '#d5-преди-след'],
    ['Галерия', '#d5-галерия'],
    ['Отзиви', '#d5-отзиви'],
    ['График', '#d5-график'],
    ['Контакти', '#d5-контакти'],
  ];
  return (
    <nav style={{
      position: 'fixed', top: 44, left: 0, right: 0, zIndex: 200, height: 68,
      background: scrolled ? 'rgba(255,255,255,0.97)' : C5.white,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${C5.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 48px',
      boxShadow: scrolled ? '0 2px 20px rgba(26,86,219,0.1)' : 'none',
      transition: 'all 0.3s',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, background: C5.blue, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ic5 name="home" size={20} color="white" sw={2} />
        </div>
        <div>
          <div style={{ fontFamily: C5.fh, fontSize: 20, fontWeight: 900, color: C5.navy, lineHeight: 1.1 }}>
            TopFinish <span style={{ color: C5.blue }}>BUILD</span>
          </div>
          <div style={{ fontFamily: C5.fb, fontSize: 11, color: C5.gray, lineHeight: 1 }}>Довършителни ремонти</div>
        </div>
      </div>
      {/* Links — hidden on mobile */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {links.map(([t, h]) => (
            <a key={t} href={h} style={{
              fontFamily: C5.fb, fontSize: 13, fontWeight: 500, color: C5.navy,
              letterSpacing: '0.02em', transition: 'color 0.2s', textDecoration: 'none',
            }}
              onMouseEnter={e => e.currentTarget.style.color = C5.blue}
              onMouseLeave={e => e.currentTarget.style.color = C5.navy}>
              {t}
            </a>
          ))}
          <a href="#d5-контакти" style={{
            background: C5.navy, color: 'white', padding: '10px 24px',
            fontFamily: C5.fh, fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
            textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C5.blue}
            onMouseLeave={e => e.currentTarget.style.background = C5.navy}>
            Заявете сега
          </a>
        </div>
      )}
      {isMobile && (
        <a href="#d5-контакти" style={{
          background: C5.blue, color: 'white', padding: '9px 18px',
          fontFamily: C5.fh, fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none',
        }}>
          Заявете
        </a>
      )}
    </nav>
  );
}

// ── HERO5 ─────────────────────────────────────────────────────────────────────
function Hero5() {
  const isMobile = useIsMobile();
  const stats = [['350+', 'Обекта'], ['12г.', 'Опит'], ['3г.', 'Гаранция'], ['5★', 'Рейтинг']];
  return (
    <section style={{ minHeight: '85vh', paddingTop: 112, overflow: 'hidden', position: 'relative', background: C5.white }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '55fr 45fr',
        minHeight: 'calc(85vh - 112px)',
      }}>
        {/* Left — light blue bg, dark text */}
        <div style={{
          background: '#dbeafe',
          padding: isMobile ? '60px 24px 48px' : '80px 64px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C5.blue, padding: '6px 16px', borderRadius: 4,
            marginBottom: 28, width: 'fit-content',
          }}>
            <Ic5 name="shield" size={14} color="white" />
            <span style={{ fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'white' }}>
              Сертифицирани специалисти
            </span>
          </div>
          <h1 style={{
            fontFamily: C5.fh, fontSize: isMobile ? 'clamp(42px,10vw,64px)' : 'clamp(48px,5vw,78px)',
            fontWeight: 900, color: C5.navy, lineHeight: 0.95, marginBottom: 24, letterSpacing: '-0.01em',
          }}>
            Експертни<br />Довършителни<br /><span style={{ color: C5.blue }}>Ремонти</span>
          </h1>
          <p style={{
            fontFamily: C5.fb, fontSize: 17, color: '#334155',
            lineHeight: 1.75, maxWidth: 460, marginBottom: 36, fontWeight: 400,
          }}>
            Специализирани довършителни дейности с прецизност и внимание към всеки детайл — от баня до цялостен ремонт.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#d5-контакти" style={{
              background: C5.blue, color: 'white', padding: '14px 32px',
              fontFamily: C5.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em',
              textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8,
              borderRadius: 6, textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C5.navy; }}
              onMouseLeave={e => { e.currentTarget.style.background = C5.blue; }}>
              Безплатна консултация <Ic5 name="arrow" size={15} color="white" />
            </a>
            <a href="#d5-галерия" style={{
              border: `2px solid ${C5.blue}`, color: C5.navy, padding: '14px 32px',
              fontFamily: C5.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em',
              textTransform: 'uppercase', display: 'inline-block', borderRadius: 6,
              textDecoration: 'none', transition: 'all 0.2s', background: 'transparent',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C5.blue; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = C5.navy; }}>
              Вижте проекти
            </a>
          </div>
        </div>
        {/* Right — worker image, no background, clean */}
        {!isMobile && (
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(85vh - 112px)' }}>
            <img src={P5.worker} alt="Строителен специалист" style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block',
            }} />
          </div>
        )}
        {isMobile && (
          <div>
            <img src={P5.worker} alt="Строителен специалист" style={{
              width: '100%', height: 280, objectFit: 'cover', objectPosition: 'top center', display: 'block',
            }} />
          </div>
        )}
      </div>
      {/* Stats bar */}
      <div style={{ background: C5.navy, padding: isMobile ? '24px 20px' : '28px 64px' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
          gap: isMobile ? 20 : 0,
        }}>
          {stats.map(([n, l]) => (
            <div key={n} style={{ textAlign: 'center', padding: isMobile ? '8px 0' : '0 32px', borderRight: !isMobile ? `1px solid rgba(255,255,255,0.1)` : 'none' }}>
              <div style={{ fontFamily: C5.fh, fontSize: isMobile ? 36 : 44, fontWeight: 900, color: C5.blue, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: C5.fb, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FEATURE STRIP ─────────────────────────────────────────────────────────────
function FeatureStrip5() {
  const isMobile = useIsMobile();
  const items = [
    {
      icon: 'grid', title: 'Нашите Услуги',
      desc: 'Баня, настилки, боядисване, В/К, електро и гипсокартон — всичко под един покрив с гарантирано качество.',
    },
    {
      icon: 'award', title: 'Защо Ние',
      desc: '12 години опит, сертифицирани майстори и 3 години гаранция. Стриктно спазваме договорените срокове.',
    },
    {
      icon: 'star', title: 'Отзиви от Клиенти',
      desc: 'Над 350 доволни клиента и 5-звезден рейтинг. Препоръките на клиентите ни са нашата най-добра реклама.',
    },
  ];
  return (
    <section style={{ background: C5.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: isMobile ? 40 : 56,
        }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 10, border: `2px solid ${C5.blue}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Ic5 name={item.icon} size={22} color={C5.blue} />
              </div>
              <h3 style={{
                fontFamily: C5.fh, fontSize: 22, fontWeight: 800, color: C5.navy,
                textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 12,
              }}>{item.title}</h3>
              <p style={{ fontFamily: C5.fb, fontSize: 15, color: C5.gray, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ABOUT SECTION ─────────────────────────────────────────────────────────────
function AboutSection5() {
  const isMobile = useIsMobile();
  const checks = [
    'Гаранция 3 години за всеки обект',
    'Сертифицирани майстори с опит',
    'Стриктно спазване на срокове',
    'Безплатна консултация и оглед',
  ];
  return (
    <section style={{ background: C5.white, padding: isMobile ? '60px 0' : '100px 0', borderTop: `1px solid ${C5.border}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 80, alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <div style={{
              fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: C5.blue, marginBottom: 16,
            }}>За нас</div>
            <h2 style={{
              fontFamily: C5.fh, fontSize: isMobile ? 'clamp(32px,8vw,52px)' : 'clamp(36px,3.5vw,56px)',
              fontWeight: 900, color: C5.navy, lineHeight: 1, marginBottom: 20,
            }}>
              Професионални<br />Довършителни<br />Ремонти
            </h2>
            <p style={{ fontFamily: C5.fb, fontSize: 16, color: C5.gray, lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
              Работим по проекти от всякакъв мащаб — от ремонт на единична стая до цялостна реновация на имот. Гарантираме качество и спазване на сроковете.
            </p>
            <div style={{ marginBottom: 32 }}>
              {checks.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 22, height: 22, background: C5.blue, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Ic5 name="check" size={12} color="white" sw={2.5} />
                  </div>
                  <span style={{ fontFamily: C5.fb, fontSize: 14, color: C5.navy, fontWeight: 500 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#d5-контакти" style={{
                background: C5.blue, color: 'white', padding: '13px 28px',
                fontFamily: C5.fh, fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = C5.blueDk}
                onMouseLeave={e => e.currentTarget.style.background = C5.blue}>
                Заявете консултация <Ic5 name="arrow" size={15} color="white" />
              </a>
              <a href="#d5-галерия" style={{
                border: `2px solid ${C5.blue}`, color: C5.blue, padding: '13px 28px',
                fontFamily: C5.fh, fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
                textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none',
                display: 'inline-block', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C5.blue; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C5.blue; }}>
                Вижте портфолио
              </a>
            </div>
          </div>
          {/* Right */}
          <div style={{ position: 'relative' }}>
            <img src={P5.worker2} alt="Работа" style={{
              width: '100%', height: isMobile ? 280 : 480, objectFit: 'cover',
              borderRadius: 12, display: 'block', boxShadow: '0 20px 50px rgba(26,86,219,0.12)',
            }} />
            <div style={{
              position: 'absolute', bottom: isMobile ? 12 : 24, right: isMobile ? 12 : 24,
              background: C5.blue, padding: '16px 22px', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(26,86,219,0.4)',
            }}>
              <div style={{ fontFamily: C5.fh, fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1 }}>350+</div>
              <div style={{ fontFamily: C5.fb, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>обекта</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES5 ─────────────────────────────────────────────────────────────────
const SVCS5 = [
  { icon: 'bath',   title: 'Баня / WC',       desc: 'Пълен ремонт на бани — хидроизолация, облицовка, фаянс. Прецизна работа с гаранция.' },
  { icon: 'layers', title: 'Настилки',         desc: 'Ламинат, паркет, теракот и мозайка с идеална нивелация и завършен вид.' },
  { icon: 'brush',  title: 'Боядисване',       desc: 'Гладка шпакловка и боядисване. Перфектни повърхности без дефект.' },
  { icon: 'wrench', title: 'В/К инсталации',   desc: 'Водопровод, канализация и отопление от сертифицирани специалисти.' },
  { icon: 'zap',    title: 'Електро работи',   desc: 'Окабеляване, табла, осветление и контакти с пълна документация.' },
  { icon: 'grid',   title: 'Гипсокартон',      desc: 'Преградни стени, окачени тавани и декоративни ниши по проект.' },
];

function Services5() {
  const isMobile = useIsMobile();
  return (
    <section id="d5-услуги" style={{ background: C5.lightBg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div style={{
            fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
          }}>Нашите услуги</div>
          <h2 style={{
            fontFamily: C5.fh, fontSize: isMobile ? 'clamp(32px,8vw,48px)' : 'clamp(36px,3.5vw,54px)',
            fontWeight: 900, color: C5.navy, lineHeight: 1,
          }}>Всичко за вашия ремонт</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: 20,
        }}>
          {SVCS5.map((s, i) => (
            <SvcCard5 key={i} icon={s.icon} title={s.title} desc={s.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SvcCard5({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C5.white, borderRadius: 12, padding: '32px 28px',
        boxShadow: hov ? '0 12px 36px rgba(26,86,219,0.12)' : '0 2px 8px rgba(26,86,219,0.04)',
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%', background: C5.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <Ic5 name={icon} size={22} color="white" />
      </div>
      <h3 style={{
        fontFamily: C5.fh, fontSize: 20, fontWeight: 800, color: C5.navy,
        textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10,
      }}>{title}</h3>
      <p style={{ fontFamily: C5.fb, fontSize: 14, color: C5.gray, lineHeight: 1.7, marginBottom: 16 }}>{desc}</p>
      <a href="#d5-контакти" style={{
        fontFamily: C5.fh, fontSize: 13, fontWeight: 700, color: C5.blue,
        letterSpacing: '0.05em', textDecoration: 'none',
      }}>Научете повече →</a>
    </div>
  );
}

// ── STATS BAR5 ────────────────────────────────────────────────────────────────
function StatsBar5() {
  const isMobile = useIsMobile();
  const items = [['350+', 'Завършени обекта'], ['12', 'Години опит'], ['3г.', 'Гаранция'], ['100%', 'Доволни клиенти']];
  return (
    <section style={{ background: C5.blue, padding: isMobile ? '40px 0' : '52px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
          gap: isMobile ? 28 : 0,
        }}>
          {items.map(([n, l], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: C5.fh, fontSize: isMobile ? 40 : 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: C5.fb, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BEFORE / AFTER5 ───────────────────────────────────────────────────────────
function BeforeAfter5() {
  const isMobile = useIsMobile();
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const update = useCallback((e: MouseEvent | TouchEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - r.left;
    setPos(Math.max(4, Math.min(96, (x / r.width) * 100)));
  }, []);

  useEffect(() => {
    const mv = (e: MouseEvent | TouchEvent) => { if (drag.current) { e.preventDefault(); update(e); } };
    const up = () => { drag.current = false; };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', mv, { passive: false });
    document.addEventListener('touchend', up);
    return () => {
      document.removeEventListener('mousemove', mv);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', mv);
      document.removeEventListener('touchend', up);
    };
  }, [update]);

  return (
    <section id="d5-преди-след" style={{ background: C5.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign: 'center' }}>
        <div style={{
          fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
        }}>Трансформация</div>
        <h2 style={{
          fontFamily: C5.fh, fontSize: isMobile ? 'clamp(30px,8vw,48px)' : 'clamp(34px,4vw,56px)',
          fontWeight: 900, color: C5.navy, lineHeight: 1, marginBottom: 8,
        }}>Преди &amp; След</h2>
        <p style={{
          fontFamily: C5.fb, color: C5.gray, fontSize: 14,
          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 36,
        }}>Плъзнете за да видите разликата</p>
        <div
          ref={ref}
          style={{
            position: 'relative', overflow: 'hidden', maxWidth: 920, margin: '0 auto',
            aspectRatio: '16/9', cursor: 'ew-resize', userSelect: 'none',
            borderRadius: 10, boxShadow: '0 20px 60px rgba(26,86,219,0.15)',
          }}
          onMouseDown={e => { drag.current = true; update(e.nativeEvent); }}
          onTouchStart={e => { drag.current = true; update(e.nativeEvent); }}>
          {/* Before */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={P5.before} alt="Преди" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: 14, left: 14, background: C5.navy, color: 'white',
              padding: '5px 16px', fontFamily: C5.fh, fontSize: 12, fontWeight: 800,
              letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 4,
            }}>ПРЕДИ</div>
          </div>
          {/* After */}
          <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(${pos}% 0,100% 0,100% 100%,${pos}% 100%)` }}>
            <img src={P5.after} alt="След" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', top: 14, right: 14, background: C5.blue, color: 'white',
              padding: '5px 16px', fontFamily: C5.fh, fontSize: 12, fontWeight: 800,
              letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: 4,
            }}>СЛЕД</div>
          </div>
          {/* Handle */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${pos}%`,
            width: 3, background: 'white', transform: 'translateX(-50%)',
            pointerEvents: 'none', boxShadow: '0 0 12px rgba(26,86,219,0.4)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 44, height: 44, background: 'white', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `3px solid ${C5.blue}`,
              boxShadow: '0 4px 16px rgba(26,86,219,0.25)',
            }}>
              <svg width="20" height="16" viewBox="0 0 22 18" fill="none" stroke={C5.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 15 3 9 8 3" /><polyline points="14 15 19 9 14 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY5 ──────────────────────────────────────────────────────────────────
const GAL5_CATS = ['Всички', 'Бани', 'Кухни', 'Тераси', 'Спални', 'Хол'];
const GAL5 = [
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

function GalItem5({ label, src }: { label: string; src: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', cursor: 'pointer', borderRadius: 8 }}>
      <div style={{ transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s', height: '100%' }}>
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: hov ? 'rgba(15,31,61,0.65)' : 'rgba(15,31,61,0)',
        transition: 'background 0.3s',
        display: 'flex', alignItems: 'flex-end', padding: 14,
      }}>
        <div style={{
          background: C5.blue, color: 'white', padding: '5px 14px', borderRadius: 4,
          fontFamily: C5.fh, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em',
          opacity: hov ? 1 : 0, transform: hov ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.3s',
        }}>{label}</div>
      </div>
    </div>
  );
}

function Gallery5() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState('Всички');
  const items = tab === 'Всички' ? GAL5 : GAL5.filter(i => i.cat === tab);
  return (
    <section id="d5-галерия" style={{ background: C5.lightBg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
          <div style={{
            fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
          }}>Портфолио</div>
          <h2 style={{
            fontFamily: C5.fh, fontSize: isMobile ? 'clamp(30px,8vw,48px)' : 'clamp(34px,3.5vw,52px)',
            fontWeight: 900, color: C5.navy, lineHeight: 1,
          }}>Нашите проекти</h2>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center' }}>
          {GAL5_CATS.map(c => (
            <button key={c} onClick={() => setTab(c)} style={{
              padding: '8px 20px', fontFamily: C5.fh, fontSize: 13, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: tab === c ? 'white' : C5.navy,
              background: tab === c ? C5.blue : 'white',
              border: `1px solid ${tab === c ? C5.blue : C5.border}`,
              borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
            }}>{c}</button>
          ))}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: 12,
        }}>
          {items.map((it, i) => <GalItem5 key={`${tab}-${i}`} label={it.label} src={it.src} />)}
        </div>
      </div>
    </section>
  );
}

// ── PARTNERS5 ─────────────────────────────────────────────────────────────────
const PARTNERS5 = ['KNAUF', 'WEBER', 'ROCA', 'GROHE', 'BOSCH', 'MAPEI', 'SIKA', 'HILTI', 'BAUMIT', 'LITOKOL'];

function Partners5() {
  const doubled = [...PARTNERS5, ...PARTNERS5];
  return (
    <section style={{
      background: C5.white, padding: '36px 0', overflow: 'hidden',
      borderTop: `1px solid ${C5.border}`, borderBottom: `1px solid ${C5.border}`,
    }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'marquee 30s linear infinite', width: 'fit-content' }}>
          {doubled.map((p, i) => (
            <div key={i} style={{
              padding: '0 52px', fontFamily: C5.fh, fontSize: 18, fontWeight: 900,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: C5.blue,
              opacity: 0.35, whiteSpace: 'nowrap', transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.35'}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS5 ─────────────────────────────────────────────────────────────
const REVIEWS5 = [
  { name: 'Иван Петров',     role: 'Ремонт на баня — гр. София',  text: 'Невероятен резултат! Екипът работи прецизно, чисто и стриктно в срок. Банята изглежда като от дизайнерско списание.', stars: 5 },
  { name: 'Мария Иванова',   role: 'Цялостен ремонт — 85кв.',     text: 'Цялостен ремонт на апартамента — всяко кътче изпипано. Шпакловката идеална, плочките перфектно наредени. Благодаря!', stars: 5 },
  { name: 'Стефан Георгиев', role: 'Ремонт на кухня и хол',       text: 'Работил съм с много фирми, но TopFinish Build са на съвсем друго ниво. Готови бяха 3 дни преди крайния срок!', stars: 5 },
];

function Testimonials5() {
  const isMobile = useIsMobile();
  return (
    <section id="d5-отзиви" style={{ background: C5.lightBg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign: 'center' }}>
        <div style={{
          fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
        }}>Отзиви</div>
        <h2 style={{
          fontFamily: C5.fh, fontSize: isMobile ? 'clamp(30px,8vw,48px)' : 'clamp(34px,3.5vw,52px)',
          fontWeight: 900, color: C5.navy, lineHeight: 1, marginBottom: isMobile ? 36 : 52,
        }}>Доволни клиенти</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
          gap: 20,
        }}>
          {REVIEWS5.map((r, i) => (
            <div key={i} style={{
              background: C5.white, borderRadius: 10, padding: '32px 28px', textAlign: 'left',
              border: `1px solid ${C5.border}`, position: 'relative', overflow: 'hidden',
              borderTop: `3px solid ${C5.blue}`,
            }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} style={{ color: '#f59e0b', fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontFamily: C5.fb, fontSize: 14, lineHeight: 1.8, color: C5.gray, marginBottom: 24, fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, background: C5.blue, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: C5.fh, fontSize: 16, fontWeight: 900, color: 'white',
                }}>
                  {r.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontFamily: C5.fh, fontSize: 15, fontWeight: 800, color: C5.navy, textTransform: 'uppercase' }}>{r.name}</div>
                  <div style={{ fontFamily: C5.fb, fontSize: 12, color: C5.gray }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CALENDAR5 ─────────────────────────────────────────────────────────────────
const BUSY5: Record<string, number[]> = {
  '2026-4': [1, 2, 3, 7, 8, 9, 14, 15, 21, 22, 28, 29, 30],
  '2026-5': [4, 5, 6, 11, 12, 13, 18, 19, 20, 25, 26, 27],
  '2026-6': [1, 2, 8, 9, 15, 16, 22, 23, 29, 30],
};
const MONTHS5 = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
const DAYS5 = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function Calendar5() {
  const isMobile = useIsMobile();
  const [cur, setCur] = useState(new Date(2026, 3, 1));
  const yr = cur.getFullYear(), mo = cur.getMonth() + 1;
  const busy = BUSY5[`${yr}-${mo}`] || [];
  const firstDow = (new Date(yr, mo - 1, 1).getDay() + 6) % 7;
  const days = new Date(yr, mo, 0).getDate();
  const today = new Date();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <section id="d5-график" style={{ background: C5.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign: 'center' }}>
        <div style={{
          fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
        }}>График</div>
        <h2 style={{
          fontFamily: C5.fh, fontSize: isMobile ? 'clamp(30px,8vw,48px)' : 'clamp(34px,3.5vw,52px)',
          fontWeight: 900, color: C5.navy, lineHeight: 1, marginBottom: 8,
        }}>Заетост на екипа</h2>
        <p style={{
          fontFamily: C5.fb, color: C5.gray, fontSize: 14, letterSpacing: '0.06em',
          textTransform: 'uppercase', marginBottom: 36,
        }}>Вижте кога сме свободни</p>
        <div style={{
          maxWidth: 660, margin: '0 auto',
          background: C5.white, border: `1px solid ${C5.border}`,
          borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(26,86,219,0.08)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: `1px solid ${C5.border}`,
            background: C5.lightBg,
          }}>
            <button onClick={() => setCur(new Date(yr, mo - 2, 1))} style={{
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C5.navy, cursor: 'pointer', background: 'white',
              border: `1px solid ${C5.border}`, borderRadius: 6, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C5.blue; e.currentTarget.style.color = C5.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C5.border; e.currentTarget.style.color = C5.navy; }}>
              <Ic5 name="chevL" size={16} />
            </button>
            <div style={{
              fontFamily: C5.fh, fontSize: 18, fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: C5.navy,
            }}>{MONTHS5[mo - 1]} {yr}</div>
            <button onClick={() => setCur(new Date(yr, mo, 1))} style={{
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C5.navy, cursor: 'pointer', background: 'white',
              border: `1px solid ${C5.border}`, borderRadius: 6, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C5.blue; e.currentTarget.style.color = C5.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C5.border; e.currentTarget.style.color = C5.navy; }}>
              <Ic5 name="chevR" size={16} />
            </button>
          </div>
          {/* Day names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: `1px solid ${C5.border}` }}>
            {DAYS5.map(d => (
              <div key={d} style={{
                textAlign: 'center', padding: '10px 0',
                fontFamily: C5.fh, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', color: C5.gray, textTransform: 'uppercase',
              }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const isBusy = busy.includes(day);
              const isToday = yr === today.getFullYear() && mo - 1 === today.getMonth() && day === today.getDate();
              return (
                <div key={day} style={{
                  textAlign: 'center', padding: '9px 0', margin: 2, fontSize: 13,
                  fontFamily: C5.fb,
                  fontWeight: isBusy ? 700 : 400,
                  color: isBusy ? 'white' : isToday ? C5.blue : C5.navy,
                  background: isBusy ? C5.blue : isToday ? `${C5.blue}15` : 'transparent',
                  borderRadius: 4,
                }}>
                  {day}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{
            display: 'flex', gap: 24, padding: '12px 24px',
            borderTop: `1px solid ${C5.border}`, justifyContent: 'center',
            background: C5.lightBg,
          }}>
            {[[C5.blue, 'white', 'Зает'], ['white', C5.navy, 'Свободен']].map(([bg, tc, label]) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: C5.fb, fontSize: 12, color: C5.gray,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1px solid ${C5.border}` }} />
                <span style={{ color: tc === 'white' ? C5.gray : tc }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <a href="#d5-контакти" style={{
          marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: C5.blue, color: 'white', padding: '13px 28px',
          fontFamily: C5.fh, fontWeight: 700, fontSize: 14, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 6, textDecoration: 'none',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = C5.blueDk}
          onMouseLeave={e => e.currentTarget.style.background = C5.blue}>
          Запитайте свободна дата <Ic5 name="arrow" size={15} color="white" />
        </a>
      </div>
    </section>
  );
}

// ── PRICING5 ──────────────────────────────────────────────────────────────────
const CALC_SERVICES = [
  { id: 'paint',   label: 'Боядисване',         price: 12,  unit: 'лв/м²' },
  { id: 'plaster', label: 'Шпакловка',           price: 15,  unit: 'лв/м²' },
  { id: 'tiles',   label: 'Теракот / облицовка', price: 35,  unit: 'лв/м²' },
  { id: 'laminate',label: 'Ламинат / паркет',    price: 22,  unit: 'лв/м²' },
  { id: 'gyp',     label: 'Гипсокартон',         price: 28,  unit: 'лв/м²' },
  { id: 'plumb',   label: 'ВиК инсталации',      price: 850, unit: 'лв/баня' },
  { id: 'elec',    label: 'Електро',             price: 600, unit: 'лв/стая' },
];
const CALC_ROOMS = ['Хол', 'Спалня', 'Кухня', 'Баня', 'Коридор'];

function Calc5() {
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [sqm, setSqm] = useState<Record<string, string>>({});
  const [qty, setQty] = useState<Record<string, string>>({});

  const toggle = (id: string) => setSel(p => ({ ...p, [id]: !p[id] }));

  const total = CALC_SERVICES.reduce((acc, s) => {
    if (!sel[s.id]) return acc;
    if (s.id === 'plumb' || s.id === 'elec') {
      return acc + s.price * (parseInt(qty[s.id] || '1') || 1);
    }
    const area = CALC_ROOMS.reduce((a, r) => a + (parseFloat(sqm[`${s.id}-${r}`] || '0') || 0), 0);
    return acc + s.price * area;
  }, 0);

  const inp: React.CSSProperties = {
    width: 72, padding: '6px 8px', border: `1px solid ${C5.border}`,
    borderRadius: 6, fontSize: 13, textAlign: 'center',
    fontFamily: C5.fb, color: C5.navy, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <p style={{ fontFamily: C5.fb, fontSize: 14, color: C5.gray, marginBottom: 24, lineHeight: 1.7 }}>
        Изберете услуги и въведете квадратури — ще получите ориентировъчна цена веднага.
      </p>
      {CALC_SERVICES.map(s => (
        <div key={s.id} style={{
          background: sel[s.id] ? '#f0f4ff' : '#fafafa',
          border: `1px solid ${sel[s.id] ? C5.blue : C5.border}`,
          borderRadius: 10, padding: '16px 20px', marginBottom: 10, transition: 'all 0.2s',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!sel[s.id]} onChange={() => toggle(s.id)}
              style={{ width: 18, height: 18, accentColor: C5.blue, cursor: 'pointer' }} />
            <span style={{ fontFamily: C5.fh, fontSize: 17, fontWeight: 800, color: C5.navy, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: C5.blue, fontFamily: C5.fh, fontWeight: 700 }}>
              {s.price} {s.unit}
            </span>
          </label>
          {sel[s.id] && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C5.border}` }}>
              {(s.id === 'plumb' || s.id === 'elec') ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: C5.fb, fontSize: 13, color: C5.gray }}>Брой {s.id === 'plumb' ? 'бани' : 'стаи'}:</span>
                  <input type="number" min="1" max="20" value={qty[s.id] || '1'}
                    onChange={e => setQty(p => ({ ...p, [s.id]: e.target.value }))} style={inp} />
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: C5.fh, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C5.gray, textTransform: 'uppercase', marginBottom: 10 }}>Квадратура по стаи (м²)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {CALC_ROOMS.map(r => (
                      <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontFamily: C5.fb, fontSize: 12, color: C5.gray }}>{r}</span>
                        <input type="number" min="0" placeholder="0" value={sqm[`${s.id}-${r}`] || ''}
                          onChange={e => setSqm(p => ({ ...p, [`${s.id}-${r}`]: e.target.value }))} style={inp} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {/* Total */}
      <div style={{
        marginTop: 28, padding: '28px 32px',
        background: `linear-gradient(135deg, ${C5.navy}, ${C5.blue})`,
        borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 20,
      }}>
        <div>
          <div style={{ fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Ориентировъчна стойност</div>
          <div style={{ fontFamily: C5.fh, fontSize: 44, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 4 }}>
            {total.toLocaleString('bg-BG')} <span style={{ fontSize: 24 }}>лв.</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>* Без включен ДДС. Точна оферта след оглед.</div>
        </div>
        <a href="#d5-контакти" style={{
          background: 'white', color: C5.blue, padding: '14px 28px',
          fontFamily: C5.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
        }}>Искам оферта →</a>
      </div>
    </div>
  );
}

function Pricing5() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<'info' | 'calc'>('info');

  const btnBase: React.CSSProperties = {
    padding: '10px 28px', fontFamily: C5.fh, fontWeight: 700, fontSize: 15,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    border: `1px solid ${C5.border}`, cursor: 'pointer', transition: 'all 0.2s', borderRadius: 6,
  };

  return (
    <section id="d5-цени" style={{ background: C5.lightBg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: C5.blue, marginBottom: 12,
          }}>Цени</div>
          <h2 style={{
            fontFamily: C5.fh, fontSize: isMobile ? 'clamp(30px,8vw,48px)' : 'clamp(34px,3.5vw,52px)',
            fontWeight: 900, color: C5.navy, lineHeight: 1,
          }}>Ценообразуване</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <button onClick={() => setTab('info')} style={{
              ...btnBase,
              background: tab === 'info' ? C5.blue : 'white',
              color: tab === 'info' ? 'white' : C5.navy,
              borderColor: tab === 'info' ? C5.blue : C5.border,
            }}>Информация</button>
            <button onClick={() => setTab('calc')} style={{
              ...btnBase,
              background: tab === 'calc' ? C5.blue : 'white',
              color: tab === 'calc' ? 'white' : C5.navy,
              borderColor: tab === 'calc' ? C5.blue : C5.border,
            }}>Калкулатор</button>
          </div>
        </div>

        {tab === 'info' ? (
          <div style={{ textAlign: 'center', padding: isMobile ? '40px 0' : '80px 0' }}>
            <div style={{
              width: 72, height: 72, background: C5.lightBg, border: `2px solid ${C5.blue}`,
              borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Ic5 name="wrench" size={30} color={C5.blue} />
            </div>
            <h3 style={{ fontFamily: C5.fh, fontSize: 28, fontWeight: 900, color: C5.navy, textTransform: 'uppercase', marginBottom: 12 }}>
              Очаквайте скоро
            </h3>
            <p style={{ fontFamily: C5.fb, fontSize: 16, color: C5.gray, maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
              Подробна информация за нашето ценообразуване — пълни ценови листи, пакети и промоции. Засега използвайте калкулатора за ориентировъчна оценка.
            </p>
            <button onClick={() => setTab('calc')} style={{
              marginTop: 28, background: C5.blue, color: 'white', border: 'none',
              padding: '13px 30px', fontFamily: C5.fh, fontWeight: 700, fontSize: 15,
              letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
            }}>
              Към Калкулатора →
            </button>
          </div>
        ) : (
          <Calc5 />
        )}
      </div>
    </section>
  );
}

// ── CONTACT5 ──────────────────────────────────────────────────────────────────
function Contact5() {
  const isMobile = useIsMobile();
  const [f, setF] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setF({ name: '', phone: '', email: '', service: '', message: '' });
  };
  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: `1px solid ${C5.border}`,
    background: 'white', fontFamily: C5.fb, fontSize: 14, color: C5.navy,
    outline: 'none', borderRadius: 6, boxSizing: 'border-box',
  };
  const contactItems = [
    { icon: 'phone', label: 'Телефон',  val: '+359 88 123 4567' },
    { icon: 'mail',  label: 'Имейл',    val: 'info@topfinishbuild.bg' },
    { icon: 'pin',   label: 'Адрес',    val: 'гр. София, ул. Строителна 12' },
  ];
  return (
    <section id="d5-контакти" style={{ background: C5.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 80, alignItems: 'start',
        }}>
          {/* Left info */}
          <div>
            <div style={{
              fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: C5.blue, marginBottom: 14,
            }}>Контакт</div>
            <h2 style={{
              fontFamily: C5.fh, fontSize: isMobile ? 'clamp(32px,8vw,50px)' : 'clamp(36px,3.5vw,52px)',
              fontWeight: 900, color: C5.navy, lineHeight: 1, marginBottom: 18,
            }}>Готови да<br />помогнем</h2>
            <p style={{ fontFamily: C5.fb, fontSize: 16, color: C5.gray, lineHeight: 1.8, marginBottom: 36 }}>
              Свържете се за безплатна консултация и точна оферта. Отговаряме в рамките на 24 часа.
            </p>
            {contactItems.map(({ icon, label, val }) => (
              <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, background: C5.blue, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ic5 name={icon} size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: C5.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C5.gray, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: C5.fb, fontSize: 15, color: C5.navy, fontWeight: 500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Right form */}
          <div style={{
            background: 'white', border: `1px solid ${C5.border}`,
            borderRadius: 12, padding: isMobile ? 24 : 40,
            boxShadow: '0 4px 24px rgba(26,86,219,0.08)',
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 60, height: 60, background: C5.blue, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                }}>
                  <Ic5 name="check" size={26} color="white" sw={2.5} />
                </div>
                <div style={{ fontFamily: C5.fh, fontSize: 26, fontWeight: 900, color: C5.navy, textTransform: 'uppercase' }}>Изпратено!</div>
                <p style={{ fontFamily: C5.fb, color: C5.gray, marginTop: 8 }}>Ще се свържем в рамките на 24 часа.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[
                  { k: 'name',  l: 'Вашето Име *',  ph: 'Иван Иванов',       req: true },
                  { k: 'phone', l: 'Телефон *',      ph: '+359 88...',         req: true },
                  { k: 'email', l: 'Имейл',          ph: 'email@example.com',  req: false },
                ].map(({ k, l, ph, req }) => (
                  <div key={k} style={{ marginBottom: 16 }}>
                    <label style={{
                      display: 'block', fontFamily: C5.fh, fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase', color: C5.navy, marginBottom: 6,
                    }}>{l}</label>
                    <input required={req} value={f[k as keyof typeof f]} onChange={set(k)}
                      style={inp} placeholder={ph}
                      onFocus={e => e.target.style.borderColor = C5.blue}
                      onBlur={e => e.target.style.borderColor = C5.border} />
                  </div>
                ))}
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block', fontFamily: C5.fh, fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: C5.navy, marginBottom: 6,
                  }}>Вид услуга</label>
                  <select value={f.service} onChange={set('service')} style={{ ...inp, appearance: 'none' }}>
                    <option value="">— Изберете —</option>
                    {['Баня / WC', 'Настилки', 'Боядисване', 'В/К', 'Електро', 'Гипсокартон', 'Цялостен ремонт'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{
                    display: 'block', fontFamily: C5.fh, fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: C5.navy, marginBottom: 6,
                  }}>Съобщение *</label>
                  <textarea required value={f.message} onChange={set('message')}
                    style={{ ...inp, minHeight: 110, resize: 'vertical' }}
                    placeholder="Опишете проекта..."
                    onFocus={e => e.target.style.borderColor = C5.blue}
                    onBlur={e => e.target.style.borderColor = C5.border} />
                </div>
                <button type="submit" style={{
                  background: C5.blue, color: 'white', padding: '14px 32px',
                  fontFamily: C5.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em',
                  textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6,
                  width: '100%', justifyContent: 'center', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = C5.blueDk}
                  onMouseLeave={e => e.currentTarget.style.background = C5.blue}>
                  Изпрати запитване <Ic5 name="send" size={16} color="white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER5 ───────────────────────────────────────────────────────────────────
function Footer5() {
  const isMobile = useIsMobile();
  const navLinks = ['Услуги', 'Галерия', 'Отзиви', 'График', 'Цени', 'Контакти'];
  const svcLinks = ['Баня / WC', 'Настилки', 'Боядисване', 'В/К инсталации', 'Електро', 'Гипсокартон'];
  return (
    <footer style={{ background: C5.navy, color: 'white', padding: isMobile ? '48px 0 24px' : '60px 0 28px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
          gap: isMobile ? 36 : 60, marginBottom: 44,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, background: C5.blue, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ic5 name="home" size={18} color="white" sw={2} />
              </div>
              <div style={{ fontFamily: C5.fh, fontSize: 20, fontWeight: 900, letterSpacing: '0.06em' }}>
                TopFinish <span style={{ color: C5.blue }}>BUILD</span>
              </div>
            </div>
            <p style={{ fontFamily: C5.fb, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 300 }}>
              Специализирани довършителни дейности с 12 години опит. Перфекционизъм и прецизност — гарантирано.
            </p>
          </div>
          {/* Nav */}
          <div>
            <div style={{
              fontFamily: C5.fh, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 18,
              borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 10,
            }}>Навигация</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontFamily: C5.fb, fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C5.blue}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <div style={{
              fontFamily: C5.fh, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 18,
              borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 10,
            }}>Услуги</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {svcLinks.map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#d5-услуги" style={{ fontFamily: C5.fb, fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C5.blue}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ fontFamily: C5.fb, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © 2026 TopFinish Build. Всички права запазени.
          </div>
          <div style={{ fontFamily: C5.fh, fontSize: 11, color: C5.blue, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 }}>
            Перфекционизъм във всеки детайл
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── marquee keyframe ──────────────────────────────────────────────────────────
if (!document.getElementById('d5-marquee-style')) {
  const s = document.createElement('style');
  s.id = 'd5-marquee-style';
  s.textContent = '@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(s);
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Design5() {
  return (
    <div style={{ paddingTop: 44 }}>
      <Nav5 />
      <Hero5 />
      <FeatureStrip5 />
      <AboutSection5 />
      <Services5 />
      <StatsBar5 />
      <BeforeAfter5 />
      <Gallery5 />
      <Partners5 />
      <Testimonials5 />
      <Calendar5 />
      <Pricing5 />
      <Contact5 />
      <Footer5 />
    </div>
  );
}
