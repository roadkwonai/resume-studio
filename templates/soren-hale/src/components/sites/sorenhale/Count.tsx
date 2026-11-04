"use client";

import { useEffect, useState, type CSSProperties } from "react";

const ease = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;

/** Counts a number up (once `on` flips true) while keeping prefix/suffix/decimals/thousands of the target text, e.g. "0.8 s", "1,048". */
export function Count({ to, on, ms = 1400, className, style }: { to: string; on: boolean; ms?: number; className?: string; style?: CSSProperties }) {
  const m = to.match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
  const [k, setK] = useState(1);
  useEffect(() => {
    if (!m || !on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // reduced motion or no number: jump straight to the end
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setK(1);
      return;
    }
    let raf = 0;
    let t0 = 0;
    setK(0);
    const tick = (t: number) => {
      t0 ||= t;
      const p = (t - t0) / ms;
      setK(ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, to, ms]);
  let text = to;
  if (m) {
    const dec = (m[2].split(".")[1] ?? "").length;
    const v = parseFloat(m[2].replace(/,/g, "")) * k;
    const s = dec ? v.toFixed(dec) : String(Math.round(v));
    text = m[1] + (m[2].includes(",") ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s) + m[3];
  }
  return (
    <span className={`sh-count sh-num${className ? " " + className : ""}`} style={style} aria-label={to}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
