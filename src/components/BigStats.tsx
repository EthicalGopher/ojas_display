import { bigStats } from '../data';
import type { StatItem } from '../types';

export const BigStats = () => (
  <section className="stats-section">
    <div className="container">
      <div className="big-stats">
        {bigStats.map((stat: StatItem) => (
          <article key={stat.label} className="big-stat">
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
            <small>{stat.detail}</small>
          </article>
        ))}
      </div>
    </div>
  </section>
);
