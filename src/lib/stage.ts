import { CYCLE, SEGMENT, type Exercise, type PoseStats } from '../three/pose';

/**
 * The athlete lives in one fixed 3D layer behind the page and follows the
 * visitor down it. Each section marks itself with `data-stage="<slot>"`; the
 * slot says which exercise she performs and which side of the screen she
 * stands on. Sections with solid backgrounds use `hidden` and slide over her.
 */
export type Side = 'center' | 'left' | 'right';
export type Slot = { exercise: Exercise | 'cycle'; side: Side; visible: boolean };

export const SLOTS: Record<string, Slot> = {
  hero: { exercise: 'cycle', side: 'center', visible: true },
  coach: { exercise: 'squat', side: 'right', visible: true },
  battle: { exercise: 'skip', side: 'left', visible: true },
  flow: { exercise: 'swing', side: 'right', visible: true },
  hidden: { exercise: 'cycle', side: 'center', visible: false },
};

export const stage = {
  slot: SLOTS.hero,
  /** Scroll progress through the current section (0 → 1), turns the camera. */
  progress: 0,
  listeners: new Set<(s: PoseStats) => void>(),
};

/** The exercise on screen at clock time `t`: the slot's own, or the hero's timed cycle. */
export const currentExercise = (t: number): Exercise =>
  stage.slot.exercise === 'cycle'
    ? CYCLE[Math.floor(t / SEGMENT) % CYCLE.length]
    : stage.slot.exercise;

export const broadcastStats = (s: PoseStats) => stage.listeners.forEach((fn) => fn(s));
