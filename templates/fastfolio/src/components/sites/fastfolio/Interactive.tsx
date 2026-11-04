"use client";

import Lenis from "lenis";
import { useEffect, useState } from "react";
import { CircleArrow } from "./Icons";
import { Roll } from "./Roll";

export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Same options the source page runs Lenis with.
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    let frame = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function MobileMenu({ links, contact, openLabel, closeLabel, contactLabel }: { links: { href: string; label: string }[]; contact: string; openLabel: string; closeLabel: string; contactLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="ff-burger" aria-expanded={open} aria-label={open ? closeLabel : openLabel} onClick={() => setOpen(!open)} data-open={open ? "" : undefined}>
        <span />
        <span />
        <span />
      </button>
      {open ? (
        <div className="ff-sheet">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Roll href={contact} label={contactLabel} solid arrow small />
        </div>
      ) : null}
    </>
  );
}

export function Job({ title, period, items, open: initial, toggle }: { title: string; period: string; items: string[]; open: boolean; toggle: string }) {
  const [open, setOpen] = useState(initial);
  return (
    <article className="ff-job" data-open={open ? "" : undefined}>
      <header>
        <h4>{title}</h4>
        <p>{period}</p>
      </header>
      {items.length ? (
        <>
          <div className="ff-job-body">
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <button type="button" aria-expanded={open} aria-label={toggle} onClick={() => setOpen(!open)}>
            <CircleArrow />
          </button>
        </>
      ) : null}
    </article>
  );
}
