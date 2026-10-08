import { useEffect, useRef, useState } from 'react';
import { SectionHead } from './ui';
import { appScreens } from '../data';
import { useInView } from '../three/useInView';

const AUTOPLAY_MS = 4200;

export const AppScreens = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>('0px');
  const dragX = useRef<number | null>(null);
  const count = appScreens.length;

  const go = (dir: number) => setActive((i) => (i + dir + count) % count);

  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, inView, count]);

  const current = appScreens[active];

  return (
    <section className="screens" id="screens">
      <div className="container">
        <SectionHead
          kicker="Inside the app"
          title={
            <>
              Real screens.
              <br />
              <em>Real reps.</em>
            </>
          }
        >
          Captured from the current Android build. Drag, tap a phone, or use the arrows.
        </SectionHead>

        <div
          ref={ref}
          className="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(e) => {
            dragX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (dragX.current === null) return;
            const dx = e.clientX - dragX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            dragX.current = null;
          }}
        >
          <div className="carousel-stage">
            {appScreens.map((screen, i) => {
              let offset = i - active;
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;
              const abs = Math.abs(offset);
              return (
                <div
                  key={screen.id}
                  className="phone"
                  onClick={() => setActive(i)}
                  style={{
                    transform: `translateX(${offset * 62}%) translateZ(${-abs * 220}px) rotateY(${offset * -24}deg)`,
                    opacity: abs > 2 ? 0 : 1 - abs * 0.18,
                    filter: `brightness(${1 - abs * 0.3})`,
                    zIndex: 10 - abs,
                  }}
                >
                  <img src={screen.src} alt={screen.title} draggable={false} loading="lazy" />
                  <span className="glare" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="carousel-caption">
          <span className="idx">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <div aria-live="polite">
            <h3>{current.title}</h3>
            <p>{current.caption}</p>
          </div>
          <div className="carousel-nav">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous screen">
              &larr;
            </button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next screen">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
