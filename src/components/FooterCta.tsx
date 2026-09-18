import { Kicker, BtnLink } from './ui';
import { projectLinks, sihDetails } from '../data';

export const FooterCta = () => (
  <section className="footer-cta">
    <div className="container">
      <Kicker style={{ color: '#fff' }}>GET STARTED TODAY</Kicker>
      <h2>
        READY TO
        <br />
        TEST YOUR FORM?
      </h2>
      <p>
        Download the Android APK to try live pose tracking, posture screening,
        and multiplayer fitness battles right on your phone.
      </p>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '25px' }}>
        <BtnLink
          href={projectLinks.apk}
          variant="secondary"
          style={{ borderColor: '#fff', background: '#fff', color: '#E3522B' }}
        >
          DOWNLOAD ANDROID APK &rarr;
        </BtnLink>
        <BtnLink
          href={projectLinks.github}
          variant="secondary"
          style={{ borderColor: '#fff', color: '#fff' }}
        >
          EXPLORE SOURCE CODE &rarr;
        </BtnLink>
      </div>
      <div style={{ marginTop: '24px', fontSize: '13px', opacity: 0.9 }}>
        {sihDetails.event} · Team ID: {sihDetails.teamId} · Problem ID: {sihDetails.problemId}
      </div>
    </div>
  </section>
);
