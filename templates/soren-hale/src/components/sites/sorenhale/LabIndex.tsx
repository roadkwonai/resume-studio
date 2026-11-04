"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip, F_D, Face, Sec, rv, useSec } from "./ui";
import { Count, Filter, Pic } from "./Detail";
import { labItems, ui } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");
const kinds = Array.from(new Set(labItems.map((p) => p.kind).filter(Boolean)));
const counts = labItems.reduce<Record<string, number>>((a, p) => ({ ...a, [p.kind]: (a[p.kind] ?? 0) + 1 }), {});

const Star = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.2 1.2-6.6-4.8-4.6 6.6-.9z" />
  </svg>
);
const Down = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v12M6.5 11l5.5 5.5 5.5-5.5M5 20.5h14" />
  </svg>
);
const Arr = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Inner() {
  const { on } = useSec();
  const [kind, setKind] = useState("");
  const [picked, setPicked] = useState(false);
  const shown = labItems.filter((p) => !kind || p.kind === kind);
  return (
    <div className="sh-wrap pg pg-flush">
      <div className="shli-bar" style={rv(on, 0)}>
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
          total={labItems.length}
        />
        <p className="shli-count sh-mono" role="status">
          <b>{pad(shown.length)}</b>
          {kind ? ` ${ui.workPage.of} ${pad(labItems.length)}` : ""} {shown.length === 1 && !kind ? ui.workPage.one : ui.workPage.many}
        </p>
      </div>
      <ul className="shli-grid" aria-label={kind || ui.lab.railLabel}>
        {shown.map((p, i) => (
          <li
            key={`${kind}-${p.slug}`}
            className={`shli-li${picked ? " is-in" : ""}`}
            style={picked ? { animationDelay: `${Math.min(i, 5) * 45}ms` } : rv(on, 120 + Math.min(i, 5) * 60, 22)}
          >
            <Link className="shli-card sh-plate" href={`/lab/${p.slug}`} data-cur="open project" aria-label={`${p.name}. ${p.summary}`}>
              <Pic src={p.image} alt={p.alt} ratio="16/10" eager={i < 3} className="shli-pic">
                {p.image ? null : <Face text={p.name} />}
                <span className="shli-kind">
                  <Chip t={p.kind} tone="fill" />
                </span>
              </Pic>
              <span className="shli-body">
                <span className="shli-name" style={F_D}>{p.name}</span>
                <span className="shli-line">{p.summary}</span>
                {p.install ? (
                  <span className="shli-inst sh-mono">
                    <i aria-hidden="true">$</i>
                    <span>{p.install}</span>
                  </span>
                ) : null}
                <span className="shli-stats sh-mono">
                  {p.stars ? (
                    <span className="shli-stat">
                      <Star />
                      <Count to={p.stars} on={on} />
                      <em>{ui.lab.stars}</em>
                    </span>
                  ) : null}
                  {p.downloads ? (
                    <span className="shli-stat">
                      <Down />
                      <Count to={p.downloads} on={on} ms={1700} />
                      <em>{ui.lab.downloads}</em>
                    </span>
                  ) : null}
                  <span className="shli-open">
                    {ui.lab.open}
                    <Arr />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LabIndex() {
  return (
    <Sec className="shli">
      <Inner />
    </Sec>
  );
}
