import type { Exercise } from '../types';

const youtubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${query}`;

export const VideoButton = ({ query }: { query: string }) => (
  <a
    className="video-btn"
    href={youtubeSearchUrl(query)}
    target="_blank"
    rel="noopener noreferrer"
  >
    WATCH FORM VIDEO &rarr;
  </a>
);

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <article className="exercise-card">
    <div className="exercise-image">
      <img src={exercise.image} alt={exercise.imageAlt} />
    </div>
    <div className="exercise-body">
      {exercise.badge && <div className="badge-tag">{exercise.badge}</div>}
      <h3>{exercise.title}</h3>
      <div className="meta">{exercise.meta}</div>
      <p>{exercise.description}</p>
      <VideoButton query={exercise.videoQuery} />
    </div>
  </article>
);
