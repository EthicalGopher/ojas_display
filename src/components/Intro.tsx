import { Kicker } from './ui';
import { introList } from '../data';

export const Intro = () => (
  <section className="intro">
    <div className="container intro-grid">
      <div>
        <Kicker style={{ color: '#fff' }}>WHY OJAS</Kicker>
        <h2>
          TRAIN SOLO.
          <br />
          FACE OFF.
          <br />
          PROGRESS.
        </h2>
        <p>
          Choose a focused solo session, challenge an opponent in a head-to-head
          face-off, or enter a structured competition with up to 10 participants.
          Every format keeps the goal clear and the next move simple.
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
