import raw from "@/../content/profile.json";
import siteEn from "@/../content/site.en.json";
import siteKo from "@/../content/site.ko.json";
import type { Profile } from "@/lib/profile";
import { yearOf } from "@/lib/profile";

export type Card = { num: string; title: string; body: string };

type KernelExtras = {
  brand?: string;
  terminal?: { whoami?: string; mission?: string; status?: string };
  portraitNote?: string;
  locationNote?: string;
  projectsIntro?: string;
  projectsNote?: string;
  processStages?: string[];
  projects?: Record<string, { path?: string; mock?: string }>;
};

export const profile = raw as unknown as Profile;
export const site = profile.locale === "ko" ? siteKo : siteEn;
export const extras = (profile.extras?.["kernel-dev"] ?? {}) as KernelExtras;

const { basics } = profile;
const pad = (n: number) => String(n).padStart(2, "0");
const joined = (parts: (string | undefined)[], sep: string) => parts.filter(Boolean).join(sep);

export const BRAND = extras.brand ?? basics.handle ?? basics.name;
export const PROMPT = `${basics.handle ?? basics.shortName ?? basics.name}@${site.terminal.host}: ${site.terminal.path}`;

const { whoami = basics.label, mission = basics.headline, status = basics.availability } = extras.terminal ?? {};
export const TERMINAL_LINES = [
  [site.terminal.whoami, whoami],
  [site.terminal.mission, mission],
  [site.terminal.status, status],
].flatMap(([command, output]) => (output ? [command, `> ${output}`] : []));

export const METRICS = profile.metrics ?? [];

export const PRINCIPLES = (profile.principles ?? []).map((p, i) => `${pad(i + 1)} / ${p}`);

export const SKILLS: Card[] = (profile.skills ?? [])
  .filter((g) => g.items.length > 0)
  .map((g, i) => ({
    num: pad(i + 1),
    title: g.group,
    body: g.items.map((item) => (item.note ? `${item.name}. ${item.note}` : item.name)).join(" · "),
  }));

const span = (start?: string, end?: string) =>
  start ? `${yearOf(start)} — ${end ? yearOf(end) : site.sections.experience.present}` : yearOf(end);

export const TIMELINE = [
  ...(profile.work ?? []).map((w) => ({ date: span(w.start, w.end), role: `${w.company} / ${w.position}`, summary: w.summary })),
  ...(profile.education ?? []).map((e) => ({ date: span(e.start, e.end), role: `${e.institution} / ${e.area}`, summary: e.summary })),
];

export const AWARDS = (profile.awards ?? []).map((a) => ({
  title: a.title,
  summary: a.summary,
  meta: joined([a.issuer, a.date], " / "),
}));

export const PROJECTS = (profile.projects ?? []).map((p) => {
  const tags = (p.tags ?? []).join(" / ");
  const custom = extras.projects?.[p.slug];
  return {
    name: p.name,
    type: p.kind,
    path: custom?.path ?? `~/builds/${p.slug}`,
    mock: custom?.mock ?? joined([`$ open ${p.name}`, tags && `> ${tags}`], "\n"),
    description: p.summary,
    tags,
    live: p.url,
    github: p.repo,
  };
});

export const USE_CASES: Card[] = (profile.services ?? []).map((v, i) => ({ num: pad(i + 1), title: v.name, body: v.summary }));

export const PROCESS: Card[] = (profile.process ?? []).map((step, i) => ({
  num: joined([pad(i + 1), extras.processStages?.[i]], " / "),
  title: step.title,
  body: step.summary,
}));

export const FAQ = (profile.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));

export const SOCIALS = (basics.profiles ?? []).map((l) => ({ label: `${l.network} ↗`, href: l.url }));

export const NAV_LINKS = [
  { label: site.nav.about, href: "#about" },
  ...(SKILLS.length ? [{ label: site.nav.stack, href: "#stack" }] : []),
  ...(PROJECTS.length ? [{ label: site.nav.projects, href: "#projects" }] : []),
  { label: site.nav.contact, href: "#contact" },
];

export const LOCATION_LINE = joined(
  [joined([basics.location?.city, basics.location?.country], ", "), extras.locationNote, basics.location?.timezone],
  "  /  ",
).toUpperCase();

type SectionKey = keyof typeof site.sections;
const SHOWN: Record<SectionKey, boolean> = {
  about: true,
  stack: SKILLS.length > 0,
  experience: TIMELINE.length + AWARDS.length > 0,
  projects: PROJECTS.length > 0,
  useCases: USE_CASES.length > 0,
  process: PROCESS.length > 0,
  faq: FAQ.length > 0,
  contact: true,
};
const ORDER = (Object.keys(SHOWN) as SectionKey[]).filter((key) => SHOWN[key]);

// Numbers follow the visible sections. The source prints contact unpadded ("[ 8 / CONTACT ]").
export const sectionLabel = (key: SectionKey) => {
  const n = ORDER.indexOf(key) + 1;
  return `[ ${key === "contact" ? n : pad(n)} / ${site.sections[key].label} ]`;
};
