export type NavLink = {
  label: string;
  href: string;
};

export type Exercise = {
  id: string;
  title: string;
  meta: string;
  description: string;
  image: string;
  imageAlt: string;
  videoQuery: string;
  badge?: string;
  checks?: string[];
};

export type SystemCard = {
  num: string;
  title: string;
  description: string;
  tags: string[];
  link: { label: string; href: string };
};

export type Step = {
  num: string;
  title: string;
  description: string;
};

export type StatItem = {
  value: string;
  label: string;
  detail: string;
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type GameMode = {
  id: string;
  title: string;
  players: string;
  description: string;
  badge: string;
  details?: string[];
};

export type HealthFeature = {
  id: string;
  title: string;
  tag: string;
  description: string;
  solution: string;
};

export type AppScreen = {
  id: string;
  src: string;
  title: string;
  caption: string;
};

export type RankTier = {
  level: number;
  title: string;
  tier: string;
  color: string;
  points: string;
};

export type ProgressionFeature = {
  kicker: string;
  title: string;
  description: string;
  points: string[];
};

export type ReleaseNote = {
  date: string;
  title: string;
  description: string;
};

export type TechItem = {
  layer: string;
  value: string;
  note: string;
};
