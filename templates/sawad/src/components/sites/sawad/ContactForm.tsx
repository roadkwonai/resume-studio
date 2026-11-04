"use client";

import type { FormEvent } from "react";
import type { FormText } from "./data";
import s from "./sawad.module.css";

export function ContactForm({ t, email, budgets }: { t: FormText; email: string; budgets: string[] }) {
  // shortcut: no backend, opens the visitor's mail client; swap for a real endpoint when one exists.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const budget = budgets.length ? `${t.budget}: ${f.get("budget")}\n` : "";
    const body = `${t.name}: ${f.get("name")}\n${t.email}: ${f.get("email")}\n${budget}\n${f.get("message")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <label className={s.field}>
        <span className={s.label}>{t.name}</span>
        <input className={s.control} name="name" placeholder={t.namePlaceholder} required />
      </label>
      <label className={s.field}>
        <span className={s.label}>{t.email}</span>
        <input className={s.control} name="email" type="email" placeholder={t.emailPlaceholder} required />
      </label>
      {budgets.length > 0 && (
        <label className={`${s.field} ${s.wide}`}>
          <span className={`${s.label} ${s.inter}`}>{t.budget}</span>
          <select className={s.control} name="budget" defaultValue="" required>
            <option value="" disabled>
              {t.budgetPlaceholder}
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className={`${s.field} ${s.wide}`}>
        <span className={`${s.label} ${s.labelAlt}`}>{t.message}</span>
        <textarea className={s.control} name="message" placeholder={t.messagePlaceholder} />
      </label>
      <button className={s.submit} type="submit">
        {t.submit}
      </button>
    </form>
  );
}
