"use client";

import { useId, type MouseEvent } from "react";
import Link from "next/link";
import { Eb, Hd, Sec, rv, useSec } from "./ui";
import { Md, headings, slugify } from "./md";
import { site, ui } from "./data";

type LegalKey = "privacy" | "terms" | "cookies";
const DOCS: [string, LegalKey][] = [[ui.legal.privacy, "privacy"], [ui.legal.terms, "terms"], [ui.legal.cookies, "cookies"]];
const legalDocs: Record<LegalKey, { title: string; body: string }> = {
  privacy: { title: ui.legal.privacyTitle, body: ui.legal.privacyBody },
  terms: { title: ui.legal.termsTitle, body: ui.legal.termsBody },
  cookies: { title: ui.legal.cookiesTitle, body: ui.legal.cookiesBody },
};

declare global {
  interface Window { __shLenis?: { scrollTo: (y: number) => void } }
}

function jump(e: MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const y = el.getBoundingClientRect().top + window.scrollY - 112;
  const lenis = window.__shLenis;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  el.focus({ preventScroll: true });
}

function Side({ doc, idp }: { doc: LegalKey; idp: string }) {
  const toc = headings(legalDocs[doc].body);
  return (
    <>
      {toc.length ? (
        <nav className="pg-toc" aria-label={ui.legal.onPage}>
          <p className="sh-lbl">{ui.legal.onPage}</p>
          <ol>
            {toc.map((h, i) => (
              <li key={h.slug}>
                <a href={`#${idp}-${slugify(h.text)}`} data-cur="jump" onClick={(e) => jump(e, `${idp}-${slugify(h.text)}`)}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <nav className="shlg-docs" aria-label={ui.legal.other}>
        <p className="sh-lbl">{ui.legal.other}</p>
        <ul>
          {DOCS.map(([l, k]) => (
            <li key={k}>
              <Link className={`sh-pick${k === doc ? " is-on" : ""}`} href={`/${k}`} aria-current={k === doc ? "page" : undefined} data-cur="open">{l}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="shlg-q">
        {ui.legal.question} <a href={`mailto:${site.email}`} data-cur="write mail">{ui.legal.write}</a>
      </p>
    </>
  );
}

function Inner({ doc }: { doc: LegalKey }) {
  const { on } = useSec();
  const idp = "lg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const d = legalDocs[doc];
  return (
    <div className="sh-wrap pg pg-first">
      <header className="shlg-head">
        <Eb text={ui.legal.eyebrow} />
        <Hd tag="h1" className="pg-h1" text={d.title} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
        {ui.legal.updated ? <p className="shlg-date sh-mono" style={rv(on, 220)}>{ui.legal.updatedLabel} <b>{ui.legal.updated}</b></p> : null}
      </header>
      <div className="pg-prose has-side">
        <aside className="pg-prose-side is-top" style={rv(on, 360)}><Side doc={doc} idp={idp} /></aside>
        <div className="pg-prose-main" style={rv(on, 260, 22)}>
          <Md md={d.body} idPrefix={idp} />
        </div>
        <aside className="pg-prose-side is-end" style={rv(on, 360)}><Side doc={doc} idp={idp} /></aside>
      </div>
    </div>
  );
}

export function Legal({ doc }: { doc: LegalKey }) {
  return (
    <Sec className="shlg shlg-doc">
      <Inner doc={doc} />
    </Sec>
  );
}
