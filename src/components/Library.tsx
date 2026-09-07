import { useState, useEffect } from 'react';
import { Kicker } from './ui';
import { exercises, planPoints } from '../data';
import { getContent, type ExerciseRow } from '../lib/contentApi';
import type { Exercise, PlanPoint } from '../types';
import { ExerciseCard } from './ExerciseCard';

const mapRow = (row: ExerciseRow): Exercise => ({
  id: String(row.id),
  title: row.name,
  meta: row.muscle_groups,
  description: row.description,
  image: row.image_url,
  imageAlt: row.name,
  videoQuery: row.name.replace(/\s+/g, '+') + '+exercise+proper+form',
});

const exerciseGrid = (display: Exercise[]) => (
  <div className="exercise-grid" id="workouts">
    {display.map((exercise: Exercise) => (
      <ExerciseCard key={exercise.id} exercise={exercise} />
    ))}
  </div>
);

export const Library = () => {
  const [items, setItems] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const content = await getContent();
        setItems(content.exercises.map(mapRow));
      } catch {
        setError('Content request failed');
        setItems(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const display = items ?? exercises;

  return (
    <section className="library">
      <div className="container">
        <div className="section-head">
          <div>
            <Kicker>WORKOUT LIBRARY</Kicker>
            <h2>
              MOVE WITH
              <br />
              PURPOSE.
            </h2>
          </div>
          <p>
            Your plan brings profile context, workout filters, movement targets
            and session controls into one clear training feed.
          </p>
        </div>
        <div className="plan-feature">
          <div className="plan-photo">
            <img src="/move-purpose.jpeg" alt="OJAS workout plan preview" />
          </div>
          <div className="plan-points">
            {planPoints.map((point: PlanPoint) => (
              <article key={point.title} className="plan-point">
                <div className="point-kicker">{point.kicker}</div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="exercise-intro">
          <Kicker>EXERCISE LIBRARY</Kicker>
          <h3>
            Choose your movement. Understand its focus. Start your session with
            clarity.
          </h3>
          <p>
            The same exercise demonstrations stay in place while each card
            explains the movement and the muscles it targets.
          </p>
        </div>
        {loading && items === null ? (
          <p style={{ color: '#b9b9be' }}>Loading exercises…</p>
        ) : error && items === null ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <p style={{ color: '#E3522B' }}>
              Could not load the exercise library. Showing cached data.
            </p>
            {exerciseGrid(display)}
          </div>
        ) : (
          exerciseGrid(display)
        )}
      </div>
    </section>
  );
};
