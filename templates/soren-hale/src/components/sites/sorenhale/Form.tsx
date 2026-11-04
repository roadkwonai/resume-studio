"use client";

import { useId, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Btn, Chip, Eb, F_D, Grid, Hd, Pick, Sec, plain, rv, useSec } from "./ui";
import { fill, services, site, ui } from "./data";

const BUDGETS = site.budgets;
const KINDS = services.length ? [...services.map((s) => s.name), ui.cta.other] : [];
const NUM = { fontVariantNumeric: "tabular-nums lining-nums" } as const;

interface Brief { kind: string; budget: string; name: string }

/** Picks made elsewhere (the Cta brief, "Start this project") arrive through session storage or ?kind=. */
function readBrief(): string {
  const got: Partial<Brief> = {};
  try {
    const b = JSON.parse(sessionStorage.getItem("sh-brief") || "null") as Partial<Brief> | null;
    if (b && typeof b === "object") {
      if (b.kind) got.kind = String(b.kind);
      if (b.budget) got.budget = String(b.budget);
      if (b.name) got.name = String(b.name);
    }
  } catch {
    /* unreadable brief: start empty */
  }
  const k = new URLSearchParams(window.location.search).get("kind");
  if (k) got.kind = k;
  return Object.keys(got).length ? JSON.stringify(got) : "";
}

function Chips({ n, label, options, value, onChange }: { n: string; label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="pg-chips">
      <legend><span className="sh-mono" aria-hidden="true">{n}</span>{label}</legend>
      <div>
        {options.map((o) => (
          <Pick key={o} label={o} on={value === o} onClick={() => onChange(value === o ? "" : o)} />
        ))}
      </div>
    </fieldset>
  );
}

function Field({ id, label, name, value, onChange, type = "text", area, placeholder, auto }: {
  id: string; label: string; name: string; value: string; onChange: (v: string) => void; type?: string; area?: boolean; placeholder: string; auto?: string;
}) {
  return (
    <label className="pg-f" htmlFor={id}>
      <span className="pg-f-l">{label}<i aria-hidden="true"> *</i></span>
      {area ? (
        <textarea id={id} name={name} rows={5} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required data-cur="type" />
      ) : (
        <input id={id} name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required autoComplete={auto} data-cur="type" />
      )}
    </label>
  );
}

function Inner() {
  const { on } = useSec();
  const router = useRouter();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [edits, setEdits] = useState<Partial<Record<"kind" | "budget" | "name" | "email" | "msg", string>>>({});
  const [busy, setBusy] = useState(false);
  const raw = useSyncExternalStore(() => () => {}, readBrief, () => "");
  const brief = useMemo<Partial<Brief>>(() => (raw ? (JSON.parse(raw) as Partial<Brief>) : {}), [raw]);
  const f = {
    kind: edits.kind ?? brief.kind ?? "",
    budget: edits.budget ?? brief.budget ?? "",
    name: edits.name ?? brief.name ?? "",
    email: edits.email ?? "",
    msg: edits.msg ?? "",
  };
  const carried = [brief.kind, brief.budget, brief.name].filter(Boolean).join(" · ");
  const set = (k: keyof typeof edits) => (v: string) => setEdits((p) => ({ ...p, [k]: v }));

  const kinds = f.kind && !KINDS.includes(f.kind) ? [...KINDS, f.kind] : KINDS;
  const budgets = f.budget && !BUDGETS.includes(f.budget) ? [...BUDGETS, f.budget] : BUDGETS;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      sessionStorage.setItem("sh-sent", JSON.stringify({ name: f.name, kind: f.kind, t: Date.now() }));
      sessionStorage.removeItem("sh-brief");
    } catch {
      /* storage blocked: the thank-you page greets without a name */
    }
    // shortcut: no backend, so the message goes out through the visitor's mail app; upgrade to a server action or form service when one exists.
    const body = [f.msg, "", `${ui.form.mailName}: ${f.name}`, `${ui.form.mailEmail}: ${f.email}`, ...(f.kind ? [`${ui.form.mailNeeds}: ${f.kind}`] : []), ...(f.budget ? [`${ui.form.mailBudget}: ${f.budget}`] : [])].join("\n");
    const subject = fill(ui.form.subject, { kind: f.kind || ui.cta.subject, from: f.name });
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => router.push("/thanks"), 500);
  };

  return (
    <div className="sh-wrap pg pg-first shfm-grid">
      <div className="shfm-copy">
        <Eb text={ui.form.eyebrow} />
        <Hd tag="h1" className="pg-h1" text={site.contactHeading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
        <p className="sh-lead pg-lead" style={rv(on, 220)}>
          {site.contactLead}
        </p>
        <address className="shfm-ways" style={rv(on, 320)}>
          <a href={`mailto:${site.email}`} data-cur="write mail"><span className="sh-lbl">{ui.form.email}</span><b style={F_D}>{site.email}</b></a>
          {site.phone ? <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} data-cur="call"><span className="sh-lbl">{ui.form.phone}</span><b style={{ ...F_D, ...NUM }}>{site.phone}</b></a> : null}
          {site.city ? <div><span className="sh-lbl">{ui.form.basedIn}</span><b style={F_D}>{site.city}</b></div> : null}
          {site.replyNote ? <p className="shfm-resp sh-mono"><i className="sh-dot" aria-hidden="true" />{site.replyNote}</p> : null}
        </address>
      </div>
      <form className="pg-form sh-plate shfm-form" onSubmit={submit} style={rv(on, 180, 26)} aria-label={plain(site.contactHeading)}>
        <div className="shfm-bar">
          <span className="sh-lbl">{ui.form.file}</span>
          <Chip t={ui.form.draft} tone="mut" />
        </div>
        <p className={`shfm-note sh-mono${carried ? " is-on" : ""}`} aria-live="polite">
          <span aria-hidden="true">{"//"}</span> {carried ? fill(ui.form.carried, { value: carried }) : ui.form.idle}
        </p>
        {kinds.length ? <Chips n="01" label={ui.cta.kind} options={kinds} value={f.kind} onChange={set("kind")} /> : null}
        {budgets.length ? <Chips n={kinds.length ? "02" : "01"} label={ui.cta.budget} options={budgets} value={f.budget} onChange={set("budget")} /> : null}
        <div className="pg-two">
          <Field id={`${uid}-name`} label={ui.form.yourName} name="name" value={f.name} onChange={set("name")} auto="name" placeholder={ui.form.namePlaceholder} />
          <Field id={`${uid}-email`} label={ui.form.email} name="email" type="email" value={f.email} onChange={set("email")} auto="email" placeholder={ui.form.emailPlaceholder} />
        </div>
        <Field id={`${uid}-msg`} label={ui.form.message} name="message" area value={f.msg} onChange={set("msg")} placeholder={ui.form.messagePlaceholder} />
        <div className="pg-form-foot">
          <Btn type="submit" label={busy ? ui.form.sending : ui.form.send} kind="solid" cur="send" disabled={busy} />
          <p>{ui.form.privacy}</p>
        </div>
      </form>
    </div>
  );
}

export function Form() {
  return (
    <Sec className="shfm">
      <Grid x={12} y={12} />
      <Inner />
    </Sec>
  );
}
