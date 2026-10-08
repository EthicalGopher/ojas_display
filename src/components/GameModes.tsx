import { Reveal, SectionHead } from './ui';
import { gameModes } from '../data';
import type { GameMode } from '../types';

export const GameModes = () => (
  <section className="modes-section" id="modes">
    <div className="container">
      <SectionHead
        kicker="Game modes"
        title={
          <>
            Six ways
            <br />
            to <em>play.</em>
          </>
        }
      >
        Train quietly on your own, follow an AI Tutor, or step into a live match. Matchmaking
        never leaves you waiting: if nobody is free, a level-matched opponent steps in.
      </SectionHead>
      <div className="modes-grid">
        {gameModes.map((mode: GameMode, i) => (
          <Reveal as="article" key={mode.id} className="mode-card" delay={(i % 3) * 90}>
            <div className="mode-header">
              <span className="mode-idx">M.{String(i + 1).padStart(2, '0')}</span>
              <span className="mode-players">{mode.players}</span>
            </div>
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
            {mode.details && (
              <div className="mode-details">
                {mode.details.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            )}
            <span className="mode-badge">{mode.badge}</span>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
