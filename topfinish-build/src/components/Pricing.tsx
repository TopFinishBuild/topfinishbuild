import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const SERVICES = [
  { id: 'paint',    label: 'Боядисване',        price: 12,  unit: 'лв/м²' },
  { id: 'plaster',  label: 'Шпакловка',          price: 15,  unit: 'лв/м²' },
  { id: 'tiles',    label: 'Теракот / облицовка', price: 35,  unit: 'лв/м²' },
  { id: 'laminate', label: 'Ламинат / паркет',    price: 22,  unit: 'лв/м²' },
  { id: 'gyp',      label: 'Гипсокартон',         price: 28,  unit: 'лв/м²' },
  { id: 'plumb',    label: 'ВиК инсталации',      price: 850, unit: 'лв/баня' },
  { id: 'elec',     label: 'Електро',             price: 600, unit: 'лв/стая' },
];

const ROOMS = ['Хол','Спалня','Кухня','Баня','Коридор'];

function Calculator() {
  const [sel, setSel]   = useState<Record<string,boolean>>({});
  const [sqm, setSqm]   = useState<Record<string,string>>({});
  const [qty, setQty]   = useState<Record<string,string>>({});
  const isMobile = useIsMobile();

  const toggle = (id: string) => setSel(p => ({ ...p, [id]: !p[id] }));

  const total = SERVICES.reduce((acc, s) => {
    if (!sel[s.id]) return acc;
    if (s.id === 'plumb' || s.id === 'elec') {
      return acc + s.price * (parseInt(qty[s.id] || '1') || 1);
    }
    const area = ROOMS.reduce((a, r) => a + (parseFloat(sqm[`${s.id}-${r}`] || '0') || 0), 0);
    return acc + s.price * area;
  }, 0);

  const h2: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, textTransform:'uppercase', letterSpacing:'0.03em', color:'#1e3266' };
  const lbl: React.CSSProperties = { fontSize:13, color:'#4a5568', fontFamily:"'Barlow',sans-serif" };
  const inp: React.CSSProperties = { width:72, padding:'6px 8px', border:'1px solid #e2e8f0', borderRadius:6, fontSize:13, textAlign:'center', fontFamily:"'Barlow',sans-serif", color:'#1e3266', outline:'none' };

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      <p style={{ ...lbl, marginBottom:28, fontSize:14, color:'#6b7280' }}>
        Изберете услуги и въведете квадратури — ще получите ориентировъчна цена веднага.
      </p>

      {SERVICES.map(s => (
        <div key={s.id} style={{ background: sel[s.id]?'#fff8f3':'#fafafa', border:`1px solid ${sel[s.id]?'#f97316':'#e2e8f0'}`, borderRadius:10, padding:'18px 22px', marginBottom:10, transition:'all 0.2s' }}>
          <label style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
            <input type="checkbox" checked={!!sel[s.id]} onChange={() => toggle(s.id)}
              style={{ width:18, height:18, accentColor:'#f97316', cursor:'pointer' }} />
            <span style={{ ...h2, fontSize:17 }}>{s.label}</span>
            <span style={{ marginLeft:'auto', fontSize:13, color:'#f97316', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>
              {s.price} {s.unit}
            </span>
          </label>

          {sel[s.id] && (
            <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #f1f5f9' }}>
              {(s.id === 'plumb' || s.id === 'elec') ? (
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={lbl}>Брой {s.id==='plumb'?'бани':'стаи'}:</span>
                  <input type="number" min="1" max="20" value={qty[s.id]||'1'} onChange={e=>setQty(p=>({...p,[s.id]:e.target.value}))} style={inp} />
                </div>
              ) : (
                <div>
                  <div style={{ ...lbl, marginBottom:10, fontSize:12, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' }}>Квадратура по стаи (м²)</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                    {ROOMS.map(r => (
                      <div key={r} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                        <span style={{ ...lbl, fontSize:12 }}>{r}</span>
                        <input type="number" min="0" placeholder="0" value={sqm[`${s.id}-${r}`]||''} onChange={e=>setSqm(p=>({...p,[`${s.id}-${r}`]:e.target.value}))} style={inp} />
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
      <div style={{ marginTop:28, padding: isMobile ? '20px' : '28px 32px', background:'linear-gradient(135deg,#1e3266,#1d4ed8)', borderRadius:12, display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 16 : 0 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)' }}>Ориентировъчна стойност</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:44, fontWeight:900, color:'white', lineHeight:1.1, marginTop:4 }}>
            {total.toLocaleString('bg-BG')} <span style={{ fontSize:24 }}>лв.</span>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6 }}>* Без включен ДДС. Точна оферта след оглед.</div>
        </div>
        <a href="#contact" style={{ background:'#f97316', color:'white', padding:'14px 28px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:8, whiteSpace:'nowrap' }}>
          Искам оферта →
        </a>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [tab, setTab] = useState<'soon'|'calc'>('soon');
  const isMobile = useIsMobile();
  const active: React.CSSProperties = { background:'#f97316', color:'white', borderColor:'#f97316' };
  const base: React.CSSProperties = { padding:'10px 28px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', border:'1px solid #e2e8f0', cursor:'pointer', transition:'all 0.2s', borderRadius:6 };

  return (
    <section id="prices" style={{ background:'#f8fafc', padding: isMobile ? '60px 0' : '80px 0' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding: isMobile ? '0 20px' : '0 48px' }}>
        <div style={{ marginBottom:40 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'#f97316', marginBottom:10 }}>Цени</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(36px,4vw,60px)', fontWeight:900, textTransform:'uppercase', color:'#1e3266', lineHeight:1 }}>
            ЦЕНООБРАЗУВАНЕ
          </h2>
          <div style={{ display:'flex', gap:8, marginTop:28 }}>
            <button onClick={()=>setTab('soon')} style={{ ...base, ...(tab==='soon'?active:{color:'#4a5568'}) }}>Информация</button>
            <button onClick={()=>setTab('calc')} style={{ ...base, ...(tab==='calc'?active:{color:'#4a5568'}) }}>Калкулатор</button>
          </div>
        </div>

        {tab === 'soon' ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:64 }}>🔨</div>
            <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#1e3266', textTransform:'uppercase', marginTop:20, marginBottom:12 }}>
              Очаквайте скоро
            </h3>
            <p style={{ fontSize:16, color:'#6b7280', maxWidth:480, margin:'0 auto', lineHeight:1.75 }}>
              Подробна информация за нашето ценообразуване — пълни ценови листи, пакети и промоции. Засега използвайте калкулатора за ориентировъчна оценка.
            </p>
            <button onClick={()=>setTab('calc')} style={{ marginTop:28, background:'#f97316', color:'white', border:'none', padding:'14px 32px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:8, cursor:'pointer' }}>
              Към Калкулатора →
            </button>
          </div>
        ) : (
          <Calculator />
        )}
      </div>
    </section>
  );
}
