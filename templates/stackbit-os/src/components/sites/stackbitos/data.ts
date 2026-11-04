import raw from "@/../content/profile.json";
import en from "@/../content/site.en.json";
import ko from "@/../content/site.ko.json";
import { initialsOf, period } from "@/lib/profile";
import type { Profile, SkillItem } from "@/lib/profile";

type Extras = {
  osName?: string;
  siteTitle?: string;
  experience?: string;
  focus?: string;
  quote?: string;
  codeStack?: string[];
  codeStatus?: string;
  codeEmail?: string;
  globeMarker?: [number, number]; // [longitude, latitude]
  caseStudies?: Record<string, string>; // project slug -> url
};

export const profile = raw as unknown as Profile;
export const site: typeof en = profile.locale === "ko" ? ko : en;
export const extras = (profile.extras?.["stackbit-os"] ?? {}) as Extras;

const { basics } = profile;

export const INITIALS = initialsOf(profile);
export const OS_LABEL = extras.osName ?? INITIALS.toUpperCase();
export const PAGE_TITLE = extras.siteTitle ?? `${basics.name} · ${basics.label}`;
export const CONTACT_EMAIL = basics.email;

export const CV_URL = basics.resumeFile;
export const CV_FILENAME = `${basics.name.trim().toLowerCase().replace(/\s+/g, "-")}-cv${CV_URL?.match(/\.[^./]+$/)?.[0] ?? ""}`;

export const CITY = basics.location?.city;
export const LOCATION = basics.location && [basics.location.city, basics.location.country].filter(Boolean).join(", ");
export const LOCATION_URL = basics.location?.mapUrl;

function validTimeZone(timeZone?: string) {
  if (!timeZone) return undefined;
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone });
    return timeZone;
  } catch {
    return undefined;
  }
}

export const TIME_ZONE = validTimeZone(basics.location?.timezone);

export const profileFacts = [
  { label: site.profile.experience, value: extras.experience },
  { label: site.profile.focus, value: extras.focus },
  { label: site.profile.responseTime, value: basics.responseTime, accent: true },
].filter((fact) => fact.value);

const allPrinciples = profile.principles ?? [];
const half = Math.ceil(allPrinciples.length / 2);
export const principles = [allPrinciples.slice(0, half), allPrinciples.slice(half)].filter((column) => column.length);
export const principlesPerColumn = half;

export const metrics = profile.metrics ?? [];

const skills = (profile.skills ?? []).filter((group) => group.items.length);
export const techGroups = skills.filter((group) => group.items.some((item) => item.progress !== undefined));
export const skillPanels = skills.filter((group) => !techGroups.includes(group));

export function skillLevel({ level, years }: SkillItem) {
  const duration = years === undefined ? "" : (years === 1 ? site.tech.year : site.tech.years).replace("{n}", String(years));
  return [level, duration].filter(Boolean).join(" / ");
}

export const experience = (profile.work ?? []).map((job) => ({
  period: period(job.start, job.end, profile.locale).toUpperCase(),
  title: `${job.position} · ${job.company}`,
  body: job.summary,
}));

function projectDate(date?: string) {
  const [year, month] = date?.split("-") ?? [];
  return month ? `${month} / ${year}` : year;
}

export const projects = (profile.projects ?? []).map((project) => ({
  ...project,
  date: projectDate(project.date),
  links: [
    { label: site.projects.caseStudy, href: extras.caseStudies?.[project.slug] },
    { label: site.projects.livePreview, href: project.url },
    { label: site.projects.github, href: project.repo },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href)),
}));

export const openSourceStats = profile.openSource?.stats ?? [];
export const repositories = profile.openSource?.repos ?? [];

const codeStack = extras.codeStack ?? skills.flatMap((group) => group.items).slice(0, 3).map((item) => item.name);
const codeStatus = extras.codeStatus ?? basics.availability;
const codeConstants = [
  ...(codeStack.length ? [`  const stack = [${codeStack.map((name) => `"${name}"`).join(", ")}]`] : []),
  ...(codeStatus ? [`  const status = "${codeStatus}"`] : []),
];

export const codeSample = [
  ...(projects.length ? [`import { projects } from "./data"`, ""] : []),
  "export default function Portfolio() {",
  ...codeConstants,
  ...(codeConstants.length ? [""] : []),
  "  return (",
  `    <main className="developer-cv">`,
  `      <Hero name="${basics.name}"${codeStatus ? " status={status}" : ""} />`,
  ...(codeStack.length ? ["      <Skills items={stack} />"] : []),
  ...(projects.length ? ["      <Projects data={projects} />"] : []),
  `      <Contact email="${extras.codeEmail ?? CONTACT_EMAIL}" />`,
  "    </main>",
  "  )",
  "}",
].join("\n");

const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const contactLinks: { label: string; value: string; href?: string }[] = [
  { label: site.contact.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  ...(basics.profiles ?? []).map((link) => ({ label: link.network, value: bareUrl(link.url), href: link.url })),
  ...(LOCATION ? [{ label: site.contact.location, value: LOCATION, href: LOCATION_URL }] : []),
];

export const visibleSections = {
  profile: true,
  bio: true,
  principles: allPrinciples.length > 0,
  performance: metrics.length > 0,
  tech: skills.length > 0,
  experience: experience.length > 0,
  projects: projects.length > 0,
  openSource: openSourceStats.length + repositories.length > 0,
  contact: true,
};

export type SectionKey = keyof typeof visibleSections;

const sectionOrder = (Object.keys(visibleSections) as SectionKey[]).filter((key) => visibleSections[key]);
const padded = (position: number) => String(position).padStart(3, "0");

// Sections renumber themselves so a hidden one leaves no gap in the nav.
export const sectionNumber = (key: SectionKey) => sectionOrder.indexOf(key) + 1;
export const sectionLabel = (key: SectionKey) => `${site.sections[key]} / ${padded(sectionNumber(key))}`;
export const navItems = sectionOrder.map((_, index) => padded(index + 1));
