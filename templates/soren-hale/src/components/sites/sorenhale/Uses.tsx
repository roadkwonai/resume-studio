"use client";

import Link from "next/link";
import { useState } from "react";
import { F_D, Sec, rv, useSec } from "./ui";
import { extras, live, ui, usesGroups } from "./data";

const groups = usesGroups.map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, h: r.h && live(r.h) ? r.h : undefined })) }));
const cfg = extras.uses?.config;
const config = cfg?.code ?? "";
const codeAfter = cfg?.after ?? 0;

function Code() {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(config);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard blocked: leave the label alone */
    }
  };
  return (
    <figure className="pg-code">
      <figcaption>
        <span className="sh-lbl">{cfg?.file}</span>
        <button type="button" className="pg-code-cp sh-inring" data-cur="copy code" onClick={copy}>
          <span aria-live="polite">{done ? ui.md.copied : ui.md.copy}</span>
        </button>
      </figcaption>
      <pre tabIndex={0} className="sh-inring" aria-label={cfg?.label}>
        <code>
          {config.split("\n").slice(0, -1).map((ln, i) => (
            <span key={i} className={ln.trim().startsWith("//") ? "is-c" : undefined}>{ln + "\n"}</span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Inner() {
  const { on } = useSec();
  // blocks in render order: the code block sits after group `codeAfter`
  const blocks: ({ g: number } | "code")[] = [];
  groups.forEach((_, i) => {
    blocks.push({ g: i });
    if (cfg && i + 1 === codeAfter) blocks.push("code");
  });
  return (
    <div className="sh-wrap pg">
      <div className="shus-groups">
        {blocks.map((b, bi) => {
          const style = rv(on, 120 + bi * 70, 16);
          if (b === "code") {
            return (
              <div className="shus-g is-code" key="code" style={style}>
                <div className="shus-gh"><h2 className="shus-gt" style={F_D}>{cfg?.title}</h2></div>
                <div className="shus-code"><Code /></div>
              </div>
            );
          }
          const g = groups[b.g];
          const id = `shus-${b.g + 1}`;
          return (
            <div className="shus-g" key={g.title} style={style} role="group" aria-labelledby={id}>
              <div className="shus-gh">
                <span className="shus-gn sh-mono" aria-hidden="true">{String(b.g + 1).padStart(2, "0")}</span>
                <h2 className="shus-gt" id={id} style={F_D}>{g.title}</h2>
                <span className="shus-gc sh-mono">{g.rows.length} {g.rows.length === 1 ? ui.usesPage.one : ui.usesPage.many}</span>
              </div>
              <ul className="shus-list">
                {g.rows.map((r) => (
                  <li key={r.n}>
                    {r.h ? (
                      <Link className="shus-row" href={r.h} data-cur="open link">
                        <span className="shus-rn" style={F_D}>{r.n}</span>
                        <span className="shus-rt">{r.t}</span>
                        <b className="shus-ra" aria-hidden="true"><Arrow /></b>
                      </Link>
                    ) : (
                      <div className="shus-row is-plain">
                        <span className="shus-rn" style={F_D}>{r.n}</span>
                        <span className="shus-rt">{r.t}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {ui.usesPage.note ? <p className="shus-note sh-lbl" style={rv(on, 300)}>{ui.usesPage.note}</p> : null}
    </div>
  );
}

export function Uses() {
  return (
    <Sec className="shus">
      <Inner />
    </Sec>
  );
}
