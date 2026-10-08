import { useEffect, useRef, useState } from 'react';

/** True while the element is near the viewport; used to pause offscreen canvases. */
export const useInView = <T extends HTMLElement>(margin = '120px') => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(node);
    return () => io.disconnect();
  }, [margin]);

  return [ref, inView] as const;
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
