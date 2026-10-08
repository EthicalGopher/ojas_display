import { useCallback, useEffect, useRef } from 'react';
import { BtnLink, Kicker } from './ui';
import { heroCapabilities, heroStats, projectLinks, sihDetails } from '../data';
import { scrollState } from '../lib/scroll';
import { stage } from '../lib/stage';
import { SplitText, gsap, reducedMotion, useGSAP } from '../lib/motion';
import { INTRO_DONE_EVENT } from './Intro';
import type { PoseStats } from '../three/pose';


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
  pushup: {
    num: '05',
    name: 'Push-ups',
    sub: 'Chest depth · elbow lockout · straight core',
    metric: 'Elbow angle',
    progress: 'Depth',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: (s) => (s.progress > 0.7 ? 'Down' : 'Press'),
  },
  jacks: {
    num: '06',
    name: 'Jumping jacks',
    sub: 'Arm range · rhythm · landing',
    metric: 'Arm angle',
    progress: 'Range',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: (s) => (s.progress > 0.6 ? 'Open' : 'Close'),
  },
  warmup: {
    num: '07',
    name: 'Warm-up',
    sub: 'Mobility · range · readiness',
    metric: 'Knee angle',
    progress: 'Range',
    format: (s) => `${Math.round(s.angle)}°`,
    phase: () => 'Moving',
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

  const section = useRef<HTMLElement>(null);

  // the athlete lives in the page-wide stage; the HUD listens to her live stats
  useEffect(() => {
    stage.listeners.add(onStats);
    return () => void stage.listeners.delete(onStats);
  }, [onStats]);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      // pinned while the camera orbits; the headline splits apart and the corners clear away
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: '+=90%',
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              scrollState.hero = self.progress;
            },
          },
        })
        .to('.hero-giant .left', { xPercent: -45, autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero-giant .right', { xPercent: 45, autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero-corner.tl, .hero-corner.tr', { y: -60, autoAlpha: 0, ease: 'none' }, 0)
        .to('.scroll-cue', { autoAlpha: 0, duration: 0.2, ease: 'none' }, 0);

      // entrance once the intro curtain lifts: letters rise out of a mask, then the furniture
      const split = SplitText.create('.hero-giant span', { type: 'chars', mask: 'chars' });
      const enter = gsap
        .timeline({ paused: true })
        .from(split.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.025 })
        .from('.hero-corner, .hud-card, .scroll-cue', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.35);
      const play = () => enter.play();
      if (document.querySelector('.intro')) window.addEventListener(INTRO_DONE_EVENT, play, { once: true });
      else play();
      return () => window.removeEventListener(INTRO_DONE_EVENT, play);
    },
    { scope: section },
  );

  return (
    <section className="hero-cine" id="overview" ref={section} data-stage="hero">
      <div className="hero-sticky">
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
