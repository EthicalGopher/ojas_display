import { BtnLink, Kicker } from './ui';
import { projectLinks, sihDetails } from '../data';

export const FooterCta = () => (
  <section className="footer-cta">
    <div className="container">
      <div className="cta-card">
      <Kicker>Android · Free</Kicker>
      <h2>
        Prop it up.
        <br />
        Press start.
      </h2>
      <p>
        Download the APK and try live rep tracking, the posture scanner and ranked battles on
        your own phone.
      </p>
      <div className="hero-actions">
        <BtnLink href={projectLinks.apk} variant="light">
          Download APK
        </BtnLink>
        <BtnLink href={projectLinks.github} variant="ghost-light">
          Source on GitHub
        </BtnLink>
      </div>
      <div className="cta-meta">
        {sihDetails.event} · Team {sihDetails.teamId} · {sihDetails.problemId}
      </div>
      </div>
    </div>
  </section>
);
