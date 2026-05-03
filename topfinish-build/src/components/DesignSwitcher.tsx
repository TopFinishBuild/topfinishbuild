interface Props {
  active: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onChange: (d: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
}

export default function DesignSwitcher({ active, onChange }: Props) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 44, background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
        letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        marginRight: 8,
      }}>
        ДИЗАЙН
      </span>
      {([1, 2, 3, 4, 5, 6, 7] as const).map(d => (
        <button
          key={d}
          onClick={() => { onChange(d); window.scrollTo(0, 0); }}
          style={{
            padding: '5px 20px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: active === d ? '#fff' : 'rgba(255,255,255,0.38)',
            background: active === d ? '#f07420' : 'transparent',
            border: `1px solid ${active === d ? '#f07420' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          Дизайн {d}
        </button>
      ))}
    </div>
  );
}
