"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip, F_D, Face, Sec, rv, useSec, ArrowSvg } from "./ui";
import { Diff, Filter, Pic } from "./Detail";
import { projects, ui } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");
const kinds = Array.from(new Set(projects.map((p) => p.tag).filter(Boolean)));
const counts = projects.reduce<Record<string, number>>((a, p) => ({ ...a, [p.tag]: (a[p.tag] ?? 0) + 1 }), {});

function Inner() {
  const { on } = useSec();
  const [kind, setKind] = useState("");
  const [picked, setPicked] = useState(false);
  const shown = projects.filter((p) => !kind || p.tag === kind);
  return (
    <div className="sh-wrap pg pg-flush">
      <div className="shwi-bar" style={rv(on, 0)}>
        <Filter
          label={ui.workPage.filter}
          all={ui.workPage.all}
          options={kinds}
          value={kind}
          onChange={(v) => {
            setPicked(true);
            setKind(v);
          }}
          counts={counts}
          total={projects.length}
        />
        <p className="shwi-count sh-mono" role="status">
          <b>{pad(shown.length)}</b>
          {kind ? ` ${ui.workPage.of} ${pad(projects.length)}` : ""} {shown.length === 1 && !kind ? ui.workPage.one : ui.workPage.many}
        </p>
      </div>
      <ul className="shwi-grid" aria-label={kind || ui.workPage.allLabel}>
        {shown.map((p, i) => (
          <li
            key={`${kind}-${p.slug}`}
            className={`shwi-li${picked ? " is-in" : ""}`}
            style={picked ? { animationDelay: `${Math.min(i, 5) * 45}ms` } : rv(on, 120 + Math.min(i, 3) * 70, 22)}
          >
            <article className="shwi-card sh-plate">
              <Pic src={p.image} alt={p.alt} ratio="16/10" eager={i < 2} className="shwi-pic">
                {p.image ? null : <Face text={p.title} />}
                <span className="shwi-kind">
                  <Chip t={p.tag} tone="fill" />
                </span>
              </Pic>
              <div className="shwi-body">
                <p className="shwi-meta sh-lbl">
                  <span>{[p.client, p.year].filter(Boolean).join(" · ")}</span>
                  <span className="shwi-role">{p.role}</span>
                </p>
                <h2 className="shwi-name" style={F_D}>
                  <Link className="shwi-link" href={`/work/${p.slug}`} data-cur="open case">
                    {p.title}
                  </Link>
                </h2>
                <p className="shwi-line">{p.summary}</p>
                <div className="shwi-foot">
                  {p.after ? (
                    <p className="shwi-metric">
                      <Diff from={p.before} to={p.after} on={on} delay={300} className="shwi-diff" />
                      <span className="sh-lbl">{p.metricLabel}</span>
                    </p>
                  ) : <span />}
                  <span className="shwi-open sh-mono" aria-hidden="true">
                    {ui.work.openCase}
                    <ArrowSvg />
                  </span>
                </div>
                <p className="shwi-stack">
                  {p.stack.slice(0, 4).map((s) => (
                    <Chip key={s} t={s} />
                  ))}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkIndex() {
  return (
    <Sec className="shwi">
      <Inner />
    </Sec>
  );
}
