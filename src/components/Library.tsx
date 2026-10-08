import { useEffect, useState } from 'react';
import { SectionHead } from './ui';
import { exercises } from '../data';
import { getContent, type ExerciseRow } from '../lib/contentApi';
import type { Exercise } from '../types';
import { ExerciseCard } from './ExerciseCard';

const fallbackById = new Map(exercises.map((e) => [e.title.toLowerCase(), e]));

const mapRow = (row: ExerciseRow): Exercise => {
  const known = fallbackById.get(row.name.toLowerCase());
  return {
    id: String(row.id),
    title: row.name,
    meta: row.muscle_groups,
    description: row.description,
    image: row.image_url || known?.image || '',
    imageAlt: row.name,
    videoQuery: row.name.replace(/\s+/g, '+') + '+exercise+proper+form',
    badge: known?.badge ?? 'Workout',
    checks: known?.checks,
  };
};

export const Library = () => {
  const [items, setItems] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const content = await getContent();
        if (content.exercises && content.exercises.length > 0) {
          setItems(content.exercises.map(mapRow));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const display = items ?? exercises;

  return (
    <section className="library" id="workouts" data-stage="hidden">
      <div className="container">
        <SectionHead
          kicker="Exercise library"
          title={
            <>
              Every move,
              <br />
              <em>measured.</em>
            </>
          }
        >
          Strength work and yoga, each with the angles the AI checks on every rep. New: Tree
          Pose, scored by your longest steady hold.
        </SectionHead>
        {loading && items === null ? (
          <p className="library-note">SYNCING LIBRARY…</p>
        ) : (
          error && <p className="library-note">OFFLINE COPY · LIVE LIBRARY UNAVAILABLE</p>
        )}
        <div className="exercise-grid">
          {display.map((exercise: Exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </section>
  );
};
