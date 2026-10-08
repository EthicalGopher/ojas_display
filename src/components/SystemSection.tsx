import type { MouseEvent } from 'react';
import { Reveal, SectionHead } from './ui';
import { systemCards } from '../data';
import type { SystemCard } from '../types';

/** Line drawings for each pillar, in the site's brass/ember palette. */
const icons = [
  <svg key="cam" viewBox="0 0 120 120" fill="none" strokeWidth="1.5">
    <rect x="22" y="8" width="76" height="104" rx="12" stroke="var(--line-2)" />
    <g stroke="var(--brass)">
      <line x1="60" y1="34" x2="46" y2="48" /><line x1="60" y1="34" x2="74" y2="48" />
      <line x1="60" y1="34" x2="60" y2="66" /><line x1="60" y1="66" x2="50" y2="86" />
      <line x1="60" y1="66" x2="70" y2="86" /><line x1="50" y1="86" x2="48" y2="102" />
      <line x1="70" y1="86" x2="72" y2="102" />
    </g>
    <g fill="var(--ember)">
      <circle cx="60" cy="26" r="5" /><circle cx="60" cy="34" r="2.5" /><circle cx="46" cy="48" r="2.5" />
      <circle cx="74" cy="48" r="2.5" /><circle cx="60" cy="66" r="2.5" /><circle cx="50" cy="86" r="2.5" />
      <circle cx="70" cy="86" r="2.5" /><circle cx="48" cy="102" r="2.5" /><circle cx="72" cy="102" r="2.5" />
    </g>
  </svg>,
  <svg key="vs" viewBox="0 0 120 120" fill="none" strokeWidth="1.5">
    <path d="M60 10 L104 30 V64 C104 88 84 104 60 112 C36 104 16 88 16 64 V30 Z" stroke="var(--brass)" />
    <path d="M60 24 L92 38 V64 C92 82 78 94 60 100 C42 94 28 82 28 64 V38 Z" stroke="var(--line-2)" />
    <path d="M44 48 L54 76 L64 48" stroke="var(--ember)" strokeWidth="3" />
    <path d="M86 52 C82 46 70 46 70 54 C70 62 86 60 86 68 C86 76 72 76 68 70" stroke="var(--ember)" strokeWidth="3" />
  </svg>,
  <svg key="scan" viewBox="0 0 120 120" fill="none" strokeWidth="1.5">
    <path d="M16 30 V16 H30 M90 16 H104 V30 M104 90 V104 H90 M30 104 H16 V90" stroke="var(--brass)" />
    <g stroke="var(--line-2)" strokeDasharray="3 3">
      <line x1="26" y1="40" x2="94" y2="40" /><line x1="26" y1="64" x2="94" y2="64" />
    </g>
    <g stroke="var(--bone)">
      <line x1="44" y1="40" x2="76" y2="40" /><line x1="46" y1="64" x2="74" y2="64" />
      <line x1="44" y1="40" x2="46" y2="64" /><line x1="76" y1="40" x2="74" y2="64" />
      <line x1="46" y1="64" x2="54" y2="84" /><line x1="74" y1="64" x2="66" y2="84" />
      <line x1="54" y1="84" x2="48" y2="102" /><line x1="66" y1="84" x2="72" y2="102" />
    </g>
    <circle cx="54" cy="84" r="4" fill="var(--alert)" /><circle cx="66" cy="84" r="4" fill="var(--alert)" />
    <line x1="20" y1="74" x2="100" y2="74" stroke="var(--ember)" strokeWidth="2" />
  </svg>,
];

const tilt = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
  el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
};

const untilt = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

export const SystemSection = () => (
  <section className="pillars beside-right" id="pillars" data-stage="coach">
    <div className="container">
      <SectionHead
        kicker="The engine"
        title={
          <>
            Track. <em>Battle.</em>
            <br />
            Protect.
          </>
        }
      >
        Three systems in one app: a camera coach that sees your form, a game layer that keeps
        you coming back, and a scanner that looks after your joints.
      </SectionHead>
      <div className="pillar-grid">
        {systemCards.map((card: SystemCard, i) => (
          <Reveal key={card.title} delay={i * 120}>
            <article className="pillar" onMouseMove={tilt} onMouseLeave={untilt}>
              <div className="pillar-num">
                <b>{card.num}</b>
                <span>SYS.{card.num}</span>
              </div>
              <div className="pillar-icon">{icons[i]}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <a className="card-link" href={card.link.href}>
                {card.link.label} <span aria-hidden>&rarr;</span>
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
