"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { F_D, Sec, rv, useSec } from "./ui";
import { processSteps as steps, ui } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");

function Inner({ onSeen }: { onSeen: (v: boolean) => void }) {
  const { on } = useSec();
  // the rail/dot animations key off `.shpr.is-on` on the section root, which Sec cannot set itself
  useEffect(() => {
    if (on) onSeen(true);
  }, [on, onSeen]);
  return (
    <div className="sh-wrap pg pg-flush">
      <ol className="shpr-list" aria-label={ui.processPage.listLabel}>
        {steps.map((s, i) => (
          <li className="shpr-row" key={s.t} style={{ "--i": i } as CSSProperties}>
            <p className="shpr-when" style={{ ...F_D, ...rv(on, 120 + i * 90, 14) }}>{s.when || pad(i + 1)}</p>
            <span className="shpr-rail" aria-hidden="true"><i /></span>
            <div className="shpr-main" style={rv(on, 160 + i * 90, 14)}>
              <p className="shpr-n sh-mono" aria-hidden="true">{pad(i + 1)} / {pad(steps.length)}</p>
              <h2 style={F_D}>{s.t}</h2>
              <p className="shpr-l">{s.l}</p>
            </div>
            {s.get ? (
              <div className="shpr-get sh-plate" style={rv(on, 220 + i * 90, 14)}>
                <p className="sh-lbl">{ui.processPage.youGet}</p>
                <p className="shpr-g">
                  <span className="shpr-ck" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span>{s.get}</span>
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="shpr-note sh-mono" style={rv(on, 300)}><span aria-hidden="true">{"// "}</span>{ui.processPage.note}</p>
    </div>
  );
}

export function Process() {
  const [seen, setSeen] = useState(false);
  return (
    <Sec className={`shpr${seen ? " is-on" : ""}`}>
      <Inner onSeen={setSeen} />
    </Sec>
  );
}
