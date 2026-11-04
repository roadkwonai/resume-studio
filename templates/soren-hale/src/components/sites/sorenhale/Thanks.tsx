"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Btn, Chip, Eb, Grid, Hd, Sec, rv, useSec } from "./ui";
import { fill, live, site, ui } from "./data";

const readSent = () => {
  try {
    return sessionStorage.getItem("sh-sent") || "";
  } catch {
    return "";
  }
};

function Inner() {
  const { on } = useSec();
  // The contact form leaves the sender's name and pick in session storage.
  const raw = useSyncExternalStore(() => () => {}, readSent, () => "");
  const sent = useMemo(() => {
    try {
      const s = JSON.parse(raw || "{}") as { name?: string; kind?: string };
      return { name: String(s.name || "").trim(), kind: String(s.kind || "") };
    } catch {
      return { name: "", kind: "" };
    }
  }, [raw]);
  const first = sent.name.split(/\s+/)[0];
  const rows: [string, string][] = [
    [ui.thanks.from, sent.name || ui.thanks.you],
    [ui.thanks.about, sent.kind || ui.thanks.newProject],
    [ui.thanks.reply, site.replyNote],
  ];
  return (
    <div className="sh-wrap pg pg-first shtk-in">
      <div className="shtk-copy">
        <Eb text={ui.thanks.eyebrow} />
        <Hd key={first} tag="h1" className="pg-h1" text={first ? fill(ui.thanks.greet, { first }) : ui.thanks.heading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
        <p className="sh-lead pg-lead" style={rv(on, 220)}>{ui.thanks.lead}</p>
        <div className="pg-btns" style={rv(on, 300)}>
          <Btn href="/" label={ui.thanks.home} kind="solid" cur="go home" />
          {live("/work") ? <Btn href="/work" label={ui.thanks.work} kind="ghost" cur="open work" /> : null}
        </div>
      </div>
      <div className="shtk-card sh-plate" style={rv(on, 260, 24)}>
        <p className="shtk-top sh-mono">
          <i className="sh-dot" aria-hidden="true" />
          <span>main</span>
          <em>inbox</em>
          <Chip t={ui.thanks.queued} tone="acc" />
        </p>
        <p className="shtk-msg sh-mono">{ui.thanks.commit}</p>
        <dl className="shtk-rows">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><dt className="sh-lbl">{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function Thanks() {
  return (
    <Sec className="shtk" eager>
      <Grid x={50} y={30} />
      <Inner />
    </Sec>
  );
}
