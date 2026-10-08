import type {
  AppScreen,
  Exercise,
  FooterColumn,
  GameMode,
  HealthFeature,
  NavLink,
  ProgressionFeature,
  RankTier,
  ReleaseNote,
  StatItem,
  Step,
  SystemCard,
  TechItem,
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
  { label: 'Engine', href: '#pillars' },
  { label: 'App', href: '#screens' },
  { label: 'Modes', href: '#modes' },
  { label: 'Ranks', href: '#ranks' },
  { label: 'Scanner', href: '#health' },
  { label: 'Library', href: '#workouts' },
  { label: 'Updates', href: '#updates' },
];

export const heroStats: StatItem[] = [
  { value: '33', label: 'Body landmarks', detail: 'Tracked live by MediaPipe Pose on the phone GPU' },
  { value: '6', label: 'Ways to play', detail: 'Solo, AI Tutor, Human vs AI, Quick Duel, Battle Ground, Friends' },
  { value: '0', label: 'Frames uploaded', detail: 'Camera video never leaves your phone' },
  { value: '6', label: 'Rank tiers', detail: 'Bronze to Immortal' },
];

export const heroCapabilities: string[] = [
  'Pose tracking',
  'Rep counting',
  'Form correction',
  'Posture scan',
  'Ranked battles',
];

export const tunnelLeft: string[] = [
  'Pose tracking', 'Rep counting', 'Knee angle', 'Squat depth', 'Elbow angle', 'Hip hinge',
  'Jump rhythm', 'Hold timer', 'Form score', 'Voice cues', 'Tempo', 'Balance',
  'Fatigue watch', 'Spine check', 'Shoulder level', 'Knee valgus', 'Foot angle', 'Calories',
  'Offline mode', '33 landmarks',
];

export const tunnelRight: string[] = [
  'Human vs AI', 'Quick Duel', 'Battle Ground', 'Friend invites', 'Squads', 'Arena',
  'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal',
  'XP', 'Coins', '3D avatars', 'Outfits', 'Streaks', 'Daily challenges',
  'Leaderboards', 'Achievements',
];

export const tickerItems: string[] = [
  'On-device pose tracking',
  'Automatic rep counting',
  'Live form correction',
  'Human vs AI duels',
  'Live 1v1 battles',
  '3D avatars and shop',
  'Squads and leagues',
  'Posture scanner',
  'Tree Pose hold classifier',
  'Daily streaks',
  'Works offline',
];

export const systemCards: SystemCard[] = [
  {
    num: '01',
    title: 'Camera coach',
    description:
      'Prop your phone up and move. Ojas follows 33 points on your body, counts every clean rep, and tells you out loud when your knees cave or your back rounds.',
    tags: ['33-point pose tracking', 'Auto rep count', 'Voice and on-screen tips'],
    link: { label: 'How it works', href: '#how' },
  },
  {
    num: '02',
    title: 'Battles and ranks',
    description:
      'Duel an AI at four difficulty levels, take on a friend in a live 2-minute split-screen match, or climb a Battle Ground leaderboard. Every rep earns XP, coins and rank.',
    tags: ['Human vs AI', 'Live 1v1', 'Squads', 'Bronze to Immortal'],
    link: { label: 'See the modes', href: '#modes' },
  },
  {
    num: '03',
    title: 'Posture scanner',
    description:
      'A 3-second full-body scan checks shoulder level, hips and pelvis, knee alignment and spine. Ojas then builds a short daily routine to fix what it finds.',
    tags: ['3-second scan', 'Knee valgus check', 'Corrective plans'],
    link: { label: 'Try the scanner', href: '#health' },
  },
];

export const appScreens: AppScreen[] = [
  {
    id: 'home',
    src: '/screens/home_screen.webp',
    title: 'Home feed',
    caption: 'Week calendar, energy burned, daily challenges and the 3-second posture check, one tap away.',
  },
  {
    id: 'tracking',
    src: '/screens/ai_rep_tracking.webp',
    title: 'Live rep tracking',
    caption: 'The camera overlay draws your skeleton and counts reps as you move. Here: squats with the AI Tutor.',
  },
  {
    id: 'scan',
    src: '/screens/ai_body_scan.webp',
    title: 'Posture scanner',
    caption: 'Shoulders, hips and knees are checked against level lines while you hold still for three seconds.',
  },
  {
    id: 'versus',
    src: '/screens/human_vs_ai.webp',
    title: 'Human vs AI',
    caption: 'A 2-minute duel against an AI opponent that paces itself to the difficulty you pick.',
  },
  {
    id: 'catalog',
    src: '/screens/exercise_catalog.webp',
    title: 'Exercise catalog',
    caption: 'Strength moves and yoga poses, each with the angles the AI checks before you start.',
  },
];

export const gameModes: GameMode[] = [
  {
    id: 'solo',
    title: 'Solo Training',
    players: '1 player',
    description: 'Train at your own pace with automatic rep counts and form tips on every set.',
    badge: 'Works offline',
  },
  {
    id: 'ai-tutor',
    title: 'AI Tutor',
    players: 'Guided',
    description: 'A coach that calls out each phase of the movement — top, down, hold — and keeps you on tempo.',
    badge: 'Voice coaching',
  },
  {
    id: 'human-vs-ai',
    title: 'Human vs AI',
    players: '1 vs bot',
    description: 'A 2-minute battle against an AI opponent with live rep and calorie comparison.',
    badge: '4 difficulty levels',
    details: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
  },
  {
    id: 'quick-duel',
    title: 'Quick Duel',
    players: '1 vs 1',
    description:
      'Live split-screen match against a friend or a matched player. If nobody is free, a level-matched opponent steps in so you never wait.',
    badge: 'Live multiplayer',
    details: ['2-min rounds', 'Versus intro', 'Synced scoreboard'],
  },
  {
    id: 'battleground',
    title: 'Battle Ground',
    players: 'Up to 10',
    description: 'An open free-for-all room. Everyone does the same move; the live leaderboard decides.',
    badge: 'Group race',
  },
  {
    id: 'friend-challenge',
    title: 'Friend Challenge',
    players: 'Invite',
    description: 'Add fitness friends and send a one-tap battle invite straight from your list.',
    badge: 'Social',
  },
];

export const rankTiers: RankTier[] = [
  { level: 1, title: 'Rookie', tier: 'Bronze', color: '#CD7F32', points: '0 – 99' },
  { level: 2, title: 'Challenger', tier: 'Silver', color: '#C7C7CC', points: '100 – 249' },
  { level: 3, title: 'Warrior', tier: 'Gold', color: '#D9A441', points: '250 – 499' },
  { level: 4, title: 'Master', tier: 'Platinum', color: '#DCD6CC', points: '500 – 999' },
  { level: 5, title: 'Champion', tier: 'Diamond', color: '#F1ECE4', points: '1,000 – 1,999' },
  { level: 6, title: 'Grandmaster', tier: 'Immortal', color: '#C2283A', points: '2,000+' },
];

export const progression: ProgressionFeature[] = [
  {
    kicker: 'Avatar shop',
    title: 'Your 3D character',
    description:
      'Your avatar stands in your profile wearing its current outfit, hair and accessory. Try anything on the 3D model before you buy it.',
    points: ['Characters, outfits, hair, accessories', '1 coin for every 10 XP', 'Separate loadout per character'],
  },
  {
    kicker: 'Squads',
    title: 'Train as a crew',
    description:
      'Squads have their own level and Squad Power, a top-3 podium, a ranked roster and Arena tournaments. Leagues are marked with fortress crests.',
    points: ['Squad Power ranking', 'Arena tournaments', 'League crests'],
  },
  {
    kicker: 'Streaks',
    title: 'Keep the fire lit',
    description:
      'A daily streak screen with a week chain and milestone progress. Optional reminders at 7:00 PM and 9:30 PM open straight into Train.',
    points: ['Week chain and milestones', 'Evening reminders', 'Daily challenges'],
  },
];

export const healthFeatures: HealthFeature[] = [
  {
    id: 'knock-knee',
    title: 'Knock knee screening',
    tag: 'Knee valgus',
    description: 'Checks whether your knees drift inward when you stand or squat, before it turns into pain.',
    solution: 'Hip and glute strengthening drills to pull the knees back over the toes.',
  },
  {
    id: 'pelvis',
    title: 'Shoulder and pelvis level',
    tag: 'Alignment',
    description: 'Compares the height of both shoulders and both hips to spot tilt and uneven loading.',
    solution: 'Targeted stretches and single-side work to even things out.',
  },
  {
    id: 'duck-foot',
    title: 'Duck foot check',
    tag: 'Foot balance',
    description: 'Spots feet that point outward while you move, which throws off knee and hip tracking.',
    solution: 'Calf stretches, hip rotations and ankle mobility drills.',
  },
  {
    id: 'fatigue-monitor',
    title: 'Fatigue and form drop',
    tag: 'Safety',
    description: 'Watches your speed and balance through a set and notices when your form starts to slip.',
    solution: 'Prompts a rest or a slower tempo before tired reps become injuries.',
  },
];

export const scanChecks = [
  { label: 'Shoulders', value: 'Level', ok: true },
  { label: 'Hips & pelvis', value: 'Tilted', ok: false },
  { label: 'Knees', value: 'Caving in', ok: false },
  { label: 'Spine', value: 'Straight', ok: true },
];

export const exercises: Exercise[] = [
  {
    id: 'squats',
    title: 'Squats',
    meta: 'Legs · Glutes · Core',
    description: 'Full-depth squats with a flat back and a controlled stand.',
    image: 'https://full-rocket-7cbom.sites.repaint.com/imports/squats-exercise-icon-20519.svg',
    imageAlt: 'Squats illustration',
    videoQuery: 'squats+exercise+proper+form',
    badge: 'Strength',
    checks: ['Knee bend depth', 'Back posture', 'Standing lockout'],
  },
  {
    id: 'push-ups',
    title: 'Push-ups',
    meta: 'Chest · Triceps · Core',
    description: 'Chest to the floor, arms locked at the top, body in one straight line.',
    image: '/screens/a-guy-doing-pushups.svg',
    imageAlt: 'Push-ups illustration',
    videoQuery: 'push+ups+proper+form',
    badge: 'Strength',
    checks: ['Chest drop depth', 'Arm extension', 'Straight core'],
  },
  {
    id: 'lunges',
    title: 'Lunges',
    meta: 'Single leg · Balance · Knees',
    description: 'A clean step forward, a 90-degree front knee and a strong push back.',
    image: 'https://full-rocket-7cbom.sites.repaint.com/imports/lunges-exercise-illustration-b16ba.svg',
    imageAlt: 'Lunges illustration',
    videoQuery: 'lunges+exercise+proper+form',
    badge: 'Strength',
    checks: ['Front knee angle', 'Back knee clearance', 'Vertical spine'],
  },
  {
    id: 'crunches',
    title: 'Crunches',
    meta: 'Abs · Core control',
    description: 'A focused curl that works the abs without pulling on the neck.',
    image: 'https://full-rocket-7cbom.sites.repaint.com/imports/crunches-exercise-icon-ca993.svg',
    imageAlt: 'Crunches illustration',
    videoQuery: 'crunches+exercise+proper+form',
    badge: 'Core',
    checks: ['Shoulder lift angle', 'Core contraction', 'No neck pulling'],
  },
  {
    id: 'tree-pose',
    title: 'Tree Pose (Vrikshasana)',
    meta: 'Balance · Hips · Focus',
    description:
      'Scored by your longest unbroken hold. An on-device image classifier confirms the stance before the timer starts.',
    image: '/screens/a-female-doing-yoga.svg',
    imageAlt: 'Tree Pose illustration',
    videoQuery: 'tree+pose+vrikshasana+proper+form',
    badge: 'New · Yoga',
    checks: ['Standing leg straight', 'Foot placement', 'Best hold time'],
  },
  {
    id: 'triangle-pose',
    title: 'Triangle Pose (Trikonasana)',
    meta: 'Mobility · Hips · Spine',
    description: 'Open the hips and lengthen both sides while keeping steady balance.',
    image: 'https://full-rocket-7cbom.sites.repaint.com/imports/triangle-pose-exercise-illustrat-3df06.svg',
    imageAlt: 'Triangle Pose illustration',
    videoQuery: 'triangle+pose+yoga+proper+form',
    badge: 'Yoga',
    checks: ['Leg straightness', 'Lateral hip hinge', 'Arm reach'],
  },
  {
    id: 'bhujangasana',
    title: 'Cobra Pose (Bhujangasana)',
    meta: 'Back extension · Chest',
    description: 'Strengthen the lower back and open the chest with a smooth lift.',
    image: '',
    imageAlt: 'Cobra Pose',
    videoQuery: 'bhujangasana+cobra+pose+proper+form',
    badge: 'Yoga',
    checks: ['Chest elevation', 'Lower back arch', 'Neck alignment'],
  },
  {
    id: 'balasana',
    title: "Child's Pose (Balasana)",
    meta: 'Recovery · Lower back',
    description: 'A resting hold that releases the spine, shoulders and hips.',
    image: '/screens/a-guy-doing-child_pose.svg',
    imageAlt: "Child's Pose illustration",
    videoQuery: 'balasana+childs+pose+proper+form',
    badge: 'Recovery',
    checks: ['Deep hip rest', 'Arm stretch', 'Hold timer'],
  },
];

export const steps: Step[] = [
  {
    num: '01',
    title: 'Prop your phone',
    description: 'Lean it on a wall or a bottle about six feet away so the camera sees your whole body.',
  },
  {
    num: '02',
    title: 'Pick a mode',
    description: 'Solo, AI Tutor, a posture scan, or a battle against the AI, a friend or a full room.',
  },
  {
    num: '03',
    title: 'Move',
    description: 'Ojas counts clean reps and corrects your form out loud while you train.',
  },
  {
    num: '04',
    title: 'Level up',
    description: 'Earn XP and coins, keep your streak, climb the ranks and kit out your avatar.',
  },
];

export const releaseNotes: ReleaseNote[] = [
  {
    date: '04 Oct 2026',
    title: '3D avatars, rank emblems and Squads',
    description:
      'An offline 3D avatar viewer and shop with live try-on, new Bronze-to-Immortal emblems, a game-style Squad screen with Arena cards, and a new streak screen with evening reminders.',
  },
  {
    date: '24 Sep 2026',
    title: 'Tree Pose with an on-device classifier',
    description:
      'Tree Pose joins the library. Pose geometry is cross-checked by a 24 MB image model that runs offline on the phone, and you are scored by your best hold time.',
  },
  {
    date: '24 Sep 2026',
    title: 'Light and dark mode, new home feed',
    description:
      'An app-wide theme toggle, a swipeable featured carousel, an activity grid with energy and reps, an animated streak splash and a redesigned match camera setup.',
  },
  {
    date: '24 Sep 2026',
    title: 'Gamified redesign and instant matchmaking',
    description:
      'XP, levels, achievements and level-up celebrations, a live news feed, a versus intro before every match, and a stand-in opponent when nobody is free to play.',
  },
];

export const techStack: TechItem[] = [
  { layer: 'Pose engine', value: 'MediaPipe Pose', note: 'On-device, GPU accelerated' },
  { layer: 'Pose classifier', value: 'ResNet50 · int8 ONNX', note: '24 MB, runs offline in a worker' },
  { layer: 'Mobile', value: 'React Native · Expo SDK 57', note: 'TypeScript' },
  { layer: '3D avatars', value: 'three.js · three-vrm', note: 'VRM and GLB, offline viewer' },
  { layer: 'Live matches', value: 'FastAPI · WebSockets', note: 'Synced reps and scoreboards' },
  { layer: 'Data & auth', value: 'Supabase', note: 'Database, auth, realtime channels' },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Engine', href: '#pillars' },
      { label: 'Game modes', href: '#modes' },
      { label: 'Ranks & avatars', href: '#ranks' },
      { label: 'Posture scanner', href: '#health' },
      { label: 'Exercise library', href: '#workouts' },
      { label: 'Release notes', href: '#updates' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Download APK', href: projectLinks.apk },
      { label: 'GitHub repository', href: projectLinks.github },
      { label: 'Video demo', href: projectLinks.video },
      { label: 'Showcase site', href: projectLinks.display },
    ],
  },
  {
    title: 'SIH 2026',
    links: [
      { label: 'Team Ojas26 · ID 141537', href: '#' },
      { label: 'Problem ID SIH26196', href: '#' },
      { label: 'Theme: Fitness & Sports', href: '#' },
      { label: 'Category: Software', href: '#' },
    ],
  },
];
