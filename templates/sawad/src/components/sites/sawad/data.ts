import raw from "@/../content/profile.json";
import en from "@/../content/site.en.json";
import ko from "@/../content/site.ko.json";
import type { Profile } from "@/lib/profile";

export const profile = raw as unknown as Profile;
export const site = profile.locale === "ko" ? ko : en;
export type FormText = typeof site.form;

type Headings = typeof site.headings;
type Extras = {
  siteTitle?: string;
  siteDescription?: string;
  ogImage?: string;
  headings?: Partial<Record<keyof Headings, string[]>>;
  footerCredit?: { text: string; url?: string }[];
  hidePosition?: boolean;
};

const extras = (profile.extras?.sawad ?? {}) as Extras;

export const siteTitle = extras.siteTitle ?? profile.basics.name;
export const siteDescription = extras.siteDescription ?? profile.basics.summary;
export const ogImage = extras.ogImage ?? profile.basics.photo;
export const headings = { ...site.headings, ...extras.headings };
export const footerCredit = extras.footerCredit;

export const projects = profile.projects ?? [];
export const jobs = profile.work ?? [];
export const showPosition = !extras.hidePosition;
export const posts = profile.writing ?? [];
export const socials = profile.basics.profiles ?? [];
export const tools = (profile.skills ?? []).flatMap((g) => g.items.map((item) => ({ ...item, group: g.group })));

// The design sets two-line headings: everything before the last word, then the last word.
export function splitLast(text: string): [string, string] {
  const trimmed = text.trim();
  const at = trimmed.lastIndexOf(" ");
  return at < 0 ? [trimmed, ""] : [trimmed.slice(0, at), trimmed.slice(at + 1)];
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  const parsed = new Date(date);
  if (date.length === 4 || Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(profile.locale, { ...options, year: "numeric", timeZone: "UTC" }).format(parsed);
}

export function jobPeriod(start: string, end?: string) {
  const format = (date: string) => formatDate(date, { month: "short" });
  return `${format(start)} - ${end ? format(end) : site.present}`;
}

export const postDate = (date: string) => formatDate(date, { month: "short", day: "numeric" });

export function chipText(name: string) {
  return name.trim().split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}
