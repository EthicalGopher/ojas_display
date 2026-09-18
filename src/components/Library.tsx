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
  badge: 'Core Workout',
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
        if (content.exercises && content.exercises.length > 0) {
          setItems(content.exercises.map(mapRow));
        }
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
            <Kicker>YOUR APP &amp; TRAINING PLAN</Kicker>
            <h2>
              TRAIN WITH
              <br />
              CLEAR PURPOSE.
            </h2>
          </div>
          <p>
            Your app brings your profile, custom workout filters, posture targets,
            and real-time feedback together into one simple feed.
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
          <Kicker>EXERCISE &amp; YOGA LIBRARY</Kicker>
          <h3>
            Pick your exercise. Check your posture. Train with real-time feedback.
          </h3>
          <p>
            Choose from a wide variety of strength exercises and yoga routines.
            Every exercise card shows you the right form and target muscle areas.
          </p>
        </div>
        {loading && items === null ? (
          <p style={{ color: '#b9b9be' }}>Loading exercises...</p>
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
