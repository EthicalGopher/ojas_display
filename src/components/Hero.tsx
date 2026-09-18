import { BtnLink, Kicker } from './ui';
import { HeroPhoneMockup } from './HeroPhoneMockup';
import { heroStats, projectLinks, sihDetails } from '../data';

export const Hero = () => (
  <section className="hero" id="overview">
    <div className="container hero-grid">
      <div>
        <Kicker>
          {sihDetails.event} · {sihDetails.problemId}
        </Kicker>
        <h1>
          GAMIFIED FITNESS.
          <br />
          REAL-TIME FORM.
          <br />
          HEALTH SCREENING.
        </h1>
        <p className="hero-copy">
          Ojas turns your phone camera into your personal workout coach.
          Count your reps automatically, fix your form with live tips,
          check your posture health, and challenge your friends in fun fitness battles.
        </p>
        <div className="hero-actions">
          <BtnLink href={projectLinks.apk} variant="primary">
            DOWNLOAD APK &rarr;
          </BtnLink>
          <BtnLink href={projectLinks.video} variant="secondary">
            WATCH DEMO VIDEO &rarr;
          </BtnLink>
          <BtnLink href={projectLinks.github} variant="secondary">
            GITHUB REPOSITORY &rarr;
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
