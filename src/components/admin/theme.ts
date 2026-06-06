import type { CSSProperties } from 'react';

export const FH     = "'Manrope', sans-serif";
export const NAVY   = '#0f1f3d';
export const ORANGE = '#f07420';

export const inp: CSSProperties = {
    width: '100%', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    padding: '9px 12px', color: NAVY,
    fontSize: 14, fontFamily: FH,
    boxSizing: 'border-box', outline: 'none',
};

export const lbl: CSSProperties = {
    display: 'block', color: '#475569',
    fontSize: 12, fontWeight: 600,
    fontFamily: FH, marginBottom: 4,
};

export const card: CSSProperties = {
    background: '#fff', borderRadius: 12, padding: 24,
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(15,31,61,0.06)',
    marginBottom: 24,
};

export const sectionTitle: CSSProperties = {
    color: NAVY, fontSize: 16, fontWeight: 700,
    fontFamily: FH, margin: '0 0 16px',
};

export const muted: CSSProperties = {
    color: '#94a3b8', fontSize: 13, fontFamily: FH,
};

export const successBox: CSSProperties = {
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 8, padding: '10px 16px',
    color: '#15803d', fontSize: 13, fontFamily: FH,
    marginBottom: 16,
};

export const errorBox: CSSProperties = {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 8, padding: '10px 16px',
    color: '#dc2626', fontSize: 13, fontFamily: FH,
    marginBottom: 16,
};

export const primaryBtn = (disabled = false): CSSProperties => ({
    background: disabled ? '#fdba74' : ORANGE,
    color: '#fff', border: 'none', borderRadius: 8,
    padding: '10px 24px', fontSize: 14, fontWeight: 700,
    fontFamily: FH, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1, transition: 'background 0.2s',
});

export const ghostBtn = (disabled = false): CSSProperties => ({
    background: 'transparent',
    color: disabled ? '#cbd5e1' : '#475569',
    border: `1.5px solid ${disabled ? '#e2e8f0' : '#cbd5e1'}`,
    borderRadius: 8, padding: '9px 20px',
    fontSize: 13, fontWeight: 600, fontFamily: FH,
    cursor: disabled ? 'not-allowed' : 'pointer',
});

export const dangerBtn: CSSProperties = {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 6, padding: '6px 12px',
    color: '#dc2626', fontSize: 12, fontWeight: 600,
    fontFamily: FH, cursor: 'pointer',
};
