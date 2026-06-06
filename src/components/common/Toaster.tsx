import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ToastType } from '../../utils/toast';

interface ToastItem { id: number; msg: string; type: ToastType; }

const ICONS: Record<ToastType, string> = {
    success: '✓',
    error:   '✕',
    info:    'i',
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: '#051810', border: 'rgba(34,197,94,0.35)',  text: '#86efac', icon: 'rgba(34,197,94,0.2)'  },
    error:   { bg: '#180505', border: 'rgba(239,68,68,0.35)',  text: '#fca5a5', icon: 'rgba(239,68,68,0.2)'  },
    info:    { bg: '#050d18', border: 'rgba(96,165,250,0.35)', text: '#93c5fd', icon: 'rgba(96,165,250,0.2)' },
};

export function Toaster() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const { msg, type = 'success' } = (e as CustomEvent<{ msg: string; type: ToastType }>).detail;
            const id = Date.now() + Math.random();
            setToasts(prev => [...prev, { id, msg, type }]);
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
        };
        window.addEventListener('app:toast', handler);
        return () => window.removeEventListener('app:toast', handler);
    }, []);

    if (toasts.length === 0) return null;

    return createPortal(
        <div style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 99999,
            display: 'flex', flexDirection: 'column-reverse', gap: 10,
            pointerEvents: 'none',
        }}>
            {toasts.map(t => {
                const c = COLORS[t.type];
                return (
                    <div key={t.id} className="app-toast" style={{
                        background: c.bg,
                        border: `1.5px solid ${c.border}`,
                        borderRadius: 12,
                        padding: '13px 18px',
                        color: c.text,
                        fontSize: 14,
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 11,
                        minWidth: 260,
                        maxWidth: 380,
                        lineHeight: 1.4,
                    }}>
                        <span style={{
                            flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                            background: c.icon,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700,
                        }}>
                            {ICONS[t.type]}
                        </span>
                        {t.msg}
                    </div>
                );
            })}
        </div>,
        document.body
    );
}
