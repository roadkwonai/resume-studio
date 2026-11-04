import Image from "next/image";
import Link from "next/link";
import { initialsOf } from "@/lib/profile";
import { Icon, type IconName } from "./icons";
import { footerCredit, jobs, posts, profile, projects, site, socials, tools } from "./data";
import { socialIcons } from "./socialIcons";
import s from "./sawad.module.css";

const NAV: { href: string; label: string; icon: IconName; show: boolean }[] = [
  { href: "/", label: site.nav.home, icon: "home", show: true },
  { href: "/projects", label: site.nav.projects, icon: "folder", show: projects.length > 0 },
  { href: "/experience", label: site.nav.experience, icon: "briefcase", show: jobs.length > 0 },
  { href: "/tools", label: site.nav.tools, icon: "tool", show: tools.length > 0 },
  { href: "/blog", label: site.nav.blog, icon: "edit", show: posts.length > 0 },
];

export function Nav() {
  return (
    <nav className={s.nav} aria-label={site.nav.label}>
      {NAV.filter((n) => n.show).map((n) => (
        <Link key={n.href} href={n.href} className={s.navLink} aria-label={n.label}>
          <Icon name={n.icon} className={s.navIcon} />
          <span className={s.tip}>{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function ProfileCard() {
  const { name, headline, photo, photoAlt } = profile.basics;
  return (
    <div className={s.card}>
      {photo ? (
        <Image className={s.photo} src={photo} alt={photoAlt ?? name} width={240} height={284} sizes="260px" priority />
      ) : (
        <div className={`${s.photo} ${s.initials}`} aria-hidden="true">
          {initialsOf(profile)}
        </div>
      )}
      <div className={s.shapeTop} />
      <div className={s.shapeBottom} />
      <div className={s.shapeMobile} />
      <p className={s.name}>{name}</p>
      <p className={s.bio}>{headline}</p>
      {socials.length > 0 && (
        <div className={s.socials}>
          {socials.map((x) => (
            <a
              key={x.url}
              className={s.social}
              href={x.url}
              target="_blank"
              rel="noreferrer"
              aria-label={x.network}
            >
              <svg
                className={s.socialIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: socialIcons[x.network.toLowerCase()] ?? socialIcons.link }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <p>
        {footerCredit
          ? footerCredit.map((part) =>
              part.url ? (
                <a key={part.text} href={part.url} target="_blank" rel="noreferrer">
                  {part.text}
                </a>
              ) : (
                part.text
              ),
            )
          : `© ${profile.basics.name}`}
      </p>
    </footer>
  );
}
