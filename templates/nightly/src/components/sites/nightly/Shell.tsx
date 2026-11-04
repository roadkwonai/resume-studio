"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EMAIL, NAME, extras, legalOn, links, nav, place, profile, site } from "./data";
import { Arrow } from "./ui";
import { Preloader } from "./Preloader";
import s from "./nl.module.css";

const f = site.footer;
const footerNote = extras.footerNote ?? profile.basics.summary;
const reach = [place, profile.basics.responseTime].filter(Boolean).join(". ");

function Footer({ path }: { path: string }) {
  const [load, setLoad] = useState("0.03");
  useEffect(() => {
    const set = (ms: number) => setTimeout(() => setLoad((ms / 1000).toFixed(2)), 0);
    const landed = (window as unknown as { __ngLoadMs?: number }).__ngLoadMs;
    const t = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (landed) set(landed);
    else if (t && t.loadEventEnd > 0) set(t.loadEventEnd);
    const on = () => {
      const v = (window as unknown as { __ngLoadMs?: number }).__ngLoadMs;
      if (v) set(v);
    };
    window.addEventListener("ngw:ready", on);
    return () => window.removeEventListener("ngw:ready", on);
  }, []);
  return (
    <footer className={s.footer}>
      <div className={s.fTop}>
        <div className={s.fBrand}>
          <h3>{NAME}</h3>
          <p className={s.body}>{footerNote}</p>
        </div>
        <div className={s.fCols}>
          <div className={s.fCol}>
            <span className={s.fColH}>{f.site}</span>
            {nav.map((n) => (
              <Link key={n.href} href={n.href}>{n.label}</Link>
            ))}
          </div>
          {links.length ? (
            <div className={s.fCol}>
              <span className={s.fColH}>{f.elsewhere}</span>
              {links.map((l) => (
                <a key={l.url} href={l.url}>{l.network}</a>
              ))}
            </div>
          ) : null}
          <div className={s.fCol}>
            <span className={s.fColH}>{f.contact}</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {reach ? <p>{reach}</p> : null}
          </div>
        </div>
      </div>
      <div className={s.fBottom}>
        <span>© {new Date().getFullYear()} {NAME}</span>
        <span>
          {f.loadedBefore} <b>{load} s</b> {f.loadedAfter}
        </span>
        <span className={s.fLegal}>
          {legalOn ? <Link href="/legal/privacy-policy" className={path === "/legal/privacy-policy" ? s.cur : ""}>{f.privacy}</Link> : null}
          {legalOn ? <Link href="/legal/terms" className={path === "/legal/terms" ? s.cur : ""}>{f.terms}</Link> : null}
          <Link href="/style-guide" className={path === "/style-guide" ? s.cur : ""}>{f.styleGuide}</Link>
        </span>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const on = (href: string) => path === href || path.startsWith(href + "/");
  return (
    <div className={s.page}>
      <Preloader />
      <nav className={s.nav} aria-label={site.nav.aria}>
        <div className={s.navInner}>
          <Link href="/" className={s.logo}>{NAME}</Link>
          <div className={s.links}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`${s.link} ${on(n.href) || n.href === "/contact" ? s.linkOn : ""}`}>{n.label}</Link>
            ))}
          </div>
          <button className={s.menuBtn} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? site.nav.close : site.nav.menu}</button>
        </div>
      </nav>
      <div className={`${s.drawer} ${open ? s.drawerOpen : ""}`} aria-hidden={!open}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={s.drawerRow}>
            {n.label}
            <Arrow />
          </Link>
        ))}
        <div className={s.drawerNote}>
          <span>{EMAIL}</span>
          {place ? <span>{place}</span> : null}
        </div>
      </div>
      <main className={s.main}>{children}</main>
      <Footer path={path} />
    </div>
  );
}
