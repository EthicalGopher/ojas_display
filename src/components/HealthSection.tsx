import { Kicker } from './ui';
import { healthFeatures } from '../data';
import type { HealthFeature } from '../types';

export const HealthSection = () => (
  <section className="health-section" id="health" style={{ background: '#303034' }}>
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>PREVENTIVE WELLNESS AND SCREENING</Kicker>
          <h2>
            HEALTH SCANNER
            <br />
            AND POSTURE CHECK.
          </h2>
        </div>
        <p>
          Early posture screening helps detect joint alignment problems before they cause pain.
          Ojas analyzes body alignment with the phone camera and guides you through corrective workouts.
        </p>
      </div>
      <div className="health-grid">
        {healthFeatures.map((item: HealthFeature) => (
          <article key={item.id} className="health-card">
            <span className="health-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p className="health-desc">{item.description}</p>
            <div className="health-solution">
              <strong>Corrective Action:</strong>
              <span>{item.solution}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
