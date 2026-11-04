"use client";

import type { FormEvent } from "react";
import s from "./kerneldev.module.css";

type Labels = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  budget: string;
  budgetPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  subject: string;
};

export function ContactForm({ email, budgets, labels }: { email: string; budgets: string[]; labels: Labels }) {
  // shortcut: no backend, the form opens the visitor's mail client; swap for an API route when one exists.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const budget = d.get("Budget");
    const body = `${budget ? `${labels.budget}: ${budget}\n\n` : ""}${d.get("Message")}\n\n${d.get("Name")} <${d.get("Email")}>`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <label className={s.field}>
        <span className={s.mono}>{labels.name}</span>
        <span className={s.input}>
          <input type="text" name="Name" placeholder={labels.namePlaceholder} required />
        </span>
      </label>
      <label className={s.field}>
        <span className={s.mono}>{labels.email}</span>
        <span className={s.input}>
          <input type="email" name="Email" placeholder={labels.emailPlaceholder} required />
        </span>
      </label>
      {budgets.length > 0 && (
        <label className={s.field}>
          <span className={s.mono}>{labels.budget}</span>
          <span className={s.input}>
            <select name="Budget" defaultValue="">
              <option value="">{labels.budgetPlaceholder}</option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </span>
        </label>
      )}
      <label className={s.field}>
        <span className={s.mono}>{labels.message}</span>
        <span className={s.textareaWrap}>
          <textarea name="Message" placeholder={labels.messagePlaceholder} required />
        </span>
      </label>
      <button type="submit" className={s.submit}>
        {labels.submit}
      </button>
    </form>
  );
}
