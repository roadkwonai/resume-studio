"use client";

import { Fragment, useState, type ReactNode } from "react";
import { F_D } from "./ui";
import { ui } from "./data";

/* Small markdown subset used by the CMS bodies: ## / ### headings, paragraphs, - lists, 1. lists, > quotes, ``` code, **bold**, `code`, [links](url). */

type Block =
  | { k: "h"; level: 2 | 3; text: string }
  | { k: "p"; text: string }
  | { k: "ul" | "ol"; items: string[] }
  | { k: "q"; text: string }
  | { k: "code"; lang: string; text: string };

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");

export function parse(md: string): Block[] {
  const out: Block[] = [];
  const lines = md.replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const fence = l.match(/^```(\w*)/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push({ k: "code", lang: fence[1], text: buf.join("\n") });
      continue;
    }
    const h = l.match(/^(#{2,3})\s+(.*)/);
    if (h) { out.push({ k: "h", level: h[1].length === 2 ? 2 : 3, text: h[2].trim() }); i++; continue; }
    if (/^>\s?/.test(l)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push({ k: "q", text: buf.join(" ").trim() });
      continue;
    }
    if (/^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l)) {
      const ordered = /^\d+\./.test(l);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\.\s+/ : /^[-*]\s+/).test(lines[i])) items.push(lines[i++].replace(/^([-*]|\d+\.)\s+/, ""));
      out.push({ k: ordered ? "ol" : "ul", items });
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>|```|[-*]\s|\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
    out.push({ k: "p", text: buf.join(" ") });
  }
  return out;
}

export function headings(md: string) {
  return parse(md).flatMap((b) => (b.k === "h" && b.level === 2 ? [{ text: b.text, slug: slugify(b.text) }] : []));
}

function inline(s: string): ReactNode[] {
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  return s.split(re).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    const a = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (a) return <a key={i} href={a[2]}>{a[1]}</a>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Code({ lang, text, label }: { lang: string; text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard blocked: leave the label alone */
    }
  };
  return (
    <figure className="pg-code">
      <figcaption>
        <span className="sh-lbl">{lang || ui.md.code}</span>
        <button type="button" className="pg-code-cp sh-inring" data-cur="copy code" onClick={copy}>
          <span aria-live="polite">{done ? ui.md.copied : ui.md.copy}</span>
        </button>
      </figcaption>
      <pre tabIndex={0} className="sh-inring" aria-label={label ?? (lang || ui.md.code)}>
        <code>{text.split("\n").map((ln, i) => <span key={i}>{ln + "\n"}</span>)}</code>
      </pre>
    </figure>
  );
}

/** Renders markdown with the `.sh-md pg-md` scaffold. `idPrefix` scopes heading ids (they feed the table of contents). */
export function Md({ md, idPrefix = "md", className = "sh-md pg-md" }: { md: string; idPrefix?: string; className?: string }) {
  return (
    <div className={className}>
      {parse(md).map((b, i) => {
        switch (b.k) {
          case "h": {
            const T = b.level === 2 ? "h2" : "h3";
            return <T key={i} id={`${idPrefix}-${slugify(b.text)}`} tabIndex={-1} style={F_D}>{b.text}</T>;
          }
          case "p": return <p key={i}>{inline(b.text)}</p>;
          case "ul": return <ul key={i}>{b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ul>;
          case "ol": return <ol key={i}>{b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ol>;
          case "q": return <blockquote key={i}>{inline(b.text)}</blockquote>;
          case "code": return <Code key={i} lang={b.lang} text={b.text} />;
        }
      })}
    </div>
  );
}
