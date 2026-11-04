"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Chip, Eb, F_D, Face, Hd, More, Sec, rv, useSec } from "./ui";
import { Count } from "./Count";
import { labItems, ui } from "./data";

const Arrow = ({ back = false, s = 16, w = 2.2 }: { back?: boolean; s?: number; w?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={back ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const Star = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.2 1.2-6.6-4.8-4.6 6.6-.9z" />
  </svg>
);
const Down = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v12M6.5 11l5.5 5.5 5.5-5.5M5 20.5h14" />
  </svg>
);

function Inner() {
  const { on } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rail = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [st, setSt] = useState({ a: true, b: false, fits: false });
  const items = labItems.slice(0, 6);

  // arrows, progress bar and the "cut" state of cards touching the viewport edge
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      const x = el.scrollLeft;
      const a = x <= 2;
      const b = x >= max - 2;
      const fits = max <= 2;
      setSt((s) => (s.a === a && s.b === b && s.fits === fits ? s : { a, b, fits }));
      const f = el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1;
      bar.current?.style.setProperty("--f", f.toFixed(4));
      bar.current?.style.setProperty("--p", (max > 0 ? x / max : 0).toFixed(4));
      const w = window.innerWidth;
      el.querySelectorAll(".shlb-item").forEach((li) => {
        const r = li.getBoundingClientRect();
        li.classList.toggle("is-cut", r.left < 4 || r.right > w - 4);
      });
    };
    const q = () => {
      raf ||= requestAnimationFrame(read);
    };
    q();
    el.addEventListener("scroll", q, { passive: true });
    window.addEventListener("resize", q);
    const ro = new ResizeObserver(q);
    ro.observe(el);
    const t = window.setTimeout(q, 700);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      el.removeEventListener("scroll", q);
      window.removeEventListener("resize", q);
      ro.disconnect();
    };
  }, []);

  // mouse drag with release inertia; a drag never turns into a click; horizontal wheel scrolls the rail
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let down = false;
    let drag = false;
    let x0 = 0;
    let s0 = 0;
    let id = -1;
    let block = 0;
    let vel = 0;
    let lx = 0;
    let lt = 0;
    let fling = 0;
    const inside = (t: EventTarget | null) => t instanceof Node && el.contains(t);
    const stop = () => {
      if (fling) cancelAnimationFrame(fling);
      fling = 0;
    };
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      stop();
      down = true;
      drag = false;
      x0 = e.clientX;
      s0 = el.scrollLeft;
      id = e.pointerId;
      vel = 0;
      lx = e.clientX;
      lt = performance.now();
    };
    const pm = (e: PointerEvent) => {
      if (!down || e.pointerId !== id) return;
      const dx = e.clientX - x0;
      if (!drag && Math.abs(dx) > 6) {
        drag = true;
        el.classList.add("is-drag");
      }
      if (drag) {
        el.scrollLeft = s0 - dx;
        const t = performance.now();
        if (t > lt) {
          vel = (e.clientX - lx) / (t - lt);
          lx = e.clientX;
          lt = t;
        }
      }
    };
    const pu = (e: PointerEvent) => {
      if (!down || e.pointerId !== id) return;
      down = false;
      if (!drag) return;
      block = performance.now() + 350;
      el.classList.remove("is-drag");
      if (!reduce && Math.abs(vel) > 0.25 && performance.now() - lt < 80) {
        let v = vel * 16;
        const f = () => {
          el.scrollLeft -= v;
          v *= 0.93;
          fling = Math.abs(v) > 0.4 ? requestAnimationFrame(f) : 0;
        };
        fling = requestAnimationFrame(f);
      }
    };
    const click = (e: MouseEvent) => {
      if (performance.now() < block && inside(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        block = 0;
      }
    };
    const ds = (e: Event) => inside(e.target) && e.preventDefault();
    const wheel = (e: WheelEvent) => {
      if (!inside(e.target) || e.ctrlKey || el.scrollWidth - el.clientWidth <= 0) return;
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      const dy = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
      if (dx && Math.abs(dx) > Math.abs(dy)) {
        stop();
        el.scrollLeft += e.deltaMode === 1 ? dx * 32 : dx;
        e.preventDefault();
        e.stopPropagation();
      }
    };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    window.addEventListener("pointercancel", pu);
    window.addEventListener("click", click, true);
    window.addEventListener("dragstart", ds, true);
    window.addEventListener("wheel", wheel, { passive: false, capture: true });
    return () => {
      stop();
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("pointercancel", pu);
      window.removeEventListener("click", click, true);
      window.removeEventListener("dragstart", ds, true);
      window.removeEventListener("wheel", wheel, { capture: true });
    };
  }, []);

  const go = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const c = el.querySelector("[data-shlb-card]");
    el.scrollBy({ left: dir * (c ? c.getBoundingClientRect().width + 20 : el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <>
      <div className="sh-wrap shlb-head">
        <div className="sh-headblock">
          <Eb text={ui.lab.eyebrow} />
          <Hd text={ui.lab.heading} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.lab.lead}
          </p>
        </div>
        {!st.fits ? (
          <div className="shlb-arrows" style={rv(on, 260)}>
            <button type="button" className="shlb-arrow" aria-label={ui.lab.prev} aria-controls={`shlb-rail-${uid}`} disabled={st.a} onClick={() => go(-1)} data-cur="scroll back">
              <Arrow back />
            </button>
            <button type="button" className="shlb-arrow" aria-label={ui.lab.next} aria-controls={`shlb-rail-${uid}`} disabled={st.b} onClick={() => go(1)} data-cur="scroll on">
              <Arrow />
            </button>
          </div>
        ) : null}
      </div>
      <ul className="shlb-rail" id={`shlb-rail-${uid}`} ref={rail} aria-label={ui.lab.railLabel} data-gate-skip="" data-lenis-prevent-touch="">
        {items.map((it, t) => (
          <li className="shlb-item" data-shlb-card="" style={rv(on, 300 + Math.min(t, 5) * 70)} key={it.slug}>
            <Link className="shlb-card sh-plate" href={`/lab/${it.slug}`} draggable={false} data-cur="drag" aria-label={`${it.name}. ${it.summary}`}>
              <span className="sh-pic shlb-pic" style={{ aspectRatio: "16/10", borderRadius: 9 }}>
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.alt} width={1600} height={1000} loading="lazy" decoding="async" draggable={false} style={{ objectPosition: "50% 50%" }} />
                ) : (
                  <Face text={it.name} />
                )}
                {it.kind ? (
                  <span className="shlb-kind">
                    <Chip t={it.kind} tone="fill" />
                  </span>
                ) : null}
              </span>
              <span className="shlb-body">
                <span className="shlb-name" style={F_D}>{it.name}</span>
                <span className="shlb-line">{it.summary}</span>
                <span className="shlb-stats sh-mono">
                  {it.stars ? (
                    <span className="shlb-stat">
                      <Star />
                      <Count to={it.stars} on={on} />
                      <em>{ui.lab.stars}</em>
                    </span>
                  ) : null}
                  {it.downloads ? (
                    <span className="shlb-stat">
                      <Down />
                      <Count to={it.downloads} on={on} ms={1700} />
                      <em>{ui.lab.downloads}</em>
                    </span>
                  ) : null}
                  <span className="shlb-open">
                    {ui.lab.open}
                    <Arrow s={13} w={2} />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sh-wrap shlb-foot">
        <span className="shlb-bar" ref={bar} aria-hidden="true" style={st.fits ? { visibility: "hidden" } : undefined}>
          <i />
        </span>
        <More href="/lab" n="02" label={ui.lab.all} cur="open lab" />
      </div>
    </>
  );
}

export function Lab() {
  if (!labItems.length) return null;
  return (
    <Sec className="shlb sh-well">
      <Inner />
    </Sec>
  );
}
