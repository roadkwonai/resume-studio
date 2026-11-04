// Single source: resume-studio/shared/profile.ts. `node scripts/sync-shared.mjs` copies it into every template.
// One content/profile.json in this shape renders in any template. Every list may be empty: the section then disappears.

export type Locale = "ko" | "en";

export type Link = { network: string; url: string; username?: string };
export type Metric = { value: string; label: string };

export type Work = {
  company: string;
  position: string;
  start: string; // YYYY or YYYY-MM
  end?: string; // omitted means present
  url?: string;
  location?: string;
  summary: string;
  highlights?: string[];
  tags?: string[];
};

export type Education = { institution: string; area: string; degree?: string; start?: string; end?: string; summary?: string };
export type Award = { title: string; issuer?: string; date?: string; summary?: string };

export type SkillItem = { name: string; level?: string; years?: number; progress?: number; note?: string; icon?: string; url?: string };
export type SkillGroup = { group: string; items: SkillItem[] };

export type Project = {
  slug: string;
  name: string;
  summary: string;
  kind?: string;
  client?: string;
  role?: string;
  date?: string; // YYYY or YYYY-MM
  timeline?: string;
  tags?: string[];
  url?: string;
  repo?: string;
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  problem?: string;
  solution?: string;
  result?: string;
  body?: string; // markdown
  metrics?: { label: string; before?: string; after: string }[];
  featured?: boolean;
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  tagline?: string;
  includes?: string[];
  steps?: string[];
  price?: string;
  duration?: string;
};

export type Step = { title: string; summary: string };
export type Testimonial = { quote: string; name: string; role?: string; company?: string; avatar?: string };

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  body: string; // markdown
  tag?: string;
  image?: string;
  imageAlt?: string;
  readingTime?: string;
};

export type Repo = { name: string; summary: string; slug?: string; url?: string; stars?: string; pulls?: string; downloads?: string; license?: string; install?: string; body?: string; kind?: string; image?: string };
export type Faq = { question: string; answer: string };
export type NowItem = { title: string; body: string };
export type UsesGroup = { group: string; items: { name: string; note?: string }[] };

export type Profile = {
  locale: Locale;
  basics: {
    name: string;
    label: string; // job title
    headline: string; // the hero sentence, short
    summary: string; // two or three sentences
    about: string[]; // paragraphs for the about section
    email: string;
    shortName?: string;
    initials?: string;
    handle?: string;
    phone?: string;
    website?: string;
    location?: { city: string; country?: string; timezone?: string; mapUrl?: string };
    availability?: string; // "2027년 1월부터 합류 가능"
    responseTime?: string;
    photo?: string; // /profile/...
    photoAlt?: string;
    aboutImage?: string;
    aboutImageAlt?: string;
    resumeFile?: string; // /profile/resume.pdf
    profiles?: Link[];
  };
  metrics?: Metric[];
  principles?: string[];
  work?: Work[];
  education?: Education[];
  awards?: Award[];
  skills?: SkillGroup[];
  projects?: Project[];
  services?: Service[];
  process?: Step[];
  testimonials?: Testimonial[];
  writing?: Post[];
  openSource?: { stats?: Metric[]; repos?: Repo[] };
  faq?: Faq[];
  now?: NowItem[];
  uses?: UsesGroup[];
  contact?: { headline?: string; note?: string; budgets?: string[] };
  features?: { legal?: boolean }; // legal pages stay hidden unless true
  extras?: Record<string, unknown>; // template-only demo fields, keyed by template id; optional by contract
};

const PRESENT: Record<Locale, string> = { ko: "현재", en: "Present" };

export function yearOf(date?: string): string {
  return date ? date.slice(0, 4) : "";
}

export function period(start: string | undefined, end: string | undefined, locale: Locale, sep = " — "): string {
  const from = yearOf(start);
  const to = end ? yearOf(end) : PRESENT[locale];
  if (!from) return "";
  return from === to ? from : `${from}${sep}${to}`;
}

export function initialsOf(profile: Profile): string {
  const { initials, name } = profile.basics;
  if (initials) return initials;
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return /^[가-힣]{3,4}$/.test(name) ? name.slice(-2) : name.slice(0, 2); // 윤하람 → 하람, the given name
}

export function linkOf(profile: Profile, network: string): Link | undefined {
  return profile.basics.profiles?.find((p) => p.network.toLowerCase() === network.toLowerCase());
}
