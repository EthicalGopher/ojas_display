import { useRef, useState } from 'react';
import { gsap, reducedMotion, useGSAP } from '../lib/motion';
import { appScreens, tunnelLeft, tunnelRight } from '../data';

const STEP = 360 / 20; // degrees between words on the drum

/** Words wrapped on a turning drum, spun by scroll, around a swapping app screen. */
export const WordTunnel = () => {
  const section = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState(0);

  useGSAP(
    () => {
      const pick = (p: number) => setScreen(Math.min(appScreens.length - 1, Math.floor(p * appScreens.length)));
      if (reducedMotion()) return;
      // pinned while both drums turn in opposite directions and the screen swaps
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 1.2,
            onUpdate: (self) => pick(self.progress),
          },
        })
        .fromTo('.drum-l', { rotationX: 0 }, { rotationX: 260, ease: 'none' }, 0)
        .fromTo('.drum-r', { rotationX: 9 }, { rotationX: -251, ease: 'none' }, 0)
        .fromTo('.tunnel-card', { scale: 0.86, rotationY: -12 }, { scale: 1, rotationY: 12, ease: 'none' }, 0);
    },
    { scope: section },
  );

  const drum = (words: string[], side: 'l' | 'r') => (
    <div className={`drum drum-${side}`}>
      {words.map((w, i) => (
        <span key={w} style={{ transform: `rotateX(${-i * STEP}deg) translateZ(var(--radius))` }}>
          {w}
        </span>
      ))}
    </div>
  );

  return (
    <section className="tunnel" ref={section} aria-label="What Ojas tracks">
      <div className="tunnel-sticky">
        <span className="tunnel-label tl">( Track )</span>
        <span className="tunnel-label tr">( Compete )</span>
        {drum(tunnelLeft, 'l')}
        <figure className="tunnel-card">
          {appScreens.map((s, i) => (
            <img key={s.id} src={s.src} alt={s.title} className={i === screen ? 'on' : ''} loading="lazy" />
          ))}
          <figcaption>
            <b>{appScreens[screen].title}</b>
            <span>
              {String(screen + 1).padStart(2, '0')} / {String(appScreens.length).padStart(2, '0')}
            </span>
          </figcaption>
        </figure>
        {drum(tunnelRight, 'r')}
        <p className="tunnel-foot">On-device · offline · private</p>
      </div>
    </section>
  );
};
