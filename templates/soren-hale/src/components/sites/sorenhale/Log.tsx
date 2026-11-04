"use client";

import { useEffect, useId, useRef } from "react";
import { Btn, Chip, Eb, F_D, Hd, More, Sec, rv, useSec } from "./ui";
import { jobs, site, ui } from "./data";

/** 7-hex commit-style hash (FNV-1a) of a stable string */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ("0000000" + (h >>> 0).toString(16)).slice(-7);
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** The lime branch line grows with scroll (eased, never retreats) and lights each node it reaches. */
function useBranch(ref: React.RefObject<HTMLOListElement | null>, count: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-shlg-node]"));
    let raf = 0;
    let shown = 0;
    let target = 0;
    let lit = -1;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const h = r.height || 1;
      const end = window.scrollY + vh >= document.documentElement.scrollHeight - 2 && r.top < vh;
      const p = end ? 1 : clamp((vh * 0.64 - r.top) / h);
      if (p > target) target = p;
      shown += (target - shown) * 0.14;
      if (target - shown < 8e-4) shown = target;
      el.style.setProperty("--lg", shown.toFixed(4));
      const m = shown * h;
      let k = -1;
      nodes.forEach((n, i) => {
        if (n.getBoundingClientRect().top - r.top + 7 <= m + 1) k = i;
      });
      if (k !== lit) {
        lit = k;
        nodes.forEach((n, i) => n.classList.toggle("is-lit", i <= k));
      }
      raf = shown === target && (r.bottom < -200 || r.top > vh + 200) ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, [ref, count]);
}

function Inner() {
  const { on } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const graph = useRef<HTMLOListElement>(null);
  const list = jobs.slice(0, 6);
  useBranch(graph, list.length);
  return (
    <div className="sh-wrap sh-pad">
      <div className="shlg-top">
        <div className="sh-headblock" id={`shlg-h-${uid}`}>
          <Eb text={ui.log.eyebrow} />
          <Hd text={ui.log.heading} delay={60} />
        </div>
        <div className="shlg-side">
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.log.lead}
          </p>
          <div className="shlg-ctas" style={rv(on, 280)}>
            <Btn href={site.cvHref} label={ui.log.downloadCv} kind="ghost" icon="down" cur="get the pdf" />
            <More href={site.resumeHref} n="01" label={ui.log.readResume} cur="open resume" />
          </div>
        </div>
      </div>
      <ol className="shlg-graph" ref={graph} aria-label={ui.log.label}>
        <li className="shlg-line" aria-hidden="true"><i /></li>
        {list.map((j, t) => {
          const now = !j.end;
          const stack = j.tech;
          return (
            <li className={`shlg-row${now ? " is-now" : ""}`} key={j.slug + j.start}>
              <div className="shlg-when sh-mono" style={rv(on, 300 + t * 70, 12)}>
                <span className="shlg-dates">
                  {j.start}
                  {j.start && (now || j.end !== j.start) ? <i> {ui.log.to} </i> : null}
                  {now ? ui.log.now : j.end === j.start ? "" : j.end}
                </span>
                <span className="shlg-hash">{hash(j.slug || j.company + j.start)}</span>
              </div>
              <div className="shlg-rail" aria-hidden="true">
                <b data-shlg-node="" className={now ? "is-now" : ""} />
              </div>
              <div className="shlg-what" style={rv(on, 340 + t * 70, 12)}>
                <p className="shlg-refs sh-mono">
                  {now ? (
                    <span className="shlg-head">
                      <i className="sh-dot" aria-hidden="true" />
                      {ui.log.head}
                    </span>
                  ) : null}
                  {t === list.length - 1 && list.length > 1 ? <span className="shlg-first">{ui.log.first}</span> : null}
                  <span className="shlg-at">{[j.company, j.place].filter(Boolean).join(" · ")}</span>
                </p>
                <h3 className="shlg-role" style={F_D}>{j.role}</h3>
                {j.summary ? <p className="shlg-text">{j.summary}</p> : null}
              </div>
              {stack.length ? (
                <ul className="shlg-stack" style={rv(on, 380 + t * 70, 12)}>
                  {stack.map((x) => (
                    <li key={x}><Chip t={x} /></li>
                  ))}
                </ul>
              ) : (
                <span className="shlg-stack" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Log() {
  if (!jobs.length) return null;
  return (
    <Sec className="shlg">
      <Inner />
    </Sec>
  );
}
