"use client";

import { Eb, F_D, Sec, rv, useSec } from "./ui";
import { projects, site, ui } from "./data";

const clients = Array.from(new Set(projects.map((p) => p.client).filter(Boolean)));

function Inner() {
  const { on } = useSec();
  const run = true; // reduced motion stops the loop in CSS
  // one marks set is repeated until it is wide enough (>= 10 names), then two copies loop
  const row = Array.from({ length: Math.ceil(10 / Math.max(1, clients.length)) }, () => clients).flat();
  const dur = Math.round(((row.length * 26) / 5) * 10) / 10;
  const set = (key: string, names: string[]) => (
    <span className="shmk-set" aria-hidden="true" key={key}>
      {names.map((n, i) => (
        <span className="shmk-mark" style={F_D} key={i}>
          {n}
          <i aria-hidden="true">/</i>
        </span>
      ))}
    </span>
  );
  const facts = [
    { l: ui.marks.status, v: site.status, live: true },
    { l: ui.marks.timezone, v: [site.city, site.timeZone].filter(Boolean).join(" · ") },
    { l: ui.marks.reply, v: site.replyNote },
  ].filter((f) => f.v);
  return (
    <div className="sh-wrap shmk-in">
      {clients.length ? (
        <div className="shmk-top">
          <Eb text={ui.marks.eyebrow} className="shmk-lbl" />
          <p className="sh-sr">{ui.marks.eyebrow}: {clients.join(", ")}</p>
          <div className={`shmk-view${run ? " is-run" : ""}`} style={{ ...rv(on, 120, 10), ["--dur" as string]: `${dur}s` }}>
            <div className="shmk-track" data-gate-skip="">
              {set("a", run ? row : clients)}
              {run ? set("b", row) : null}
            </div>
          </div>
        </div>
      ) : null}
      {facts.length ? (
        <ul className={`shmk-facts sh-mono${clients.length ? "" : " is-solo"}`} style={rv(on, 220, 10)}>
          {facts.map((f) => (
            <li key={f.l}>
              {f.live ? <i className="sh-dot" aria-hidden="true" /> : null}
              <span className="shmk-k">{f.l}</span>
              <span className="shmk-v">{f.v}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Marks() {
  if (!clients.length && !site.status && !site.city && !site.timeZone && !site.replyNote) return null;
  return (
    <Sec className="shmk" threshold={0.3}>
      <Inner />
    </Sec>
  );
}
