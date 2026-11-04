"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";
import { yearOf } from "@/lib/profile";
import { Btn, Eb, F_D, Hd, Sec, rv, useSec } from "./ui";
import { accent, extras, jobs, site, stackItems, ui } from "./data";

const span = (a?: string, b?: string) => [yearOf(a), yearOf(b)].filter(Boolean).join(` ${ui.resume.to} `);
const education = site.education.map((e) => ({ t: [e.degree, e.area].filter(Boolean).join(" "), p: e.institution, w: span(e.start, e.end) }));
const awards = site.awards.map((a) => ({ t: a.title, p: a.issuer ?? "", w: yearOf(a.date) }));
const languages = extras.languages ?? [];
const talks = (extras.talks ?? []).map((e) => ({ t: e.title, p: e.place, w: e.year }));
const groups = Array.from(new Set(stackItems.map((s) => s.group)));

const Items = ({ title, rows }: { title: string; rows: { t: string; p: string; w: string }[] }) =>
  rows.length ? (
    <Block title={title}>
      <ul className="shre-items">
        {rows.map((e) => (
          <li key={e.t}>
            <span className="shre-it">{e.t}</span>
            <span className="shre-ip">
              {[e.p, e.w].filter(Boolean).map((x, i) => <Fragment key={x}>{i ? <Dot /> : null}{x}</Fragment>)}
            </span>
          </li>
        ))}
      </ul>
    </Block>
  ) : null;

const Tags = ({ items, label }: { items: string[]; label?: string }) => (
  <ul className="shre-tags" aria-label={label}>
    {items.map((t) => <li key={t}>{t}</li>)}
  </ul>
);
const Dot = () => <span aria-hidden="true"> · </span>;
const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="shre-blk">
    <h2 className="shre-h2"><span aria-hidden="true">{"//"}</span> {title}</h2>
    {children}
  </section>
);

// "Download CV" has no separate PDF (the CV file is this page), so like the source it opens the print dialog (Save as PDF).
const print = () => window.print();

function Inner() {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg pg-first">
      <header className="shre-top">
        <div className="shre-id">
          <Eb text={ui.resume.eyebrow} className="shre-np" />
          <Hd tag="h1" className="pg-h1 shre-h1" text={accent(site.name)} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
          <p className="shre-desc" style={{ ...F_D, ...rv(on, 200) }}>{site.role}</p>
        </div>
        <div className="shre-meta" style={rv(on, 260)}>
          <dl className="shre-contact">
            {site.city ? <div><dt className="sh-lbl">{ui.resume.city}</dt><dd>{site.city}</dd></div> : null}
            <div><dt className="sh-lbl">{ui.resume.email}</dt><dd><a href={`mailto:${site.email}`} data-cur="write email">{site.email}</a></dd></div>
            {site.phone ? <div><dt className="sh-lbl">{ui.resume.phone}</dt><dd><a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} data-cur="call">{site.phone}</a></dd></div> : null}
          </dl>
          <div className="shre-btns shre-np">
            {site.resumeFile ? (
              <Btn href={site.resumeFile} label={ui.resume.downloadCv} kind="ghost" icon="down" cur="get the pdf" />
            ) : (
              <Btn label={ui.resume.downloadCv} kind="ghost" icon="down" onClick={print} cur="save pdf" />
            )}
            <Btn label={ui.resume.print} kind="quiet" onClick={print} cur="print page" />
            <p className="sh-lbl">{ui.resume.printNote}</p>
          </div>
        </div>
      </header>
      <div className="shre-sheet sh-plate" style={rv(on, 320)}>
        <div className="shre-main">
          <p className="shre-sum">{site.intro}</p>
          {jobs.length ? (
            <Block title={ui.resume.experience}>
              <ol className="shre-jobs">
                {jobs.map((j) => (
                  <li className="shre-job" key={j.slug + j.start}>
                    <p className="shre-when sh-mono">{j.start === j.end ? j.start : `${j.start} ${ui.resume.to} ${j.end || ui.resume.now}`}</p>
                    <div className="shre-jb">
                      <h3 style={F_D}>{j.role}</h3>
                      <p className="shre-co">{j.company}{j.place ? <><Dot />{j.place}</> : null}</p>
                      <p className="shre-line">{j.summary}</p>
                      {j.tech.length ? <Tags items={j.tech} label={ui.resume.tagsLabel} /> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </Block>
          ) : null}
        </div>
        <div className="shre-side">
          {groups.length ? (
            <Block title={ui.resume.skills}>
              <dl className="shre-skills">
                {groups.map((g) => (
                  <div key={g}>
                    <dt className="sh-lbl">{g}</dt>
                    <dd><Tags items={stackItems.filter((s) => s.group === g).map((s) => s.name)} /></dd>
                  </div>
                ))}
              </dl>
            </Block>
          ) : null}
          <Items title={ui.resume.education} rows={education} />
          <Items title={ui.resume.awards} rows={awards} />
          {languages.length ? (
            <Block title={ui.resume.languages}>
              <ul className="shre-items is-pairs">
                {languages.map(([n, l]) => (
                  <li key={n}><span className="shre-it">{n}</span><span className="shre-ip">{l}</span></li>
                ))}
              </ul>
            </Block>
          ) : null}
          <Items title={ui.resume.talks} rows={talks} />
        </div>
      </div>
    </div>
  );
}

export function Resume() {
  return (
    <Sec className="shre" eager>
      <Inner />
    </Sec>
  );
}
