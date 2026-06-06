import { useState, useRef, useEffect } from 'react';

interface Props {
    beforeUrl: string;
    afterUrl: string;
}

export default function BeforeAfterSlider({ beforeUrl, afterUrl }: Props) {
    const [sliderPos, setSliderPos] = useState(50);
    const [dragging, setDragging]   = useState(false);
    const wrapRef     = useRef<HTMLDivElement>(null);
    const touchStart  = useRef<{ x: number; y: number } | null>(null);
    const touchLocked = useRef<'h' | 'v' | null>(null);

    const calcPos = (clientX: number) => {
        if (!wrapRef.current) return;
        const r = wrapRef.current.getBoundingClientRect();
        setSliderPos(Math.min(100, Math.max(0, (clientX - r.left) / r.width * 100)));
    };

    useEffect(() => {
        if (!dragging) return;
        const onMove = (e: MouseEvent) => calcPos(e.clientX);
        const onUp   = () => setDragging(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup',   onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup',   onUp);
        };
    }, [dragging]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const onStart = (e: TouchEvent) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            touchLocked.current = null;
        };

        const onMove = (e: TouchEvent) => {
            if (!touchStart.current) return;
            const dx = Math.abs(e.touches[0].clientX - touchStart.current.x);
            const dy = Math.abs(e.touches[0].clientY - touchStart.current.y);
            if (!touchLocked.current) touchLocked.current = dx > dy ? 'h' : 'v';
            if (touchLocked.current === 'h') {
                e.preventDefault();
                calcPos(e.touches[0].clientX);
            }
        };

        const onEnd = () => { touchStart.current = null; touchLocked.current = null; };

        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove',  onMove,  { passive: false });
        el.addEventListener('touchend',   onEnd,   { passive: true });
        return () => {
            el.removeEventListener('touchstart', onStart);
            el.removeEventListener('touchmove',  onMove);
            el.removeEventListener('touchend',   onEnd);
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            className="before-after__slider"
            onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
        >
            <img src={afterUrl} alt="След ремонт" loading="lazy" decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={beforeUrl} alt="Преди ремонт" loading="lazy" decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${sliderPos}%`,
                width: 3, background: 'white',
                transform: 'translateX(-50%)',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 44, height: 44,
                    background: 'white', borderRadius: '50%',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width="20" height="16" viewBox="0 0 22 18" fill="none"
                        stroke="#f07420" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8 15 3 9 8 3"/><polyline points="14 15 19 9 14 3"/>
                    </svg>
                </div>
            </div>

            <span className="before-after__label before-after__label--before">ПРЕДИ</span>
            <span className="before-after__label before-after__label--after">СЛЕД</span>
        </div>
    );
}
