import Hero from "./Hero";

import { useIsMobile } from '../hooks/useIsMobile';

const stats = [['350+', 'Обекта'], ['12г.', 'Опит'], ['3г.', 'Гаранция'], ['5★', 'Рейтинг']];

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

export default function Design6() {
  const isMobile = useIsMobile();


    return(
        <>
        <Hero />
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
        <StatsBar5 />
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
        
      </>
    )

}