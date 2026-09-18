import { Kicker } from './ui';
import { introList, sihDetails } from '../data';

export const Intro = () => (
  <section className="intro">
    <div className="container intro-grid">
      <div>
        <Kicker style={{ color: '#fff' }}>
          {sihDetails.teamName} · INNOVATION FOR EVERYONE
        </Kicker>
        <h2>
          EXERCISE MADE FUN,
          <br />
          SAFE AND
          <br />
          ACCESSIBLE.
        </h2>
        <p>
          Most people stop exercising because workouts feel repetitive or lack feedback.
          Ojas brings live competition, instant form correction, and posture health screening
          straight to your phone without requiring expensive wearables, sensors, or gym memberships.
        </p>
      </div>
      <div className="intro-list">
        {introList.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  </section>
);
