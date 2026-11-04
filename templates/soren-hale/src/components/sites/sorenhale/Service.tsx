"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Btn, ArrowSvg, Eb, F_D, Hd, Sec, rv, useSec } from "./ui";
import { Check } from "./ServiceList";
import { accent, services, site, ui } from "./data";

const NUM = { fontVariantNumeric: "tabular-nums lining-nums" } as const;
const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

function Inner({ slug }: { slug: string }) {
  const { on, w } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [open, setOpen] = useState(0);
  const sv = services.find((s) => s.slug === slug) ?? services[0];
  const steps = sv.steps;
  const qs = sv.faqs.map((f) => ({ q: f.question, a: f.answer }));
  const others = services.filter((s) => s.slug !== sv.slug);
  const heading = accent(sv.name);

  // The source CSS keys the step line on `.shsd.is-on`; Sec only exposes the flag through context.
  useEffect(() => {
    document.querySelector(".shsd")?.classList.toggle("is-on", on);
  }, [on, w]);

  return (
    <div className="sh-wrap pg pg-first">
      <div className="pg-top">
        <div className="pg-top-copy">
          <nav className="pg-crumb" aria-label={`${ui.nav.services} / ${sv.name}`} style={rv(on, 0, 12)}>
            <ol>
              <li><Link href="/" aria-label={site.name} data-cur="go home">~</Link></li>
              <li><Link href="/services" data-cur="go up">{ui.nav.services}</Link></li>
              <li aria-current="page"><span>{sv.name}</span></li>
            </ol>
          </nav>
          <Eb text={ui.service.eyebrow} />
          <Hd tag="h1" className="pg-h1" text={heading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
          {sv.tagline ? <p className="sh-lead pg-lead" style={rv(on, 220)}>{sv.tagline}</p> : null}
        </div>
        <div className="pg-top-side" style={rv(on, 220)}>
          <div className="shsd-spec sh-plate">
            <dl hidden={!sv.price && !sv.duration}>
              {sv.price ? <div><dt className="sh-lbl">{ui.services.price}</dt><dd style={{ ...F_D, ...NUM }}>{sv.price}</dd></div> : null}
              {sv.duration ? <div><dt className="sh-lbl">{ui.services.timeline}</dt><dd style={{ ...F_D, ...NUM }}>{sv.duration}</dd></div> : null}
            </dl>
            {/* the site Loader intercepts link clicks, so the pick travels as ?kind= (the form reads it) instead of an onClick */}
            <Btn href={`/contact?kind=${encodeURIComponent(sv.name)}`} label={ui.service.start} kind="solid" cur="start project" className="shsd-key" />
            <p className="shsd-note sh-lbl">{ui.service.note}</p>
          </div>
        </div>
      </div>

      <div className="shsd-block shsd-scope">
        <div className="shsd-scope-l">
          <Eb text={ui.service.scope} />
          <p className="shsd-body" style={rv(on, 260)}>{sv.summary}</p>
        </div>
        {sv.includes.length ? (
          <div className="shsd-inc sh-plate" style={rv(on, 320)}>
            <p className="sh-lbl">{ui.services.includes}</p>
            <ul>
              {sv.includes.map((t) => (
                <li key={t}>
                  <span className="shsd-ck" aria-hidden="true"><Check /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {steps.length ? (
        <div className="shsd-block">
          <div className="sh-headblock">
            <Eb text={ui.service.howItRuns} />
            <Hd text={ui.service.heading} delay={60} />
          </div>
          <ol className="shsd-steps" aria-label={ui.service.steps}>
            {steps.map((s, i) => (
              <li key={i} style={{ "--i": i } as CSSProperties}>
                <i className="shsd-node" aria-hidden="true" />
                <div className="shsd-step" style={rv(on, 200 + i * 90, 16)}>
                  <p className="shsd-when sh-mono"><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{s.when}</p>
                  {s.t ? <h3 style={F_D}>{s.t}</h3> : null}
                  {s.l ? <p className="shsd-step-l">{s.l}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>

      ) : null}
      {qs.length ? (
        <div className="shsd-block shsd-q">
          <div className="sh-headblock">
            <Eb text={ui.service.questions} />
            <Hd text={ui.service.qHeading} delay={60} />
          </div>
          <ul className="shsd-qs" aria-label={ui.service.questions}>
            {qs.map((q, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className={`shsd-qrow${isOpen ? " is-open" : ""}`}>
                  <h3 className="shsd-qh">
                    <button
                      type="button"
                      id={`shsd-b-${uid}-${i}`}
                      className="shsd-qbtn sh-inring"
                      aria-expanded={isOpen}
                      aria-controls={`shsd-p-${uid}-${i}`}
                      data-cur={isOpen ? "close answer" : "open answer"}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className="shsd-qn sh-mono" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <span className="shsd-qt" style={F_D}>{q.q}</span>
                      <span className="shsd-qic" aria-hidden="true"><Plus /></span>
                    </button>
                  </h3>
                  <div id={`shsd-p-${uid}-${i}`} role="region" aria-labelledby={`shsd-b-${uid}-${i}`} className="shsd-panel">
                    <div className="shsd-clip"><p className="shsd-a">{q.a}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

      ) : null}
      {others.length ? (
        <div className="shsd-block shsd-others">
          <Eb text={ui.service.others} />
          <ul className="pg-rows" aria-label={ui.service.others}>
            {others.map((s, i) => (
              <li key={s.slug} style={rv(on, i * 50, 14)}>
                <Link className="pg-row" href={`/services/${s.slug}`} data-cur="open service">
                  <span className="pg-row-m sh-mono">{s.price || s.duration}</span>
                  <span className="pg-row-t" style={F_D}>{s.name}</span>
                  <span className="pg-row-l">{s.tagline || s.summary}</span>
                  <b className="pg-row-a" aria-hidden="true"><ArrowSvg /></b>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function Service({ slug }: { slug: string }) {
  return (
    <Sec className="shsd">
      <Inner slug={slug} />
    </Sec>
  );
}
