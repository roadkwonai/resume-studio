"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "./data";
import s from "./nl.module.css";

const ROWS = site.preloader;
const MIN_SHOW = 450; // "Shortest show" 0.45 s
const MAX_WAIT = 4000; // "Longest wait" 4 s

const kind = (name: string, type: string) => {
  if (/\.(woff2?|ttf|otf)(\?|#|$)/i.test(name)) return 1;
  if (type === "script" || /\.m?js(\?|#|$)/i.test(name)) return 2;
  if (type === "img" || type === "image" || /\.(png|jpe?g|webp|avif|gif|svg)(\?|#|$)/i.test(name)) return 3;
  return -1;
};
const fmt = (n: number) => {
  const r = String(Math.round(n));
  return n >= 1000 ? `${r.slice(0, -3)},${r.slice(-3)}` : r;
};

type Frame = { v: number; a: number[]; b: number[]; on: boolean[]; ready: boolean };

/** The page's own requests drawn as bars while they load, then opened onto the page. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [f, setF] = useState<Frame>({ v: 0, a: [0, 0, 0, 0, 0], b: [0, 0, 0, 0, 0], on: [true, false, false, false, false], ready: false });
  const [open, setOpen] = useState(false);
  const [w, setW] = useState(1440);

  useEffect(() => {
    const el = root.current;
    const h = document.documentElement;
    if (!el || h.getAttribute("data-ngw") !== "run") return;
    let raf = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const t0 = performance.now();
    const hyd = t0;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const A = [0, 0, 0, 0, 0];
    const B = [0, 0, 0, 0, 0];
    const on = [true, false, false, false, false];
    let readyAt = 0;
    setW(el.clientWidth);
    const scan = () => {
      const a = [0, 1e12, 1e12, 1e12];
      const b = [0, 0, 0, 0];
      for (const e of performance.getEntriesByType("resource") as PerformanceResourceTiming[]) {
        const k = kind(e.name, e.initiatorType);
        if (k < 0) continue;
        const x = e.responseEnd || e.startTime + e.duration;
        if (e.startTime < a[k]) a[k] = e.startTime;
        if (x > b[k]) b[k] = x;
      }
      for (let k = 1; k < 4; k++)
        if (b[k] > 0) {
          A[k] = a[k];
          B[k] = b[k];
          on[k] = true;
        }
    };
    const frame = (v: number, ready: boolean) => {
      scan();
      const re = nav?.responseEnd ?? 0;
      B[0] = re > 0 && re < v ? re : v;
      setF({ v, a: [...A], b: [...B], on: [...on], ready });
    };
    const done = () => {
      h.setAttribute("data-ngw", "done");
      window.dispatchEvent(new Event("ngw:done"));
    };
    const tick = () => {
      const now = performance.now();
      if (!readyAt) {
        const cap = now - t0 > MAX_WAIT;
        if (cap || document.fonts?.status === "loaded" || now > hyd + 1500) readyAt = now;
      }
      if (readyAt) {
        scan();
        let a = 0;
        for (let k = 0; k < 4; k++) if (on[k] && B[k] > a) a = B[k];
        A[4] = Math.min(a, readyAt);
        B[4] = readyAt;
        on[4] = true;
        (window as unknown as { __ngLoadMs: number }).__ngLoadMs = Math.round(readyAt);
        frame(readyAt, true);
        window.dispatchEvent(new Event("ngw:ready"));
        timers.push(setTimeout(() => setOpen(true), Math.max(120, t0 + MIN_SHOW - performance.now() + 120)));
        timers.push(setTimeout(done, Math.max(120, t0 + MIN_SHOW - performance.now() + 120) + 680));
        return;
      }
      frame(now, false);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, []);

  const narrow = w < 810;
  const x0 = narrow ? 20 : 250;
  const x1 = narrow ? 20 : 48;
  const max = Math.max(500, f.v / 0.8);
  const px = Math.max(1, w - x0 - x1) / max;
  const step = px * 100 >= 72 ? 1 : px * 200 >= 72 ? 2 : px * 500 >= 72 ? 5 : px * 1000 >= 72 ? 10 : px * 2000 >= 72 ? 20 : 50;
  const pos = (t: number) => `calc(var(--x0) + (100% - var(--x0) - var(--x1)) * ${t / max})`;
  const ticks: number[] = [];
  for (let t = 0; t <= max; t += step * 100) ticks.push(t);
  const thin = 6 / px;
  const sq = (narrow ? 8 : 10) / px;

  return (
    <div ref={root} className={`${s.ngw} ${open ? s.ngwOpen : ""}`} aria-hidden>
      {ROWS.map((name, k) => {
        const a = Math.max(0, Math.min(f.a[k], f.b[k] - (k === 4 ? sq : thin)));
        const b = f.b[k];
        const lit = f.on[k] && (k < 4 || f.ready);
        return (
          <div key={name} className={`${s.ngwRow} ${lit ? s.ngwOn : ""} ${k === 4 && lit ? s.ngwRdy : ""}`} style={{ ["--i" as string]: k }}>
            <div className={s.ngwTop} />
            <div className={s.ngwMid}>
              <div className={s.ngwL} style={{ width: pos(a) }} />
              <div className={s.ngwBar} />
              <div className={s.ngwR} style={{ width: `calc(100% - ${pos(b)})` }} />
            </div>
            <div className={s.ngwBot} />
            <span className={s.ngwName}>{name}</span>
            <span className={s.ngwMs} style={{ left: `calc(${pos(b)} + 12px)` }}>{k < 4 ? `${fmt(f.b[k] - f.a[k])} ms` : ""}</span>
          </div>
        );
      })}
      <div className={s.ngwAxis}>
        {ticks.map((t) => (
          <div key={t} className={s.ngwTk} style={{ left: pos(t) }}>
            <span>{fmt(t)}</span>
          </div>
        ))}
      </div>
      <div className={s.ngwHead} style={{ left: pos(f.v) }} />
      <div className={s.ngwNum}>
        {fmt(f.v)}
        <span className={s.ngwU}>ms</span>
      </div>
    </div>
  );
}
