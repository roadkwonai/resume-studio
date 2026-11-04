"use client";

import { Eb, F_D, Hd, More, Sec, rv, useSec } from "./ui";
import { Count } from "./Count";
import { extras, fill, live, ui } from "./data";

const Tick = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

type BenchData = NonNullable<typeof extras.bench>;

function Inner({ b }: { b: BenchData }) {
  const { on } = useSec();
  return (
    <div className="sh-wrap sh-pad">
      <div className="shbn-top">
        <div className="sh-headblock">
          <Eb text={b.eyebrow} />
          <Hd text={b.heading} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {b.lead}
          </p>
        </div>
        <div className="shbn-side" style={rv(on, 260)}>
          <p className="shbn-note sh-mono">
            <i className="shbn-dot" aria-hidden="true" />
            {b.note}
          </p>
          {live("/work") ? <More href="/work" n="01" label={b.more} cur="open work" /> : null}
        </div>
      </div>
      <ul className="shbn-rings" aria-label={ui.bench.scoresLabel} style={{ ["--n" as string]: b.scores.length }}>
        {b.scores.map(({ label, score }, i) => (
          <li className="shbn-cell" style={rv(on, 120 + i * 80)} key={label}>
            <p className="shbn-lab">
              <span className="sh-mono shbn-ix">{String(i + 1).padStart(2, "0")}</span>
              <span className="shbn-name">{label}</span>
            </p>
            <div className="shbn-ring">
              <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                <circle className="shbn-tk" cx="100" cy="100" r="96" pathLength={100} />
                <circle className="shbn-tr" cx="100" cy="100" r="82" />
                <circle className="shbn-ar" cx="100" cy="100" r="82" pathLength={100} style={{ strokeDashoffset: on ? 100 - score : 100, transitionDelay: `${200 + i * 110}ms` }} />
              </svg>
              <p className="shbn-val">
                <span className="shbn-num" style={F_D}>
                  <Count to={String(score)} on={on} ms={900} />
                </span>
                <span className="sh-mono shbn-of">{ui.bench.of100}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="shbn-vit sh-plate is-well" style={rv(on, 380)}>
        <p className="shbn-vh">
          <span className="sh-mono shbn-vt">{b.vitalsTitle}</span>
          <span className="sh-lbl">{b.vitalsNote}</span>
        </p>
        <ul className="shbn-bars" aria-label={ui.bench.vitalsLabel} style={{ ["--n" as string]: b.vitals.length }}>
          {b.vitals.map((x, i) => {
            const ratio = x.v / x.b;
            const over = ratio > 1;
            return (
              <li className={`shbn-bar${over ? " is-over" : ""}`} key={x.short}>
                <p className="shbn-bh">
                  <span className="sh-chip is-acc">{x.short}</span>
                  <span className="sh-lbl">{x.name}</span>
                </p>
                <p className="shbn-bv" style={F_D}>
                  {x.value}
                </p>
                <div className="shbn-track" aria-hidden="true">
                  <i style={{ width: `${Math.max(1.5, Math.min(1, ratio) * 100)}%`, transform: on ? "scaleX(1)" : "scaleX(0)", transitionDelay: `${460 + i * 120}ms` }} />
                  <b />
                </div>
                <p className="shbn-bf">
                  <span className="sh-lbl shbn-z">0</span>
                  <span className="shbn-st sh-mono">
                    {over ? null : <Tick />}
                    {over ? ui.bench.over : ui.bench.within}
                  </span>
                  <span className="sh-lbl shbn-bb">{fill(ui.bench.budget, { value: x.budget })}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Bench() {
  if (!extras.bench) return null;
  return (
    <Sec className="sh-lime shbn">
      <Inner b={extras.bench} />
    </Sec>
  );
}
