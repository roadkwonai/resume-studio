"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Btn, Caret, Chip, Eb, Grid, Hd, Pick, Sec, plain, rv, useSec } from "./ui";
import { counted, fill, services, site, ui } from "./data";

const BUDGETS = site.budgets;
const KINDS = services.length ? [...services.map((s) => s.name), ui.cta.other] : [];
const pad = (n: number) => String(n).padStart(2, "0");
const steps = 1 + (KINDS.length ? 1 : 0) + (BUDGETS.length ? 1 : 0);

interface Brief {
  kind: string;
  budget: string;
  name: string;
}

const readBrief = (): Partial<Brief> => {
  try {
    const b = JSON.parse(sessionStorage.getItem("sh-brief") || "{}");
    return b && typeof b === "object" ? b : {};
  } catch {
    return {};
  }
};

/** Picks live in sessionStorage so the contact form can pick them up. */
function Inner() {
  const { on } = useSec();
  const router = useRouter();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [b, setB] = useState<Brief>({ kind: "", budget: "", name: "" });
  useEffect(() => {
    const s = readBrief();
    // sessionStorage is only readable after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setB({ kind: s.kind || "", budget: s.budget || "", name: s.name || "" });
  }, []);
  const update = (p: Partial<Brief>) => {
    const next = { ...b, ...p };
    setB(next);
    try {
      sessionStorage.setItem("sh-brief", JSON.stringify(next));
    } catch {
      /* storage blocked: picks just won't carry over */
    }
  };
  const any = !!(b.kind || b.budget || b.name.trim());
  const body = [b.kind && `kind: ${b.kind}`, b.budget && `budget: ${b.budget}`, b.name.trim() && `name: ${b.name.trim()}`].filter(Boolean).join("\n");
  const mail = `mailto:${site.email}?subject=${encodeURIComponent(ui.cta.subject)}${body ? `&body=${encodeURIComponent(body + "\n\n")}` : ""}`;
  const val = (v: string) =>
    v ? (
      <b className="shct-v">&quot;{v}&quot;</b>
    ) : (
      <em className="shct-u">
        null <span>{ui.cta.notPicked}</span>
      </em>
    );
  return (
    <div className="sh-wrap sh-pad">
      <div className="sh-headblock shct-head">
        <Eb text={ui.cta.eyebrow} />
        <Hd text={site.contactHeading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={60} />
        <p className="sh-lead" style={rv(on, 200)}>
          {steps > 1 ? counted(ui.cta.lead, steps) : ui.cta.leadSolo}
        </p>
      </div>
      <form
        className="shct-form"
        action="/contact"
        method="get"
        aria-label={plain(site.contactHeading)}
        onSubmit={(e) => {
          e.preventDefault();
          update({});
          router.push("/contact");
        }}
      >
        <div className="shct-steps">
          {KINDS.length ? (
            <div className="shct-step" role="group" aria-labelledby={`shct-k-${uid}`} style={rv(on, 260)}>
              <p className="shct-lab" id={`shct-k-${uid}`}>
                <span className="sh-mono" aria-hidden="true">01</span>{ui.cta.kind}
              </p>
              <div className="shct-picks">
                {KINDS.map((k) => (
                  <Pick key={k} label={k} on={b.kind === k} onClick={() => update({ kind: b.kind === k ? "" : k })} cur={b.kind === k ? "clear pick" : "pick kind"} />
                ))}
              </div>
            </div>
          ) : null}
          {BUDGETS.length ? (
            <div className="shct-step" role="group" aria-labelledby={`shct-b-${uid}`} style={rv(on, 330)}>
              <p className="shct-lab" id={`shct-b-${uid}`}>
                <span className="sh-mono" aria-hidden="true">{pad(KINDS.length ? 2 : 1)}</span>{ui.cta.budget}
              </p>
              <div className="shct-picks">
                {BUDGETS.map((k) => (
                  <Pick key={k} label={k} on={b.budget === k} onClick={() => update({ budget: b.budget === k ? "" : k })} cur={b.budget === k ? "clear pick" : "pick budget"} />
                ))}
              </div>
            </div>
          ) : null}
          <div className="shct-step" style={rv(on, 400)}>
            <label className="shct-lab" htmlFor={`shct-n-${uid}`}>
              <span className="sh-mono" aria-hidden="true">{pad(steps)}</span>{ui.cta.name}
            </label>
            <input
              className="shct-in"
              id={`shct-n-${uid}`}
              type="text"
              autoComplete="name"
              maxLength={60}
              placeholder={ui.cta.namePlaceholder}
              value={b.name}
              onChange={(e) => update({ name: e.target.value.slice(0, 60) })}
              data-cur="type name"
            />
          </div>
        </div>
        <div className="shct-out sh-plate" style={rv(on, 340)}>
          <div className="shct-bar">
            <span className="sh-lbl">{ui.cta.file}</span>
            <Chip t={ui.cta.draft} tone="mut" />
          </div>
          <div className="shct-code sh-mono" aria-hidden="true">
            <span className="shct-l"><i>export const</i> brief = {"{"}</span>
            {KINDS.length ? <span className="shct-l is-in">kind: {val(b.kind)},</span> : null}
            {BUDGETS.length ? <span className="shct-l is-in">budget: {val(b.budget)},</span> : null}
            <span className="shct-l is-in">name: {val(b.name.trim())},</span>
            <span className="shct-l">{"}"}<Caret /></span>
          </div>
          <p className="sh-sr" aria-live="polite">{fill(ui.cta.soFar, { value: any ? [b.kind, b.budget, b.name.trim()].filter(Boolean).join(", ") : ui.cta.nothing })}</p>
          <div className="shct-act">
            <Btn label={ui.cta.continue} kind="solid" type="submit" cur="to contact" />
            <p className="shct-mail">
              {ui.cta.orWrite} <a href={mail} data-cur="write email">{site.email}</a>
            </p>
          </div>
          <p className="shct-note">{ui.cta.note}</p>
        </div>
      </form>
    </div>
  );
}

export function Cta() {
  return (
    <Sec className="sh-well shct">
      <Grid x={78} y={30} />
      <Inner />
    </Sec>
  );
}
