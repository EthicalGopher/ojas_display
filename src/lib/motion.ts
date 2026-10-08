import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP);

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP };

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls to an in-page anchor through the smoother when there is one, natively otherwise. */
export const scrollToHash = (hash: string) => {
  const target = hash && hash !== '#' ? document.querySelector(hash) : null;
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(target ?? 0, true, 'top top');
  else (target ?? document.body).scrollIntoView({ behavior: 'smooth' });
};
