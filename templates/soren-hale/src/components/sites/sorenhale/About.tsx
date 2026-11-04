"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { Eb, F_D, More, Sec, rv, useSec } from "./ui";
import { accent, extras, nowItems, site, ui } from "./data";

const STATEMENT = accent(site.about[0] ?? site.intro);
const NOW = extras.now?.rows ?? nowItems.slice(0, 4).map((n): [string, string] => [n.t, n.l]);

function tokens(s: string) {
  const out: { t: string; acc: boolean }[] = [];
  let acc = false;
  for (const part of s.split("*")) {
    for (const w of part.split(/\s+/).filter(Boolean)) out.push({ t: w, acc });
    acc = !acc;
  }
  return out;
}

function Inner() {
  const { on } = useSec();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const h2 = useRef<HTMLHeadingElement>(null);
  const words = useMemo(() => tokens(STATEMENT), []);
  const plain = words.map((w) => w.t).join(" ");

  // scroll-linked word light-up: words turn from dim to full ink as the statement crosses the viewport
  useEffect(() => {
    const el = h2.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ws = Array.from(el.querySelectorAll<HTMLElement>(".shab-w"));
    el.classList.add("is-scrub");
    let near = true;
    let top = 0;
    let height = 1;
    let vh = 1;
    let lit = -1;
    let raf = 0;
    const io = new IntersectionObserver((e) => (near = e[0].isIntersecting), { rootMargin: "20% 0px 20% 0px" });
    io.observe(el);
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!near) return;
      const r = el.getBoundingClientRect();
      top = r.top;
      height = r.height;
      vh = window.innerHeight || 1;
      const start = vh * 0.78;
      const end = vh * 0.46;
      const p = Math.min(1, Math.max(0, (start - top) / Math.max(1, start - end + height)));
      const n = Math.round(p * ws.length);
      if (n === lit) return;
      const a = Math.min(n, lit < 0 ? 0 : lit);
      const b = Math.max(n, lit < 0 ? ws.length : lit);
      for (let i = a; i < b; i++) ws[i].classList.toggle("is-lit", i < n);
      lit = n;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.classList.remove("is-scrub");
      ws.forEach((w) => w.classList.remove("is-lit"));
    };
  }, []);

  return (
    <div className="sh-wrap sh-pad">
      <div className="shab-top">
        <div className="shab-copy">
          <Eb text={ui.about.eyebrow} />
          <h2 ref={h2} id={`shab-h-${id}`} className="shab-st" style={{ ...F_D, ...rv(on, 80, 14) }}>
            <span className="sh-sr">{plain}</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <span key={i}>
                  <span className={`shab-w${w.acc ? " is-acc" : ""}`}>{w.t}</span>{" "}
                </span>
              ))}
            </span>
          </h2>
        </div>
        <figure className="shab-fig" style={rv(on, 240, 22)}>
          <span className="sh-pic" style={{ aspectRatio: "4/5", borderRadius: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.aboutImage} alt={site.aboutAlt} width={1600} height={2000} loading="lazy" decoding="async" draggable={false} style={{ objectPosition: "50% 30%" }} />
          </span>
          <figcaption className="sh-lbl">
            <i className="shab-tick" aria-hidden="true" />
            {[site.name, site.city].filter(Boolean).join(" · ")}
          </figcaption>
        </figure>
      </div>
      <div className="shab-now" style={rv(on, 320)}>
        {NOW.length ? (
          <>
            <p className="shab-nowhd sh-mono">
              <span className="shab-nowl">
                <i className="sh-dot" aria-hidden="true" />
                {ui.about.now}
              </span>
              {extras.now?.updated ? <span className="shab-nown">{extras.now.updated}</span> : null}
            </p>
            <dl className="shab-list">
              {NOW.map(([k, v]) => (
                <div className="shab-row" key={k}>
                  <dt className="sh-lbl">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
        <div className="shab-more">
          <More href="/about" n="02" label={ui.about.more} cur="read more" />
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <Sec className="shab">
      <Inner />
    </Sec>
  );
}
