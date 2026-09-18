import { Kicker } from './ui';
import { systemCards } from '../data';
import type { SystemCard } from '../types';

export const SystemSection = () => (
  <section className="system" id="pillars">
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>THE THREE CORE PILLARS</Kicker>
          <h2>
            SMART.
            <br />
            COMPETITIVE.
            <br />
            HEALTHY.
          </h2>
        </div>
        <p>
          Everything you need to train with accurate form, challenge your friends,
          and protect your body — all in one simple mobile app.
        </p>
      </div>
      <div className="system-grid">
        {systemCards.map((card: SystemCard) => (
          <article key={card.title} className="system-card">
            <div>
              <div className="system-num">{card.num}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a className="card-link" href={card.link.href}>
              {card.link.label}
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);
