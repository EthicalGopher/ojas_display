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
};

export type SystemCard = {
  num: string;
  title: string;
  description: string;
  tags: string[];
  link: { label: string; href: string };
};

export type PlanPoint = {
  kicker: string;
  title: string;
  description: string;
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

export type FeedItem = {
  label: string;
  title: string;
  description: string;
  tags: string[];
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};
