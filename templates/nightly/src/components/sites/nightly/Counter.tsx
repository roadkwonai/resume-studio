"use client";

import { useEffect, useRef } from "react";
import s from "./nl.module.css";

/** Port of the source's Roll component: digits roll in the first time the figure is seen. */
export function Roll({ figure, unit, size, unitSize, tracking = -0.05 }: { figure: string; unit?: string; size: string; unitSize?: string; tracking?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    el.classList.add(s.wait);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          el.getBoundingClientRect();
          el.classList.remove(s.wait);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [figure]);
  let x = 0;
  return (
    <div className={s.ngr} ref={ref}>
      <span className={s.ngrN} style={{ fontSize: size, letterSpacing: `${tracking}em` }} role="text" aria-label={`${figure}${unit ? ` ${unit}` : ""}`}>
        {Array.from(figure).map((ch, t) => {
          if (!/[0-9]/.test(ch))
            return (
              <span key={t} className={s.ngrC} aria-hidden>
                <span><i>{ch}</i></span>
              </span>
            );
          const n = Number(ch);
          const k = 3 + (x % 3);
          const c = x++;
          return (
            <span key={t} className={s.ngrC} aria-hidden>
              <span className={s.ngrS} style={{ ["--k" as string]: k, ["--c" as string]: c }}>
                {Array.from({ length: k + 1 }, (_, i) => (n - k + i + 100) % 10).map((d, i) => <i key={i}>{d}</i>)}
              </span>
            </span>
          );
        })}
      </span>
      {unit ? <span className={s.ngrU} style={{ fontSize: unitSize }} aria-hidden>{unit}</span> : null}
    </div>
  );
}
