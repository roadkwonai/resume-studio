"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Download, Minus, Plus, X } from "lucide-react";
import {
  CITY,
  CONTACT_EMAIL,
  CV_FILENAME,
  CV_URL,
  LOCATION,
  LOCATION_URL,
  OS_LABEL,
  TIME_ZONE,
  experience,
  navItems,
  profile,
  site,
} from "./data";
import styles from "./stackbit.module.css";

export function Logo() {
  return (
    <a href="#1" className={styles.logo} aria-label={`${OS_LABEL} OS, ${site.nav.backToTop}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M6.928 16 5 15.467 9.259 0l1.928.533ZM11 3v3l2 2-2 2v3l5-5ZM5 10 3 8l2-2V3L0 8l5 5Z"
          fill="currentColor"
        />
      </svg>
      <span>
        {OS_LABEL} <b>OS</b>
      </span>
    </a>
  );
}

export function Preloader() {
  const [phase, setPhase] = useState<"boot" | "leaving" | "done">("boot");

  useEffect(() => {
    const leave = setTimeout(() => setPhase("leaving"), 3000);
    const done = setTimeout(() => setPhase("done"), 3500);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;
  return (
    <div className={phase === "leaving" ? `${styles.preloader} ${styles.preloaderOut}` : styles.preloader} aria-hidden="true">
      <div className={styles.preloaderContent}>
        <div className={styles.bootLine}>
          <Logo />
        </div>
        {[`${OS_LABEL} OS ${site.boot.version}`, ...site.boot.lines].map((line, index) => (
          <p key={line} className={styles.bootLine} style={{ animationDelay: `${(index + 1) * 200}ms` }}>
            {line}
          </p>
        ))}
        <p className={`${styles.bootLine} ${styles.bootGranted}`} style={{ animationDelay: "1200ms" }}>
          {site.boot.granted}
        </p>
        <div className={styles.bootBars}>
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} style={{ animationDelay: `${1400 + index * 130}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState<string[] | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => {
      const now = new Date();
      const [hours, minutes, seconds] = format.format(now).split(":");
      setTime([hours, minutes, seconds, String(now.getMilliseconds()).padStart(3, "0")]);
    };
    tick();
    const timer = setInterval(tick, 47);
    return () => clearInterval(timer);
  }, []);

  const [hours = "--", minutes = "--", seconds = "--", millis = "---"] = time ?? [];
  return (
    <span className={styles.clock} role="timer" aria-label={site.header.clock.replace("{city}", CITY ?? "").replace("{time}", `${hours}:${minutes}:${seconds}`)}>
      <b>{hours}</b>
      <i>:</i>
      <b>{minutes}</b>
      <i>:</i>
      <i>{seconds}</i>
      <i>:</i>
      <i>{millis}</i>
    </span>
  );
}

function CvButton() {
  return (
    <a className={styles.cvButton} href={CV_URL} download={CV_FILENAME}>
      <Download size={16} strokeWidth={2.4} aria-hidden="true" />
      {site.header.downloadCv}
    </a>
  );
}

export function Header({ badge }: { badge: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={open ? `${styles.header} ${styles.headerOpen}` : styles.header}>
      <nav className={styles.headerInner} aria-label={site.nav.primary}>
        <div className={styles.headerTop}>
          <Logo />
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-label={open ? site.nav.close : site.nav.open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} strokeWidth={1.5} aria-hidden="true" /> : <span className={styles.burger} />}
          </button>
        </div>
        <div className={styles.navPanel}>
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li key={item}>
                <a href={`#${index + 1}`} onClick={close}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.headerMeta}>
            <span>{badge}</span>
            {LOCATION && (
              <a href={LOCATION_URL} target="_blank" rel="noopener noreferrer">
                {LOCATION.toUpperCase()}
              </a>
            )}
            {TIME_ZONE && <Clock />}
            {CV_URL && <CvButton />}
          </div>
        </div>
      </nav>
    </header>
  );
}

export function ExperienceList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.experienceList}>
      {experience.map((item, index) => {
        const open = openIndex === index;
        return (
          <article key={index} className={open ? `${styles.experienceCard} ${styles.experienceOpen}` : styles.experienceCard}>
            <button
              type="button"
              className={styles.experienceHead}
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>
                <span className={styles.experiencePeriod}>{item.period}</span>
                <span className={styles.experienceTitle}>{item.title}</span>
              </span>
              <span className={styles.experienceToggle} aria-hidden="true">
                {open ? <Minus size={22} strokeWidth={1.5} /> : <Plus size={22} strokeWidth={1.5} />}
              </span>
            </button>
            <div className={styles.experienceBody}>
              <p>{item.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ContactForm({ children }: { children: React.ReactNode }) {
  const { form } = site;
  const budgets = profile.contact?.budgets ?? [];
  // shortcut: opens the visitor's mail client, add a form endpoint when the site has a real inbox.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    const subject = site.form.subject.replace("{name}", field("name"));
    const body = `${field("message")}\n\n${field("name")}\n${field("email")}\n${field("company")}\n${field("budget")}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formRow}>
        <input name="name" type="text" placeholder={form.namePlaceholder} aria-label={form.nameLabel} autoComplete="name" required />
        <input name="email" type="email" placeholder={form.emailPlaceholder} aria-label={form.emailLabel} autoComplete="email" required />
      </div>
      <input name="company" type="text" placeholder={form.companyPlaceholder} aria-label={form.companyLabel} autoComplete="organization" />
      {budgets.length > 0 && (
        <select name="budget" aria-label={form.budgetLabel} defaultValue="">
          <option value="">{form.budgetPlaceholder}</option>
          {budgets.map((budget) => (
            <option key={budget}>{budget}</option>
          ))}
        </select>
      )}
      <div className={styles.messageRow}>
        <textarea name="message" placeholder={form.messagePlaceholder} aria-label={form.messageLabel} required />
        {children}
      </div>
      <button type="submit" className={styles.submit}>
        {form.submit}
      </button>
    </form>
  );
}
