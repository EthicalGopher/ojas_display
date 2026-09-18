import type {
  Exercise,
  SystemCard,
  PlanPoint,
  Step,
  StatItem,
  FeedItem,
  FooterColumn,
  NavLink,
  GameMode,
  HealthFeature,
} from './types';

export const sihDetails = {
  event: 'Smart India Hackathon 2026',
  problemId: 'SIH26196',
  problemTitle:
    'Student Innovation — Ideas that can boost fitness activities and assist in keeping fit',
  theme: 'Fitness & Sports',
  category: 'Software',
  teamId: '141537',
  teamName: 'Ojas26',
};

export const projectLinks = {
  apk: 'https://drive.google.com/uc?id=1PBxgVbEr9TnmoPt4xh1aLcxOKE3eO2GB',
  github: 'https://github.com/EthicalGopher/Ojas',
  video: 'https://youtu.be/wqpIih8VV-0',
  display: 'https://ojassih.netlify.app/',
};

export const navLinks: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Pillars', href: '#pillars' },
  { label: 'Game Modes', href: '#modes' },
  { label: 'Workouts', href: '#workouts' },
  { label: 'Health Check', href: '#health' },
  { label: 'How It Works', href: '#how' },
];

export const heroStats: StatItem[] = [
  { value: '6', label: 'Workout Modes', detail: 'Solo, AI Tutor, AI Dual, 1v1, Battleground, Friends' },
  { value: '100%', label: 'Private & Secure', detail: 'Camera video stays strictly on your phone' },
  { value: '0', label: 'Extra Gear Needed', detail: 'Works with the phone camera you already have' },
  { value: 'Offline', label: 'Works Anywhere', detail: 'Track your reps even without an internet connection' },
];

export const introList: string[] = [
  '01 — SMART CAMERA POSE TRACKING',
  '02 — AUTOMATIC REP COUNTING',
  '03 — INSTANT FORM CORRECTION',
  '04 — LIVE 1V1 AND 10-PLAYER BATTLES',
  '05 — BODY POSTURE & HEALTH CHECK',
  '06 — SMART FATIGUE PROTECTION',
  '07 — WORKOUT ANYWHERE OFFLINE',
  '08 — 100% PRIVATE ON YOUR PHONE',
];

export const systemCards: SystemCard[] = [
  {
    num: '01',
    title: 'AI CAMERA TRACKING',
    description:
      'Set your phone up and start moving. Your camera tracks your body, counts every clean repetition, and gives you instant audio and visual tips to correct your form.',
    tags: ['Real-time posture tips', 'Automatic rep counts', 'No wearables needed'],
    link: { label: 'SEE HOW IT WORKS ->', href: '#how' },
  },
  {
    num: '02',
    title: 'LIVE BATTLES & GAMES',
    description:
      'Turn your regular exercise into a game. Train alone, follow an AI coach, duel a friend in a live 1v1 match, or join group battles with up to 10 players.',
    tags: ['Solo training', 'Live 1v1 duels', '10-Player room battles', 'XP & leaderboards'],
    link: { label: 'EXPLORE GAME MODES ->', href: '#modes' },
  },
  {
    num: '03',
    title: 'POSTURE & HEALTH CHECK',
    description:
      'Screen your body for common posture issues like knock knees or foot misalignment before you train, and get guided corrective exercises to keep you healthy.',
    tags: ['Knock knee check', 'Foot balance check', 'Corrective exercise plans'],
    link: { label: 'CHECK YOUR HEALTH ->', href: '#health' },
  },
];

export const gameModes: GameMode[] = [
  {
    id: 'solo',
    title: 'Solo Workout',
    players: '1 Player',
    description:
      'Train at your own pace with automatic rep counts and live posture advice on every set.',
    badge: 'Offline Supported',
  },
  {
    id: 'ai-tutor',
    title: 'AI Fitness Tutor',
    players: 'Personal Coach',
    description:
      'Follow your personal AI coach who guides your movements and keeps you motivated.',
    badge: 'Guided Training',
  },
  {
    id: 'human-vs-ai',
    title: 'Human vs AI',
    players: '1 vs AI Bot',
    description:
      'Test your speed, stamina, and clean form against an adaptive AI challenger.',
    badge: 'Competitive',
  },
  {
    id: '1v1-match',
    title: 'Direct 1v1 Match',
    players: '2 Players',
    description:
      'Challenge a friend to a live match. See who finishes cleaner reps in real time.',
    badge: 'Live Multiplayer',
  },
  {
    id: 'battleground',
    title: 'Battleground',
    players: 'Up to 10 Players',
    description:
      'Join an open multiplayer room with friends or classmates and race for the top spot.',
    badge: 'Group Competition',
  },
  {
    id: 'friend-challenge',
    title: 'Friend Challenge',
    players: 'Custom Room',
    description:
      'Create private workout rooms and send invite links straight to your friends.',
    badge: 'Social Fitness',
  },
];

export const healthFeatures: HealthFeature[] = [
  {
    id: 'knock-knee',
    title: 'Knock Knee Screening (Knee Valgus)',
    tag: 'Joint Alignment',
    description:
      'Checks if your knees turn inward when you stand or squat, catching problems early before they cause pain.',
    solution:
      'Gives you simple hip and glute strengthening exercises to straighten your posture.',
  },
  {
    id: 'duck-foot',
    title: 'Duck Foot Check (Out-Toeing)',
    tag: 'Foot Balance',
    description:
      'Spots if your feet point outward while moving, helping you restore natural balance and walking posture.',
    solution:
      'Guides you through gentle calf stretches, hip rotations, and ankle mobility drills.',
  },
  {
    id: 'fatigue-monitor',
    title: 'Smart Fatigue & Form Drop Monitor',
    tag: 'Safety & Protection',
    description:
      'Watches your movement speed and balance to notice when your muscles are tired.',
    solution:
      'Prompts you to take a rest break or slow down so you never injure yourself.',
  },
  {
    id: 'goal-nutrition',
    title: 'Goal & Nutrition Alignment',
    tag: 'Your Daily Goal',
    description:
      'Choose your goal: Lose Weight, Maintain Fitness, or Build Muscle.',
    solution:
      'Automatically adjusts your workout targets and daily nutrition advice to match your goal.',
  },
];

export const planPoints: PlanPoint[] = [
  {
    kicker: '01 / YOUR PROFILE',
    title: 'Track Your Streak & Level',
    description:
      'See your daily workout streak, XP level, total reps, and battle record in one easy place.',
  },
  {
    kicker: '02 / YOUR GOAL',
    title: 'Custom Plans For You',
    description:
      'Select Weight Loss, Maintenance, or Muscle Gain to get routines tailored for your needs.',
  },
  {
    kicker: '03 / FORM TARGETS',
    title: 'Clear Movement Guides',
    description:
      'Look at target angles and posture guidelines before you start each workout.',
  },
  {
    kicker: '04 / REAL-TIME COACH',
    title: 'Instant Voice & Visual Tips',
    description:
      'Hear audio cues and see on-screen warnings whenever you need to adjust your posture.',
  },
  {
    kicker: '05 / MATCH SCORES',
    title: 'Points and Leaderboards',
    description:
      'Check your form scores, total repetitions, points earned, and rise up the ranks.',
  },
  {
    kicker: '06 / SMOOTH & COOL',
    title: 'Works Smoothly On Any Phone',
    description:
      'Automatically tunes itself to your phone so it runs smoothly without heating up your battery.',
  },
];

export const exercises: Exercise[] = [
  {
    id: 'squats',
    title: 'Squats',
    meta: 'Lower Body Strength · Hip Control · Leg Drive',
    description:
      'Build lower body strength with measured knee depth, a flat back, and a controlled return.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/squats-exercise-icon-20519.svg',
    imageAlt: 'Squats illustration',
    videoQuery: 'squats+exercise+proper+form',
    badge: 'Core Workout',
  },
  {
    id: 'triangle-pose',
    title: 'Triangle Pose (Trikonasana)',
    meta: 'Mobility · Spine Alignment · Leg Balance',
    description:
      'Open your hips and stretch your leg lines while keeping steady balance and relaxed breathing.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/triangle-pose-exercise-illustrat-3df06.svg',
    imageAlt: 'Triangle Pose illustration',
    videoQuery: 'triangle+pose+yoga+proper+form',
    badge: 'Yoga & Mobility',
  },
  {
    id: 'lunges',
    title: 'Lunges',
    meta: 'Single Leg Balance · Knee Stability · Core',
    description:
      'Strengthen each leg separately with a clean forward step, 90-degree knee bend, and strong push back.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/lunges-exercise-illustration-b16ba.svg',
    imageAlt: 'Lunges illustration',
    videoQuery: 'lunges+exercise+proper+form',
    badge: 'Core Workout',
  },
  {
    id: 'crunches',
    title: 'Crunches',
    meta: 'Abdominal Strength · Core Control · Tempo',
    description:
      'Strengthen your core through a focused upward curl, controlled tempo, and steady form.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/crunches-exercise-icon-ca993.svg',
    imageAlt: 'Crunches illustration',
    videoQuery: 'crunches+exercise+proper+form',
    badge: 'Core Workout',
  },
  {
    id: 'sit-ups',
    title: 'Sit-Ups',
    meta: 'Full Core Power · Hip Connection · Endurance',
    description:
      'Build core endurance with full-range movement, keeping feet flat and your spine protected.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/sit-ups-exercise-illustration-01b38.png',
    imageAlt: 'Sit-Ups illustration',
    videoQuery: 'sit+ups+exercise+proper+form',
    badge: 'Core Workout',
  },
  {
    id: 'bhujangasana',
    title: 'Cobra Pose (Bhujangasana)',
    meta: 'Back Extension · Chest Opening · Posture Correction',
    description:
      'Strengthen your lower back and open your chest with smooth spine extension and shoulder control.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/triangle-pose-exercise-illustrat-3df06.svg',
    imageAlt: 'Cobra Pose illustration',
    videoQuery: 'bhujangasana+cobra+pose+proper+form',
    badge: 'Yoga & Posture',
  },
  {
    id: 'balasana',
    title: "Child's Pose (Balasana)",
    meta: 'Rest & Recovery · Hip Opening · Back Relief',
    description:
      'A gentle resting posture that releases tension from your spine, shoulders, and lower body.',
    image:
      'https://full-rocket-7cbom.sites.repaint.com/imports/sit-ups-exercise-illustration-01b38.png',
    imageAlt: "Child's Pose illustration",
    videoQuery: 'balasana+childs+pose+proper+form',
    badge: 'Recovery & Posture',
  },
];

export const steps: Step[] = [
  {
    num: '01 / SETUP',
    title: 'POSITION YOUR PHONE',
    description:
      'Place your phone against a wall, water bottle, or stand so your front camera can see you clearly.',
  },
  {
    num: '02 / SELECT',
    title: 'CHOOSE YOUR WORKOUT',
    description:
      'Pick a solo session, follow the AI coach, take a posture check, or challenge a friend to a battle.',
  },
  {
    num: '03 / TRAIN',
    title: 'MOVE WITH LIVE FEEDBACK',
    description:
      'Exercise with confidence while your phone counts your clean reps and corrects your posture on the spot.',
  },
  {
    num: '04 / ADVANCE',
    title: 'LEVEL UP & STAY HEALTHY',
    description:
      'Collect points, view your health progress, and rise through the ranks on the leaderboard.',
  },
];

export const bigStats: StatItem[] = [
  {
    value: '06',
    label: 'Workout & Battle Modes',
    detail: 'Solo · AI Tutor · Human vs AI · 1v1 Match · Battleground · Friend Challenge',
  },
  {
    value: '100%',
    label: 'On-Device Privacy',
    detail: 'Your camera video never leaves your phone — everything is processed locally',
  },
  {
    value: '0',
    label: 'Extra Sensors Needed',
    detail: 'No smartwatches or expensive gym equipment needed — just your smartphone',
  },
];

export const feedItems: FeedItem[] = [
  {
    label: 'OJAS ARENA',
    title: 'Live 1v1 and Group Battles',
    description:
      'Challenge friends or workout buddies in live matches. Real-time scoring compares your repetitions and form quality to crown the winner.',
    tags: ['1V1 BATTLES', '10-PLAYER ROOMS', 'LEADERBOARDS'],
  },
  {
    label: 'HEALTH SCREENING',
    title: 'Posture & Alignment Check',
    description:
      'Spot common alignment problems like knock knees and outward feet early, and follow guided recovery routines to protect your joints.',
    tags: ['KNOCK KNEE CHECK', 'FOOT BALANCE CHECK', 'CORRECTIVE DRILLS'],
  },
  {
    label: 'OFFLINE & PRIVATE',
    title: 'Works Anywhere & 100% Private',
    description:
      'Workout whenever you want without an internet connection. Your camera video is never uploaded or shared with anyone.',
    tags: ['OFFLINE MODE', 'ZERO SERVER UPLOAD', 'DATA PRIVACY'],
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'OJAS PLATFORM',
    links: [
      { label: 'Overview', href: '#overview' },
      { label: 'Core Pillars', href: '#pillars' },
      { label: 'Game Modes', href: '#modes' },
      { label: 'Exercise Library', href: '#workouts' },
      { label: 'Health Scanner', href: '#health' },
      { label: 'How It Works', href: '#how' },
    ],
  },
  {
    title: 'PROJECT RESOURCES',
    links: [
      { label: 'Download APK', href: projectLinks.apk },
      { label: 'GitHub Repository', href: projectLinks.github },
      { label: 'Watch Video Demo', href: projectLinks.video },
      { label: 'Live Showcase Site', href: projectLinks.display },
    ],
  },
  {
    title: 'SIH 2026',
    links: [
      { label: 'Team Ojas26 (ID 141537)', href: '#' },
      { label: 'Problem ID: SIH26196', href: '#' },
      { label: 'Theme: Fitness & Sports', href: '#' },
      { label: 'Category: Software', href: '#' },
    ],
  },
];
