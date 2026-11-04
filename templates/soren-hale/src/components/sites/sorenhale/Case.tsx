"use client";

import { Fragment } from "react";
import { F_D, Chip, Face, Sec, rv, useSec } from "./ui";
import { Md } from "./md";
import { Diff, Next, Pic, PicFig, Top } from "./Detail";
import { accent, projects, ui, type Project } from "./data";

function Inner({ p }: { p: Project }) {
  const { on, ph } = useSec();
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : null;
  const facts = [
    [ui.case.client, p.client],
    [ui.case.year, p.year],
    [ui.case.role, p.role],
    [ui.case.kind, p.tag],
    [ui.case.timeline, p.timeline],
  ].filter(([, v]) => v);
  const parts = [
    { t: ui.case.problem, x: p.intro },
    { t: ui.case.approach, x: p.changes },
    { t: ui.case.result, x: p.result },
    { t: ui.case.notes, x: p.body },
  ].filter((x) => x.x.trim());
  const pics = p.gallery;
  const picAt = Math.min(1, parts.length - 1);
  const stack = p.stack;
  return (
    <div className="sh-wrap pg pg-first">
      <Top
        trail={[{ label: ui.nav.work, href: "/work" }]}
        here={p.title}
        eyebrow={ui.case.eyebrow}
        heading={accent(p.title)}
        lead={p.summary}
        button={p.link ? { label: ui.case.visit, href: p.link, cur: "open" } : undefined}
      />
      <div className={`shcs-metric sh-plate${p.after ? "" : " is-bare"}`} hidden={!p.after && !facts.length} style={rv(on, 380, 22)}>
        {p.after ? (
          <p className="shcs-m">
            <span className="sh-lbl">{p.metricLabel}</span>
            <Diff from={p.before} to={p.after} on={on} delay={620} className="shcs-diff" />
          </p>
        ) : null}
        <dl className="shcs-facts">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="sh-lbl">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="shcs-lead" style={rv(on, 460, 24)}>
        {p.image ? (
          <PicFig src={p.image} alt={p.alt} ratio={ph ? "4/3" : "16/9"} eager />
        ) : (
          <figure className="pg-pic sh-plate">
            <Pic src="" ratio={ph ? "4/3" : "16/9"}><Face text={p.title} /></Pic>
          </figure>
        )}
      </div>
      <div className="shcs-parts">
        {parts.map((x, n) => (
          <Fragment key={x.t}>
            <section className="shcs-part" aria-labelledby={`cs-p${n}`}>
              <div className="shcs-part-h">
                <span className="sh-mono" aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
                <h2 id={`cs-p${n}`} style={F_D}>{x.t}</h2>
              </div>
              <Md md={x.x} idPrefix={`cs${n}`} />
            </section>
            {n === picAt && pics.length ? (
              <div className="shcs-picwrap">
                <div className={`shcs-pics${pics.length === 1 ? " is-one" : ""}`} role="group" aria-label={ui.case.pictures} style={rv(on, 200, 22)}>
                  {pics.map((x2) => (
                    <PicFig key={x2.src} src={x2.src} alt={x2.alt} ratio={pics.length === 1 ? "16/9" : "4/3"} cap={x2.alt} eager />
                  ))}
                </div>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      {stack.length ? (
        <div className="shcs-part shcs-stack">
          <div className="shcs-part-h">
            <h2 style={F_D}>{ui.case.builtWith}</h2>
          </div>
          <p className="shcs-chips">
            {stack.map((s) => (
              <Chip key={s} t={s} />
            ))}
          </p>
        </div>
      ) : null}
      {next ? (
        <div className="shcs-next">
          <Next href={`/work/${next.slug}`} label={ui.case.next} title={next.title} line={next.summary} meta={[next.tag, next.year].filter(Boolean).join(" · ")} cur="open case" />
        </div>
      ) : null}
    </div>
  );
}

export function Case({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <Sec className="shcs">
      <Inner p={p} />
    </Sec>
  );
}
