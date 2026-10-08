import { useEffect, useRef, useState } from 'react';
import { appScreens, tunnelLeft, tunnelRight } from '../data';

const STEP = 360 / 20; // degrees between words on the drum

/** Words wrapped on a turning drum, spun by scroll, around a swapping app screen. */
export const WordTunnel = () => {
  const section = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      el.style.setProperty('--spin', `${p * 260}deg`);
      setScreen(Math.min(appScreens.length - 1, Math.floor(p * appScreens.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

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
