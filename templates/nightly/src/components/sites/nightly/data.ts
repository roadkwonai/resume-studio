import raw from "@/../content/profile.json";
import en from "@/../content/site.en.json";
import ko from "@/../content/site.ko.json";
import { initialsOf, yearOf, type Profile } from "@/lib/profile";
import { fill, splitFigure } from "./format";

/** Everything a template-only field can hold. All optional: without it the spot falls back to the profile or disappears. */
type Copy = { lead?: string; rest?: string; text?: string };
type Extras = {
  place?: string;
  ogImage?: string;
  drafts?: { message: string; when: string; text: string }[];
  statement?: string[];
  homeStory?: string[];
  workingAs?: string;
  takingOn?: string;
  hours?: string;
  footerNote?: string;
  tools?: string;
  resumeNote?: string;
  contactRest?: string;
  moved?: { before?: string; after?: string };
  pages?: { work?: Copy; about?: Copy; services?: Copy; writing?: Copy; contact?: Copy };
  form?: { namePlaceholder?: string; messageLabel?: string; messagePlaceholder?: string };
  projects?: Record<string, { note?: string; line?: string; next?: string }>;
  services?: Record<string, { fit?: string }>;
};

export const profile = raw as unknown as Profile;
export const site: typeof en = profile.locale === "ko" ? ko : en;
export const extras = (profile.extras?.nightly ?? {}) as Extras;

const { basics } = profile;
export const EMAIL = basics.email;
export const NAME = basics.name;
export const initials = initialsOf(profile);
export const place = extras.place ?? basics.location?.city ?? "";
export const pageTitle = (title: string) => `${title} · ${NAME}`;
export const byline = [basics.label, basics.location?.city].filter(Boolean).join(", ");

export const projects = (profile.projects ?? []).map((p, i, all) => {
  const metric = p.metrics?.[0];
  const more = extras.projects?.[p.slug];
  return {
    ...p,
    year: yearOf(p.date),
    stack: p.tags?.join(", ") ?? "",
    metric,
    ...splitFigure(metric?.after ?? ""),
    note: more?.note ?? (metric?.before ? fill(site.project.was, { before: metric.before }) : ""),
    line: more?.line ?? (metric ? fill(metric.before ? site.project.line : site.project.lineAfter, metric) : ""),
    next: all.find((q) => q.slug === more?.next) ?? all[i + 1],
  };
});
export type Project = (typeof projects)[number];

export const heroProject = projects.find((p) => p.featured) ?? projects[0];
/** The closing scene needs a before and an after, so it prefers the hero project and otherwise takes the first that has both. */
export const movedProject = heroProject?.metric?.before ? heroProject : projects.find((p) => p.metric?.before);
/** The width-folding scene needs a desktop, tablet and phone shot: `image` plus two `gallery` entries. */
export const hasScreens = (p: Project) => Boolean(p.image) && (p.gallery?.length ?? 0) >= 2;
export const screensProject = projects.find(hasScreens);

const result = heroProject?.line ? `${heroProject.line}.` : "";
export const hero = {
  result,
  drafts:
    extras.drafts && extras.drafts.length > 1
      ? extras.drafts
      : [
          { message: site.hero.firstDraft, when: "", text: basics.summary.split(/(?<=[.!?])\s/)[0] }, // one sentence: the stage is sized for about 90 characters
          { message: site.hero.shorter, when: "", text: basics.headline },
          ...(result ? [{ message: site.hero.addNumber, when: "", text: basics.headline }] : []),
        ],
};

export const services = (profile.services ?? []).map((v) => ({
  ...v,
  terms: v.duration,
  get: v.includes ?? [],
  steps: v.steps ?? [],
  fit: extras.services?.[v.slug]?.fit,
}));

const dateTag = profile.locale === "ko" ? "ko-KR" : "en-US";
const formatDate = (date: string, month: "short" | "long") => {
  const d = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString(dateTag, { year: "numeric", month, day: "numeric", timeZone: "UTC" });
};
export const posts = (profile.writing ?? []).map((p, i, all) => ({
  ...p,
  v: `v1.${all.length - i}`, // the newest post is always the highest release
  short: formatDate(p.date, "short"),
  long: formatDate(p.date, "long"),
  next: all[i + 1],
}));

export const testimonials = (profile.testimonials ?? []).map((t) => ({ ...t, role: [t.role, t.company].filter(Boolean).join(", ") }));
export const faq = profile.faq ?? [];
export const experience = (profile.work ?? []).map((w) => ({
  years: `${yearOf(w.start)}–${w.end ? yearOf(w.end) : site.about.now}`,
  role: w.position,
  org: w.company,
  text: w.summary,
}));
export const howIWork = profile.process ?? [];
export const tools = extras.tools ?? (profile.skills ?? []).flatMap((g) => g.items.map((i) => i.name)).join(", ");
export const links = basics.profiles ?? [];
export const legalOn = profile.features?.legal === true;

export const nav = [
  { href: "/work", label: site.nav.work, on: projects.length > 0 },
  { href: "/about", label: site.nav.about, on: true },
  { href: "/services", label: site.nav.services, on: services.length > 0 },
  { href: "/writing", label: site.nav.writing, on: posts.length > 0 },
  { href: "/contact", label: site.nav.contact, on: true },
].filter((n) => n.on);

export const servicesLead = site.pages.services.leads[services.length - 1] ?? site.pages.services.leadMany;
const pg = extras.pages ?? {};
export const pages = {
  work: { ...site.pages.work, ...pg.work },
  about: { label: site.pages.about.label, lead: basics.label, rest: basics.headline, ...pg.about },
  services: { label: site.pages.services.label, lead: servicesLead, ...pg.services },
  writing: { ...site.pages.writing, ...pg.writing },
  contact: { label: site.pages.contact.label, lead: profile.contact?.headline ?? site.pages.contact.lead, text: profile.contact?.note, ...pg.contact },
};

export const ctaHeading = profile.contact?.headline ?? site.cta.headline;
export const ctaNote = profile.contact?.note ?? [basics.availability, basics.responseTime].filter(Boolean).join(" ");
