import { useRef } from 'react';

export function useSwipe(onLeft: () => void, onRight: () => void, threshold = 40) {
  const startX = useRef(0);
  return {
    onTouchStart: (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; },
    onTouchEnd:   (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(dx) > threshold) dx < 0 ? onLeft() : onRight();
    },
  };
}
