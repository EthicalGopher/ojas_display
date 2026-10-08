import { Suspense, lazy, useCallback, useEffect, useRef } from 'react';
import { BtnLink, Kicker } from './ui';
import { heroCapabilities, heroStats, projectLinks, sihDetails } from '../data';
import { scrollState } from '../lib/scroll';
import { useInView } from '../three/useInView';
import type { PoseStats } from '../three/pose';

const HeroScene = lazy(() => import('../three/HeroScene'));

type HudInfo = {
  num: string;
  name: string;
  sub: string;
  metric: string;
  progress: string;
  format: (s: PoseStats) => string;
  phase: (s: PoseStats) => string;
};

const EXERCISE_HUD: Record<PoseStats['exercise'], HudInfo> = {
  squat: {
    num: '01',
    name: 'Squats',
    sub: 'Knee depth · back angle · lockout',
    metric: 'Knee angle',
    progress: 'Depth',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: (s) => (s.progress > 0.85 ? 'Down' : s.progress < 0.12 ? 'Top' : 'Moving'),
  },
  skip: {
    num: '02',
    name: 'Skipping rope',
    sub: 'Jump rhythm · landing · cadence',
    metric: 'Count',
    progress: 'Air',
    format: (s) => `${s.reps} jumps`,
    phase: (s) => (s.progress > 0.2 ? 'Air' : 'Land'),
  },
  curl: {
    num: '03',
    name: 'Dumbbell curls',
    sub: 'Elbow angle · tempo · no swing',
    metric: 'Elbow angle',
    progress: 'Range',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: (s) => (s.progress > 0.8 ? 'Squeeze' : s.progress < 0.1 ? 'Extend' : 'Lift'),
  },
  swing: {
    num: '04',
    name: 'Kettlebell swing',
    sub: 'Hip hinge · flat back · snap',
    metric: 'Hip angle',
    progress: 'Hinge',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: (s) => (s.progress > 0.6 ? 'Hinge' : 'Snap'),
  },
  scan: {
    num: '00',
    name: 'Posture scan',
    sub: '',
    metric: 'Hold',
    progress: 'Scan',
    format: () => '',
    phase: () => 'Hold',
  },
};

export const Hero = () => {
  const [stageRef, inView] = useInView<HTMLDivElement>();
  const reps = useRef<HTMLSpanElement>(null);
  const metricLabel = useRef<HTMLSpanElement>(null);
  const metric = useRef<HTMLElement>(null);
  const progressLabel = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const phase = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const cardNum = useRef<HTMLSpanElement>(null);
  const cardTitle = useRef<HTMLElement>(null);
  const cardSub = useRef<HTMLSpanElement>(null);
  const last = useRef({ reps: -1, metric: '', phase: '', exercise: '' });

  // Written straight to the DOM so the 60fps loop never re-renders React.
  const onStats = useCallback((s: PoseStats) => {
    const info = EXERCISE_HUD[s.exercise];
    const l = last.current;
    if (s.exercise !== l.exercise) {
      l.exercise = s.exercise;
      if (live.current) live.current.textContent = `Live · ${info.name}`;
      if (metricLabel.current) metricLabel.current.textContent = info.metric;
      if (progressLabel.current) progressLabel.current.textContent = info.progress;
      if (cardNum.current) cardNum.current.textContent = info.num;
      if (cardTitle.current) cardTitle.current.textContent = info.name;
      if (cardSub.current) cardSub.current.textContent = info.sub;
      const c = card.current;
      if (c) {
        c.classList.remove('show');
        void c.offsetWidth; // restart the animation
        c.classList.add('show');
      }
    }
    const m = info.format(s);
    if (m !== l.metric && metric.current) {
      metric.current.textContent = m;
      l.metric = m;
    }
    if (progress.current) progress.current.textContent = `${Math.round(s.progress * 100)}%`;
    if (bar.current) bar.current.style.width = `${s.progress * 100}%`;
    if (s.reps !== l.reps && reps.current) {
      reps.current.textContent = String((s.reps % 99) + 1).padStart(2, '0');
      l.reps = s.reps;
    }
    const p = info.phase(s);
    if (p !== l.phase && phase.current) {
      phase.current.textContent = p;
      l.phase = p;
    }
  }, []);

  // scroll progress through the pinned hero drives the camera orbit and the headline split
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      scrollState.hero = p;
      el.style.setProperty('--p', p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero-cine" id="overview" ref={section}>
      <div className="hero-sticky" ref={stageRef}>
        <div className="hero-canvas">
          <Suspense fallback={<div className="stage-fallback">INITIALISING POSE ENGINE</div>}>
            <HeroScene active={inView} onStats={onStats} />
          </Suspense>
        </div>

        <h1 className="hero-giant">
          <span className="left">
            Your phone
            <br />
            <i>is the</i>
          </span>
          <span className="right">
            <i>AI</i>
            <br />
            coach.
          </span>
        </h1>

        <div className="title-card" ref={card} aria-hidden>
          <span ref={cardNum}>01</span>
          <b ref={cardTitle}>Squats</b>
          <span ref={cardSub} />
        </div>

        <div className="hero-corner tl">
          <Kicker>
            {sihDetails.event} · {sihDetails.problemId}
          </Kicker>
          <p>
            Ojas reads 33 points on your body through the phone camera, counts every clean rep
            and corrects your form out loud. Nothing is uploaded.
          </p>
        </div>

        <ul className="hero-corner tr" aria-label="What Ojas does">
          {heroCapabilities.map((c, i) => (
            <li key={c}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {c}
            </li>
          ))}
        </ul>

        <div className="hero-corner bl">
          <div className="hero-actions">
            <BtnLink href={projectLinks.apk} variant="primary">
              Download APK
            </BtnLink>
            <BtnLink href={projectLinks.video} variant="secondary">
              Watch demo
            </BtnLink>
          </div>
          <div className="hero-stats">
            {heroStats.map((stat) => (
              <div key={stat.label} title={stat.detail}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hud-card" aria-hidden>
          <div className="hud-card-top">
            <span className="hud-tag">
              <span className="dot" /> <span ref={live}>Live · Squats</span>
            </span>
            <div className="hud-reps">
              <small>Reps</small>
              <span ref={reps}>01</span>
            </div>
          </div>
          <div className="hud-meter-row">
            <span ref={metricLabel}>Knee angle</span>
            <b ref={metric}>178°</b>
          </div>
          <div className="hud-meter-row">
            <span ref={progressLabel}>Depth</span>
            <b ref={progress}>0%</b>
          </div>
          <div className="hud-bar">
            <i ref={bar} />
          </div>
          <div className="hud-phase" ref={phase}>
            Top
          </div>
        </div>

        <div className="scroll-cue" aria-hidden>
          <i />
          Scroll
        </div>
      </div>
    </section>
  );
};
