"use client";

import { Btn, Eb, F_D, Grid, Hd, Sec, rv, useSec } from "./ui";

export interface PageHeroProps {
  eyebrow: string;
  /** headline; `*accent words*` are lime, `|` forces a line break */
  heading: string;
  lead?: string;
  buttons?: { label: string; href: string; kind?: "solid" | "ghost"; icon?: "arrow" | "down" | "none" }[];
  facts?: [label: string, value: string][];
  /** right-hand fake git commit card (Now / Stack pages) */
  commit?: { repo: string; subject: string; meta: string };
}

function Inner({ eyebrow, heading, lead, buttons, facts, commit }: PageHeroProps) {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg pg-first pg-tight">
      <div className={`pg-top${commit ? "" : " is-wide"}`}>
        <div className="pg-top-copy">
          <Eb text={eyebrow} />
          <Hd tag="h1" className="pg-h1" text={heading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
          {lead ? (
            <p className="sh-lead pg-lead" style={rv(on, 220)}>
              {lead}
            </p>
          ) : null}
          {buttons?.length ? (
            <div className="pg-btns" style={rv(on, 300)}>
              {buttons.map((b) => (
                <Btn key={b.href + b.label} href={b.href} label={b.label} kind={b.kind ?? "ghost"} icon={b.icon} />
              ))}
            </div>
          ) : null}
          {facts?.length ? (
            <dl className="pg-facts" style={rv(on, 380)}>
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="sh-lbl">{k}</dt>
                  <dd style={{ ...F_D, fontVariantNumeric: "tabular-nums lining-nums" }}>{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {commit ? (
          <div className="pg-top-side" style={rv(on, 220)}>
            <div className="sh-commit shph-commit">
              <span className="sh-commit-1">
                <i aria-hidden="true" />
                main<em>{commit.repo}</em>
              </span>
              <strong>{commit.subject}</strong>
              <span className="sh-commit-3">{commit.meta}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function PageHero(props: PageHeroProps) {
  return (
    <Sec className={`shph ${props.commit ? "is-commit" : "is-none"}`} eager>
      <Grid x={84} y={8} />
      <Inner {...props} />
    </Sec>
  );
}
