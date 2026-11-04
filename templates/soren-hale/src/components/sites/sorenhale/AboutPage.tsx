"use client";

import Link from "next/link";
import { counted, extras, live, nowItems, site, ui } from "./data";
import { Eb, Hd, Sec, rv, useSec, F_D } from "./ui";

// story rows pair with the paragraphs after the statement; without them every paragraph is a plain row
const beats = extras.story?.length
  ? extras.story.map((b, i) => ({ when: b.when, t: b.title, p: site.about[i + 1] ?? "" }))
  : site.about.map((p) => ({ when: "", t: "", p }));
const rules = site.principles;
const nowLine = extras.now?.line ?? nowItems[0]?.l ?? "";

const pad = (n: number) => String(n).padStart(2, "0");

function Inner() {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg">
      <div className="shap-story">
        <div className="shap-main">
          <div className="sh-headblock">
            <Eb text={ui.aboutPage.storyEyebrow} />
            <Hd text={ui.aboutPage.storyHeading} delay={60} />
          </div>
          <ol className="shap-beats">
            {beats.map((b, i) => (
              <li className="shap-beat" key={i} style={rv(on, 160 + i * 90)}>
                <p className="shap-when sh-mono">
                  <span className="shap-n" aria-hidden="true">{pad(i + 1)}</span>
                  {b.when ? <span>{b.when}</span> : null}
                </p>
                <div className="shap-bt">
                  {b.t ? <h3 style={F_D}>{b.t}</h3> : null}
                  <p>{b.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="shap-side" style={rv(on, 240)}>
          <figure className="pg-pic sh-plate">
            <span className="sh-pic" style={{ aspectRatio: "4/5", borderRadius: 9 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.aboutImage} alt={site.aboutAlt} width={1600} height={2000} loading="eager" decoding="async" draggable={false} style={{ objectPosition: "50% 30%" }} />
            </span>
            <figcaption className="sh-lbl">{[site.name, site.city].filter(Boolean).join(" · ")}</figcaption>
          </figure>
        </div>
      </div>
      {rules.length ? (
        <div className="shap-rules" aria-labelledby="shap-r">
          <div className="shap-rhead">
            <div className="sh-headblock" id="shap-r">
              <Eb text={ui.aboutPage.rulesEyebrow} />
              <Hd text={counted(ui.aboutPage.rulesHeading, rules.length)} delay={60} />
            </div>
            <p className="sh-lead" style={rv(on, 200)}>{ui.aboutPage.rulesLead}</p>
          </div>
          <ol className="shap-rlist">
            {rules.map((r, i) => (
              <li className="shap-rule" key={r.t} style={rv(on, 200 + i * 60)}>
                <span className="shap-rn sh-mono" aria-hidden="true">{pad(i + 1)}</span>
                <h3 style={F_D}>{r.t}</h3>
                {r.p ? <p>{r.p}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {live("/now") ? (
        <Link className="shap-now sh-plate" href="/now" data-cur="open now" style={rv(on, 260)}>
          <span className="shap-nl sh-mono">
            <span className="shap-nll"><i className="sh-dot" aria-hidden="true" />{ui.about.now}</span>
            {extras.now?.updated ? <span className="shap-nn">{extras.now.updated}</span> : null}
          </span>
          <span className="shap-nt" style={F_D}>{nowLine}</span>
          <span className="shap-nb">
            <span className="shap-nbl sh-mono">{ui.aboutPage.seeNow}</span>
            <b className="shap-na" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </b>
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export function AboutPage() {
  return (
    <Sec className="shap">
      <Inner />
    </Sec>
  );
}
