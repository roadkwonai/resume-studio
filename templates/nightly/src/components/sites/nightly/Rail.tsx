"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "./data";
import { fill } from "./format";
import s from "./nl.module.css";

const SHIP_AT = 0.48; // the source's Ship line instance: a section goes live once its top passes 48% of the window

/** Port of the source's Ship line: hairline and square down the left edge, counting sections as they go live. */
export function Rail() {
  const live = useRef(new Set<Element>());
  const [count, setCount] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    const on = () => {
      const els = Array.from(document.querySelectorAll("[data-ng-ship]")).filter((e) => (e as HTMLElement).offsetWidth > 0);
      for (const e of els) if (e.getBoundingClientRect().top < window.innerHeight * SHIP_AT) live.current.add(e);
      const x = els.filter((e) => live.current.has(e)).length;
      setCount((p) => (p[0] === x && p[1] === els.length ? p : [x, els.length]));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  const [x, total] = count;
  const done = total > 0 && x === total;
  return (
    <>
      <div className={s.rail} aria-hidden>
        <span className={s.railMark} style={{ top: done ? "calc(100% - 30px)" : `${SHIP_AT * 100}%`, transition: "top .6s ease" }} />
      </div>
      <span className={s.railText} aria-hidden>
        {done ? fill(site.rail.all, { total }) : total > 0 ? <><b>{x}</b>{fill(site.rail.of, { total })}</> : null}
      </span>
    </>
  );
}
