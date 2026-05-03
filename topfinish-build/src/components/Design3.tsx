import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const IC3: Record<string,string> = {
  bath:    '<path d="M2 11h20v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8v-3z"/><path d="M7 11V5a2 2 0 0 1 4 0v1"/><line x1="6" y1="22" x2="5" y2="24"/><line x1="18" y1="22" x2="19" y2="24"/>',
  layers:  '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  brush:   '<path d="M15.5 2.1L3.2 14.4 2 22l7.6-1.2 12.3-12.3a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.6-0.4z"/><path d="M3.2 14.4c1.1 1.1 1.6 2.5 1.2 3.8"/>',
  wrench:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap:     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grid:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  phone:   '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  pin:     '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  award:   '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  clock:   '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  home:    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
};
function Ic3({ name, size=22, color='currentColor', sw=1.5 }: { name:string; size?:number; color?:string; sw?:number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{display:'inline-block',flexShrink:0}} dangerouslySetInnerHTML={{__html: IC3[name]??''}} />;
}

const Y = {
  yellow:  '#FFD000',
  yellowDk:'#E6BB00',
  dark:    '#111827',
  dark2:   '#1f2937',
  white:   '#ffffff',
  offwhite:'#f9fafb',
  gray:    '#6b7280',
  gray2:   '#9ca3af',
  border:  '#e5e7eb',
  fh:      "'Barlow Condensed', sans-serif",
  fb:      "'Barlow', sans-serif",
};

const P = {
  hero:    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  worker2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  worker3: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
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

// ── PRICING DATA ──────────────────────────────────────────────────────────────
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

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav3() {
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [['Услуги','#d3-услуги'],['Проекти','#d3-преди-след'],['Галерия','#d3-галерия'],['Клиенти','#d3-отзиви'],['График','#d3-график'],['Цени','#d3-цени'],['Контакти','#d3-контакти']];
  return (
    <nav style={{ position:'fixed', top:44, left:0, right:0, zIndex:200, height:70,
      background: scrolled ? 'rgba(255,255,255,0.97)' : Y.white,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom:`1px solid ${Y.border}`, display:'flex', alignItems:'center',
      justifyContent:'space-between', padding: isMobile ? '0 20px' : '0 48px', transition:'all 0.3s',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:42, height:42, background:Y.yellow, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={Y.dark}/><polyline points="9 22 9 12 15 12 15 22" fill={Y.yellow} stroke={Y.dark} strokeWidth="1.5"/></svg>
        </div>
        <div>
          <div style={{ fontFamily:Y.fh, fontSize:20, fontWeight:900, color:Y.dark, lineHeight:1.1 }}>TopFinish <span style={{color:Y.yellow}}>Build</span></div>
          <div style={{ fontFamily:Y.fb, fontSize:11, color:Y.gray, lineHeight:1 }}>Перфекционизъм в детайлите</div>
        </div>
      </div>
      {isMobile ? (
        <a href="#d3-контакти" style={{ background:Y.yellow, color:Y.dark, padding:'10px 20px', fontFamily:Y.fh, fontWeight:800, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, transition:'all 0.2s', whiteSpace:'nowrap' }}
          onMouseEnter={e=>e.currentTarget.style.background=Y.yellowDk} onMouseLeave={e=>e.currentTarget.style.background=Y.yellow}>
          Заявете
        </a>
      ) : (
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          {links.map(([t,h]) => (
            <a key={t} href={h} style={{ fontFamily:Y.fb, fontSize:13, fontWeight:500, color:Y.dark2, letterSpacing:'0.02em', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=Y.yellow} onMouseLeave={e=>e.currentTarget.style.color=Y.dark2}>{t}</a>
          ))}
          <a href="#d3-контакти" style={{ background:Y.yellow, color:Y.dark, padding:'10px 24px', fontFamily:Y.fh, fontWeight:800, fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=Y.yellowDk} onMouseLeave={e=>e.currentTarget.style.background=Y.yellow}>
            Заявете сега
          </a>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero3() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      background: Y.yellow,
      minHeight: isMobile ? 'auto' : '90vh',
      paddingTop: 114,
      paddingBottom: isMobile ? 48 : 0,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      alignItems: 'center',
      overflow: 'visible',
      position: 'relative',
    }}>
      {/* decorative circles */}
      <div style={{ position:'absolute', right:'5%', bottom:'-5%', width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,0.12)' }} />
      <div style={{ position:'absolute', right:'22%', top:'10%', width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.18)' }} />

      {/* left */}
      <div style={{ padding: isMobile ? '40px 20px 32px' : '60px 60px 60px 80px', zIndex:1 }}>
        <div style={{ display:'inline-block', background:Y.dark, color:Y.yellow, padding:'5px 16px', borderRadius:50, fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:24 }}>
          Довършителни ремонти
        </div>
        <h1 style={{ fontFamily:Y.fh, fontSize: isMobile ? 'clamp(38px,10vw,60px)' : 'clamp(46px,5.5vw,80px)', fontWeight:900, color:Y.dark, lineHeight:0.95, marginBottom:24, letterSpacing:'-0.01em' }}>
          БЪРЗО,<br/>КАЧЕСТВЕНО<br/>И <span style={{ background:Y.dark, color:Y.yellow, padding:'0 8px', display:'inline-block' }}>ДОСТЪПНО</span>
        </h1>
        <p style={{ fontFamily:Y.fb, fontSize: isMobile ? 15 : 17, color:'rgba(17,24,39,0.7)', lineHeight:1.75, maxWidth:420, marginBottom:36, fontWeight:400 }}>
          Специализирани довършителни дейности с прецизност и внимание към всеки детайл. Вашето пространство заслужава само най-доброто.
        </p>
        <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
          <a href="#d3-контакти" style={{ background:Y.dark, color:Y.yellow, padding:'15px 36px', fontFamily:Y.fh, fontWeight:800, fontSize:16, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, display:'inline-flex', alignItems:'center', gap:10, transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=Y.dark2} onMouseLeave={e=>e.currentTarget.style.background=Y.dark}>
            Безплатна консултация
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="#d3-галерия" style={{ fontFamily:Y.fh, fontWeight:700, fontSize:15, color:Y.dark, letterSpacing:'0.05em', display:'flex', alignItems:'center', gap:6, textDecoration:'underline', textUnderlineOffset:4 }}>
            Вижте проекти
          </a>
        </div>
        <div style={{ display:'flex', gap: isMobile ? 24 : 40, marginTop:52, paddingTop:32, borderTop:`2px solid rgba(17,24,39,0.15)`, flexWrap:'wrap' }}>
          {[['350+','Обекта'],['12г.','Опит'],['100%','Доволни']].map(([n,l])=>(
            <div key={n}>
              <div style={{ fontFamily:Y.fh, fontSize: isMobile ? 36 : 44, fontWeight:900, color:Y.dark, lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:Y.fb, fontSize:12, color:'rgba(17,24,39,0.55)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* right - image card — overlaps into the next section on desktop */}
      {!isMobile && (
        <div style={{ padding:'40px 60px 0 20px', display:'flex', justifyContent:'center', alignItems:'flex-end', zIndex:10 }}>
          <div style={{ position:'relative', width:'100%', maxWidth:480, marginBottom:-140 }}>
            <div style={{ background:Y.white, borderRadius:24, overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.22)' }}>
              <img src={P.hero} alt="Майстор" style={{ width:'100%', height:520, objectFit:'cover', objectPosition:'top', display:'block' }} />
            </div>
            {/* badge */}
            <div style={{ position:'absolute', bottom:164, left:-24, background:Y.dark, color:'white', padding:'14px 20px', borderRadius:14, boxShadow:'0 8px 24px rgba(0,0,0,0.25)', zIndex:2 }}>
              <div style={{ fontFamily:Y.fh, fontSize:28, fontWeight:900, color:Y.yellow, lineHeight:1 }}>5★</div>
              <div style={{ fontFamily:Y.fb, fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>Средна оценка</div>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div style={{ padding:'0 20px 8px', display:'flex', justifyContent:'center', zIndex:1 }}>
          <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
            <div style={{ background:Y.white, borderRadius:20, overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.14)' }}>
              <img src={P.hero} alt="Майстор" style={{ width:'100%', height:240, objectFit:'cover', display:'block' }} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── ABOUT STRIP ───────────────────────────────────────────────────────────────
function AboutStrip() {
  const isMobile = useIsMobile();
  return (
    <section style={{ background:Y.white, padding: isMobile ? '60px 0' : '200px 0 80px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems:'center' }}>
        {/* image */}
        <div style={{ position:'relative' }}>
          <div style={{ background:Y.yellow, borderRadius:20, position:'absolute', top:20, left:20, right:-20, bottom:-20, zIndex:0 }} />
          <div style={{ position:'relative', zIndex:1, borderRadius:20, overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.12)' }}>
            <img src={P.worker2} alt="Работа" style={{ width:'100%', height: isMobile ? 280 : 420, objectFit:'cover', display:'block' }} />
          </div>
          <div style={{ position:'absolute', top:-10, right:-30, zIndex:2, background:Y.dark, color:Y.yellow, padding:'16px 20px', borderRadius:12, textAlign:'center' }}>
            <div style={{ fontFamily:Y.fh, fontSize:32, fontWeight:900, lineHeight:1 }}>12+</div>
            <div style={{ fontFamily:Y.fb, fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>години</div>
          </div>
        </div>
        {/* text */}
        <div style={{ marginTop: isMobile ? 20 : 0 }}>
          <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:20 }}>За нас</div>
          <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(34px,3.5vw,54px)', fontWeight:900, color:Y.dark, lineHeight:1, marginBottom:20 }}>
            ВАШИЯТ НАДЕЖДЕН<br/>ПАРТНЬОР ЗА РЕМОНТ
          </h2>
          <p style={{ fontFamily:Y.fb, fontSize:16, color:Y.gray, lineHeight:1.8, marginBottom:32 }}>
            Повече от 12 години TopFinish Build е синоним на прецизност, надеждност и безупречно качество. Всеки обект е нов стандарт за нас.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:36 }}>
            {[['wrench','Технически опит','Сертифицирани майстори с дългогодишен опит'],['zap','Аварийни ремонти','Бързо реагиране при спешни случаи'],['award','Гаранция','3 години гаранция за всеки завършен обект']].map(([ic,t,d])=>(
              <div key={t} style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:44, height:44, background:Y.yellow, borderRadius:50, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic3 name={ic} size={20} color={Y.dark} /></div>
                <div>
                  <div style={{ fontFamily:Y.fh, fontSize:16, fontWeight:800, color:Y.dark }}>{t}</div>
                  <div style={{ fontFamily:Y.fb, fontSize:13, color:Y.gray }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="#d3-контакти" style={{ background:Y.yellow, color:Y.dark, padding:'14px 32px', fontFamily:Y.fh, fontWeight:800, fontSize:15, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, display:'inline-block', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background=Y.yellowDk} onMouseLeave={e=>e.currentTarget.style.background=Y.yellow}>
            Поискайте оферта →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES ─────────────────────────────────────────────────────────────────
const SVCS3 = [
  { icon:'bath',   title:'Баня / WC',       desc:'Пълен ремонт — хидроизолация, облицовка, фаянс. Прецизна работа с гаранция.' },
  { icon:'layers', title:'Настилки',         desc:'Ламинат, паркет, теракот и мозайка с идеална нивелация.' },
  { icon:'brush',  title:'Боядисване',       desc:'Гладка шпакловка и боядисване. Перфектни повърхности без дефект.' },
  { icon:'wrench', title:'В/К инсталации',   desc:'Водопровод, канализация и отопление. Сертифицирани специалисти.' },
  { icon:'zap',    title:'Електро работи',   desc:'Окабеляване, табла, осветление и контакти с пълна документация.' },
  { icon:'grid',   title:'Гипсокартон',      desc:'Преградни стени, окачени тавани, декоративни ниши.' },
];

function SvcCard3({ icon, title, desc }: { icon:string; title:string; desc:string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background: h ? Y.yellow : Y.white, border:`2px solid ${h ? Y.yellow : Y.border}`, borderRadius:16, padding:'32px 28px', transition:'all 0.25s', cursor:'default', boxShadow: h ? '0 12px 40px rgba(255,208,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ width:52, height:52, background: h ? Y.dark : Y.yellow, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, transition:'all 0.25s' }}><Ic3 name={icon} size={24} color={h ? Y.yellow : Y.dark} /></div>
      <div style={{ fontFamily:Y.fh, fontSize:20, fontWeight:800, color:Y.dark, textTransform:'uppercase', letterSpacing:'0.02em', marginBottom:10 }}>{title}</div>
      <p style={{ fontFamily:Y.fb, fontSize:14, color: h ? 'rgba(17,24,39,0.7)' : Y.gray, lineHeight:1.7 }}>{desc}</p>
    </div>
  );
}

function Services3() {
  const isMobile = useIsMobile();
  return (
    <section id="d3-услуги" style={{ background:Y.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56, flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Услуги</div>
            <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1 }}>ВСИЧКО ЗА<br/>ВАШИЯ <span style={{ background:Y.yellow, padding:'0 6px' }}>РЕМОНТ</span></h2>
          </div>
          <a href="#d3-контакти" style={{ fontFamily:Y.fh, fontSize:14, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:Y.dark, borderBottom:`2px solid ${Y.yellow}`, paddingBottom:4 }}>Заявете оферта →</a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:20 }}>
          {SVCS3.map(s=><SvcCard3 key={s.title} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// ── STATS ────────────────────────────────────────────────────────────────────
function Stats3() {
  const isMobile = useIsMobile();
  return (
    <div style={{ background:Y.dark, padding:'52px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:32 }}>
        {[['350+','Завършени обекта'],['12','Години на пазара'],['48ч','Отговор на оферта'],['5★','Средна оценка']].map(([n,l])=>(
          <div key={n} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:Y.fh, fontSize:52, fontWeight:900, color:Y.yellow, lineHeight:1 }}>{n}</div>
            <div style={{ fontFamily:Y.fb, fontSize:13, color:'rgba(255,255,255,0.5)', letterSpacing:'0.08em', marginTop:6, textTransform:'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BEFORE/AFTER ─────────────────────────────────────────────────────────────
function BeforeAfter3() {
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
    <section id="d3-преди-след" style={{ background:Y.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Трансформация</div>
        <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1, marginBottom:8 }}>ПРЕДИ & <span style={{ background:Y.yellow, padding:'0 8px' }}>СЛЕД</span></h2>
        <p style={{ fontFamily:Y.fb, color:Y.gray, fontSize:15, letterSpacing:'0.05em', marginBottom:40 }}>Плъзнете за да видите разликата</p>
        <div ref={ref}
          style={{ position:'relative', overflow:'hidden', maxWidth:920, margin:'0 auto', aspectRatio:'16/9', cursor:'ew-resize', userSelect:'none', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}
          onMouseDown={e=>{drag.current=true;update(e.nativeEvent);}}
          onTouchStart={e=>{drag.current=true;update(e.nativeEvent);}}>
          <div style={{ position:'absolute', inset:0 }}>
            <img src={P.before} alt="Преди" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', top:16, left:16, background:Y.dark, color:'white', padding:'6px 18px', fontFamily:Y.fh, fontSize:13, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', borderRadius:50 }}>ПРЕДИ</div>
          </div>
          <div style={{ position:'absolute', inset:0, clipPath:`polygon(${pos}% 0,100% 0,100% 100%,${pos}% 100%)` }}>
            <img src={P.after} alt="След" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', top:16, right:16, background:Y.yellow, color:Y.dark, padding:'6px 18px', fontFamily:Y.fh, fontSize:13, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', borderRadius:50 }}>СЛЕД</div>
          </div>
          <div style={{ position:'absolute', top:0, bottom:0, left:`${pos}%`, width:3, background:Y.yellow, transform:'translateX(-50%)', pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:48, height:48, background:Y.dark, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke={Y.yellow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY ──────────────────────────────────────────────────────────────────
const GAL3_CATS = ['Всички','Бани','Кухни','Тераси','Спални','Хол'];
const GAL3 = [
  {cat:'Бани',   label:'Луксозна баня',           src:P.bath1},
  {cat:'Кухни',  label:'Модерна кухня',            src:P.kit1},
  {cat:'Тераси', label:'Тераса с настилка',        src:P.ter1},
  {cat:'Спални', label:'Спалня — гипсокартон',     src:P.bed1},
  {cat:'Хол',    label:'Хол — цялостен ремонт',    src:P.liv1},
  {cat:'Бани',   label:'Баня — микроцимент',       src:P.bath2},
  {cat:'Кухни',  label:'Кухня — окачен таван',     src:P.kit2},
  {cat:'Тераси', label:'Тераса — гранитогрес',     src:P.ter2},
  {cat:'Спални', label:'Спалня — боя',             src:P.bed2},
  {cat:'Хол',    label:'Хол — декоративна стена',  src:P.liv2},
  {cat:'Бани',   label:'Баня — черно-бяла',        src:P.bath3},
  {cat:'Кухни',  label:'Кухня — плочки',           src:P.kit3},
];

function GalItem3({ label, src }: { label:string; src:string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ aspectRatio:'4/3', overflow:'hidden', position:'relative', cursor:'pointer', borderRadius:16, boxShadow: h ? '0 12px 32px rgba(0,0,0,0.2)' : 'none', transition:'box-shadow 0.3s' }}>
      <div style={{ transform: h ? 'scale(1.06)' : 'scale(1)', transition:'transform 0.4s', height:'100%' }}>
        <img src={src} alt={label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      </div>
      <div style={{ position:'absolute', inset:0, background: h ? 'rgba(17,24,39,0.55)' : 'transparent', transition:'background 0.3s', display:'flex', alignItems:'flex-end', padding:16, borderRadius:16 }}>
        <div style={{ background:Y.yellow, color:Y.dark, padding:'6px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em', opacity: h?1:0, transform: h?'translateY(0)':'translateY(8px)', transition:'all 0.3s' }}>{label}</div>
      </div>
    </div>
  );
}

function Gallery3() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState('Всички');
  const items = tab==='Всички' ? GAL3 : GAL3.filter(i=>i.cat===tab);
  return (
    <section id="d3-галерия" style={{ background:Y.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Портфолио</div>
        <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1, marginBottom:36 }}>НАШИТЕ <span style={{ background:Y.yellow, padding:'0 8px' }}>ПРОЕКТИ</span></h2>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
          {GAL3_CATS.map(c=>(
            <button key={c} onClick={()=>setTab(c)} style={{ padding:'8px 22px', fontFamily:Y.fh, fontSize:14, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color: tab===c ? Y.dark : Y.gray, background: tab===c ? Y.yellow : Y.white, border:`2px solid ${tab===c ? Y.yellow : Y.border}`, borderRadius:50, cursor:'pointer', transition:'all 0.2s' }}>{c}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:16 }}>
          {items.map((it,i)=><GalItem3 key={`${tab}-${i}`} label={it.label} src={it.src} />)}
        </div>
      </div>
    </section>
  );
}

// ── PARTNERS ─────────────────────────────────────────────────────────────────
const PARTNERS3 = ['KNAUF','WEBER','ROCA','GROHE','BOSCH','MAPEI','SIKA','HILTI','BAUMIT','LITOKOL'];
function Partners3() {
  const doubled = [...PARTNERS3,...PARTNERS3];
  return (
    <section style={{ background:Y.white, padding:'48px 0', overflow:'hidden', borderTop:`1px solid ${Y.border}`, borderBottom:`1px solid ${Y.border}` }}>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontFamily:Y.fh, fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:Y.gray2 }}>Работим с водещи марки</div>
      </div>
      <div style={{ overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 30s linear infinite', width:'fit-content' }}>
          {doubled.map((p,i)=>(
            <div key={i} style={{ padding:'0 48px', fontFamily:Y.fh, fontSize:18, fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase', color:'#d1d5db', whiteSpace:'nowrap', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=Y.dark} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
const REVIEWS3 = [
  { name:'Иван Петров',    role:'Ремонт на баня — гр. София',  text:'Невероятен резултат! Екипът работи прецизно, чисто и стриктно в срок. Банята изглежда като от дизайнерско списание.', stars:5 },
  { name:'Мария Иванова',  role:'Цялостен ремонт — 85кв.',     text:'Цялостен ремонт на апартамента — всяко кътче изпипано с изключителна грижа. Шпакловката идеална, плочките перфектни.', stars:5 },
  { name:'Стефан Георгиев',role:'Ремонт на кухня и хол',       text:'Работил съм с много фирми, но TopFinish Build са на съвсем друго ниво. Готови бяха 3 дни преди крайния срок!', stars:5 },
];
function Testimonials3() {
  const isMobile = useIsMobile();
  return (
    <section id="d3-отзиви" style={{ background:Y.yellow, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ display:'inline-block', background:Y.dark, color:Y.yellow, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Отзиви</div>
          <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1 }}>ДОВОЛНИ <span style={{ background:Y.dark, color:Y.yellow, padding:'0 8px' }}>КЛИЕНТИ</span></h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:24 }}>
          {REVIEWS3.map((r,i)=>(
            <div key={i} style={{ background:Y.white, borderRadius:20, padding:'36px', boxShadow:'0 8px 30px rgba(0,0,0,0.08)' }}>
              <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                {Array.from({length:r.stars}).map((_,j)=><span key={j} style={{ color:Y.yellow, fontSize:18 }}>★</span>)}
              </div>
              <p style={{ fontFamily:Y.fb, fontSize:15, lineHeight:1.8, color:Y.gray, marginBottom:24, fontStyle:'italic' }}>"{r.text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, background:Y.yellow, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:Y.fh, fontSize:16, fontWeight:900, color:Y.dark }}>
                  {r.name.split(' ').map(w=>w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontFamily:Y.fh, fontSize:16, fontWeight:800, color:Y.dark, textTransform:'uppercase' }}>{r.name}</div>
                  <div style={{ fontFamily:Y.fb, fontSize:12, color:Y.gray }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CALENDAR ─────────────────────────────────────────────────────────────────
const BUSY3: Record<string,number[]> = {
  '2026-4':[1,2,3,7,8,9,14,15,21,22,28,29,30],
  '2026-5':[4,5,6,11,12,13,18,19,20,25,26,27],
  '2026-6':[1,2,8,9,15,16,22,23,29,30],
};
const MONTHS3 = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];
const DAYS3   = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

function Calendar3() {
  const isMobile = useIsMobile();
  const [cur, setCur] = useState(new Date(2026,3,1));
  const yr=cur.getFullYear(), mo=cur.getMonth()+1;
  const busy=BUSY3[`${yr}-${mo}`]||[];
  const firstDow=(new Date(yr,mo-1,1).getDay()+6)%7;
  const days=new Date(yr,mo,0).getDate();
  const today=new Date();
  const cells=[...Array(firstDow).fill(null),...Array.from({length:days},(_,i)=>i+1)];
  return (
    <section id="d3-график" style={{ background:Y.white, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>График</div>
        <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1, marginBottom:8 }}>ЗАЕТОСТ НА <span style={{ background:Y.yellow, padding:'0 8px' }}>ЕКИПА</span></h2>
        <p style={{ fontFamily:Y.fb, color:Y.gray, fontSize:14, letterSpacing:'0.05em', marginBottom:40, textTransform:'uppercase' }}>Вижте кога сме свободни и заявете своя проект</p>
        <div style={{ maxWidth:660, margin:'0 auto', background:Y.offwhite, border:`2px solid ${Y.border}`, borderRadius:20, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: isMobile ? '16px 16px' : '20px 28px', borderBottom:`1px solid ${Y.border}`, background:Y.yellow }}>
            <button onClick={()=>setCur(new Date(yr,mo-2,1))} style={{ width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(17,24,39,0.1)',border:'none',borderRadius:'50%',cursor:'pointer',color:Y.dark }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ fontFamily:Y.fh, fontSize: isMobile ? 16 : 20, fontWeight:900, letterSpacing:'0.06em', textTransform:'uppercase', color:Y.dark }}>{MONTHS3[mo-1]} {yr}</div>
            <button onClick={()=>setCur(new Date(yr,mo,1))} style={{ width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(17,24,39,0.1)',border:'none',borderRadius:'50%',cursor:'pointer',color:Y.dark }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:`1px solid ${Y.border}`, background:Y.white }}>
            {DAYS3.map(d=><div key={d} style={{ textAlign:'center', padding:'10px 0', fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.1em', color:Y.gray2, textTransform:'uppercase' }}>{d}</div>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'8px', background:Y.white }}>
            {cells.map((day,i)=>{
              if(!day) return <div key={`e${i}`}/>;
              const isBusy=busy.includes(day);
              const isToday=yr===today.getFullYear()&&mo-1===today.getMonth()&&day===today.getDate();
              return (
                <div key={day} style={{ textAlign:'center', padding:'9px 0', margin:2, fontSize:14, fontWeight:isBusy?700:400, color: isBusy ? Y.dark : isToday ? Y.dark : Y.gray, background: isBusy ? Y.yellow : isToday ? '#fef9c3' : 'transparent', borderRadius:8, position:'relative' }}>
                  {day}
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:24, padding: isMobile ? '14px 16px' : '14px 28px', borderTop:`1px solid ${Y.border}`, justifyContent:'center', background:Y.white }}>
            {[[Y.yellow,'Зает'],['#e5e7eb','Свободен']].map(([bg,label])=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:Y.fb, fontSize:12, color:Y.gray, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:bg, border:'1px solid #d1d5db' }}/>{label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop:32 }}>
          <a href="#d3-контакти" style={{ background:Y.yellow, color:Y.dark, padding:'14px 32px', fontFamily:Y.fh, fontWeight:800, fontSize:15, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, display:'inline-flex', alignItems:'center', gap:10 }}>
            Запитайте свободна дата →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── PRICING ──────────────────────────────────────────────────────────────────
function Pricing3() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'calculator'|'packages'>('calculator');
  const [selectedRoom, setSelectedRoom] = useState(CALC_ROOMS[0]);
  const [checked, setChecked] = useState<Record<string,boolean>>({});
  const [areas, setAreas] = useState<Record<string,string>>({});

  const toggleService = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    if (!areas[id]) setAreas(prev => ({ ...prev, [id]: '20' }));
  };

  const total = CALC_SERVICES.reduce((sum, svc) => {
    if (!checked[svc.id]) return sum;
    const qty = parseFloat(areas[svc.id] || '0') || 0;
    return sum + svc.price * qty;
  }, 0);

  const packages = [
    { name:'Освежаване', desc:'Боядисване + шпакловка на всички стаи', price:'от 2 500 лв', features:['Шпакловка и боядисване','Подготовка на повърхности','Почистване след работа','Гаранция 1 г.'] },
    { name:'Стандарт', desc:'Пълен ремонт без В/К и Електро', price:'от 8 000 лв', features:['Всичко от Освежаване','Настилки (ламинат/теракот)','Гипсокартон','Обков и интериорни врати','Гаранция 2 г.'], featured:true },
    { name:'Комплект', desc:'Цялостен ремонт до ключ', price:'от 18 000 лв', features:['Всичко от Стандарт','В/К инсталации','Електроинсталация','Проект и авторски надзор','Гаранция 3 г.'] },
  ];

  return (
    <section id="d3-цени" style={{ background:Y.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        {/* heading */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Цени</div>
          <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1 }}>
            ПРОЗРАЧНИ <span style={{ background:Y.yellow, padding:'0 8px' }}>ЦЕНИ</span>
          </h2>
          <p style={{ fontFamily:Y.fb, fontSize:16, color:Y.gray, marginTop:16, maxWidth:520, margin:'16px auto 0' }}>
            Изберете пакет или използвайте калкулатора, за да пресметнете приблизителната стойност на вашия ремонт.
          </p>
        </div>

        {/* tab switcher */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:48 }}>
          {([['calculator','Калкулатор'],['packages','Пакети']] as const).map(([id, label]) => (
            <button key={id} onClick={()=>setActiveTab(id)}
              style={{ padding:'11px 32px', fontFamily:Y.fh, fontSize:15, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', borderRadius:50, transition:'all 0.2s',
                background: activeTab===id ? Y.yellow : 'transparent',
                color: activeTab===id ? Y.dark : Y.gray,
                border: activeTab===id ? `2px solid ${Y.yellow}` : `2px solid ${Y.border}` }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── CALCULATOR TAB ── */}
        {activeTab === 'calculator' && (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap:32, alignItems:'start' }}>
            {/* left: room + services */}
            <div>
              {/* room selector */}
              <div style={{ background:Y.white, borderRadius:16, padding: isMobile ? '20px' : '28px', border:`2px solid ${Y.border}`, marginBottom:24 }}>
                <div style={{ fontFamily:Y.fh, fontSize:14, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:Y.dark, marginBottom:16 }}>Стая / Помещение</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {CALC_ROOMS.map(room => (
                    <button key={room} onClick={()=>setSelectedRoom(room)}
                      style={{ padding:'9px 20px', fontFamily:Y.fh, fontSize:14, fontWeight:700, letterSpacing:'0.06em', cursor:'pointer', borderRadius:50, transition:'all 0.2s',
                        background: selectedRoom===room ? Y.yellow : Y.white,
                        color: selectedRoom===room ? Y.dark : Y.gray,
                        border: selectedRoom===room ? `2px solid ${Y.yellow}` : `2px solid ${Y.border}` }}>
                      {room}
                    </button>
                  ))}
                </div>
              </div>

              {/* services grid */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:12 }}>
                {CALC_SERVICES.map(svc => {
                  const isChecked = !!checked[svc.id];
                  return (
                    <div key={svc.id}
                      onClick={()=>toggleService(svc.id)}
                      style={{ background:Y.white, borderRadius:14, padding:'20px', cursor:'pointer', transition:'all 0.2s',
                        border: isChecked ? `2px solid ${Y.yellow}` : `2px solid ${Y.border}`,
                        boxShadow: isChecked ? '0 4px 20px rgba(255,208,0,0.25)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isChecked ? 12 : 0 }}>
                        <div>
                          <div style={{ fontFamily:Y.fh, fontSize:16, fontWeight:800, color:Y.dark, textTransform:'uppercase', letterSpacing:'0.02em' }}>{svc.label}</div>
                          <div style={{ fontFamily:Y.fb, fontSize:13, color:Y.gray, marginTop:2 }}>{svc.price} {svc.unit}</div>
                        </div>
                        <div style={{ width:24, height:24, borderRadius:6, border:`2px solid ${isChecked ? Y.yellow : Y.border}`, background: isChecked ? Y.yellow : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
                          {isChecked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={Y.dark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      </div>
                      {isChecked && (
                        <div onClick={e=>e.stopPropagation()} style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <label style={{ fontFamily:Y.fb, fontSize:12, color:Y.gray, flexShrink:0 }}>Количество:</label>
                          <input type="number" min="1" value={areas[svc.id]||''}
                            onChange={e=>setAreas(prev=>({...prev,[svc.id]:e.target.value}))}
                            placeholder="м² / бр"
                            style={{ flex:1, padding:'7px 12px', border:`2px solid ${Y.border}`, borderRadius:8, fontFamily:Y.fb, fontSize:14, color:Y.dark, outline:'none', background:Y.offwhite }}
                            onFocus={e=>e.target.style.borderColor=Y.yellow}
                            onBlur={e=>e.target.style.borderColor=Y.border}/>
                          <span style={{ fontFamily:Y.fb, fontSize:12, color:Y.gray, flexShrink:0 }}>{svc.unit.replace('лв/','')}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* right: total card */}
            <div style={{ background:Y.dark, borderRadius:20, padding: isMobile ? '28px 24px' : '36px 32px', position:'sticky', top: 130 }}>
              <div style={{ fontFamily:Y.fh, fontSize:13, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', marginBottom:24 }}>Калкулация — {selectedRoom}</div>

              {/* line items */}
              <div style={{ marginBottom:24 }}>
                {CALC_SERVICES.filter(s=>checked[s.id]).length === 0 ? (
                  <div style={{ fontFamily:Y.fb, fontSize:14, color:'rgba(255,255,255,0.3)', fontStyle:'italic', textAlign:'center', padding:'20px 0' }}>
                    Изберете услуги от списъка
                  </div>
                ) : (
                  CALC_SERVICES.filter(s=>checked[s.id]).map(svc => {
                    const qty = parseFloat(areas[svc.id]||'0')||0;
                    const subtotal = svc.price * qty;
                    return (
                      <div key={svc.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:12, marginBottom:12, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                        <div>
                          <div style={{ fontFamily:Y.fh, fontSize:14, fontWeight:700, color:'white', textTransform:'uppercase', letterSpacing:'0.02em' }}>{svc.label}</div>
                          <div style={{ fontFamily:Y.fb, fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{qty} × {svc.price} {svc.unit}</div>
                        </div>
                        <div style={{ fontFamily:Y.fh, fontSize:16, fontWeight:800, color:Y.yellow }}>{subtotal.toLocaleString('bg-BG')} лв</div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* total */}
              <div style={{ borderTop:`2px solid ${Y.yellow}`, paddingTop:20, marginBottom:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <div style={{ fontFamily:Y.fh, fontSize:14, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)' }}>Ориентировъчно</div>
                  <div style={{ fontFamily:Y.fh, fontSize:38, fontWeight:900, color:Y.yellow, lineHeight:1 }}>{total.toLocaleString('bg-BG')} лв</div>
                </div>
                <div style={{ fontFamily:Y.fb, fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:8 }}>* Точна оферта след оглед на обекта</div>
              </div>

              <a href="#d3-контакти"
                style={{ display:'block', background:Y.yellow, color:Y.dark, padding:'15px 24px', fontFamily:Y.fh, fontWeight:800, fontSize:15, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, textAlign:'center', transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background=Y.yellowDk}
                onMouseLeave={e=>e.currentTarget.style.background=Y.yellow}>
                Поискайте точна оферта →
              </a>
            </div>
          </div>
        )}

        {/* ── PACKAGES TAB ── */}
        {activeTab === 'packages' && (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:24 }}>
            {packages.map((pkg) => (
              <div key={pkg.name}
                style={{ background: pkg.featured ? Y.dark : Y.white, borderRadius:20, padding:'36px 32px',
                  border: pkg.featured ? `2px solid ${Y.yellow}` : `2px solid ${Y.border}`,
                  boxShadow: pkg.featured ? '0 20px 60px rgba(17,24,39,0.25)' : '0 4px 16px rgba(0,0,0,0.06)',
                  position:'relative', display:'flex', flexDirection:'column' }}>
                {pkg.featured && (
                  <div style={{ position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', background:Y.yellow, color:Y.dark, padding:'5px 20px', borderRadius:50, fontFamily:Y.fh, fontSize:12, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                    Най-популярен
                  </div>
                )}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:Y.fh, fontSize:24, fontWeight:900, color: pkg.featured ? Y.yellow : Y.dark, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>{pkg.name}</div>
                  <div style={{ fontFamily:Y.fb, fontSize:14, color: pkg.featured ? 'rgba(255,255,255,0.5)' : Y.gray, lineHeight:1.5 }}>{pkg.desc}</div>
                </div>
                <div style={{ fontFamily:Y.fh, fontSize:32, fontWeight:900, color: pkg.featured ? Y.yellow : Y.dark, marginBottom:28 }}>{pkg.price}</div>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 32px', flex:1 }}>
                  {pkg.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background: pkg.featured ? Y.yellow : Y.yellow, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={Y.dark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontFamily:Y.fb, fontSize:14, color: pkg.featured ? 'rgba(255,255,255,0.8)' : Y.gray }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#d3-контакти"
                  style={{ display:'block', background: pkg.featured ? Y.yellow : Y.dark, color: pkg.featured ? Y.dark : Y.yellow, padding:'14px 24px', fontFamily:Y.fh, fontWeight:800, fontSize:15, letterSpacing:'0.08em', textTransform:'uppercase', borderRadius:50, textAlign:'center', transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=pkg.featured?Y.yellowDk:Y.dark2;}}
                  onMouseLeave={e=>{e.currentTarget.style.background=pkg.featured?Y.yellow:Y.dark;}}>
                  Заявете →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── CONTACT ──────────────────────────────────────────────────────────────────
function Contact3() {
  const isMobile = useIsMobile();
  const [f, setF] = useState({name:'',phone:'',email:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setF(p=>({...p,[k]:e.target.value}));
  const submit=(e:React.FormEvent)=>{e.preventDefault();setSent(true);setTimeout(()=>setSent(false),5000);setF({name:'',phone:'',email:'',service:'',message:''});};
  const inp:React.CSSProperties={width:'100%',padding:'13px 16px',border:`2px solid ${Y.border}`,background:Y.white,fontFamily:Y.fb,fontSize:15,color:Y.dark,outline:'none',borderRadius:10,boxSizing:'border-box'};
  return (
    <section id="d3-контакти" style={{ background:Y.offwhite, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems:'start' }}>
          <div>
            <div style={{ display:'inline-block', background:Y.yellow, color:Y.dark, padding:'4px 14px', borderRadius:50, fontFamily:Y.fh, fontSize:11, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>Контакт</div>
            <h2 style={{ fontFamily:Y.fh, fontSize:'clamp(36px,4vw,60px)', fontWeight:900, color:Y.dark, lineHeight:1, marginBottom:20 }}>ГОТОВИ ДА <span style={{ background:Y.yellow, padding:'0 8px' }}>ПОМОГНЕМ</span></h2>
            <p style={{ fontFamily:Y.fb, fontSize:16, color:Y.gray, lineHeight:1.8, marginBottom:36 }}>Свържете се за безплатна консултация и точна оферта. Отговаряме в рамките на 24 часа.</p>
            {[{icon:'phone',label:'Телефон',val:'+359 88 123 4567'},{icon:'mail',label:'Имейл',val:'info@topfinishbuild.bg'},{icon:'pin',label:'Адрес',val:'гр. София, ул. Строителна 12'}].map(({icon,label,val})=>(
              <div key={label} style={{ display:'flex', gap:16, alignItems:'center', marginBottom:20 }}>
                <div style={{ width:44, height:44, background:Y.yellow, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic3 name={icon} size={20} color={Y.dark} /></div>
                <div>
                  <div style={{ fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:Y.gray2, marginBottom:2 }}>{label}</div>
                  <div style={{ fontFamily:Y.fb, fontSize:15, color:Y.dark, fontWeight:500 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:Y.white, borderRadius:20, padding: isMobile ? 24 : 40, boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ width:64, height:64, background:Y.yellow, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:28 }}>✓</div>
                <div style={{ fontFamily:Y.fh, fontSize:26, fontWeight:900, color:Y.dark, textTransform:'uppercase' }}>Изпратено!</div>
                <p style={{ fontFamily:Y.fb, color:Y.gray, marginTop:8 }}>Ще се свържем в рамките на 24 часа.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                {[{k:'name',l:'Вашето Име *',ph:'Иван Иванов',req:true},{k:'phone',l:'Телефон *',ph:'+359 88...',req:true},{k:'email',l:'Имейл',ph:'email@example.com',req:false}].map(({k,l,ph,req})=>(
                  <div key={k} style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:Y.dark, marginBottom:8 }}>{l}</label>
                    <input required={req} value={f[k as keyof typeof f]} onChange={set(k)} style={inp} placeholder={ph}
                      onFocus={e=>e.target.style.borderColor=Y.yellow} onBlur={e=>e.target.style.borderColor=Y.border}/>
                  </div>
                ))}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:Y.dark, marginBottom:8 }}>Вид услуга</label>
                  <select value={f.service} onChange={set('service')} style={{ ...inp, appearance:'none' }}>
                    <option value="">— Изберете —</option>
                    {['Баня / WC','Настилки','Боядисване','В/К инсталации','Електро','Гипсокартон','Цялостен ремонт'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'block', fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:Y.dark, marginBottom:8 }}>Съобщение *</label>
                  <textarea required value={f.message} onChange={set('message')} style={{ ...inp, minHeight:110, resize:'vertical' }} placeholder="Опишете проекта..."
                    onFocus={e=>e.target.style.borderColor=Y.yellow} onBlur={e=>e.target.style.borderColor=Y.border}/>
                </div>
                <button type="submit" style={{ background:Y.yellow, color:Y.dark, padding:'15px 36px', fontFamily:Y.fh, fontWeight:800, fontSize:16, letterSpacing:'0.08em', textTransform:'uppercase', border:'none', cursor:'pointer', borderRadius:50, width:'100%', transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background=Y.yellowDk} onMouseLeave={e=>e.currentTarget.style.background=Y.yellow}>
                  Изпрати запитване →
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
function Footer3() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background:Y.dark, color:'white', padding:'60px 0 28px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: isMobile ? 36 : 60, marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:Y.fh, fontSize:22, fontWeight:900, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:12 }}>
              TOP<span style={{ color:Y.yellow }}>FINISH</span> BUILD
            </div>
            <p style={{ fontFamily:Y.fb, fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.8, maxWidth:300 }}>
              Специализирани довършителни дейности с 12 години опит. Перфекционизъм и прецизност — гарантирано.
            </p>
          </div>
          <div>
            <div style={{ fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:18 }}>Навигация</div>
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {['Услуги','Галерия','Отзиви','График','Цени','Контакти'].map(l=>(
                <li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontFamily:Y.fb, fontSize:14, color:'rgba(255,255,255,0.45)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily:Y.fh, fontSize:12, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:18 }}>Услуги</div>
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {['Баня / WC','Настилки','Боядисване','В/К инсталации','Електро','Гипсокартон'].map(l=>(
                <li key={l} style={{ marginBottom:10 }}><a href="#" style={{ fontFamily:Y.fb, fontSize:14, color:'rgba(255,255,255,0.45)', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='white'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontFamily:Y.fb, fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2026 TopFinish Build. Всички права запазени.</div>
          <div style={{ fontFamily:Y.fh, fontSize:11, color:Y.yellow, letterSpacing:'0.2em', textTransform:'uppercase', opacity:0.6 }}>Перфекционизъм във всеки детайл</div>
        </div>
      </div>
    </footer>
  );
}

if (!document.getElementById('d3-marquee-style')) {
  const s = document.createElement('style');
  s.id = 'd3-marquee-style';
  s.textContent = '@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(s);
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function Design3() {
  return (
    <div style={{ paddingTop:44 }}>
      <Nav3 />
      <Hero3 />
      <AboutStrip />
      <Services3 />
      <Stats3 />
      <BeforeAfter3 />
      <Gallery3 />
      <Partners3 />
      <Testimonials3 />
      <Calendar3 />
      <Pricing3 />
      <Contact3 />
      <Footer3 />
    </div>
  );
}
