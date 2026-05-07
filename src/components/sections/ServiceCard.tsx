import { useState } from 'react';

interface ServiceCardProps { icon: string; title: string; desc: string; noHover?: boolean; }

const ICONS: Record<string,string> = {
  bath:   '<path d="M2 11h20v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8v-3z"/><path d="M7 11V5a2 2 0 0 1 4 0v1"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/>',
  brush:  '<path d="M15.5 2.1L3.2 14.4 2 22l7.6-1.2 12.3-12.3a3.1 3.1 0 0 0 0-4.4 3.1 3.1 0 0 0-4.6-0.4z"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  zap:    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  grid:   '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
};

const NAVY   = '#0f1f3d';
const ORANGE = '#f07420';
const GRAY   = '#6b7280';
const BORDER = '#e5e7eb';

export default function ServiceCard({ icon, title, desc, noHover }: ServiceCardProps) {
  const [h, setH] = useState(false);
  const active = h && !noHover;
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: active ? NAVY : '#fff',
        border: `2px solid ${active ? NAVY : BORDER}`,
        borderRadius: 16,
        padding: '32px 28px',
        transition: 'all 0.25s',
        cursor: 'default',
        boxShadow: active ? '0 12px 40px rgba(15,31,61,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        width: 52, height: 52,
        background: ORANGE,
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        transition: 'all 0.25s',
      }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
          stroke="#fff"
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: ICONS[icon] ?? '' }}
        />
      </div>
      <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:18, fontWeight:700, color: active ? '#fff' : NAVY, textTransform:'uppercase', letterSpacing:'0.02em', marginBottom:10 }}>{title}</div>
      <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:17, color: active ? 'rgba(255,255,255,0.75)' : GRAY, lineHeight:1.7 }}>{desc}</p>
    </div>
  );
}
