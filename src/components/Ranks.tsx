import { Suspense, lazy, useState, type CSSProperties } from 'react';
import { Kicker, Reveal, SectionHead } from './ui';
import { progression, rankTiers } from '../data';
import { useInView } from '../three/useInView';

const RankScene = lazy(() => import('../three/RankScene'));

export const Ranks = () => {
  const [selected, setSelected] = useState(5);
  const [stageRef, inView] = useInView<HTMLDivElement>();

  return (
    <section className="ranks" id="ranks">
      <div className="container">
        <SectionHead
          kicker="Progression"
          title={
            <>
              Bronze to
              <br />
              <em>Immortal.</em>
            </>
          }
        >
          Every clean rep earns points. Climb six tiers, each with its own emblem, and spend
          coins on gear for your 3D avatar.
        </SectionHead>

        <div className="rank-stage" ref={stageRef}>
          <Suspense fallback={<div className="stage-fallback">LOADING EMBLEMS</div>}>
            <RankScene active={inView} selected={selected} onSelect={setSelected} />
          </Suspense>
        </div>
        <div className="rank-labels" role="tablist" aria-label="Rank tiers">
          {rankTiers.map((tier, i) => (
            <button
              key={tier.tier}
              type="button"
              role="tab"
              aria-selected={selected === i}
              className={`rank-label${selected === i ? ' active' : ''}`}
              style={{ '--tier': tier.color } as CSSProperties}
              onClick={() => setSelected(i)}
            >
              <small>Lv {tier.level} · {tier.title}</small>
              <b>{tier.tier}</b>
              <span>{tier.points} pts</span>
            </button>
          ))}
        </div>

        <div className="progression">
          {progression.map((item, i) => (
            <Reveal as="article" key={item.title} className="prog-card" delay={i * 110}>
              <Kicker>{item.kicker}</Kicker>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
