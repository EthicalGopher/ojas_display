import { Suspense, lazy, useEffect, useRef } from 'react';
import { Reveal, SectionHead } from './ui';
import { healthFeatures, scanChecks } from '../data';
import type { HealthFeature } from '../types';
import { useInView } from '../three/useInView';

const HeroScene = lazy(() => import('../three/HeroScene'));

/** Loops the 3-second scan readout while the stage is visible. */
const useScanProgress = (active: boolean) => {
  const pct = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(100, (((now - start) / 3000) % 1.4) * 100);
      if (pct.current) pct.current.textContent = `${Math.round(p)}%`;
      if (bar.current) bar.current.style.width = `${p}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return { pct, bar };
};

export const HealthSection = () => {
  const [stageRef, inView] = useInView<HTMLDivElement>();
  const { pct, bar } = useScanProgress(inView);

  return (
    <section className="health-section grid-bg" id="health">
      <div className="container">
        <SectionHead
          kicker="Posture scanner"
          title={
            <>
              Three seconds.
              <br />
              <em>Full-body check.</em>
            </>
          }
        >
          Stand six feet back and hold still. Ojas compares your shoulders, hips and knees
          against level lines and flags what is out of line, then builds a routine to fix it.
        </SectionHead>

        <div className="scan-layout">
          <div className="stage scan-stage" ref={stageRef}>
            <Suspense fallback={<div className="stage-fallback">CALIBRATING SCANNER</div>}>
              <HeroScene active={inView} mode="scan" flagKnees scanBeam spin={0.25} />
            </Suspense>
            <div className="hud" aria-hidden>
              <div className="scan-checks">
                {scanChecks.map((c) => (
                  <span key={c.label} className={`scan-check${c.ok ? '' : ' bad'}`}>
                    <i />
                    {c.label}: {c.value}
                  </span>
                ))}
              </div>
              <div className="scan-progress">
                <div className="scan-progress-row">
                  <span>Checking posture · hold still</span>
                  <b ref={pct}>0%</b>
                </div>
                <div className="hud-bar">
                  <i ref={bar} />
                </div>
              </div>
            </div>
          </div>

          <div className="health-grid">
            {healthFeatures.map((item: HealthFeature) => (
              <Reveal as="article" key={item.id} className="health-card">
                <span className="health-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p className="health-desc">{item.description}</p>
                <div className="health-solution">
                  <strong>Corrective plan</strong>
                  <span>{item.solution}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
