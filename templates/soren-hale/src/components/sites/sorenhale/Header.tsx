"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Btn, F_D } from "./ui";
import { live, site, ui } from "./data";

const LINKS = [
  { l: ui.nav.work, h: "/work" },
  { l: ui.nav.services, h: "/services" },
  { l: ui.nav.about, h: "/about" },
  { l: ui.nav.lab, h: "/lab" },
  { l: ui.nav.writing, h: "/writing" },
].filter((e) => live(e.h));
const MORE = [
  { l: ui.nav.stack, h: "/stack" },
  { l: ui.nav.uses, h: "/uses" },
  { l: ui.nav.now, h: "/now" },
  { l: ui.nav.process, h: "/process" },
  { l: ui.nav.resume, h: "/resume" },
  { l: ui.nav.reviews, h: "/reviews" },
  { l: ui.nav.faq, h: "/faq" },
  { l: ui.nav.contact, h: "/contact" },
].filter((e) => live(e.h));

const ChevronSvg = ({ s = 16 }: { s?: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Header() {
  const path = (usePathname() || "/").replace(/\/+$/, "") || "/";
  const [moved, setMoved] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const here = (h: string) => path === h || (h !== "/" && path.startsWith(h + "/"));

  // portal target and route change only exist after hydration
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      setMoved(window.scrollY > 40);
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  // portal target and route change only exist after hydration
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [path]);

  // Menu sheet: lock scroll, trap focus, Escape closes, desktop width closes.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const y = window.scrollY;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    html.classList.add("shhd-open");
    const lenis = (window as unknown as { __shLenis?: { stop(): void; start(): void } }).__shLenis;
    lenis?.stop();
    const focusables = () =>
      Array.from((sheet.current ?? document).querySelectorAll<HTMLElement>("a[href],button")).filter((e) => e.offsetParent !== null);
    const t = window.setTimeout(() => (sheet.current?.querySelector<HTMLElement>(".shhd-x") ?? focusables()[0])?.focus(), 40);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const a = document.activeElement;
      if (e.shiftKey && a === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && a === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const resize = () => {
      if (window.innerWidth >= 1100) setOpen(false);
    };
    window.addEventListener("keydown", key, true);
    window.addEventListener("resize", resize);
    return () => {
      window.clearTimeout(t);
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
      html.classList.remove("shhd-open");
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("resize", resize);
      lenis?.start();
      window.scrollTo(0, y);
      burger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const logo = (inSheet: boolean) => (
    <Link className="shhd-logo" href="/" style={F_D} data-cur="go home" aria-label={`${site.name}, ${site.role}`} onClick={inSheet ? () => setOpen(false) : undefined}>
      {site.name}
      <i aria-hidden="true" />
    </Link>
  );

  return (
    <>
      <header data-shhd="bar" className={`sh sh-sec shhd${moved ? " is-moved" : ""}${open ? " is-open" : ""}`}>
        <a
          className="shhd-skip"
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            const h1 = document.querySelector("h1");
            if (h1) {
              h1.setAttribute("tabindex", "-1");
              h1.focus();
            }
          }}
        >
          {ui.header.skip}
        </a>
        <div className="shhd-in">
          {logo(false)}
          <nav className="shhd-nav" aria-label={ui.header.main}>
            <ul className="f-m">
              {LINKS.map((e, i) => (
                <li key={e.h}>
                  <Link href={e.h} aria-current={here(e.h) ? "page" : undefined} data-cur="open">
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {e.l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="shhd-end">
            {site.status ? (
              <span className="shhd-stat f-m">
                <i aria-hidden="true" />
                {site.status}
              </span>
            ) : null}
            <Btn href="/contact" label={ui.header.getInTouch} kind="quiet" className="shhd-cta" cur="say hello" />
            <button
              ref={burger}
              type="button"
              className="shhd-burger"
              aria-label={open ? ui.header.closeMenu : ui.header.openMenu}
              aria-expanded={open}
              aria-controls={`shhd-sheet-${id}`}
              onClick={() => setOpen(!open)}
              data-cur="open menu"
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>
      {mounted && open
        ? createPortal(
            <div ref={sheet} id={`shhd-sheet-${id}`} data-shhd="sheet" data-lenis-prevent className="sh sh-sec sh-well shhd-sheet" role="dialog" aria-modal="true" aria-label={ui.header.openMenu}>
              <div className="shhd-s-top">
                {logo(true)}
                <button type="button" className="shhd-burger shhd-x is-x" aria-label={ui.header.closeMenu} onClick={() => setOpen(false)} data-cur="close menu">
                  <i />
                  <i />
                </button>
              </div>
              <nav className="shhd-s-body" aria-label={ui.header.main}>
                <ul className="shhd-big">
                  {[{ l: ui.nav.home, h: "/" }, ...LINKS].map((e, i) => (
                    <li key={e.h} style={{ ["--i" as string]: i }}>
                      <Link href={e.h} aria-current={here(e.h) ? "page" : undefined} onClick={() => setOpen(false)}>
                        <span className="f-m" aria-hidden="true">{String(i).padStart(2, "0")}</span>
                        <b style={F_D}>{e.l}</b>
                        <ChevronSvg />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="sh-lbl shhd-s-lab">{ui.header.more}</p>
                <ul className="shhd-small f-m">
                  {MORE.map((e) => (
                    <li key={e.h}>
                      <Link href={e.h} aria-current={here(e.h) ? "page" : undefined} onClick={() => setOpen(false)}>{e.l}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="shhd-s-foot">
                {site.status ? (
                  <p className="shhd-stat f-m">
                    <i aria-hidden="true" />
                    {site.status}
                  </p>
                ) : null}
                <a className="shhd-mail f-m" href={`mailto:${site.email}`}>{site.email}</a>
                {site.social.length ? (
                  <ul className="shhd-soc f-m" aria-label={ui.header.elsewhere}>
                    {site.social.map((s) => (
                      <li key={s.l}><a href={s.h} target="_blank" rel="noopener">{s.l}</a></li>
                    ))}
                  </ul>
                ) : null}
                <Btn href="/contact" label={ui.header.getInTouch} kind="solid" onClick={() => setOpen(false)} cur="say hello" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
