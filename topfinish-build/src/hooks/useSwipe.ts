import { useEffect, useRef, useCallback } from 'react';

export function useSwipe(onLeft: () => void, onRight: () => void, threshold = 40) {
  const elRef    = useRef<HTMLDivElement | null>(null);
  const start    = useRef<{ x: number; y: number } | null>(null);
  const locked   = useRef<'h' | 'v' | null>(null);
  const onLeftR  = useRef(onLeft);
  const onRightR = useRef(onRight);
  onLeftR.current  = onLeft;
  onRightR.current = onRight;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      start.current  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      locked.current = null;
    };
    const onMove = (e: TouchEvent) => {
      if (!start.current) return;
      const dx = Math.abs(e.touches[0].clientX - start.current.x);
      const dy = Math.abs(e.touches[0].clientY - start.current.y);
      if (!locked.current) locked.current = dx > dy ? 'h' : 'v';
      if (locked.current === 'h') e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      if (!start.current || locked.current !== 'h') { start.current = null; locked.current = null; return; }
      const dx = e.changedTouches[0].clientX - start.current.x;
      if (Math.abs(dx) > threshold) dx < 0 ? onLeftR.current() : onRightR.current();
      start.current = null;
      locked.current = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    el.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
    };
  }, [threshold]);

  const setRef = useCallback((node: HTMLDivElement | null) => { elRef.current = node; }, []);
  return { ref: setRef };
}
