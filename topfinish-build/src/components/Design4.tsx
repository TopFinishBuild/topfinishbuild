import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const D4 = {
  navy:    '#0d1e3d',
  navy2:   '#162540',
  navy3:   '#1e3456',
  orange:  '#f97316',
  orangeDk:'#ea6c0a',
  white:   '#ffffff',
  offwhite:'#f1f5f9',
  gray:    '#64748b',
  gray2:   '#94a3b8',
  border:  '#e2e8f0',
  fh:      "'Barlow Condensed', sans-serif",
  fb:      "'Barlow', sans-serif",
};

const P4 = {
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

const IC4: Record<string,string> = {
  bath:    '<path d="M2 11h20v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8v-3z"/><path d="M7 11V5a2 2 0 0 1 4 0v1"/>',
  layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  brush:   '<path d="M15.5 2.1L3.2 14.4 2 22l7.6-1.2 12.3-12.3a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.6-0.4z"/>',
  wrench:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap:     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grid:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  phone:   '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  pin:     '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  award:   '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  clock:   '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users:   '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check:   '<polyline points="20 6 9 17 4 12"/>',
  arrow:   '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chevL:   '<polyline points="15 18 9 12 15 6"/>',
  chevR:   '<polyline points="9 18 15 12 9 6"/>',
  images:  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  send:    '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  tag:     '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  calc:    '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>',
};

function Ic4({ name, size=22, color='currentColor', sw=1.5 }: { name:string; size?:number; color?:string; sw?:number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',flexShrink:0}} dangerouslySetInnerHTML={{__html: IC4[name]??''}} />;
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav4() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [['Услуги','#d4-услуги'],['Проекти','#d4-преди-след'],['Галерия','#d4-галерия'],['Клиенти','#d4-отзиви'],['График','#d4-график'],['Цени','#d4-цени'],['Контакти','#d4-контакти']];
  return (
    <nav style={{ position:'fixed', top:44, left:0, right:0, zIndex:200, height:68,
      background: scrolled ? 'rgba(13,30,61,0.97)' : D4.navy,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: isMobile ? '0 20px' : '0 48px',
      borderBottom:'1px solid rgba(255,255,255,0.07)', transition:'all 0.3s' }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <polygon points="18,2 34,32 2,32" fill={D4.orange}/>
          <polygon points="18,10 28,28 8,28" fill={D4.navy}/>
          <rect x="15" y="20" width="6" height="8" fill={D4.orange}/>
        </svg>
        <div>
          <div style={{ fontFamily:D4.fh, fontSize:20, fontWeight:900, letterSpacing:'0.06em', color:'white', lineHeight:1.1 }}>
            TOP<span style={{ color:D4.orange }}>FINISH</span>
          </div>
          <div style={{ fontFamily:D4.fb, fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Build</div>
        </div>
      </div>
      {/* Links — hidden on mobile */}
      {!isMobile && (
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          {links.map(([t,h],i) => (
            <a key={t} href={h} style={{ fontFamily:D4.fb, fontSize:13, fontWeight:500, color: i===0 ? D4.orange : 'rgba(255,255,255,0.65)', letterSpacing:'0.02em', transition:'color 0.2s', borderBottom: i===0 ? `2px solid ${D4.orange}` : 'none', paddingBottom:2 }}
              onMouseEnter={e=>e.currentTarget.style.color=D4.orange} onMouseLeave={e=>e.currentTarget.style.color= i===0 ? D4.orange : 'rgba(255,255,255,0.65)'}>{t}</a>
          ))}
          <a href="#d4-контакти" style={{ background:D4.orange, color:'white', padding:'9px 22px', fontFamily:D4.fh, fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4, transition:'background 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
            Заявете сега
          </a>
        </div>
      )}
      {/* Mobile: CTA only */}
      {isMobile && (
        <a href="#d4-контакти" style={{ background:D4.orange, color:'white', padding:'8px 16px', fontFamily:D4.fh, fontWeight:700, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:4 }}>
          Заявете
        </a>
      )}
    </nav>
  );
}

// ── HERO (full-bleed image + dark overlay) ────────────────────────────────────
function Hero4() {
  const isMobile = useIsMobile();
  return (
    <section style={{ position:'relative', minHeight:'100vh', paddingTop: isMobile ? 80 : 112, display:'flex', alignItems:'center', overflow:'hidden' }}>
      {/* BG image */}
      <div style={{ position:'absolute', inset:0, zIndex:0 }}>
        <img src={P4.hero} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background: isMobile
          ? 'rgba(13,30,61,0.92)'
          : 'linear-gradient(to right, rgba(13,30,61,0.92) 55%, rgba(13,30,61,0.35) 100%)' }} />
      </div>
      <div style={{ position:'relative', zIndex:1, maxWidth:1280, margin:'0 auto', padding: isMobile ? '60px 20px' : '80px 48px', width:'100%' }}>
        <div style={{ maxWidth: isMobile ? '100%' : 600 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.4)', padding:'6px 16px', borderRadius:4, marginBottom:28 }}>
            <Ic4 name="shield" size={14} color={D4.orange} />
            <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:D4.orange }}>Сертифицирани специалисти</span>
          </div>
          <h1 style={{ fontFamily:D4.fh, fontSize: isMobile ? 'clamp(42px,12vw,64px)' : 'clamp(48px,6vw,88px)', fontWeight:900, color:'white', lineHeight:0.92, marginBottom:28, letterSpacing:'-0.01em' }}>
            СТРОИМ<br/>ВАШАТА<br/><span style={{ color:D4.orange }}>МЕЧТА</span>
          </h1>
          <p style={{ fontFamily:D4.fb, fontSize: isMobile ? 15 : 17, color:'rgba(255,255,255,0.65)', lineHeight:1.8, maxWidth:480, marginBottom:40, fontWeight:300 }}>
            Специализирани довършителни дейности с прецизност и внимание към всеки детайл — от баня до цялостен ремонт.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <a href="#d4-контакти" style={{ background:D4.orange, color:'white', padding: isMobile ? '12px 24px' : '15px 36px', fontFamily:D4.fh, fontWeight:700, fontSize: isMobile ? 14 : 16, letterSpacing:'0.1em', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:10, borderRadius:4, transition:'background 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
              Безплатна консултация <Ic4 name="arrow" size={16} color="white" />
            </a>
            <a href="#d4-галерия" style={{ border:'2px solid rgba(255,255,255,0.4)', color:'white', padding: isMobile ? '12px 24px' : '15px 36px', fontFamily:D4.fh, fontWeight:700, fontSize: isMobile ? 14 : 16, letterSpacing:'0.1em', textTransform:'uppercase', display:'inline-block', borderRadius:4, transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='white';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.4)';}}>
              Вижте проекти
            </a>
          </div>
          {/* stats row — stacked on mobile, hidden if too tight */}
          {!isMobile ? (
            <div style={{ display:'flex', gap:40, marginTop:56, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.12)' }}>
              {[['350+','Обекта'],['12г.','Опит'],['3г.','Гаранция'],['5★','Рейтинг']].map(([n,l])=>(
                <div key={n}>
                  <div style={{ fontFamily:D4.fh, fontSize:40, fontWeight:900, color:D4.orange, lineHeight:1 }}>{n}</div>
                  <div style={{ fontFamily:D4.fb, fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:40, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.12)' }}>
              {[['350+','Обекта'],['12г.','Опит'],['3г.','Гаранция'],['5★','Рейтинг']].map(([n,l])=>(
                <div key={n}>
                  <div style={{ fontFamily:D4.fh, fontSize:32, fontWeight:900, color:D4.orange, lineHeight:1 }}>{n}</div>
                  <div style={{ fontFamily:D4.fb, fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── WHY US STRIP (3 columns, navy circle icons) ───────────────────────────────
function WhyStrip() {
  const isMobile = useIsMobile();
  const items = [
    { icon:'users',  title:'Доволни клиенти',       desc:'Повече от 350 успешно завършени проекта. Всеки клиент е препоръка за нас.' },
    { icon:'award',  title:'Сертификация',           desc:'Работим само с атестирани майстори и висококачествени материали от водещи марки.' },
    { icon:'clock',  title:'Поддръжка 24/7',         desc:'Аварийни ремонти и бързо реагиране при спешни ситуации — на ваше разположение.' },
  ];
  return (
    <section style={{ background:D4.white, padding: isMobile ? '60px 0' : '80px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign:'center' }}>
        <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,52px)', fontWeight:900, color:D4.navy, lineHeight:1, marginBottom:12 }}>
          ЗАЩО ДА ИЗБЕРЕТЕ <span style={{ color:D4.orange }}>TOPFINISH BUILD</span>
        </h2>
        <p style={{ fontFamily:D4.fb, fontSize:16, color:D4.gray, maxWidth:520, margin:'0 auto 56px', lineHeight:1.7 }}>
          Ние поставяме вашите нужди на първо място и доставяме резултати, надминаващи очакванията.
        </p>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 32 : 40 }}>
          {items.map((item,i)=>(
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:72, height:72, background:D4.navy, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
                <Ic4 name={item.icon} size={28} color={D4.orange} />
              </div>
              <h3 style={{ fontFamily:D4.fh, fontSize:22, fontWeight:800, color:D4.navy, textTransform:'uppercase', letterSpacing:'0.03em', marginBottom:12 }}>{item.title}</h3>
              <p style={{ fontFamily:D4.fb, fontSize:15, color:D4.gray, lineHeight:1.75, marginBottom:16 }}>{item.desc}</p>
              <a href="#d4-контакти" style={{ fontFamily:D4.fh, fontSize:13, fontWeight:700, color:D4.orange, letterSpacing:'0.1em', textTransform:'uppercase', borderBottom:`1px solid ${D4.orange}`, paddingBottom:2 }}>Научете повече</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SERVICES (list style with side image) ────────────────────────────────────
const SVCS4 = [
  { icon:'bath',   title:'Баня / WC',       desc:'Пълен ремонт на бани — хидроизолация, облицовка, фаянс. Прецизна работа с гаранция.' },
  { icon:'layers', title:'Настилки',         desc:'Ламинат, паркет, теракот и мозайка с идеална нивелация.' },
  { icon:'brush',  title:'Боядисване',       desc:'Гладка шпакловка и боядисване. Перфектни повърхности без дефект.' },
  { icon:'wrench', title:'В/К инсталации',   desc:'Водопровод, канализация и отопление от сертифицирани специалисти.' },
  { icon:'zap',    title:'Електро работи',   desc:'Окабеляване, табла, осветление и контакти с пълна документация.' },
  { icon:'grid',   title:'Гипсокартон',      desc:'Преградни стени, окачени тавани и декоративни ниши.' },
];

function Services4() {
  const isMobile = useIsMobile();
  return (
    <section id="d4-услуги" style={{ background:D4.navy, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems:'center' }}>
          {/* image — on top on mobile */}
          <div style={{ position:'relative', order: isMobile ? -1 : 0 }}>
            <div style={{ borderRadius:4, overflow:'hidden', boxShadow:'0 30px 60px rgba(0,0,0,0.4)' }}>
              <img src={P4.worker} alt="Работа" style={{ width:'100%', height: isMobile ? 260 : 500, objectFit:'cover', display:'block' }} />
            </div>
            <div style={{ position:'absolute', bottom: isMobile ? -16 : -20, right: isMobile ? -10 : -20, background:D4.orange, padding: isMobile ? '14px 18px' : '20px 28px', borderRadius:4 }}>
              <div style={{ fontFamily:D4.fh, fontSize: isMobile ? 26 : 36, fontWeight:900, color:'white', lineHeight:1 }}>350+</div>
              <div style={{ fontFamily:D4.fb, fontSize:12, color:'rgba(255,255,255,0.8)', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:4 }}>Завършени обекта</div>
            </div>
          </div>
          {/* service list */}
          <div style={{ paddingTop: isMobile ? 16 : 0 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <div style={{ width:32, height:2, background:D4.orange }} />
              <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Нашите услуги</span>
            </div>
            <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(34px,3.5vw,54px)', fontWeight:900, color:'white', lineHeight:1, marginBottom:40 }}>
              ВСИЧКО ЗА<br/>ВАШИЯ РЕМОНТ
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {SVCS4.map((s,i)=>(
                <div key={i} style={{ display:'flex', gap:20, alignItems:'flex-start', padding:'18px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width:44, height:44, background:'rgba(249,115,22,0.12)', border:`1px solid rgba(249,115,22,0.25)`, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Ic4 name={s.icon} size={20} color={D4.orange} />
                  </div>
                  <div>
                    <div style={{ fontFamily:D4.fh, fontSize:17, fontWeight:800, color:'white', textTransform:'uppercase', letterSpacing:'0.03em', marginBottom:4 }}>{s.title}</div>
                    <p style={{ fontFamily:D4.fb, fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="#d4-контакти" style={{ marginTop:36, display:'inline-flex', alignItems:'center', gap:10, background:D4.orange, color:'white', padding:'14px 32px', fontFamily:D4.fh, fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4, transition:'background 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
              Заявете оферта <Ic4 name="arrow" size={16} color="white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── COMMERCIAL / SPLIT SECTION ────────────────────────────────────────────────
function SplitSection() {
  const isMobile = useIsMobile();
  const [f, setF] = useState({ service:'', area:'' });
  const set = (k:string) => (e:React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => setF(p=>({...p,[k]:e.target.value}));
  const inpS: React.CSSProperties = { width:'100%', padding:'11px 14px', border:`1px solid ${D4.border}`, borderRadius:4, fontFamily:D4.fb, fontSize:14, color:D4.navy, outline:'none', background:'white' };
  return (
    <section style={{ background:D4.offwhite, padding:'0' }}>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
        {/* left: dark navy text */}
        <div style={{ background:D4.navy2, padding: isMobile ? '60px 20px' : '80px 60px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <div style={{ width:28, height:2, background:D4.orange }} />
            <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Довършителни работи</span>
          </div>
          <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(34px,3.5vw,54px)', fontWeight:900, color:'white', lineHeight:1, marginBottom:20 }}>
            КОМПЛЕКСНИ<br/>РЕШЕНИЯ ЗА<br/>ВАШ ПРОЕКТ
          </h2>
          <p style={{ fontFamily:D4.fb, fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:32, maxWidth:360 }}>
            Работим по проекти от всякакъв мащаб — от ремонт на единична стая до цялостна реновация на имот. Гарантираме качество и срокове.
          </p>
          {[['Гаранция 3 години за всеки обект'],['Сертифицирани майстори'],['Стриктно спазване на срокове'],['Безплатна консултация и оглед']].map(([t])=>(
            <div key={t} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <div style={{ width:22, height:22, background:D4.orange, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Ic4 name="check" size={12} color="white" sw={2.5} />
              </div>
              <span style={{ fontFamily:D4.fb, fontSize:14, color:'rgba(255,255,255,0.7)' }}>{t}</span>
            </div>
          ))}
          <a href="#d4-галерия" style={{ marginTop:32, display:'inline-flex', alignItems:'center', gap:10, background:D4.orange, color:'white', padding:'13px 28px', fontFamily:D4.fh, fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4, width:'fit-content', transition:'background 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
            Вижте портфолио <Ic4 name="arrow" size={15} color="white" />
          </a>
        </div>
        {/* right: image + floating quote card */}
        <div style={{ position:'relative', minHeight: isMobile ? 300 : 500 }}>
          <img src={P4.worker2} alt="Проект" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          {/* Floating quote card: hidden on mobile */}
          {!isMobile && (
            <div style={{ position:'absolute', bottom:40, right:40, background:'white', padding:'28px 28px 24px', borderRadius:8, width:280, boxShadow:'0 20px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ fontFamily:D4.fh, fontSize:18, fontWeight:900, color:D4.navy, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:20 }}>Бърза оферта</div>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.gray, marginBottom:6 }}>Услуга</label>
                <select value={f.service} onChange={set('service')} style={{ ...inpS, appearance:'none' }}>
                  <option value="">— Изберете —</option>
                  {['Баня / WC','Настилки','Боядисване','В/К','Електро','Гипсокартон','Цялостен ремонт'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.gray, marginBottom:6 }}>Площ (м²)</label>
                <input type="number" value={f.area} onChange={set('area')} placeholder="напр. 65" style={inpS} onFocus={e=>e.target.style.borderColor=D4.orange} onBlur={e=>e.target.style.borderColor=D4.border} />
              </div>
              <a href="#d4-контакти" style={{ display:'block', textAlign:'center', background:D4.orange, color:'white', padding:'12px', fontFamily:D4.fh, fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4, transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
                Изчисли цена
              </a>
            </div>
          )}
          {/* Mobile: inline quote card below image */}
          {isMobile && (
            <div style={{ background:'white', padding:'24px 20px', borderTop:`3px solid ${D4.orange}` }}>
              <div style={{ fontFamily:D4.fh, fontSize:18, fontWeight:900, color:D4.navy, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:16 }}>Бърза оферта</div>
              <div style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.gray, marginBottom:6 }}>Услуга</label>
                <select value={f.service} onChange={set('service')} style={{ ...inpS, appearance:'none' }}>
                  <option value="">— Изберете —</option>
                  {['Баня / WC','Настилки','Боядисване','В/К','Електро','Гипсокартон','Цялостен ремонт'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.gray, marginBottom:6 }}>Площ (м²)</label>
                <input type="number" value={f.area} onChange={set('area')} placeholder="напр. 65" style={inpS} onFocus={e=>e.target.style.borderColor=D4.orange} onBlur={e=>e.target.style.borderColor=D4.border} />
              </div>
              <a href="#d4-контакти" style={{ display:'block', textAlign:'center', background:D4.orange, color:'white', padding:'12px', fontFamily:D4.fh, fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>
                Изчисли цена
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── INFO CARDS (light gray, 3 cols, orange icons) ─────────────────────────────
function InfoCards() {
  const isMobile = useIsMobile();
  const cards = [
    { icon:'images',   title:'Портфолио',        desc:'Разгледайте нашите реализирани проекти и трансформации на реални обекти.', link:'#d4-галерия',    cta:'Виж галерия' },
    { icon:'calendar', title:'Преди и след',      desc:'Вижте разликата — драматичните трансформации, постигнати от нашия екип.', link:'#d4-преди-след', cta:'Виж проекти' },
    { icon:'phone',    title:'Свържете се',       desc:'Имате въпрос или нужда от консултация? Отговаряме в рамките на 24 часа.', link:'#d4-контакти',   cta:'Контакт' },
  ];
  return (
    <section style={{ background:D4.offwhite, padding: isMobile ? '60px 0' : '80px 0', borderTop:`1px solid ${D4.border}` }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:32 }}>
          {cards.map((c,i)=>(
            <div key={i} style={{ background:D4.white, borderRadius:6, padding:'36px 32px', border:`1px solid ${D4.border}`, transition:'box-shadow 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{ width:52, height:52, background:D4.orange, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                <Ic4 name={c.icon} size={22} color="white" />
              </div>
              <h3 style={{ fontFamily:D4.fh, fontSize:22, fontWeight:800, color:D4.navy, textTransform:'uppercase', letterSpacing:'0.03em', marginBottom:12 }}>{c.title}</h3>
              <p style={{ fontFamily:D4.fb, fontSize:14, color:D4.gray, lineHeight:1.75, marginBottom:20 }}>{c.desc}</p>
              <a href={c.link} style={{ fontFamily:D4.fh, fontSize:13, fontWeight:700, color:D4.orange, letterSpacing:'0.1em', textTransform:'uppercase', display:'inline-flex', alignItems:'center', gap:6 }}>
                {c.cta} <Ic4 name="arrow" size={14} color={D4.orange} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BEFORE / AFTER ────────────────────────────────────────────────────────────
function BeforeAfter4() {
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
    <section id="d4-преди-след" style={{ background:D4.white, padding:'100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 48px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <div style={{ width:28, height:2, background:D4.orange }} />
          <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Трансформация</span>
          <div style={{ width:28, height:2, background:D4.orange }} />
        </div>
        <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(34px,4vw,58px)', fontWeight:900, color:D4.navy, lineHeight:1, marginBottom:8 }}>ПРЕДИ &amp; СЛЕД</h2>
        <p style={{ fontFamily:D4.fb, color:D4.gray, fontSize:14, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:40 }}>Плъзнете за да видите разликата</p>
        <div ref={ref}
          style={{ position:'relative', overflow:'hidden', maxWidth:920, margin:'0 auto', aspectRatio:'16/9', cursor:'ew-resize', userSelect:'none', borderRadius:6, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}
          onMouseDown={e=>{drag.current=true;update(e.nativeEvent);}}
          onTouchStart={e=>{drag.current=true;update(e.nativeEvent);}}>
          <div style={{ position:'absolute', inset:0 }}>
            <img src={P4.before} alt="Преди" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', top:16, left:16, background:D4.navy, color:'white', padding:'6px 18px', fontFamily:D4.fh, fontSize:13, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', borderRadius:4 }}>ПРЕДИ</div>
          </div>
          <div style={{ position:'absolute', inset:0, clipPath:`polygon(${pos}% 0,100% 0,100% 100%,${pos}% 100%)` }}>
            <img src={P4.after} alt="След" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', top:16, right:16, background:D4.orange, color:'white', padding:'6px 18px', fontFamily:D4.fh, fontSize:13, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', borderRadius:4 }}>СЛЕД</div>
          </div>
          <div style={{ position:'absolute', top:0, bottom:0, left:`${pos}%`, width:3, background:D4.orange, transform:'translateX(-50%)', pointerEvents:'none', boxShadow:'0 0 16px rgba(249,115,22,0.6)' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:46, height:46, background:D4.navy, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${D4.orange}`, boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}>
              <svg width="20" height="16" viewBox="0 0 22 18" fill="none" stroke={D4.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
const GAL4_CATS = ['Всички','Бани','Кухни','Тераси','Спални','Хол'];
const GAL4 = [
  {cat:'Бани',   label:'Луксозна баня',           src:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Кухни',  label:'Модерна кухня',            src:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Тераси', label:'Тераса с настилка',        src:'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Спални', label:'Спалня — гипсокартон',     src:'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Хол',    label:'Хол — цялостен ремонт',    src:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Бани',   label:'Баня — микроцимент',       src:'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Кухни',  label:'Кухня — окачен таван',     src:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Тераси', label:'Тераса — гранитогрес',     src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Спални', label:'Спалня — боя',             src:'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Хол',    label:'Хол — декоративна стена',  src:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Бани',   label:'Баня — черно-бяла',        src:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&h=450&q=80'},
  {cat:'Кухни',  label:'Кухня — плочки',           src:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&h=450&q=80'},
];

function GalItem4({ label, src }: { label:string; src:string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ aspectRatio:'4/3', overflow:'hidden', position:'relative', cursor:'pointer', borderRadius:4 }}>
      <div style={{ transform:h?'scale(1.06)':'scale(1)', transition:'transform 0.4s', height:'100%' }}>
        <img src={src} alt={label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      </div>
      <div style={{ position:'absolute', inset:0, background:h?'rgba(13,30,61,0.7)':'rgba(13,30,61,0)', transition:'background 0.3s', display:'flex', alignItems:'flex-end', padding:16 }}>
        <div style={{ background:D4.orange, color:'white', padding:'6px 14px', borderRadius:3, fontFamily:D4.fh, fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', opacity:h?1:0, transform:h?'translateY(0)':'translateY(8px)', transition:'all 0.3s' }}>{label}</div>
      </div>
    </div>
  );
}

function Gallery4() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState('Всички');
  const items = tab==='Всички' ? GAL4 : GAL4.filter(i=>i.cat===tab);
  return (
    <section id="d4-галерия" style={{ background:D4.navy, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <div style={{ width:28, height:2, background:D4.orange }} />
              <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Портфолио</span>
            </div>
            <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,52px)', fontWeight:900, color:'white', lineHeight:1 }}>НАШИТЕ ПРОЕКТИ</h2>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:28 }}>
          {GAL4_CATS.map(c=>(
            <button key={c} onClick={()=>setTab(c)} style={{ padding:'8px 20px', fontFamily:D4.fh, fontSize:13, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:tab===c?'white':'rgba(255,255,255,0.45)', background:tab===c?D4.orange:'transparent', border:`1px solid ${tab===c?D4.orange:'rgba(255,255,255,0.15)'}`, borderRadius:4, cursor:'pointer', transition:'all 0.2s' }}>{c}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:10 }}>
          {items.map((it,i)=><GalItem4 key={`${tab}-${i}`} label={it.label} src={it.src} />)}
        </div>
      </div>
    </section>
  );
}

// ── PARTNERS ──────────────────────────────────────────────────────────────────
const PARTNERS4 = ['KNAUF','WEBER','ROCA','GROHE','BOSCH','MAPEI','SIKA','HILTI','BAUMIT','LITOKOL'];
function Partners4() {
  const doubled = [...PARTNERS4,...PARTNERS4];
  return (
    <section style={{ background:D4.navy2, padding:'44px 0', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 30s linear infinite', width:'fit-content' }}>
          {doubled.map((p,i)=>(
            <div key={i} style={{ padding:'0 52px', fontFamily:D4.fh, fontSize:18, fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', whiteSpace:'nowrap', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=D4.orange} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.2)'}>{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
const REVIEWS4 = [
  { name:'Иван Петров',    role:'Ремонт на баня — гр. София',  text:'Невероятен резултат! Екипът работи прецизно, чисто и стриктно в срок. Банята изглежда като от дизайнерско списание.', stars:5 },
  { name:'Мария Иванова',  role:'Цялостен ремонт — 85кв.',     text:'Цялостен ремонт на апартамента — всяко кътче изпипано. Шпакловката идеална, плочките перфектно наредени. Благодаря!', stars:5 },
  { name:'Стефан Георгиев',role:'Ремонт на кухня и хол',       text:'Работил съм с много фирми, но TopFinish Build са на съвсем друго ниво. Готови бяха 3 дни преди крайния срок!', stars:5 },
];

function Testimonials4() {
  const isMobile = useIsMobile();
  return (
    <section id="d4-отзиви" style={{ background:D4.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <div style={{ width:28, height:2, background:D4.orange }} />
          <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Отзиви</span>
          <div style={{ width:28, height:2, background:D4.orange }} />
        </div>
        <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,52px)', fontWeight:900, color:D4.navy, lineHeight:1, marginBottom:52 }}>ДОВОЛНИ КЛИЕНТИ</h2>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:24 }}>
          {REVIEWS4.map((r,i)=>(
            <div key={i} style={{ background:D4.white, borderRadius:6, padding:'36px', textAlign:'left', border:`1px solid ${D4.border}`, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:D4.orange }} />
              <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                {Array.from({length:r.stars}).map((_,j)=><span key={j} style={{ color:D4.orange, fontSize:16 }}>★</span>)}
              </div>
              <p style={{ fontFamily:D4.fb, fontSize:14, lineHeight:1.8, color:D4.gray, marginBottom:24, fontStyle:'italic' }}>"{r.text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, background:D4.navy, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D4.fh, fontSize:16, fontWeight:900, color:D4.orange }}>
                  {r.name.split(' ').map(w=>w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontFamily:D4.fh, fontSize:15, fontWeight:800, color:D4.navy, textTransform:'uppercase' }}>{r.name}</div>
                  <div style={{ fontFamily:D4.fb, fontSize:12, color:D4.gray2 }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CALENDAR ──────────────────────────────────────────────────────────────────
const BUSY4: Record<string,number[]> = {
  '2026-4':[1,2,3,7,8,9,14,15,21,22,28,29,30],
  '2026-5':[4,5,6,11,12,13,18,19,20,25,26,27],
  '2026-6':[1,2,8,9,15,16,22,23,29,30],
};
const MONTHS4 = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
const DAYS4   = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

function Calendar4() {
  const [cur, setCur] = useState(new Date(2026,3,1));
  const yr=cur.getFullYear(), mo=cur.getMonth()+1;
  const busy=BUSY4[`${yr}-${mo}`]||[];
  const firstDow=(new Date(yr,mo-1,1).getDay()+6)%7;
  const days=new Date(yr,mo,0).getDate();
  const today=new Date();
  const cells=[...Array(firstDow).fill(null),...Array.from({length:days},(_,i)=>i+1)];
  return (
    <section id="d4-график" style={{ background:D4.navy, padding:'100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 48px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <div style={{ width:28, height:2, background:D4.orange }} />
          <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>График</span>
          <div style={{ width:28, height:2, background:D4.orange }} />
        </div>
        <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,52px)', fontWeight:900, color:'white', lineHeight:1, marginBottom:8 }}>ЗАЕТОСТ НА ЕКИПА</h2>
        <p style={{ fontFamily:D4.fb, color:'rgba(255,255,255,0.4)', fontSize:14, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:40 }}>Вижте кога сме свободни</p>
        <div style={{ maxWidth:660, margin:'0 auto', background:D4.navy2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:6, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={()=>setCur(new Date(yr,mo-2,1))} style={{ width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)',cursor:'pointer',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=D4.orange;e.currentTarget.style.color=D4.orange;}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='rgba(255,255,255,0.4)';}}>
              <Ic4 name="chevL" size={16} />
            </button>
            <div style={{ fontFamily:D4.fh, fontSize:20, fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', color:'white' }}>{MONTHS4[mo-1]} {yr}</div>
            <button onClick={()=>setCur(new Date(yr,mo,1))} style={{ width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)',cursor:'pointer',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=D4.orange;e.currentTarget.style.color=D4.orange;}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='rgba(255,255,255,0.4)';}}>
              <Ic4 name="chevR" size={16} />
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            {DAYS4.map(d=><div key={d} style={{ textAlign:'center', padding:'10px 0', fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.12em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase' }}>{d}</div>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px' }}>
            {cells.map((day,i)=>{
              if(!day) return <div key={`e${i}`}/>;
              const isBusy=busy.includes(day);
              const isToday=yr===today.getFullYear()&&mo-1===today.getMonth()&&day===today.getDate();
              return (
                <div key={day} style={{ textAlign:'center', padding:'9px 0', margin:2, fontSize:13, fontWeight:isBusy?700:400, color:isBusy?D4.navy:isToday?D4.orange:'rgba(255,255,255,0.5)', background:isBusy?D4.orange:isToday?'rgba(249,115,22,0.15)':'transparent', borderRadius:3 }}>
                  {day}
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:24, padding:'14px 28px', borderTop:'1px solid rgba(255,255,255,0.07)', justifyContent:'center' }}>
            {[[D4.orange,D4.navy,'Зает'],['rgba(255,255,255,0.1)','rgba(255,255,255,0.4)','Свободен']].map(([bg,tc,label])=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:D4.fb, fontSize:12, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                <div style={{ width:10, height:10, borderRadius:2, background:bg }}/>{label}
              </div>
            ))}
          </div>
        </div>
        <a href="#d4-контакти" style={{ marginTop:32, display:'inline-flex', alignItems:'center', gap:10, background:D4.orange, color:'white', padding:'14px 32px', fontFamily:D4.fh, fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>
          Запитайте свободна дата <Ic4 name="arrow" size={16} color="white" />
        </a>
      </div>
    </section>
  );
}

// ── PRICING SECTION ───────────────────────────────────────────────────────────
const CALC_SERVICES = [
  { id:'paint',   label:'Боядисване',         price:12,  unit:'лв/m²' },
  { id:'plaster', label:'Шпакловка',           price:15,  unit:'лв/m²' },
  { id:'tiles',   label:'Теракот / облицовка', price:35,  unit:'лв/m²' },
  { id:'laminate',label:'Ламинат / паркет',    price:22,  unit:'лв/m²' },
  { id:'gyp',     label:'Гипсокартон',         price:28,  unit:'лв/m²' },
  { id:'plumb',   label:'ВиК инсталации',      price:850, unit:'лв/баня' },
  { id:'elec',    label:'Електро',             price:600, unit:'лв/стая' },
];
const CALC_ROOMS = ['Хол','Спалня','Кухня','Баня','Коридор'];

type CalcItem = { serviceId: string; room: string; qty: number };

function Pricing4() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'услуги'|'калкулатор'>('услуги');
  // Calculator state
  const [items, setItems] = useState<CalcItem[]>([{ serviceId:'paint', room:'Хол', qty:20 }]);
  const [checked, setChecked] = useState<Set<number>>(new Set([0]));

  const addItem = () => {
    setItems(prev => [...prev, { serviceId:'paint', room:'Хол', qty:20 }]);
  };
  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_,i)=>i!==idx));
    setChecked(prev => {
      const next = new Set<number>();
      prev.forEach(v => { if(v < idx) next.add(v); else if(v > idx) next.add(v-1); });
      return next;
    });
  };
  const updateItem = (idx: number, key: keyof CalcItem, val: string | number) => {
    setItems(prev => prev.map((it,i) => i===idx ? {...it,[key]:val} : it));
  };
  const toggleCheck = (idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if(next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const total = items.reduce((sum, it, idx) => {
    if(!checked.has(idx)) return sum;
    const svc = CALC_SERVICES.find(s=>s.id===it.serviceId);
    if(!svc) return sum;
    return sum + svc.price * it.qty;
  }, 0);

  const PRICE_PACKAGES = [
    {
      name: 'Стандарт',
      label: 'Базов пакет',
      price: '25',
      unit: 'лв/m²',
      desc: 'Боядисване + шпакловка + настилки. Подходящ за бюджетен ремонт.',
      features: ['Шпакловка и боядисване','Настилки по избор','Почистване след ремонт','Гаранция 1 година'],
      highlighted: false,
    },
    {
      name: 'Комплект',
      label: 'Най-популярен',
      price: '45',
      unit: 'лв/m²',
      desc: 'Пълен довършителен ремонт — всичко включено без ВиК и Електро.',
      features: ['Всичко от Стандарт','Гипсокартон и тавани','Фаянс и теракот','Гаранция 2 години','Безплатен оглед'],
      highlighted: true,
    },
    {
      name: 'Премиум',
      label: 'Цялостен ремонт',
      price: 'По заявка',
      unit: '',
      desc: 'Цялостна реновация с ВиК, Електро и дизайнерско решение.',
      features: ['Всичко от Комплект','ВиК инсталации','Електро и осветление','Дизайнерска консултация','Гаранция 3 години','Приоритетна поддръжка'],
      highlighted: false,
    },
  ];

  return (
    <section id="d4-цени" style={{ background:D4.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:28, height:2, background:D4.orange }} />
            <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Прозрачни цени</span>
            <div style={{ width:28, height:2, background:D4.orange }} />
          </div>
          <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,58px)', fontWeight:900, color:D4.navy, lineHeight:1, marginBottom:14 }}>
            ЦЕНОВА ЛИСТА
          </h2>
          <p style={{ fontFamily:D4.fb, fontSize:16, color:D4.gray, maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            Изберете пакет или използвайте калкулатора за точна прогнозна цена за вашия проект.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex', justifyContent:'center', gap:0, marginBottom:48 }}>
          {(['услуги','калкулатор'] as const).map((tab, i) => {
            const isActive = activeTab === tab;
            return (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                style={{
                  padding:'12px 32px',
                  fontFamily:D4.fh, fontSize:14, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                  cursor:'pointer', transition:'all 0.2s',
                  background: isActive ? D4.orange : 'transparent',
                  color: isActive ? 'white' : D4.navy,
                  border: `2px solid ${isActive ? D4.orange : D4.border}`,
                  borderRadius: i===0 ? '4px 0 0 4px' : '0 4px 4px 0',
                  borderLeft: i===1 && !isActive ? `2px solid ${D4.border}` : undefined,
                }}>
                {tab === 'услуги' ? 'Пакети & Цени' : 'Калкулатор'}
              </button>
            );
          })}
        </div>

        {/* Tab: Пакети */}
        {activeTab === 'услуги' && (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:28 }}>
            {PRICE_PACKAGES.map((pkg, i) => (
              <div key={i} style={{
                background: pkg.highlighted ? D4.navy : D4.white,
                border: `2px solid ${pkg.highlighted ? D4.orange : D4.border}`,
                borderRadius:8, padding:'36px 28px', position:'relative',
                boxShadow: pkg.highlighted ? '0 16px 48px rgba(249,115,22,0.18)' : '0 2px 12px rgba(0,0,0,0.05)',
                transition:'box-shadow 0.2s',
              }}
                onMouseEnter={e=>{ if(!pkg.highlighted) e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e=>{ if(!pkg.highlighted) e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)'; }}
              >
                {pkg.highlighted && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:D4.orange, color:'white', padding:'4px 18px', borderRadius:20, fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                    {pkg.label}
                  </div>
                )}
                {!pkg.highlighted && (
                  <div style={{ display:'inline-block', background:'rgba(249,115,22,0.1)', border:`1px solid rgba(249,115,22,0.25)`, color:D4.orange, padding:'3px 12px', borderRadius:3, fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:16 }}>
                    {pkg.label}
                  </div>
                )}
                {pkg.highlighted && <div style={{ height:24 }} />}
                <div style={{ fontFamily:D4.fh, fontSize:28, fontWeight:900, color: pkg.highlighted ? 'white' : D4.navy, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>{pkg.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:12 }}>
                  <span style={{ fontFamily:D4.fh, fontSize: pkg.price === 'По заявка' ? 24 : 48, fontWeight:900, color:D4.orange, lineHeight:1 }}>{pkg.price}</span>
                  {pkg.unit && <span style={{ fontFamily:D4.fb, fontSize:14, color: pkg.highlighted ? 'rgba(255,255,255,0.5)' : D4.gray }}>{pkg.unit}</span>}
                </div>
                <p style={{ fontFamily:D4.fb, fontSize:14, color: pkg.highlighted ? 'rgba(255,255,255,0.55)' : D4.gray, lineHeight:1.7, marginBottom:24 }}>{pkg.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {pkg.features.map((f,j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:20, height:20, background: pkg.highlighted ? D4.orange : 'rgba(249,115,22,0.12)', border:`1px solid ${pkg.highlighted ? D4.orange : 'rgba(249,115,22,0.3)'}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Ic4 name="check" size={11} color={pkg.highlighted ? 'white' : D4.orange} sw={2.5} />
                      </div>
                      <span style={{ fontFamily:D4.fb, fontSize:13, color: pkg.highlighted ? 'rgba(255,255,255,0.75)' : D4.gray }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#d4-контакти" style={{
                  display:'block', textAlign:'center',
                  background: pkg.highlighted ? D4.orange : 'transparent',
                  color: pkg.highlighted ? 'white' : D4.navy,
                  border: `2px solid ${pkg.highlighted ? D4.orange : D4.border}`,
                  padding:'13px', fontFamily:D4.fh, fontWeight:700, fontSize:14, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4,
                  transition:'all 0.2s',
                }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.background = D4.orange;
                    e.currentTarget.style.borderColor = D4.orange;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.background = pkg.highlighted ? D4.orange : 'transparent';
                    e.currentTarget.style.borderColor = pkg.highlighted ? D4.orange : D4.border;
                    e.currentTarget.style.color = pkg.highlighted ? 'white' : D4.navy;
                  }}>
                  Искам оферта
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Калкулатор */}
        {activeTab === 'калкулатор' && (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap:32, alignItems:'start' }}>
            {/* Left: service rows */}
            <div style={{ background:D4.white, border:`1px solid ${D4.border}`, borderRadius:8, overflow:'hidden' }}>
              <div style={{ padding:'20px 24px', borderBottom:`1px solid ${D4.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontFamily:D4.fh, fontSize:18, fontWeight:800, color:D4.navy, textTransform:'uppercase', letterSpacing:'0.04em' }}>Изберете услуги</div>
                <button onClick={addItem} style={{ display:'flex', alignItems:'center', gap:6, background:D4.orange, color:'white', border:'none', padding:'8px 16px', borderRadius:4, fontFamily:D4.fh, fontWeight:700, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk} onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
                  + Добави
                </button>
              </div>

              {/* Column headers */}
              <div style={{ display:'grid', gridTemplateColumns:'32px 1fr 130px 90px 32px', gap:8, padding:'10px 24px', background:D4.offwhite, borderBottom:`1px solid ${D4.border}` }}>
                {['','Услуга','Стая','Количество',''].map((h,i)=>(
                  <div key={i} style={{ fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:D4.gray2 }}>{h}</div>
                ))}
              </div>

              {items.map((it, idx) => {
                const isChecked = checked.has(idx);
                const svc = CALC_SERVICES.find(s=>s.id===it.serviceId);
                return (
                  <div key={idx} style={{
                    display:'grid', gridTemplateColumns:'32px 1fr 130px 90px 32px', gap:8, padding:'14px 24px', alignItems:'center',
                    borderBottom:`1px solid ${D4.border}`,
                    background: isChecked ? 'rgba(249,115,22,0.04)' : 'white',
                    transition:'background 0.2s',
                  }}>
                    {/* Checkbox */}
                    <div onClick={()=>toggleCheck(idx)} style={{
                      width:20, height:20, borderRadius:3, cursor:'pointer',
                      border:`2px solid ${isChecked ? D4.orange : D4.border}`,
                      background: isChecked ? D4.orange : 'white',
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s',
                    }}>
                      {isChecked && <Ic4 name="check" size={11} color="white" sw={2.5} />}
                    </div>

                    {/* Service select */}
                    <select value={it.serviceId} onChange={e=>updateItem(idx,'serviceId',e.target.value)}
                      style={{ fontFamily:D4.fb, fontSize:14, color:D4.navy, border:`1px solid ${isChecked ? D4.orange : D4.border}`, borderRadius:4, padding:'8px 10px', outline:'none', background:'white', transition:'border-color 0.2s', width:'100%' }}>
                      {CALC_SERVICES.map(s=><option key={s.id} value={s.id}>{s.label} — {s.price} {s.unit}</option>)}
                    </select>

                    {/* Room select */}
                    <select value={it.room} onChange={e=>updateItem(idx,'room',e.target.value)}
                      style={{ fontFamily:D4.fb, fontSize:14, color:D4.navy, border:`1px solid ${isChecked ? D4.orange : D4.border}`, borderRadius:4, padding:'8px 10px', outline:'none', background:'white', transition:'border-color 0.2s', width:'100%' }}>
                      {CALC_ROOMS.map(r=><option key={r}>{r}</option>)}
                    </select>

                    {/* Quantity */}
                    <input type="number" min={1} value={it.qty} onChange={e=>updateItem(idx,'qty',Math.max(1,Number(e.target.value)))}
                      style={{ fontFamily:D4.fb, fontSize:14, color:D4.navy, border:`1px solid ${isChecked ? D4.orange : D4.border}`, borderRadius:4, padding:'8px 10px', outline:'none', width:'100%', transition:'border-color 0.2s' }} />

                    {/* Remove */}
                    <button onClick={()=>removeItem(idx)} style={{ background:'none', border:'none', cursor:'pointer', color:D4.gray2, display:'flex', alignItems:'center', justifyContent:'center', padding:0, transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color=D4.gray2}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div style={{ padding:'40px 24px', textAlign:'center', fontFamily:D4.fb, fontSize:14, color:D4.gray2 }}>
                  Добавете услуги за изчисление
                </div>
              )}
            </div>

            {/* Right: Total card */}
            <div style={{
              background: `linear-gradient(135deg, ${D4.navy} 0%, ${D4.navy3} 100%)`,
              borderRadius:8, padding:'32px 28px', position: isMobile ? 'static' : 'sticky', top:140,
              border:`1px solid rgba(255,255,255,0.08)`,
              boxShadow:'0 20px 60px rgba(13,30,61,0.25)',
            }}>
              <div style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:D4.orange, marginBottom:20 }}>Прогнозна цена</div>

              {/* Line items */}
              <div style={{ marginBottom:20 }}>
                {items.filter((_,idx)=>checked.has(idx)).map((it, i) => {
                  const svc = CALC_SERVICES.find(s=>s.id===it.serviceId);
                  if(!svc) return null;
                  return (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <div>
                        <div style={{ fontFamily:D4.fb, fontSize:13, color:'rgba(255,255,255,0.75)' }}>{svc.label}</div>
                        <div style={{ fontFamily:D4.fb, fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{it.room} · {it.qty} {svc.unit.replace('лв/','')}</div>
                      </div>
                      <div style={{ fontFamily:D4.fh, fontSize:15, fontWeight:700, color:'white' }}>{(svc.price * it.qty).toLocaleString('bg-BG')} лв</div>
                    </div>
                  );
                })}
                {checked.size === 0 && (
                  <div style={{ fontFamily:D4.fb, fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'12px 0' }}>Изберете услуги от списъка</div>
                )}
              </div>

              {/* Total */}
              <div style={{ borderTop:`2px solid ${D4.orange}`, paddingTop:16, marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:D4.fh, fontSize:14, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Общо</div>
                  <div style={{ fontFamily:D4.fh, fontSize:38, fontWeight:900, color:D4.orange, lineHeight:1 }}>{total.toLocaleString('bg-BG')} <span style={{ fontSize:20 }}>лв</span></div>
                </div>
                <div style={{ fontFamily:D4.fb, fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:6 }}>* Прогнозна цена. Точната оферта след оглед.</div>
              </div>

              <a href="#d4-контакти" style={{
                display:'block', textAlign:'center',
                background:D4.orange, color:'white',
                padding:'14px', fontFamily:D4.fh, fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase',
                borderRadius:4, transition:'background 0.2s',
              }}
                onMouseEnter={e=>e.currentTarget.style.background=D4.orangeDk}
                onMouseLeave={e=>e.currentTarget.style.background=D4.orange}>
                Искам оферта
              </a>

              <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                <Ic4 name="shield" size={14} color='rgba(255,255,255,0.3)' />
                <span style={{ fontFamily:D4.fb, fontSize:12, color:'rgba(255,255,255,0.3)' }}>Безплатна консултация и оглед</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom note */}
        <div style={{ marginTop:48, textAlign:'center', padding:'24px', background:D4.white, border:`1px solid ${D4.border}`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <Ic4 name="check" size={18} color={D4.orange} sw={2.5} />
          <span style={{ fontFamily:D4.fb, fontSize:14, color:D4.gray }}>Всички цени са без ДДС. Материалите могат да бъдат включени по договаряне.</span>
          <a href="#d4-контакти" style={{ fontFamily:D4.fh, fontSize:13, fontWeight:700, color:D4.orange, letterSpacing:'0.08em', textTransform:'uppercase', borderBottom:`1px solid ${D4.orange}` }}>
            Свържете се с нас
          </a>
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact4() {
  const isMobile = useIsMobile();
  const [f, setF] = useState({name:'',phone:'',email:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setF(p=>({...p,[k]:e.target.value}));
  const submit=(e:React.FormEvent)=>{e.preventDefault();setSent(true);setTimeout(()=>setSent(false),5000);setF({name:'',phone:'',email:'',service:'',message:''});};
  const inp:React.CSSProperties={width:'100%',padding:'13px 15px',border:`1px solid ${D4.border}`,background:D4.white,fontFamily:D4.fb,fontSize:14,color:D4.navy,outline:'none',borderRadius:4};
  return (
    <section id="d4-контакти" style={{ background:D4.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems:'start' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <div style={{ width:28, height:2, background:D4.orange }} />
              <span style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:D4.orange }}>Контакт</span>
            </div>
            <h2 style={{ fontFamily:D4.fh, fontSize:'clamp(32px,3.5vw,52px)', fontWeight:900, color:D4.navy, lineHeight:1, marginBottom:20 }}>ГОТОВИ ДА<br/>ПОМОГНЕМ</h2>
            <p style={{ fontFamily:D4.fb, fontSize:16, color:D4.gray, lineHeight:1.8, marginBottom:36 }}>Свържете се за безплатна консултация и точна оферта. Отговаряме в рамките на 24 часа.</p>
            {[{icon:'phone',label:'Телефон',val:'+359 88 123 4567'},{icon:'mail',label:'Имейл',val:'info@topfinishbuild.bg'},{icon:'pin',label:'Адрес',val:'гр. София, ул. Строителна 12'}].map(({icon,label,val})=>(
              <div key={label} style={{ display:'flex', gap:16, alignItems:'center', marginBottom:22 }}>
                <div style={{ width:46, height:46, background:D4.navy, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Ic4 name={icon} size={18} color={D4.orange} />
                </div>
                <div>
                  <div style={{ fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.gray2, marginBottom:2 }}>{label}</div>
                  <div style={{ fontFamily:D4.fb, fontSize:15, color:D4.navy, fontWeight:500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:D4.white, border:`1px solid ${D4.border}`, borderRadius:6, padding: isMobile ? 24 : 40, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ width:60, height:60, background:D4.orange, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                  <Ic4 name="check" size={26} color="white" sw={2.5} />
                </div>
                <div style={{ fontFamily:D4.fh, fontSize:26, fontWeight:900, color:D4.navy, textTransform:'uppercase' }}>Изпратено!</div>
                <p style={{ fontFamily:D4.fb, color:D4.gray, marginTop:8 }}>Ще се свържем в рамките на 24 часа.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[{k:'name',l:'Вашето Име *',ph:'Иван Иванов',req:true},{k:'phone',l:'Телефон *',ph:'+359 88...',req:true},{k:'email',l:'Имейл',ph:'email@example.com',req:false}].map(({k,l,ph,req})=>(
                  <div key={k} style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.navy, marginBottom:8 }}>{l}</label>
                    <input required={req} value={f[k as keyof typeof f]} onChange={set(k)} style={inp} placeholder={ph} onFocus={e=>e.target.style.borderColor=D4.orange} onBlur={e=>e.target.style.borderColor=D4.border}/>
                  </div>
                ))}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.navy, marginBottom:8 }}>Вид услуга</label>
                  <select value={f.service} onChange={set('service')} style={{ ...inp, appearance:'none' }}>
                    <option value="">— Изберете —</option>
                    {['Баня / WC','Настилки','Боядисване','В/К','Електро','Гипсокартон','Цялостен ремонт'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'block', fontFamily:D4.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:D4.navy, marginBottom:8 }}>Съобщение *</label>
                  <textarea required value={f.message} onChange={set('message')} style={{ ...inp, minHeight:110, resize:'vertical' }} placeholder="Опишете проекта..." onFocus={e=>e.target.style.borderColor=D4.orange} onBlur={e=>e.target.style.borderColor=D4.border}/>
                </div>
                <button type="submit" style={{ background:D4.navy, color:'white', padding:'15px 36px', fontFamily:D4.fh, fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:12, borderRadius:4, width:'100%', justifyContent:'center', transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background=D4.orange} onMouseLeave={e=>e.currentTarget.style.background=D4.navy}>
                  Изпрати запитване <Ic4 name="send" size={16} color="white" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer4() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background:D4.navy, borderTop:`3px solid ${D4.orange}`, color:'white', padding:'60px 0 28px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: isMobile ? 36 : 60, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none"><polygon points="18,2 34,32 2,32" fill={D4.orange}/><polygon points="18,10 28,28 8,28" fill={D4.navy}/><rect x="15" y="20" width="6" height="8" fill={D4.orange}/></svg>
              <div style={{ fontFamily:D4.fh, fontSize:20, fontWeight:900, letterSpacing:'0.06em', textTransform:'uppercase' }}>TOP<span style={{ color:D4.orange }}>FINISH</span> BUILD</div>
            </div>
            <p style={{ fontFamily:D4.fb, fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.8, maxWidth:300 }}>Специализирани довършителни дейности с 12 години опит. Перфекционизъм и прецизност — гарантирано.</p>
          </div>
          <div>
            <div style={{ fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:18, borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:10 }}>Навигация</div>
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {['Услуги','Галерия','Отзиви','График','Цени','Контакти'].map(l=>(
                <li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontFamily:D4.fb, fontSize:14, color:'rgba(255,255,255,0.45)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=D4.orange} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily:D4.fh, fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:18, borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:10 }}>Услуги</div>
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {['Баня / WC','Настилки','Боядисване','В/К инсталации','Електро','Гипсокартон'].map(l=>(
                <li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontFamily:D4.fb, fontSize:14, color:'rgba(255,255,255,0.45)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=D4.orange} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontFamily:D4.fb, fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 TopFinish Build. Всички права запазени.</div>
          <div style={{ fontFamily:D4.fh, fontSize:11, color:D4.orange, letterSpacing:'0.2em', textTransform:'uppercase', opacity:0.7 }}>Перфекционизъм във всеки детайл</div>
        </div>
      </div>
    </footer>
  );
}

if (!document.getElementById('d4-marquee-style')) {
  const s = document.createElement('style');
  s.id = 'd4-marquee-style';
  s.textContent = '@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(s);
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Design4() {
  return (
    <div style={{ paddingTop:44 }}>
      <Nav4 />
      <Hero4 />
      <WhyStrip />
      <Services4 />
      <SplitSection />
      <InfoCards />
      <BeforeAfter4 />
      <Gallery4 />
      <Partners4 />
      <Testimonials4 />
      <Calendar4 />
      <Pricing4 />
      <Contact4 />
      <Footer4 />
    </div>
  );
}
