import { useState } from 'react';
import { busyDates, MONTH_NAMES, DAY_NAMES } from '../../data';

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

interface Props { theme?: 'dark' | 'light'; fillHeight?: boolean; }

export default function BusyCalendar({ theme = 'dark', fillHeight = false }: Props) {
  const [cal, setCal] = useState({ year: 2025, month: 4 });
  const { year, month } = cal;
  const totalDays = daysInMonth(year, month);
  const startDay  = firstWeekday(year, month);
  const dateKey   = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const shift = (dir: 1 | -1) => setCal(({ year: y, month: m }) => {
    const nm = m + dir;
    if (nm < 0)  return { year: y - 1, month: 11 };
    if (nm > 11) return { year: y + 1, month: 0 };
    return { year: y, month: nm };
  });

  const dk = theme === 'dark';

  // Colors
  const cellBg    = (busy: boolean) => busy
    ? (dk ? 'rgba(240,116,32,0.22)' : '#fff7ed')
    : (dk ? 'rgba(255,255,255,0.12)' : '#f9fafb');
  const cellBorder= (busy: boolean) => busy
    ? (dk ? 'rgba(240,116,32,0.6)' : '#fed7aa')
    : (dk ? 'rgba(255,255,255,0.15)' : '#e5e7eb');
  const numColor  = (busy: boolean) => busy
    ? (dk ? '#ffb366' : '#ea580c')
    : (dk ? 'rgba(255,255,255,0.85)' : '#9ca3af');
  const dotColor  = (busy: boolean) => busy
    ? (dk ? '#f07420' : '#f97316')
    : (dk ? 'rgba(255,255,255,0.25)' : '#e5e7eb');

  const navBtn: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer',
    background: dk ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
    color: dk ? '#fff' : '#111827',
    fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={fillHeight ? { display:'flex', flexDirection:'column', flex:1, height:'100%' } : {}}>

      {/* Month nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <button aria-label="Предишен месец" onClick={() => shift(-1)} style={navBtn}>‹</button>
        <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:18, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.03em', color: dk ? '#fff' : '#0f1f3d' }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button aria-label="Следващ месец" onClick={() => shift(1)} style={navBtn}>›</button>
      </div>

      {/* Day names */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:6 }}>
        {DAY_NAMES.map((d: string) => (
          <div key={d} style={{ textAlign:'center', fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600, letterSpacing:'0.06em', color: dk ? 'rgba(255,255,255,0.55)' : '#9ca3af', padding:'4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Grid — flex:1 when fillHeight so it expands to fill available space */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gridAutoRows: fillHeight ? '1fr' : 'auto',
        gap: 4,
        ...(fillHeight ? { flex: 1 } : {}),
      }}>
        {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day  = i + 1;
          const busy = busyDates.has(dateKey(day));
          return (
            <div key={day} style={{
              borderRadius: 10,
              padding: '6px 2px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${cellBorder(busy)}`,
              background: cellBg(busy),
              minHeight: fillHeight ? undefined : '3rem',
            }}>
              <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:16, fontWeight:700, color:numColor(busy), lineHeight:1 }}>{day}</span>
              {/* dot like Design 1 */}
              <span style={{ width:5, height:5, borderRadius:'50%', marginTop:4, background:dotColor(busy), display:'block', flexShrink:0 }} />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:24, marginTop:16, paddingTop:14, borderTop:`1px solid ${dk ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}>
        {([['Зает ден', true], ['Свободен ден', false]] as const).map(([label, busy]) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Manrope',sans-serif", fontSize:13, color: dk ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            <span style={{ width:14, height:14, borderRadius:3, display:'inline-block', background:dotColor(busy), border:`1.5px solid ${busy ? (dk ? '#f07420' : '#f97316') : (dk ? 'rgba(255,255,255,0.2)' : '#d1d5db')}` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
