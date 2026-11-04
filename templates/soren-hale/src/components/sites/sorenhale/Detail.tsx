"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { Btn, Eb, F_D, Hd, Pick, rv, useSec } from "./ui";
import { headings } from "./md";
import { site, ui } from "./data";

/* Pieces shared by the CMS index + detail pages (case, post, lab item): picture, before/after, crumb, page top, filter chips, TOC, next-link, count-up. */

const ratioSize = (ratio: string) => {
  const m = ratio.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  const r = m ? parseFloat(m[1]) / Math.max(0.01, parseFloat(m[2])) : 1;
  return { w: 1600, h: Math.round(1600 / (r || 1)) };
};

interface PicProps {
  src: string;
  alt?: string;
  ratio?: string;
  radius?: number;
  eager?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Pic({ src, alt = "", ratio = "16/10", radius = 9, eager = false, className = "", children }: PicProps) {
  const { w, h } = ratioSize(ratio);
  return (
    <span className={`sh-pic${className ? " " + className : ""}`} style={{ aspectRatio: ratio, borderRadius: radius }}>
      {src ? <img src={src} alt={alt} width={w} height={h} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} style={{ objectPosition: "50% 50%" }} /> : null}
      {children}
    </span>
  );
}

/** A picture on a plate, optionally captioned. */
export function PicFig({ src, alt, ratio = "4/3", cap = "", eager = false, className = "" }: { src: string; alt: string; ratio?: string; cap?: string; eager?: boolean; className?: string }) {
  if (!src) return null;
  return (
    <figure className={`pg-pic sh-plate${className ? " " + className : ""}`}>
      <Pic src={src} alt={alt} ratio={ratio} eager={eager} />
      {cap ? <figcaption className="sh-lbl">{cap}</figcaption> : null}
    </figure>
  );
}

/** "2.9 s → 0.8 s": struck-through before, accent after. */
export function Diff({ from, to, on, delay = 0, className = "" }: { from: string; to: string; on: boolean; delay?: number; className?: string }) {
  const a = from.trim();
  const b = to.trim();
  if (!a && !b) return null;
  return (
    <span className={`sh-diff${on ? " is-on" : ""}${className ? " " + className : ""}`} style={{ "--dl": `${delay}ms` } as CSSProperties}>
      {a ? (
        <s>
          <span className="sh-sr">{ui.case.from} </span>
          {a}
        </s>
      ) : null}
      {a && b ? <i aria-hidden="true">→</i> : null}
      {b ? (
        <b>
          {a ? <span className="sh-sr">{ui.case.to} </span> : null}
          {b}
        </b>
      ) : null}
    </span>
  );
}

/** Mono breadcrumb: ~ / Work / Case. */
export function Crumb({ trail, here }: { trail: { label: string; href: string }[]; here: string }) {
  return (
    <nav className="pg-crumb" aria-label={[...trail.map((t) => t.label), here].join(" / ")}>
      <ol>
        <li>
          <Link href="/" aria-label={site.name} data-cur="go home">~</Link>
        </li>
        {trail.map((t) => (
          <li key={t.href}>
            <Link href={t.href} data-cur="go up">{t.label}</Link>
          </li>
        ))}
        <li aria-current="page">
          <span>{here}</span>
        </li>
      </ol>
    </nav>
  );
}

interface TopProps {
  trail?: { label: string; href: string }[];
  here?: string;
  eyebrow: string;
  heading: string;
  size?: string;
  lead?: string;
  button?: { label: string; href: string; cur?: string };
  facts?: [label: string, value: string][];
  /** right-hand column; without it the heading spans the row */
  side?: ReactNode;
}

/** The top of a detail page (what ShPageHero is for index pages): crumb, eyebrow, headline, lead, button, facts, side column. */
export function Top({ trail, here, eyebrow, heading, size = "clamp(44px,5.4vw,84px)", lead, button, facts, side }: TopProps) {
  const { on } = useSec();
  return (
    <div className={`pg-top${side ? "" : " is-wide"}`}>
      <div className="pg-top-copy">
        {trail && here ? <Crumb trail={trail} here={here} /> : null}
        <Eb text={eyebrow} />
        <Hd tag="h1" className="pg-h1" text={heading} size={size} lh={0.98} delay={70} />
        {lead ? (
          <p className="sh-lead pg-lead" style={rv(on, 220)}>
            {lead}
          </p>
        ) : null}
        {button ? (
          <div className="pg-btns" style={rv(on, 300)}>
            <Btn href={button.href} label={button.label} kind="solid" cur={button.cur} />
          </div>
        ) : null}
        {facts?.length ? (
          <dl className="pg-facts" style={rv(on, 380)}>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="sh-lbl">{k}</dt>
                <dd style={{ ...F_D, fontVariantNumeric: "tabular-nums lining-nums" }}>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {side ? (
        <div className="pg-top-side" style={rv(on, 220, 24)}>
          {side}
        </div>
      ) : null}
    </div>
  );
}

/** Filter chips ("All 8", "Product 3", ...). Clicking the active chip clears it. */
export function Filter({ label, options, value, onChange, all = ui.workPage.all, counts, total }: { label: string; options: string[]; value: string; onChange: (v: string) => void; all?: string; counts: Record<string, number>; total: number }) {
  if (options.length < 2) return null;
  return (
    <div className="pg-filter" role="group" aria-label={label} style={rv(true)}>
      <Pick label={all} on={!value} onClick={() => onChange("")} count={total} cur="show all" />
      {options.map((o) => (
        <Pick key={o} label={o} on={value === o} onClick={() => onChange(value === o ? "" : o)} count={counts[o]} cur="filter" />
      ))}
    </div>
  );
}

type Scroller = { scrollTo(y: number): void };

/** Scrolls so the heading sits just under the fixed header (72px bar, 60px on phones, plus 24px air), like the source. */
function jump(id: string, e: MouseEvent<HTMLAnchorElement>) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const y = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth < 810 ? 60 : 72) - 24;
  const lenis = (window as unknown as { __shLenis?: Scroller | null }).__shLenis;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.pushState(null, "", `#${id}`);
  el.focus({ preventScroll: true });
}

/** "On this page" table of contents for a markdown body. */
export function Toc({ md, idPrefix, label }: { md: string; idPrefix: string; label: string }) {
  const hs = headings(md);
  if (!hs.length) return null;
  return (
    <nav className="pg-toc" aria-label={label}>
      <p className="sh-lbl">{label}</p>
      <ol>
        {hs.map((h, i) => (
          <li key={h.slug}>
            <a href={`#${idPrefix}-${h.slug}`} data-cur="jump" onClick={(e) => jump(`${idPrefix}-${h.slug}`, e)}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The big "Next ..." plate at the end of a detail page. */
export function Next({ href, label, title, line, meta, cur }: { href: string; label: string; title: string; line: string; meta?: string; cur: string }) {
  const { on } = useSec();
  return (
    <Link className="pg-next sh-plate" href={href} data-cur={cur} style={rv(on, 0, 22)} aria-label={`${label}: ${title}`}>
      <span className="pg-next-l sh-lbl">
        <i aria-hidden="true" />
        {label}
        {meta ? <em>{meta}</em> : null}
      </span>
      <span className="pg-next-t" style={F_D}>{title}</span>
      {line ? <span className="pg-next-p">{line}</span> : null}
      <b className="pg-next-a" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </b>
    </Link>
  );
}

/** "2,140" counts up from 0 once `on`; the final value is always in aria-label. */
export function Count({ to, on, ms = 1400 }: { to: string; on: boolean; ms?: number }) {
  const target = Number(to.replace(/,/g, ""));
  const ok = Number.isFinite(target) && /^[\d,]+$/.test(to);
  const [shown, setShown] = useState(ok ? "0" : to);
  useEffect(() => {
    if (!ok || !on) return;
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : ms;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setShown(Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US"));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ok, on, ms, target]);
  return (
    <span className="sh-count sh-num" aria-label={to}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
