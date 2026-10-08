import type { Exercise } from '../types';

const youtubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${query}`;

export const VideoButton = ({ query }: { query: string }) => (
  <a className="video-btn" href={youtubeSearchUrl(query)} target="_blank" rel="noopener noreferrer">
    Watch form video <span aria-hidden>&rarr;</span>
  </a>
);

/** Shown when an exercise has no illustration: a stick-figure landmark glyph. */
const PoseGlyph = () => (
  <svg className="exercise-glyph" viewBox="0 0 120 80" fill="none" aria-hidden>
    <g stroke="#2a2622" strokeWidth="2">
      <line x1="18" y1="66" x2="96" y2="66" />
      <polyline points="30,66 52,60 78,62 100,64" />
      <polyline points="52,60 60,42 66,30" />
      <polyline points="60,42 58,54 56,64" />
    </g>
    <g fill="#E25822">
      {[[30, 66], [52, 60], [78, 62], [100, 64], [60, 42], [56, 64]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
      ))}
      <circle cx="68" cy="24" r="6" />
    </g>
  </svg>
);

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <article className="exercise-card">
    <div className="exercise-image">
      {exercise.image ? (
        <img src={exercise.image} alt={exercise.imageAlt} loading="lazy" />
      ) : (
        <PoseGlyph />
      )}
      {exercise.badge && (
        <span className={`exercise-badge${exercise.badge.startsWith('New') ? ' new' : ''}`}>
          {exercise.badge}
        </span>
      )}
    </div>
    <div className="exercise-body">
      <h3>{exercise.title}</h3>
      <div className="meta">{exercise.meta}</div>
      <p>{exercise.description}</p>
      {exercise.checks && (
        <ul className="checks">
          {exercise.checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      <VideoButton query={exercise.videoQuery} />
    </div>
  </article>
);
