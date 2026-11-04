"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EMAIL, ctaHeading, ctaNote, extras, site } from "./data";
import s from "./nl.module.css";

export function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" />
    </svg>
  );
}

/** A person's image, or a type panel with `name` on it when they have none. Never falls back to a demo picture. */
export function Cover({ src, alt, name, className, ...img }: { src?: string; alt?: string; name: string; className?: string; width: number; height: number; sizes: string; priority?: boolean }) {
  if (src) return <Image src={src} alt={alt ?? name} className={className} {...img} />;
  return <span className={`${s.face} ${className ?? ""}`} aria-hidden>{name}</span>;
}

/** Adds a class once the element has entered the viewport. */
export function useSeen<T extends HTMLElement>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>("0px 0px -6% 0px");
  return (
    <div ref={ref} className={`${s.rv} ${seen ? s.rvOn : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Heading({ lead, rest, level = 2 }: { lead: string; rest?: string; level?: 1 | 2 }) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag className={level === 1 ? s.h1 : s.h2}>
      {lead}
      {rest ? <> <span className={s.dim}>{rest}</span></> : null}
    </Tag>
  );
}

export function PageHero({ label, lead, rest, text }: { label: string; lead: string; rest?: string; text?: string }) {
  return (
    <header className={s.hero}>
      <p className={s.label}>{label}</p>
      <Heading level={1} lead={lead} rest={rest} />
      {text ? <p className={s.lead}>{text}</p> : null}
    </header>
  );
}

export function Cta({ className = "" }: { className?: string }) {
  return (
    <section className={`${s.cta} ${className}`}>
      <h2 className={`${s.h2} ${s.ctaH}`}>
        {ctaHeading}
        {extras.contactRest ? <> <span className={s.dim}>{extras.contactRest}</span></> : null}
      </h2>
      <CtaRow />
    </section>
  );
}

export function CtaRow() {
  return (
    <div className={s.ctaRow}>
      {ctaNote ? <p className={s.body}>{ctaNote}</p> : null}
      <Link href="/contact" className={`${s.btn} ${s.btnPrimary}`}>
        {site.cta.button} <Arrow />
      </Link>
      <a href={`mailto:${EMAIL}`} className={s.under}>{EMAIL}</a>
    </div>
  );
}

export function SideRow({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={s.dRow}>
      <p className={s.label}>{label}</p>
      <div className={wide ? `${s.dBody} ${s.dBodyWide}` : s.dBody}>{children}</div>
    </div>
  );
}
