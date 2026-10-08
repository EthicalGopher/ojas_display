import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const IntroScene = lazy(() => import('../three/IntroScene'));
const PUSHER_READY_EVENT = 'ojas:pusher-ready';
/** How long to wait for the 3D pusher before falling back to the line-drawn one. */
const PUSHER_WAIT_MS = 3500;

/** Fired by the 3D scene once the athlete model is on screen. */
export const READY_EVENT = 'ojas:ready';

const MIN_MS = 4600;
const MAX_MS = 9000;

/** Line-drawn fallback runner, used if the 3D pusher has not loaded in time. */
const Pusher = () => (
  <svg className="pusher" viewBox="0 0 160 210" aria-hidden>
    <g className="leg leg-a">
      <polyline points="62,122 70,162 58,200" />
      <circle cx="70" cy="162" r="4" />
      <circle cx="58" cy="200" r="4" />
    </g>
    <g className="leg leg-b">
      <polyline points="62,122 70,162 58,200" />
      <circle cx="70" cy="162" r="4" />
      <circle cx="58" cy="200" r="4" />
    </g>
    <g className="upper">
      <polyline points="62,122 100,72" />
      <polyline points="100,72 128,84 156,80" />
      <polyline points="96,76 122,94 154,92" />
      <circle cx="112" cy="54" r="11" className="head" />
      <circle cx="62" cy="122" r="5" />
      <circle cx="100" cy="72" r="5" />
      <circle cx="128" cy="84" r="4" />
      <circle cx="156" cy="80" r="4" />
      <circle cx="122" cy="94" r="4" />
      <circle cx="154" cy="92" r="4" />
    </g>
  </svg>
);

export const Intro = () => {
  const [phase, setPhase] = useState<'play' | 'leave' | 'done'>('play');
  const [pct, setPct] = useState(0);
  const [pusher, setPusher] = useState<'wait' | '3d' | 'svg'>('wait');
  const ready = useRef(false);

  // the push starts once the 3D man is on screen (or the fallback kicks in)
  useEffect(() => {
    const on3d = () => setPusher((p) => (p === 'wait' ? '3d' : p));
    window.addEventListener(PUSHER_READY_EVENT, on3d);
    const id = window.setTimeout(() => setPusher((p) => (p === 'wait' ? 'svg' : p)), PUSHER_WAIT_MS);
    return () => {
      window.removeEventListener(PUSHER_READY_EVENT, on3d);
      window.clearTimeout(id);
    };
  }, []);
  const pushStarted = useRef(0);
  useEffect(() => {
    if (pusher !== 'wait') pushStarted.current = performance.now();
  }, [pusher]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const onReady = () => {
      ready.current = true;
    };
    window.addEventListener(READY_EVENT, onReady);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      // the counter eases toward 90% on its own and only finishes once the model is in
      const target = ready.current ? 100 : Math.min(90, (t / MIN_MS) * 90);
      setPct((p) => Math.min(100, p + Math.max(0.6, (target - p) * 0.08)));
      const pushDone = pushStarted.current > 0 && now - pushStarted.current > 3400;
      if ((ready.current && t > MIN_MS && pushDone) || t > MAX_MS) {
        setPct(100);
        setPhase('leave');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(READY_EVENT, onReady);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'leave') return;
    const id = window.setTimeout(() => {
      setPhase('done');
      document.documentElement.style.overflow = '';
    }, 1100);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className={`intro${phase === 'leave' ? ' leave' : ''}`} aria-hidden>
      <div className="intro-wipe" />
      <div className="intro-stage">
        <div className={`intro-push${pusher === 'wait' ? '' : ' go'}`}>
          {pusher === 'svg' ? (
            <Pusher />
          ) : (
            <div className={`intro-man${pusher === '3d' ? ' on' : ''}`}>
              <Suspense fallback={null}>
                <IntroScene />
              </Suspense>
            </div>
          )}
          <span className="intro-word">OJAS</span>
        </div>
        <p className="intro-tag">AI fitness coach · on your phone</p>
      </div>
      <div className="intro-count">
        <span>Loading pose engine</span>
        <b>{String(Math.floor(pct)).padStart(3, '0')}</b>
      </div>
    </div>
  );
};
