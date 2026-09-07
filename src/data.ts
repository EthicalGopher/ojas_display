import type {
  Exercise,
  SystemCard,
  PlanPoint,
  Step,
  StatItem,
  FeedItem,
  FooterColumn,
  NavLink,
} from './types';

export const navLinks: NavLink[] = [
  { label: 'Programs', href: '#programs' },
  { label: 'How it works', href: '#how' },
  { label: 'Workouts', href: '#workouts' },
];

export const heroStats = [
  { value: '5+', label: 'Core workouts' },
  { value: 'OJAS', label: 'Movement tracking' },
];

export const introList = [
  '01 — SMART WORKOUTS',
  '02 — SOLO TRAINING',
  '03 — HEAD-TO-HEAD FACE-OFFS',
  '04 — GROUP COMPETITIONS (UP TO 10)',
  '05 — MOVEMENT TRACKING',
  '06 — PROGRESS SCORE',
];

export const systemCards: SystemCard[] = [
  {
    num: '01',
    title: 'OJAS TRACKING',
    description:
      'Use your camera to understand your movement as you train, with posture feedback, form awareness and rep counting in one place.',
    tags: ['Movement analysis', 'Posture feedback', 'Rep counting'],
    link: { label: 'EXPLORE TRACKING →', href: '#how' },
  },
  {
    num: '02',
    title: 'PERSONAL PLAN',
    description:
      'Build a focused routine around the way you want to train, with clear paths for strength, cardio, mobility and core.',
    tags: [
      'Goal-based routines',
      'Strength · cardio · mobility',
      'Core-focused sessions',
    ],
    link: { label: 'VIEW PROGRAMS →', href: '#programs' },
  },
  {
    num: '03',
    title: 'COMPETITION MODES',
    description:
      'Choose your pace: train solo, face off one-to-one or bring up to 10 participants into the same challenge.',
    tags: ['Solo training', '1V1 face-offs', 'Up to 10 participants'],
    link: { label: 'EXPLORE MODES →', href: '#how' },
  },
];

export const planPoints: PlanPoint[] = [
  {
    kicker: '01 / PROFILE',
    title: 'Profile and activity',
    description:
      'Keep the athlete identity, current activity and training streak visible before starting a session.',
  },
  {
    kicker: '02 / FILTERS',
    title: 'Workout filters',
    description:
      'Switch between all workouts, strength, cardio, mobility and core with a focused plan view.',
  },
  {
    kicker: '03 / TARGET',
    title: 'Movement targets',
    description:
      'See the movement focus and target muscle groups clearly before you begin each workout.',
  },
  {
    kicker: '04 / SESSION',
    title: 'Session cards',
    description:
      'Each workout card keeps duration, exercise name and session information easy to scan.',
  },
  {
    kicker: '05 / TRACK',
    title: 'Progress tracking',
    description:
      'Keep completed sessions and performance information together so progress stays visible.',
  },
  {
    kicker: '06 / CONTROL',
    title: 'Simple controls',
    description:
      'Start, pause and move through your workout without losing the structure of the session.',
  },
];

export const exercises: Exercise[] = [
  {
    id: 'squats',
    title: 'Squats',
    meta: 'Lower-body power · Hip control · Thigh drive',
    description:
      'Build lower-body strength with measured depth, a stable base and a controlled return to standing.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/squats-exercise-icon-20519.svg',
    imageAlt: 'Squats illustration',
    videoQuery: 'squats+exercise+proper+form',
  },
  {
    id: 'triangle-pose',
    title: 'Triangle Pose',
    meta: 'Mobility · Hip opening · Core balance',
    description:
      'Create space through the hips and back line of the legs while maintaining balance, reach and control.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/triangle-pose-exercise-illustrat-3df06.svg',
    imageAlt: 'Triangle Pose illustration',
    videoQuery: 'triangle+pose+yoga+proper+form',
  },
  {
    id: 'lunges',
    title: 'Lunges',
    meta: 'Single-leg strength · Hip stability · Ankle control',
    description:
      'Train single-leg strength with a deliberate step, stable alignment and a confident drive back up.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/lunges-exercise-illustration-b16ba.svg',
    imageAlt: 'Lunges illustration',
    videoQuery: 'lunges+exercise+proper+form',
  },
  {
    id: 'crunches',
    title: 'Crunches',
    meta: 'Midline control · Trunk strength · Side-body engagement',
    description:
      'Keep the midline engaged through a focused curl, controlled tempo and clean repetition quality.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/crunches-exercise-icon-ca993.svg',
    imageAlt: 'Crunches illustration',
    videoQuery: 'crunches+exercise+proper+form',
  },
  {
    id: 'sit-ups',
    title: 'Sit-Ups',
    meta: 'Full-core control · Hip connection · Trunk endurance',
    description:
      'Build coordinated trunk strength with a steady full-range movement and consistent control from start to finish.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/sit-ups-exercise-illustration-01b38.png',
    imageAlt: 'Sit-Ups illustration',
    videoQuery: 'sit+ups+exercise+proper+form',
  },
];

export const steps: Step[] = [
  {
    num: '01 / PROFILE',
    title: 'DEFINE YOUR DIRECTION',
    description:
      'Create your Ojas profile, choose the result you want to work toward and give every session a clear purpose.',
  },
  {
    num: '02 / PLAN',
    title: 'BUILD YOUR SESSION',
    description:
      'Select a workout that matches your goal and training focus, from strength and cardio to mobility and core.',
  },
  {
    num: '03 / TRAIN',
    title: 'TRAIN WITH FEEDBACK',
    description:
      'Follow the movement guidance and use camera-based tracking when available to stay consistent with form and repetitions.',
  },
  {
    num: '04 / PROGRESS',
    title: 'MEASURE YOUR PROGRESS',
    description:
      'Keep completed sessions, repetitions and scores together so each workout informs the next one.',
  },
];

export const bigStats: StatItem[] = [
  {
    value: '05',
    label: 'Featured exercises',
    detail: 'Squats · Triangle Pose · Lunges · Crunches · Sit-Ups',
  },
  {
    value: '04',
    label: 'Training modes',
    detail:
      'Solo training · 1V1 face-offs · Group competitions up to 10 · Movement tracking',
  },
  {
    value: '01',
    label: 'Personal dashboard',
    detail: 'Profile · plan filters · activity status · progress tracking',
  },
];

export const feedItems: FeedItem[] = [
  {
    label: 'OJAS TRACKER',
    title: 'Read your movement with more clarity',
    description:
      'See how posture, angles and repetitions are interpreted so every session feels more controlled and intentional.',
    tags: ['POSTURE · ANGLES · REPETITIONS'],
  },
  {
    label: 'OJAS ARENA',
    title: 'Turn training into a clear challenge',
    description:
      'Use 1V1 battle scoring to compare sessions, understand the result and keep your next target in focus.',
    tags: ['1V1 SCORING · WINS · DRAWS · LOSSES'],
  },
  {
    label: 'OJAS GUIDE',
    title: 'Set up your camera with confidence',
    description:
      'Follow practical positioning guidance for a more reliable movement-tracking session before you press start.',
    tags: ['CAMERA SETUP · FORM · FEEDBACK'],
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'OJAS',
    links: [
      { label: 'Programs', href: '#programs' },
      { label: 'Workouts', href: '#workouts' },
      { label: 'How it works', href: '#how' },
    ],
  },
  {
    title: 'START HERE',
    links: [
      { label: 'Explore workouts', href: '#workouts' },
      { label: 'See how it works', href: '#how' },
    ],
  },
];
