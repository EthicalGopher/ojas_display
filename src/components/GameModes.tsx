import { Kicker } from './ui';
import { gameModes } from '../data';
import type { GameMode } from '../types';

export const GameModes = () => (
  <section className="modes-section" id="modes" style={{ background: '#2B2B2E' }}>
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>COMPETITION AND TRAINING MODES</Kicker>
          <h2>
            CHOOSE HOW
            <br />
            YOU TRAIN.
          </h2>
        </div>
        <p>
          Whether you want a peaceful solo routine, guided instruction from an AI Tutor,
          or a fast-paced multiplayer battle with up to 10 friends, Ojas has a mode ready for you.
        </p>
      </div>
      <div className="modes-grid">
        {gameModes.map((mode: GameMode) => (
          <article key={mode.id} className="mode-card">
            <div className="mode-header">
              <span className="mode-badge">{mode.badge}</span>
              <span className="mode-players">{mode.players}</span>
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
