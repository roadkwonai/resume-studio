"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sec, F_D, rv, useSec } from "./ui";
import { live, site, ui } from "./data";

const n = ui.nav;
const COLS = [
  { t: ui.footer.site, links: [[n.work, "/work"], [n.services, "/services"], [n.process, "/process"], [n.reviews, "/reviews"], [n.contact, "/contact"]] },
  { t: ui.footer.about, links: [[n.about, "/about"], [n.resume, "/resume"], [n.stack, "/stack"], [n.uses, "/uses"], [n.now, "/now"]] },
  { t: ui.footer.more, links: [[n.lab, "/lab"], [n.writing, "/writing"], [n.faq, "/faq"], [n.privacy, "/privacy"], [n.terms, "/terms"], [n.cookies, "/cookies"]] },
].map((c) => ({ ...c, links: c.links.filter(([, h]) => live(h)) })).filter((c) => c.links.length);
const GLYPHS = "01{}<>/=;()[]#$";
const WORD = site.name;

/** rough advance width per glyph (em), same heuristic the source uses to size the wordmark */
const widthEm = (s: string) =>
  Array.from(s).reduce((n, c) => n + (c === " " ? 0.22 : c > "\u2e7f" ? 1 : /[ijlI.,'!|:;]/.test(c) ? 0.26 : /[ftr]/.test(c) ? 0.36 : /[mwMW@]/.test(c) ? 0.82 : /[0-9]/.test(c) ? 0.56 : c === c.toLowerCase() ? 0.52 : 0.64), 0);

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // the clock must start after hydration (server time would mismatch)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        setNow(new Date());
        loop();
      }, 60000 - (Date.now() % 60000) + 50);
    };
    loop();
    return () => window.clearTimeout(t);
  }, []);
  let time = "";
  let zone = "";
  if (now) {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: site.timeZone, timeZoneName: "short" }).formatToParts(now);
      const g = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
      time = `${g("hour")}:${g("minute")}`;
      zone = g("timeZoneName");
    } catch {
      /* profile timezone is not a valid IANA name: the placeholder stays */
    }
  }
  return (
    <span className="shft-clock sh-num">
      {time ? <time dateTime={time}>{time}</time> : <span aria-hidden="true">--:--</span>}
      {zone ? <em> {zone}</em> : null}
    </span>
  );
}

/** The giant wordmark: fitted to the container width, then each glyph "decodes" once it scrolls into view. */
function Wordmark() {
  const { on } = useSec();
  const box = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLSpanElement>(null);
  const chars = Array.from(WORD);
  const [shown, setShown] = useState(-1);
  const [tick, setTick] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const e = box.current;
    const t = fit.current;
    if (!e || !t) return;
    let last = 0;
    const run = () => {
      const w = e.clientWidth;
      const fs = parseFloat(getComputedStyle(t).fontSize) || 0;
      const tw = t.getBoundingClientRect().width;
      if (!w || !fs || !tw) return;
      const next = Math.max(12, Math.floor((w / tw) * fs * 10) / 10);
      if (Math.abs(next - last) < 0.5 && Math.abs(tw - w) < 2) return;
      last = next;
      t.style.fontSize = next + "px";
    };
    t.style.fontSize = "";
    run();
    const ro = new ResizeObserver(run);
    ro.observe(e);
    document.fonts?.ready.then(run).catch(() => {});
    const a = window.setTimeout(run, 300);
    const b = window.setTimeout(run, 1200);
    return () => {
      ro.disconnect();
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    const e = box.current;
    if (!e || !on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((l) => {
      if (l.some((x) => x.isIntersecting)) {
        io.disconnect();
        setSeen(true);
      }
    }, { threshold: 0.3 });
    io.observe(e);
    return () => io.disconnect();
  }, [on]);

  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    let t0 = 0;
    let last = -1;
    const step = (now: number) => {
      t0 ||= now;
      const p = Math.min(1, (now - t0) / 850);
      const s = Math.floor((now - t0) / 55);
      if (s !== last || p >= 1) {
        last = s;
        setTick(s);
        setShown(p >= 1 ? chars.length : Math.floor(p * chars.length));
      }
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  const state = !seen ? (shown < 0 && on ? "wait" : "fin") : shown >= chars.length ? "fin" : "run";
  const glyph = (i: number) => GLYPHS[(i * 7 + tick * 5 + ((i * tick) % 3)) % GLYPHS.length];
  return (
    <div className="shft-wm" ref={box} style={{ ["--n" as string]: (Math.max(1.5, widthEm(WORD)) / 0.58).toFixed(3) }}>
      <p className={`shft-word is-${state}`} aria-label={WORD} style={F_D}>
        <span ref={fit} className="shft-fit" aria-hidden="true">
          {chars.map((c, i) =>
            c === " " ? (
              <span className="shft-sp" key={i}> </span>
            ) : (
              <span className={`shft-ch${state === "run" && i >= shown ? " is-g" : ""}`} key={i}>
                <span className="shft-ch-f">{c}</span>
                {state === "run" && i >= shown ? <span className="shft-ch-g">{glyph(i)}</span> : null}
              </span>
            ),
          )}
        </span>
      </p>
    </div>
  );
}

function Inner() {
  const { on } = useSec();
  return (
    <div className="sh-wrap shft-in">
      <h2 className="sh-sr">{ui.footer.heading}</h2>
      <div className="shft-top">
        <div className="shft-id" style={rv(on, 0)}>
          <p className="shft-line" style={F_D}>{[site.role, site.city].filter(Boolean).join(", ")}</p>
          <a className="shft-mail" href={`mailto:${site.email}`} data-cur="write email" aria-label={ui.footer.writeToAria}>
            <span className="sh-lbl" aria-hidden="true">{ui.footer.writeTo}</span>
            <span className="shft-mail-a">{site.email}</span>
          </a>
          {site.status ? (
            <p className="shft-status sh-mono">
              <i className="sh-dot" aria-hidden="true" />
              {site.status}
            </p>
          ) : null}
        </div>
        <nav className="shft-cols" aria-label={ui.footer.nav} style={rv(on, 120)}>
          {COLS.map((c, i) => (
            <div className="shft-col" key={c.t}>
              <p className="sh-lbl" id={`shft-c-${i}`}>
                <span aria-hidden="true">{"// "}</span>
                {c.t}
              </p>
              <ul aria-labelledby={`shft-c-${i}`}>
                {c.links.map(([l, h]) => (
                  <li key={h}>
                    <Link href={h} data-cur="open page">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {site.social.length ? (
            <div className="shft-col">
              <p className="sh-lbl" id="shft-s">
                <span aria-hidden="true">{"// "}</span>{ui.footer.elsewhere}
              </p>
              <ul aria-labelledby="shft-s">
                {site.social.map(({ l, h }) => (
                  <li key={l}>
                    <a href={h} target="_blank" rel="noopener me" data-cur="open profile">
                      {l}
                      <span className="shft-ext" aria-hidden="true">↗</span>
                      <span className="sh-sr"> {ui.footer.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </nav>
      </div>
      <div className="shft-meta">
        {site.timeZone && site.city ? (
          <p className="shft-time sh-mono">
            <i className="sh-dot" aria-hidden="true" />
            <span>{ui.footer.localTime}</span>
            <Clock />
          </p>
        ) : null}
        <p className="shft-legal sh-lbl">{ui.footer.legal}</p>
      </div>
      <Wordmark />
    </div>
  );
}

export function Footer() {
  return (
    <Sec as="footer" className="shft" threshold={0.08}>
      <Inner />
    </Sec>
  );
}
