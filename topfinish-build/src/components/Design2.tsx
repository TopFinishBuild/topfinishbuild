import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// ── colours ──────────────────────────────────────────────────────────────────
const C = {
  blue:    '#0d1b2e',
  blueMid: '#162540',
  blueLt:  '#1e3456',
  orange:  '#f07420',
  orangeDk:'#d4611a',
  white:   '#f5f4f2',
  g100:    '#e8eaed',
  g300:    '#c4c8ce',
  g500:    '#8a94a0',
  g700:    '#4a5568',
  fh:      "'Barlow Condensed', sans-serif",
  fb:      "'Barlow', sans-serif",
};

// ── photos ───────────────────────────────────────────────────────────────────
const P = {
  hero:       'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  worker2:    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  beforeRoom: '/before.jpg',
  afterRoom:  '/after.jpg',
  bath1:  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=450&q=80',
  bath2:  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80',
  bath3:  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&h=450&q=80',
  kit1:   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=450&q=80',
  kit2:   'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80',
  kit3:   'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&h=450&q=80',
  ter1:   'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=600&h=450&q=80',
  ter2:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=450&q=80',
  bed1:   'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&h=450&q=80',
  bed2:   'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&h=450&q=80',
  liv1:   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80',
  liv2:   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=450&q=80',
};

// ── icon paths ────────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  bath:    '<path d="M2 11h20v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8v-3z"/><path d="M7 11V5a2 2 0 0 1 4 0v1"/><line x1="6" y1="22" x2="5" y2="24"/><line x1="18" y1="22" x2="19" y2="24"/>',
  layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  brush:   '<path d="M15.5 2.1L3.2 14.4 2 22l7.6-1.2 12.3-12.3a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.6-0.4z"/><path d="M3.2 14.4c1.1 1.1 1.6 2.5 1.2 3.8"/>',
  wrench:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap:     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grid:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  phone:   '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  pin:     '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  send:    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  check:   '<polyline points="20 6 9 17 4 12"/>',
  arrow:   '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chevL:   '<polyline points="15 18 9 12 15 6"/>',
  chevR:   '<polyline points="9 18 15 12 9 6"/>',
  clock:   '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  award:   '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  calc:    '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="12" y1="10" x2="14" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="12" y1="14" x2="14" y2="14"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="12" y1="18" x2="14" y2="18"/>',
  info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>',
  plus:    '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:   '<line x1="5" y1="12" x2="19" y2="12"/>',
};

function Icon({ name, size = 22, color = 'currentColor', sw = 1.5 }: {
  name: string; size?: number; color?: string; sw?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? '' }}
    />
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [['Услуги','#услуги'],['Галерия','#галерия'],['Проекти','#преди-след'],['Клиенти','#отзиви'],['График','#график'],['Контакти','#контакти']];
  return (
    <nav style={{
      position: 'fixed', top: 44, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(13,27,46,0.97)' : C.blue,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 20px' : '0 48px',
      borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s',
    }}>
      <div style={{ fontFamily: C.fh, fontSize: isMobile ? 18 : 21, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.white }}>
        TOP<span style={{ color: C.orange }}>FINISH</span> BUILD
      </div>
      {isMobile ? (
        <a href="#контакти" style={{ background: C.orange, color: 'white', padding: '9px 16px', fontFamily: C.fh, fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 6 }}>
          Заявете
        </a>
      ) : (
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(([t, h]) => (
            <a key={t} href={h} style={{ fontFamily: C.fb, fontSize: 13, fontWeight: 500, color: 'rgba(245,244,242,0.65)', letterSpacing: '0.04em', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,242,0.65)')}
            >{t}</a>
          ))}
          <a href="#контакти" style={{ background: C.orange, color: 'white', padding: '10px 22px', fontFamily: C.fh, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'background 0.2s', borderRadius: 6 }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDk)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}
          >Заявете сега</a>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const isMobile = useIsMobile();
  const stats = [['350+','Завършени обекта'],['12','Години опит'],['100%','Доволни клиенти']];
  return (
    <section style={{
      background: '#fff',
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: isMobile ? 100 : 116,
      paddingBottom: isMobile ? 60 : 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {!isMobile && (
        <>
          <div style={{ position: 'absolute', right: '-2%', top: '-10%', width: '54%', aspectRatio: '1', borderRadius: '50%', background: C.orange, zIndex: 0, opacity: 0.92 }} />
          <div style={{ position: 'absolute', right: '18%', bottom: '-8%', width: '28%', aspectRatio: '1', borderRadius: '50%', background: '#f0f1f3', zIndex: 0 }} />
          <div style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', width: '42%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', zIndex: 1, boxShadow: '0 30px 80px rgba(13,27,46,0.22)' }}>
            <img src={P.hero} alt="Майстор" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </>
      )}
      <div style={{ position: 'relative', zIndex: 2, padding: isMobile ? '40px 20px' : '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {isMobile && (
          <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', marginBottom: 32, boxShadow: '0 20px 60px rgba(13,27,46,0.15)' }}>
            <img src={P.hero} alt="Майстор" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange, marginBottom: 20 }}>Перфекционизъм във всеки детайл</div>
        <h1 style={{ fontFamily: C.fh, fontSize: isMobile ? 'clamp(42px,11vw,64px)' : 'clamp(52px,6.5vw,92px)', fontWeight: 900, color: C.blue, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '0.01em', maxWidth: isMobile ? '100%' : 580, marginBottom: 28 }}>
          СТРОИМ<br />ВАШАТА<br /><span style={{ color: C.orange, fontStyle: 'italic' }}>МЕЧТА</span>
        </h1>
        <p style={{ color: C.g700, fontSize: isMobile ? 16 : 18, maxWidth: 440, lineHeight: 1.75, fontWeight: 300, marginBottom: 44 }}>
          Специализирани довършителни дейности с прецизност и внимание към всеки детайл. Вашето пространство заслужава само най-доброто.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#контакти" style={{ background: C.orange, color: 'white', padding: isMobile ? '13px 28px' : '16px 40px', fontFamily: C.fh, fontWeight: 700, fontSize: isMobile ? 15 : 17, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 8, transition: 'background 0.2s', boxShadow: '0 6px 20px rgba(240,116,32,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeDk)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}
          >Безплатна консултация <Icon name="arrow" size={18} color="white" /></a>
          <a href="#галерия" style={{ border: `2px solid ${C.blue}`, color: C.blue, padding: isMobile ? '13px 28px' : '16px 40px', fontFamily: C.fh, fontWeight: 700, fontSize: isMobile ? 15 : 17, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block', borderRadius: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.blue; }}
          >Нашите проекти</a>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? 28 : 52, marginTop: isMobile ? 44 : 64, paddingTop: 36, borderTop: `2px solid ${C.g100}`, flexWrap: 'wrap' }}>
          {stats.map(([n, l]) => (
            <div key={n}>
              <div style={{ fontFamily: C.fh, fontSize: isMobile ? 40 : 52, fontWeight: 900, color: C.orange, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: isMobile ? 11 : 13, color: C.g500, letterSpacing: '0.06em', marginTop: 5, textTransform: 'uppercase', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SERVICE CARD ─────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'white', padding: '40px 34px', border: `1px solid ${C.g100}`, borderRadius: 10, transition: 'all 0.3s', transform: h ? 'translateY(-6px)' : 'none', boxShadow: h ? '0 20px 50px rgba(13,27,46,0.1)' : '0 2px 8px rgba(13,27,46,0.04)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: C.orange, borderRadius: '0 0 10px 10px', transform: h ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.35s' }} />
      <div style={{ color: C.orange, marginBottom: 22 }}><Icon name={icon} size={40} sw={1.3} /></div>
      <div style={{ fontFamily: C.fh, fontSize: 22, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 12, color: C.blue }}>{title}</div>
      <p style={{ fontSize: 15, color: C.g700, lineHeight: 1.75 }}>{desc}</p>
    </div>
  );
}

function Services() {
  const isMobile = useIsMobile();
  const svcs = [
    { icon: 'bath',   title: 'Баня / WC',       desc: 'Пълен ремонт на бани — от облицовка и хидроизолация до монтаж на санитарен фаянс. Прецизна работа с гаранция.' },
    { icon: 'layers', title: 'Настилки',         desc: 'Полагане на ламинат, паркет, теракот и мозайка с идеална нивелация. Работим с водещи марки и материали.' },
    { icon: 'brush',  title: 'Боядисване',       desc: 'Гладка шпакловка и боядисване с висококачествени материали. Перфектни повърхности без следа от дефект.' },
    { icon: 'wrench', title: 'В/К инсталации',   desc: 'Монтаж и ремонт на водопровод, канализация и отоплителни системи. Сертифицирани специалисти.' },
    { icon: 'zap',    title: 'Електро работи',   desc: 'Ново окабеляване, разпределителни табла, монтаж на осветление и контакти с пълна документация.' },
    { icon: 'grid',   title: 'Гипсокартон',      desc: 'Преградни стени, окачени тавани, декоративни ниши и архитектурно осветление — с точни профили и швове.' },
  ];
  return (
    <section id="услуги" style={{ background: C.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Нашите услуги</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
          <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, maxWidth: 520, color: C.blue }}>
            ВСИЧКО ЗА ВАШИЯ <span style={{ color: C.orange }}>РЕМОНТ</span>
          </h2>
          {!isMobile && <a href="#контакти" style={{ fontFamily: C.fh, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.blue, borderBottom: `2px solid ${C.orange}`, paddingBottom: 4 }}>Заявете оферта →</a>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(1,1fr)' : 'repeat(3,1fr)', gap: 3 }}>
          {svcs.map(s => <ServiceCard key={s.title} {...s} />)}
        </div>
        {isMobile && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <a href="#контакти" style={{ fontFamily: C.fh, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.blue, borderBottom: `2px solid ${C.orange}`, paddingBottom: 4 }}>Заявете оферта →</a>
          </div>
        )}
      </div>
    </section>
  );
}

// ── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
  const isMobile = useIsMobile();
  return (
    <div style={{ background: C.orange, padding: isMobile ? '36px 0' : '44px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: isMobile ? 24 : 32 }}>
          {[['350+','Завършени обекта'],['12','Години на пазара'],['48ч','Отговор на оферта'],['5★','Средна оценка']].map(([n, l]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: C.fh, fontSize: isMobile ? 38 : 52, fontWeight: 900, color: 'white', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: isMobile ? 11 : 13, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginTop: 6, fontWeight: 500, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BEFORE / AFTER ───────────────────────────────────────────────────────────
function BeforeAfter() {
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
    return () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); document.removeEventListener('touchmove', mv); document.removeEventListener('touchend', up); };
  }, [update]);

  return (
    <section id="преди-след" style={{ background: C.blueMid, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Трансформация</div>
        <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, color: C.white }}>
          ПРЕДИ &amp; <span style={{ color: C.orange }}>СЛЕД</span>
        </h2>
        <p style={{ color: 'rgba(245,244,242,0.45)', marginTop: 14, fontSize: 16, letterSpacing: '0.05em' }}>ПЛЪЗНЕТЕ ЗА ДА ВИДИТЕ РАЗЛИКАТА</p>
        <div ref={ref}
          style={{ position: 'relative', overflow: 'hidden', maxWidth: 920, margin: '48px auto 0', aspectRatio: '16/9', cursor: 'ew-resize', userSelect: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseDown={e => { drag.current = true; update(e.nativeEvent); }}
          onTouchStart={e => { drag.current = true; update(e.nativeEvent); }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={P.beforeRoom} alt="Преди" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(13,27,46,0.85)', color: 'white', padding: '6px 18px', fontFamily: C.fh, fontSize: 13, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', borderRadius: 6 }}>ПРЕДИ</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(${pos}% 0,100% 0,100% 100%,${pos}% 100%)` }}>
            <img src={P.afterRoom} alt="След" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, background: C.orange, color: 'white', padding: '6px 18px', fontFamily: C.fh, fontSize: 13, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', borderRadius: 6 }}>СЛЕД</div>
          </div>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 3, background: 'white', transform: 'translateX(-50%)', pointerEvents: 'none', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 50, height: 50, background: C.orange, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(0,0,0,0.5)', gap: 2 }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ──────────────────────────────────────────────────────────────────
const GAL_CATS = ['Всички','Бани','Кухни','Тераси','Спални','Хол'];
const GAL_ITEMS = [
  { cat:'Бани',   label:'Луксозна баня с мозайка',    src: P.bath1 },
  { cat:'Кухни',  label:'Модерна кухня',              src: P.kit1  },
  { cat:'Тераси', label:'Тераса с нова настилка',     src: P.ter1  },
  { cat:'Спални', label:'Спалня — гипсокартон таван', src: P.bed1  },
  { cat:'Хол',    label:'Хол — цялостен ремонт',      src: P.liv1  },
  { cat:'Бани',   label:'Баня — микроцимент',         src: P.bath2 },
  { cat:'Кухни',  label:'Кухня — окачен таван',       src: P.kit2  },
  { cat:'Тераси', label:'Тераса — гранитогрес',       src: P.ter2  },
  { cat:'Спални', label:'Спалня — шпакловка и боя',   src: P.bed2  },
  { cat:'Хол',    label:'Хол — декоративна стена',    src: P.liv2  },
  { cat:'Бани',   label:'Баня — черно-бяла',          src: P.bath3 },
  { cat:'Кухни',  label:'Кухня — плочки',             src: P.kit3  },
];

function GalItem({ label, src }: { label: string; src: string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', cursor: 'pointer', borderRadius: 10 }}>
      <div style={{ transform: h ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.45s ease', height: '100%' }}>
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: h ? 'rgba(13,27,46,0.65)' : 'rgba(13,27,46,0)', transition: 'background 0.3s', display: 'flex', alignItems: 'flex-end', padding: 20, borderRadius: 10 }}>
        <div style={{ fontFamily: C.fh, fontSize: 15, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: h ? 1 : 0, transform: h ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.3s' }}>{label}</div>
      </div>
    </div>
  );
}

function Gallery() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState('Всички');
  const items = tab === 'Всички' ? GAL_ITEMS : GAL_ITEMS.filter(i => i.cat === tab);
  return (
    <section id="галерия" style={{ background: '#0a1525', padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Портфолио</div>
        <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, color: C.white }}>
          НАШИТЕ <span style={{ color: C.orange }}>ПРОЕКТИ</span>
        </h2>
        <div style={{ display: 'flex', gap: 4, marginTop: 40, flexWrap: 'wrap' }}>
          {GAL_CATS.map(c => (
            <button key={c} onClick={() => setTab(c)} style={{ padding: '10px 24px', fontFamily: C.fh, fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tab === c ? 'white' : 'rgba(245,244,242,0.45)', background: tab === c ? C.orange : 'transparent', border: `1px solid ${tab === c ? C.orange : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s', cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(1,1fr)' : 'repeat(3,1fr)', gap: 10, marginTop: 32 }}>
          {items.map((it, i) => <GalItem key={`${tab}-${i}`} label={it.label} src={it.src} />)}
        </div>
      </div>
    </section>
  );
}

// ── PARTNERS MARQUEE ─────────────────────────────────────────────────────────
const PARTNERS = ['KNAUF','WEBER','ROCA','GROHE','BOSCH','MAPEI','SIKA','HILTI','BAUMIT','LITOKOL'];

function Partners() {
  const doubled = [...PARTNERS, ...PARTNERS];
  return (
    <section style={{ background: C.white, padding: '56px 0', overflow: 'hidden', borderTop: `1px solid ${C.g100}`, borderBottom: `1px solid ${C.g100}` }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: C.fh, fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.g500 }}>Работим с водещи марки</div>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', animation: 'marquee 30s linear infinite', width: 'fit-content' }}>
          {doubled.map((p, i) => (
            <div key={i} style={{ padding: '0 52px', fontFamily: C.fh, fontSize: 20, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.g300, whiteSpace: 'nowrap', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.g700)}
              onMouseLeave={e => (e.currentTarget.style.color = C.g300)}
            >{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WHY US ───────────────────────────────────────────────────────────────────
function WhyUs() {
  const isMobile = useIsMobile();
  const pts = [
    { icon: 'shield', title: 'Гаранция 3 години', desc: 'Всеки изпълнен обект е покрит от нашата гаранция за качество. Стоим зад работата си.' },
    { icon: 'clock',  title: 'Стриктни срокове',  desc: 'Ценим вашето време. Всеки проект завършваме в договорения срок — без изненади.' },
    { icon: 'award',  title: 'Сертифицирани майстори', desc: 'Нашият екип се обучава непрекъснато и работи само с атестирани материали от водещи производители.' },
  ];
  return (
    <section style={{ background: C.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Защо TopFinish Build?</div>
            <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, maxWidth: 500, color: C.blue }}>
              ПЕРФЕКЦИОНИЗЪМ В <span style={{ color: C.orange }}>ДЕТАЙЛИТЕ</span>
            </h2>
            <p style={{ fontSize: 17, color: C.g700, lineHeight: 1.85, marginTop: 24, fontWeight: 300 }}>
              Повече от 12 години TopFinish Build е синоним на прецизност, надеждност и безупречно качество. Всеки обект е нов стандарт за нас.
            </p>
            <a href="#контакти" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 36, background: C.blue, color: 'white', padding: '16px 36px', fontFamily: C.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 8 }}>
              Поискайте оферта <Icon name="arrow" size={16} color="white" />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {pts.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, padding: '28px', border: `1px solid ${C.g100}`, background: 'white' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(240,116,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={p.icon} size={22} color={C.orange} />
                </div>
                <div>
                  <div style={{ fontFamily: C.fh, fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8, color: C.blue }}>{p.title}</div>
                  <p style={{ fontSize: 14, color: C.g700, lineHeight: 1.75 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Иван Петров',    role: 'Ремонт на баня — гр. София',  text: 'Невероятен резултат! Екипът работи прецизно, чисто и стриктно в срок. Банята ни изглежда като от дизайнерско списание. Определено ще препоръчам на всички.', stars: 5 },
  { name: 'Мария Иванова',  role: 'Цялостен ремонт — 85кв.',     text: 'Цялостен ремонт на апартамента — всяко кътче е изпипано с изключителна грижа. Шпакловката е идеална, плочките перфектно наредени. Благодаря на целия екип!', stars: 5 },
  { name: 'Стефан Георгиев',role: 'Ремонт на кухня и хол',       text: 'Работил съм с много фирми, но TopFinish Build са на съвсем друго ниво. Вниманието към детайла е изключително. Готови бяха 3 дни преди крайния срок!', stars: 5 },
];

function Testimonials() {
  const isMobile = useIsMobile();
  return (
    <section id="отзиви" style={{ background: 'white', padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Отзиви</div>
          <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, color: C.blue }}>
            ДОВОЛНИ <span style={{ color: C.orange }}>КЛИЕНТИ</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(1,1fr)' : 'repeat(3,1fr)', gap: 24 }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ padding: '36px', border: `1px solid ${C.g100}`, background: 'white', position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
              <div style={{ position: 'absolute', top: 12, right: 18, fontFamily: C.fh, fontSize: 110, lineHeight: 1, color: C.g100, fontWeight: 900, userSelect: 'none', pointerEvents: 'none' }}>"</div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                {Array.from({ length: r.stars }).map((_, j) => <span key={j} style={{ color: C.orange, fontSize: 18 }}>★</span>)}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: C.g700, marginBottom: 28, fontStyle: 'italic', position: 'relative', zIndex: 1 }}>"{r.text}"</p>
              <div>
                <div style={{ fontFamily: C.fh, fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.blue }}>{r.name}</div>
                <div style={{ fontSize: 12, color: C.g500, marginTop: 3, letterSpacing: '0.04em' }}>{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────────────────
const BUSY: Record<string, number[]> = {
  '2026-4': [1,2,3,7,8,9,14,15,21,22,28,29,30],
  '2026-5': [4,5,6,11,12,13,18,19,20,25,26,27],
  '2026-6': [1,2,8,9,15,16,22,23,29,30],
};
const MONTHS = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
const DAYS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

function CalendarSection() {
  const isMobile = useIsMobile();
  const [cur, setCur] = useState(new Date(2026, 3, 1));
  const yr = cur.getFullYear(), mo = cur.getMonth() + 1;
  const busy = BUSY[`${yr}-${mo}`] || [];
  const firstDow = (new Date(yr, mo - 1, 1).getDay() + 6) % 7;
  const days = new Date(yr, mo, 0).getDate();
  const today = new Date();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <section id="график" style={{ background: C.blue, padding: isMobile ? '60px 0' : '100px 0', color: C.white }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>График</div>
        <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, color: C.white }}>
          ЗАЕТОСТ НА <span style={{ color: C.orange }}>ЕКИПА</span>
        </h2>
        <p style={{ color: 'rgba(245,244,242,0.4)', marginTop: 14, fontSize: 15, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Вижте кога сме свободни и заявете своя проект</p>
        <div style={{ maxWidth: 680, margin: '48px auto 0', background: C.blueMid, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 16px' : '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={() => setCur(new Date(yr, mo - 2, 1))} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.2s', background: 'none', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
              <Icon name="chevL" size={20} />
            </button>
            <div style={{ fontFamily: C.fh, fontSize: isMobile ? 18 : 22, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{MONTHS[mo - 1]} {yr}</div>
            <button onClick={() => setCur(new Date(yr, mo, 1))} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.2s', background: 'none', border: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
              <Icon name="chevR" size={20} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: 'center', padding: '10px 0', fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: isMobile ? '4px' : '6px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const isBusy = busy.includes(day);
              const isToday = yr === today.getFullYear() && mo - 1 === today.getMonth() && day === today.getDate();
              return (
                <div key={day} style={{ textAlign: 'center', padding: isMobile ? '7px 0' : '9px 0', margin: 1, fontSize: isMobile ? 13 : 14, fontWeight: isBusy ? 600 : 400, color: isBusy || isToday ? C.orange : 'rgba(255,255,255,0.55)', background: isBusy ? 'rgba(240,116,32,0.12)' : 'transparent', position: 'relative' }}>
                  {day}
                  {isBusy && <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: C.orange }} />}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 28, padding: '14px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', justifyContent: 'center' }}>
            {[[C.orange,'Зает'],['rgba(255,255,255,0.15)','Свободен']].map(([bg, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: bg }} />{label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <a href="#контакти" style={{ background: C.orange, color: 'white', padding: '14px 36px', fontFamily: C.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 8 }}>
            Запитайте свободна дата <Icon name="arrow" size={16} color="white" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── PRICING / CALCULATOR ─────────────────────────────────────────────────────
const CALC_SERVICES = [
  { id:'paint',   label:'Боядисване',         price:12,  unit:'лв/м²' },
  { id:'plaster', label:'Шпакловка',           price:15,  unit:'лв/м²' },
  { id:'tiles',   label:'Теракот / облицовка', price:35,  unit:'лв/м²' },
  { id:'laminate',label:'Ламинат / паркет',    price:22,  unit:'лв/м²' },
  { id:'gyp',     label:'Гипсокартон',         price:28,  unit:'лв/м²' },
  { id:'plumb',   label:'ВиК инсталации',      price:850, unit:'лв/баня' },
  { id:'elec',    label:'Електро',             price:600, unit:'лв/стая' },
];
const CALC_ROOMS = ['Хол','Спалня','Кухня','Баня','Коридор'];

type CalcEntry = { serviceId: string; room: string; qty: number };

function PricingCalculator({ isMobile }: { isMobile: boolean }) {
  const [entries, setEntries] = useState<CalcEntry[]>([
    { serviceId: 'paint', room: 'Хол', qty: 20 },
  ]);

  const addEntry = () => {
    setEntries(prev => [...prev, { serviceId: 'paint', room: 'Хол', qty: 0 }]);
  };

  const removeEntry = (idx: number) => {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx: number, field: keyof CalcEntry, value: string | number) => {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const total = entries.reduce((sum, e) => {
    const svc = CALC_SERVICES.find(s => s.id === e.serviceId);
    return sum + (svc ? svc.price * Number(e.qty) : 0);
  }, 0);

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: C.white,
    fontFamily: C.fb,
    fontSize: 14,
    padding: '10px 12px',
    borderRadius: 6,
    outline: 'none',
    width: '100%',
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Header row — desktop only */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['Услуга', 'Помещение', 'Количество', ''].map((h, i) => (
              <div key={i} style={{ fontFamily: C.fh, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,242,0.35)' }}>{h}</div>
            ))}
          </div>
        )}

        {entries.map((entry, idx) => {
          const svc = CALC_SERVICES.find(s => s.id === entry.serviceId)!;
          return (
            <div key={idx} style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 40px' : '2fr 1fr 1fr 40px',
              gap: 10,
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              padding: isMobile ? '12px' : '10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <select value={entry.serviceId} onChange={e => updateEntry(idx, 'serviceId', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                    {CALC_SERVICES.map(s => <option key={s.id} value={s.id} style={{ background: C.blueMid }}>{s.label} — {s.price} {s.unit}</option>)}
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <select value={entry.room} onChange={e => updateEntry(idx, 'room', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                      {CALC_ROOMS.map(r => <option key={r} value={r} style={{ background: C.blueMid }}>{r}</option>)}
                    </select>
                    <div style={{ position: 'relative' }}>
                      <input type="number" min={0} value={entry.qty} onChange={e => updateEntry(idx, 'qty', e.target.value)}
                        style={{ ...inp, paddingRight: 44 }} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'rgba(245,244,242,0.35)', pointerEvents: 'none' }}>{svc.unit.split('/')[1] || 'бр'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <select value={entry.serviceId} onChange={e => updateEntry(idx, 'serviceId', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                    {CALC_SERVICES.map(s => <option key={s.id} value={s.id} style={{ background: C.blueMid }}>{s.label} — {s.price} {s.unit}</option>)}
                  </select>
                  <select value={entry.room} onChange={e => updateEntry(idx, 'room', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                    {CALC_ROOMS.map(r => <option key={r} value={r} style={{ background: C.blueMid }}>{r}</option>)}
                  </select>
                  <div style={{ position: 'relative' }}>
                    <input type="number" min={0} value={entry.qty} onChange={e => updateEntry(idx, 'qty', e.target.value)}
                      style={{ ...inp, paddingRight: 44 }} />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'rgba(245,244,242,0.35)', pointerEvents: 'none' }}>{svc.unit.split('/')[1] || 'бр'}</span>
                  </div>
                </>
              )}
              <button onClick={() => removeEntry(idx)}
                style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(240,116,32,0.12)', border: '1px solid rgba(240,116,32,0.25)', borderRadius: 6, cursor: 'pointer', color: C.orange, flexShrink: 0, alignSelf: isMobile ? 'flex-start' : 'center' }}>
                <Icon name="minus" size={16} color={C.orange} />
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={addEntry} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px dashed rgba(255,255,255,0.2)`, color: 'rgba(245,244,242,0.55)', padding: '10px 18px', fontFamily: C.fh, fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6, width: '100%', justifyContent: 'center', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(245,244,242,0.55)'; }}>
        <Icon name="plus" size={16} /> Добави услуга
      </button>

      {/* Total card */}
      <div style={{ marginTop: 28, background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDk} 100%)`, borderRadius: 12, padding: isMobile ? '24px 20px' : '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: '0 12px 40px rgba(240,116,32,0.35)' }}>
        <div>
          <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Приблизителна стойност</div>
          <div style={{ fontFamily: C.fh, fontSize: isMobile ? 44 : 56, fontWeight: 900, color: 'white', lineHeight: 1 }}>
            {total.toLocaleString('bg-BG')} <span style={{ fontSize: isMobile ? 22 : 28 }}>лв.</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>* Ориентировъчна цена без оглед на обекта</div>
        </div>
        <a href="#контакти" style={{ background: 'white', color: C.orange, padding: '14px 28px', fontFamily: C.fh, fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = C.orange; }}>
          Получете точна оферта <Icon name="arrow" size={16} color="inherit" />
        </a>
      </div>
    </div>
  );
}

function PricingSection() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<'info' | 'calc'>('calc');

  return (
    <section id="преди-след2-цени" style={{ background: C.blue, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        {/* Heading */}
        <div style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange, marginBottom: 14 }}>Цени</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, color: C.white, margin: 0 }}>
              ИЗЧИСЛЕТЕ <span style={{ color: C.orange }}>БЮДЖЕТА</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(245,244,242,0.45)', maxWidth: 380, lineHeight: 1.7, margin: 0 }}>
              Използвайте нашия калкулатор за ориентировъчна цена. За точна оферта се свържете с нас.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 4, width: 'fit-content' }}>
          {([['info','Информация'],['calc','Калкулатор']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: isMobile ? '10px 20px' : '11px 28px', fontFamily: C.fh, fontSize: isMobile ? 13 : 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', borderRadius: 6, transition: 'all 0.2s', background: tab === key ? C.orange : 'transparent', color: tab === key ? 'white' : 'rgba(245,244,242,0.4)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'info' ? (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: isMobile ? '40px 20px' : '60px 48px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'rgba(240,116,32,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Icon name="clock" size={32} color={C.orange} />
            </div>
            <h3 style={{ fontFamily: C.fh, fontSize: isMobile ? 28 : 36, fontWeight: 900, textTransform: 'uppercase', color: C.white, marginBottom: 16 }}>Скоро тук</h3>
            <p style={{ color: 'rgba(245,244,242,0.45)', fontSize: 16, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.75 }}>
              Подготвяме подробна информация за нашите ценови пакети и промоционални оферти. Следете ни!
            </p>
            <a href="#контакти" style={{ background: C.orange, color: 'white', padding: '14px 32px', fontFamily: C.fh, fontWeight: 700, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 8 }}>
              Попитайте за цена <Icon name="arrow" size={16} color="white" />
            </a>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: isMobile ? '24px 16px' : '36px 40px' }}>
            <PricingCalculator isMobile={isMobile} />
          </div>
        )}

        {/* Price list reference */}
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: isMobile ? 'repeat(1,1fr)' : 'repeat(3,1fr)', gap: isMobile ? 12 : 16 }}>
          {CALC_SERVICES.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '14px 20px', borderRadius: 8 }}>
              <span style={{ fontFamily: C.fb, fontSize: 14, color: 'rgba(245,244,242,0.7)' }}>{s.label}</span>
              <span style={{ fontFamily: C.fh, fontSize: 16, fontWeight: 800, color: C.orange }}>от {s.price} {s.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ──────────────────────────────────────────────────────────────────
function ContactForm() {
  const isMobile = useIsMobile();
  const [f, setF] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 5000);
    setF({ name: '', phone: '', email: '', service: '', message: '' });
  };
  const inp: React.CSSProperties = { width: '100%', padding: '13px 15px', border: `1px solid ${C.g300}`, background: 'white', fontFamily: C.fb, fontSize: 15, color: C.blue, outline: 'none', borderRadius: 6 };
  return (
    <section id="контакти" style={{ background: C.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.orange }}>Свържете се</div>
            <h2 style={{ fontFamily: C.fh, fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginTop: 12, maxWidth: 500, color: C.blue }}>
              ГОТОВИ ДА <span style={{ color: C.orange }}>ПОМОГНЕМ</span>
            </h2>
            <p style={{ fontSize: 16, color: C.g700, lineHeight: 1.85, margin: '24px 0 40px', fontWeight: 300 }}>
              Свържете се с нас за безплатна консултация и точна оферта. Отговаряме в рамките на 24 часа.
            </p>
            {[{ icon: 'phone', label: 'Телефон', val: '+359 88 123 4567' },
              { icon: 'mail',  label: 'Имейл',   val: 'info@topfinishbuild.bg' },
              { icon: 'pin',   label: 'Адрес',   val: 'гр. Sofia, ул. Строителна 12' }].map(({ icon, label, val }) => (
              <div key={icon} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 22 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(240,116,32,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: 8 }}>
                  <Icon name={icon} size={18} color={C.orange} />
                </div>
                <div>
                  <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.blue, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 15, color: C.g700 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {sent ? (
              <div style={{ background: C.blue, color: 'white', padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 56, height: 56, background: C.orange, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={26} color="white" sw={2.5} />
                </div>
                <div style={{ fontFamily: C.fh, fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Изпратено успешно!</div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>Ще се свържем с вас в рамките на 24 часа.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[{ k: 'name', l: 'Вашето Име *', ph: 'Иван Иванов', req: true },
                  { k: 'phone', l: 'Телефон *', ph: '+359 88...', req: true },
                  { k: 'email', l: 'Имейл', ph: 'email@example.com', req: false }].map(({ k, l, ph, req }) => (
                  <div key={k} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.blue, marginBottom: 8 }}>{l}</label>
                    <input required={req} value={f[k as keyof typeof f]} onChange={set(k)} style={inp} placeholder={ph}
                      onFocus={e => (e.target.style.borderColor = C.orange)} onBlur={e => (e.target.style.borderColor = C.g300)} />
                  </div>
                ))}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.blue, marginBottom: 8 }}>Вид услуга</label>
                  <select value={f.service} onChange={set('service')} style={{ ...inp, appearance: 'none' }}>
                    <option value="">— Изберете услуга —</option>
                    {['Баня / WC','Настилки','Боядисване','В/К инсталации','Електро работи','Гипсокартон','Цялостен ремонт','Друго'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.blue, marginBottom: 8 }}>Съобщение *</label>
                  <textarea required value={f.message} onChange={set('message')} style={{ ...inp, minHeight: 120, resize: 'vertical' }} placeholder="Опишете накратко вашия проект..."
                    onFocus={e => (e.target.style.borderColor = C.orange)} onBlur={e => (e.target.style.borderColor = C.g300)} />
                </div>
                <button type="submit" style={{ background: C.blue, color: 'white', padding: '16px 40px', fontFamily: C.fh, fontWeight: 700, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s', borderRadius: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.orange)} onMouseLeave={e => (e.currentTarget.style.background = C.blue)}>
                  Изпрати запитване <Icon name="send" size={16} color="white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: C.blue, color: C.white, padding: isMobile ? '48px 0 24px' : '64px 0 28px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: isMobile ? 36 : 60, marginBottom: isMobile ? 36 : 52 }}>
          <div>
            <div style={{ fontFamily: C.fh, fontSize: 21, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
              TOP<span style={{ color: C.orange }}>FINISH</span> BUILD
            </div>
            <p style={{ fontSize: 14, color: 'rgba(245,244,242,0.4)', lineHeight: 1.85, maxWidth: 300 }}>
              Специализирани довършителни дейности с 12 години опит. Перфекционизъм и прецизност — гарантирано.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,242,0.25)', marginBottom: 20 }}>Навигация</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Начало','Услуги','Галерия','Отзиви','График','Контакти'].map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: 14, color: 'rgba(245,244,242,0.5)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,242,0.5)')}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: C.fh, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,242,0.25)', marginBottom: 20 }}>Услуги</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Баня / WC','Настилки','Боядисване','В/К инсталации','Електро работи','Гипсокартон'].map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: 14, color: 'rgba(245,244,242,0.5)', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,242,0.5)')}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(245,244,242,0.22)' }}>© 2026 TopFinish Build. Всички права запазени.</div>
          <div style={{ fontSize: 11, color: 'rgba(245,244,242,0.18)', fontFamily: C.fh, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Перфекционизъм във всеки детайл</div>
        </div>
      </div>
    </footer>
  );
}

// ── marquee keyframe (injected once) ─────────────────────────────────────────
const styleTag = document.createElement('style');
styleTag.textContent = '@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
if (!document.getElementById('d2-marquee-style')) {
  styleTag.id = 'd2-marquee-style';
  document.head.appendChild(styleTag);
}

// ── ROOT EXPORT ───────────────────────────────────────────────────────────────
export default function Design2() {
  return (
    <div style={{ paddingTop: 44 }}>
      <Nav />
      <Hero />
      <Services />
      <StatsBar />
      <BeforeAfter />
      <Gallery />
      <Partners />
      <WhyUs />
      <Testimonials />
      <CalendarSection />
      <PricingSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
