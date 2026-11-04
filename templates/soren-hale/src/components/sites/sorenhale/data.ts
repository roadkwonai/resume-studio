// Thin adapter: content/profile.json + content/site.<locale>.json -> the shapes the sections render.
// Optional values become "" or [] here, so sections only have to hide what is empty.

import raw from "@/../content/profile.json";
import en from "@/../content/site.en.json";
import ko from "@/../content/site.ko.json";
import { initialsOf, yearOf, type Profile } from "@/lib/profile";

export const profile = raw as unknown as Profile;
const { basics } = profile;

type Fact = { label: string; value: string };
type Commit = { repo: string; subject: string; meta: string };

/** profile.extras["soren-hale"]: demo fields with no home in Profile. All optional; whatever is missing is hidden. */
interface Extras {
  heroLines?: string[];
  eyebrow?: string;
  commits?: { home?: Commit; now?: Commit; stack?: Commit };
  facts?: { about?: Fact[]; work?: Fact[]; services?: Fact[]; writing?: Fact[] };
  bench?: {
    eyebrow: string; heading: string; lead: string; note: string; more: string; vitalsTitle: string; vitalsNote: string;
    scores: { label: string; score: number }[];
    vitals: { short: string; name: string; value: string; v: number; budget: string; b: number }[];
  };
  story?: { when: string; title: string }[];
  principleNotes?: string[];
  now?: { updated?: string; line?: string; rows?: [string, string][]; dates?: string[] };
  process?: { when?: string; get?: string }[];
  services?: Record<string, { steps?: { when?: string; summary?: string }[]; faqs?: { question: string; answer: string }[] }>;
  stackLevels?: { level: string; meaning: string }[];
  repoAlts?: Record<string, string>;
  jobKeys?: Record<string, string>;
  languages?: [string, string][];
  talks?: { title: string; place: string; year: string }[];
  uses?: { links?: Record<string, string>; config?: { title: string; file: string; label: string; after: number; code: string } };
  /** per-person wording: overrides single keys of site.<locale>.json, e.g. { "work": { "heading": "..." } } */
  copy?: Record<string, Record<string, string>>;
}

export const extras = (profile.extras?.["soren-hale"] ?? {}) as Extras;

/** {name}-style placeholders; ones not listed here stay in the string for counted() or fill() at the call site */
const vars: Record<string, string> = { name: basics.name, label: basics.label, summary: basics.summary, email: basics.email, city: basics.location?.city ?? "" };
export const fill = (s: string, more: Record<string, string | number> = {}) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => String(more[k] ?? vars[k] ?? m));

type Ui = typeof en;
const base: Ui = profile.locale === "ko" ? ko : en;
export const ui = Object.fromEntries(
  Object.entries(base).map(([g, strings]) => [
    g,
    Object.fromEntries(Object.entries({ ...strings, ...extras.copy?.[g] }).map(([k, v]) => [k, fill(v)])),
  ]),
) as Ui;

/** "{count} tool(s)": {count} as a word, {n} as digits, (s) only when plural */
export const counted = (s: string, n: number) =>
  fill(s, { count: (ui.words as Record<string, string>)[n] ?? n, n }).replace(/\(s\)/g, n === 1 ? "" : "s");

/** lime accent on the last word, unless the text already marks its own */
export const accent = (s: string) => (s.includes("*") ? s : s.replace(/(\S+)\s*$/, "*$1*"));

/** No portrait in the profile: a template color field with the initials. The hero's code effect samples it like a photo. */
const initialsPicture = () => {
  const text = initialsOf(profile).replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><rect width="1200" height="1500" fill="#14161a"/><text x="600" y="640" text-anchor="middle" dominant-baseline="central" font-family="-apple-system,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',Arial,sans-serif" font-weight="700" font-size="${text.length > 2 ? 340 : 480}" fill="#c6ff3d">${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const site = {
  name: basics.name,
  role: basics.label,
  intro: basics.summary,
  email: basics.email,
  headline: basics.headline,
  about: basics.about,
  eyebrow: extras.eyebrow ?? basics.label,
  status: basics.availability ?? "",
  city: basics.location?.city ?? "",
  timeZone: basics.location?.timezone ?? "",
  replyNote: basics.responseTime ?? "",
  phone: basics.phone ?? "",
  workHref: "/work",
  resumeHref: "/resume",
  resumeFile: basics.resumeFile ?? "",
  cvHref: basics.resumeFile || "/resume",
  heroImage: basics.photo || initialsPicture(),
  heroAlt: basics.photoAlt || basics.name,
  aboutImage: basics.aboutImage || basics.photo || initialsPicture(),
  aboutAlt: basics.aboutImageAlt || (basics.aboutImage ? "" : basics.photoAlt) || basics.name,
  social: (basics.profiles ?? []).map((p) => ({ l: p.network, h: p.url })),
  metrics: profile.metrics ?? [],
  principles: (profile.principles ?? []).map((t, i) => ({ t, p: extras.principleNotes?.[i] ?? "" })),
  education: profile.education ?? [],
  awards: profile.awards ?? [],
  budgets: profile.contact?.budgets ?? [],
  contactHeading: accent(profile.contact?.headline || ui.cta.heading),
  contactLead: profile.contact?.note || ui.form.lead,
};

export const faqs = (profile.faq ?? []).map((f, i) => ({ slug: String(i), ...f }));

export const reviews = (profile.testimonials ?? []).map((r, i) => ({
  slug: String(i),
  quote: r.quote,
  name: r.name,
  role: [r.role, r.company].filter(Boolean).join(" · "),
  avatar: r.avatar ?? "",
}));

export const posts = (profile.writing ?? []).map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.summary,
  date: p.date,
  read: p.readingTime ?? "",
  body: p.body,
  alt: p.imageAlt ?? "",
  tag: p.tag ?? "",
  image: p.image ?? "",
}));
export type Post = (typeof posts)[number];

export const labItems = (profile.openSource?.repos ?? []).map((r, i) => {
  const slug = r.slug || `repo-${i + 1}`;
  return {
    slug,
    name: r.name,
    summary: r.summary,
    stars: r.stars ?? "",
    downloads: r.downloads ?? "",
    kind: r.kind ?? "",
    alt: extras.repoAlts?.[slug] ?? "",
    repo: r.url ?? "",
    install: r.install ?? "",
    body: r.body ?? "",
    license: r.license ?? "",
    image: r.image ?? "",
  };
});
export type LabItem = (typeof labItems)[number];
export const labStats = profile.openSource?.stats ?? [];

export const stackItems = (profile.skills ?? []).flatMap((g) =>
  g.items.map((s) => ({
    slug: `${g.group}-${s.name}`,
    name: s.name,
    group: g.group,
    years: s.years === undefined ? "" : String(s.years),
    frequency: s.level ?? "",
    note: s.note ?? "",
  })),
);
export type StackItem = (typeof stackItems)[number];

export const jobs = (profile.work ?? []).map((w) => ({
  // the fake commit hash in the career log is derived from this key
  slug: extras.jobKeys?.[w.company] ?? w.company.toLowerCase().replace(/\s+/g, "-"),
  role: w.position,
  company: w.company,
  start: yearOf(w.start),
  end: yearOf(w.end),
  summary: w.summary,
  tech: w.tags ?? [],
  place: w.location ?? "",
}));

export const services = (profile.services ?? []).map((s) => {
  const more = extras.services?.[s.slug];
  return {
    slug: s.slug,
    name: s.name,
    tagline: s.tagline ?? "",
    summary: s.summary,
    price: s.price ?? "",
    duration: s.duration ?? "",
    includes: s.includes ?? [],
    steps: (s.steps ?? []).map((t, i) => ({ t, when: more?.steps?.[i]?.when ?? "", l: more?.steps?.[i]?.summary ?? "" })),
    faqs: more?.faqs ?? [],
  };
});
export type Service = (typeof services)[number];

export const projects = (profile.projects ?? []).map((p) => {
  const metric = p.metrics?.[0];
  return {
    slug: p.slug,
    title: p.name,
    client: p.client ?? "",
    year: yearOf(p.date),
    role: p.role ?? "",
    timeline: p.timeline ?? "",
    summary: p.summary,
    before: metric?.before ?? "",
    after: metric?.after ?? "",
    metricLabel: metric?.label ?? "",
    stack: p.tags ?? [],
    body: p.body ?? "",
    alt: p.imageAlt ?? "",
    tag: p.kind ?? "",
    intro: p.problem ?? "",
    changes: p.solution ?? "",
    result: p.result ?? "",
    image: p.image ?? "",
    gallery: p.gallery ?? [],
    link: p.url || p.repo || "",
    featured: !!p.featured,
  };
});
export type Project = (typeof projects)[number];

export const nowItems = (profile.now ?? []).map((n, i) => ({ d: extras.now?.dates?.[i] ?? "", t: n.title, l: n.body }));

export const processSteps = (profile.process ?? []).map((s, i) => ({ t: s.title, l: s.summary, when: extras.process?.[i]?.when ?? "", get: extras.process?.[i]?.get ?? "" }));

export const usesGroups = (profile.uses ?? []).map((g) => ({
  title: g.group,
  rows: g.items.map((r) => ({ n: r.name, t: r.note ?? "", h: extras.uses?.links?.[r.name] })),
}));

const legal = !!profile.features?.legal;
const hidden: Record<string, boolean> = {
  "/work": !projects.length,
  "/services": !services.length,
  "/lab": !labItems.length,
  "/writing": !posts.length,
  "/stack": !stackItems.length,
  "/uses": !usesGroups.length,
  "/now": !nowItems.length,
  "/process": !processSteps.length,
  "/reviews": !reviews.length,
  "/faq": !faqs.length,
  "/privacy": !legal,
  "/terms": !legal,
  "/cookies": !legal,
};
/** false for a route whose content is empty: nav and footer drop the link, the page calls notFound() */
export const live = (href: string) => !hidden[href];
