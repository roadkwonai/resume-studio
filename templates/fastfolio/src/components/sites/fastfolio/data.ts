import raw from "@/../content/profile.json";
import siteEn from "@/../content/site.en.json";
import siteKo from "@/../content/site.ko.json";
import type { Profile } from "@/lib/profile";

type FastfolioExtras = { avatar?: string; contactUrl?: string; ctaImage?: string; ticker?: string[] };

export const profile = raw as unknown as Profile;
export const site = profile.locale === "ko" ? siteKo : siteEn;
export const extras = (profile.extras?.["fastfolio"] ?? {}) as FastfolioExtras;

const { basics } = profile;
export const skills = (profile.skills ?? []).flatMap((group) => group.items);
export const projects = profile.projects ?? [];
export const work = profile.work ?? [];
export const testimonials = profile.testimonials ?? [];
export const socials = basics.profiles ?? [];
export const avatar = extras.avatar ?? basics.photo;
export const contactHref = extras.contactUrl ?? `mailto:${basics.email}`;

const iconed = skills.filter((skill) => skill.icon);
export const ticker = extras.ticker?.length ? extras.ticker.flatMap((name) => iconed.filter((skill) => skill.name === name)) : iconed;

export const navLinks = [
  { href: "#skills", label: site.nav.skills, on: skills.length > 0 },
  { href: "#projects", label: site.nav.projects, on: projects.length > 0 },
  { href: "#experience", label: site.nav.experience, on: work.length > 0 },
  { href: "#testimonials", label: site.nav.testimonials, on: testimonials.length > 0 },
].filter((link) => link.on);
