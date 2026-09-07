import { BtnLink, Kicker } from './ui';
import { HeroPhoneMockup } from './HeroPhoneMockup';
import { heroStats } from '../data';

export const Hero = () => (
  <section className="hero">
    <div className="container hero-grid">
      <div>
        <Kicker>OJAS / MOVEMENT INTELLIGENCE</Kicker>
        <h1>
          TRAIN HARDER.
          <br />
          MOVE BETTER.
        </h1>
        <p className="hero-copy">
          Personalized training, precise movement guidance and structured
          workouts designed to help you train with confidence and progress
          consistently.
        </p>
        <div className="hero-actions">
          <BtnLink href="#workouts" variant="primary">
            START TRAINING →
          </BtnLink>
          <BtnLink href="#workouts" variant="secondary">
            EXPLORE WORKOUTS →
          </BtnLink>
        </div>
        <div className="hero-stats">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <HeroPhoneMockup />
    </div>
  </section>
);
