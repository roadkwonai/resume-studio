"use client";

import { useState } from "react";
import { EMAIL, extras, profile, services, site } from "./data";
import s from "./nl.module.css";

/* shortcut: no backend, the form opens the visitor's mail client; swap for an API route when a mail service exists. */
const t = site.form;
const budgets = profile.contact?.budgets ?? [];

function Choice({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className={s.field}>
      <span>{label}</span>
      <div className={s.selWrap}>
        <select className={s.input} name={name} defaultValue="">
          <option value="" disabled>{t.choose}</option>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="m1 1.5 5 5 5-5" /></svg>
      </div>
    </label>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [`${t.name}: ${f.get("name")}`, `${t.email}: ${f.get("email")}`, `${t.company}: ${f.get("company") || "-"}`, `${t.need}: ${f.get("need") || "-"}`, ...(budgets.length ? [`${t.budget}: ${f.get("budget") || "-"}`] : []), "", String(f.get("message"))].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form className={s.form} onSubmit={submit}>
      <label className={s.field}>
        <span>{t.name}</span>
        <input className={s.input} name="name" required placeholder={extras.form?.namePlaceholder} />
      </label>
      <label className={s.field}>
        <span>{t.email}</span>
        <input className={s.input} name="email" type="email" required placeholder={t.emailPlaceholder} />
      </label>
      <label className={s.field}>
        <span>{t.company}</span>
        <input className={s.input} name="company" placeholder={t.optional} />
      </label>
      {services.length ? (
        <Choice label={t.need} name="need" options={[...services.map((v) => v.name), t.permanent, t.other]} />
      ) : null}
      {budgets.length ? <Choice label={t.budget} name="budget" options={budgets} /> : null}
      <label className={s.field}>
        <span>{extras.form?.messageLabel ?? t.message}</span>
        <textarea className={`${s.input} ${s.area}`} name="message" required placeholder={extras.form?.messagePlaceholder} />
      </label>
      <button type="submit" className={`${s.btn} ${s.btnPrimary} ${s.send}`}>{t.send}</button>
      {sent ? <p className={`${s.body} ${s.sent}`}>{t.opening}</p> : null}
    </form>
  );
}
