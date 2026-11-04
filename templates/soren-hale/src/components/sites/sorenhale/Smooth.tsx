"use client";

import { useEffect, useRef } from "react";
import { ui } from "./data";

/* Smooth scrolling (Lenis, lerp .1) and the lime cursor dot with a data-cur label. Both are skipped on touch and with reduced motion. */

interface LenisLike {
  raf(t: number): void;
  scrollTo(target: string | Element | number, o?: { offset?: number }): void;
  destroy(): void;
  start(): void;
  stop(): void;
}

export function Smooth() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: LenisLike | null = null;
    let raf = 0;
    let dead = false;
    const w = window as unknown as { __shLenis?: LenisLike | null };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!a || !lenis || e.defaultPrevented) return;
      const href = a.getAttribute("href") ?? "";
      const i = href.indexOf("#");
      const p = href.slice(0, i);
      if (p && p !== location.pathname) return;
      const el = document.getElementById(href.slice(i + 1));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -72 });
      history.pushState(null, "", href.slice(i));
    };
    import("lenis").then(({ default: Lenis }) => {
      if (dead) return;
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true }) as unknown as LenisLike;
      w.__shLenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      window.addEventListener("click", click);
      document.documentElement.classList.add("lenis");
    });
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("click", click);
      lenis?.destroy();
      w.__shLenis = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}

export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const dot = el.current;
    const text = label.current;
    if (!dot || !text) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    html.classList.add("sh-has-cur");
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false;
    const frame = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      dot.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(frame) : 0;
    };
    const show = (v: boolean) => {
      if (on !== v) {
        on = v;
        dot.classList.toggle("is-on", v);
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const t = e.target as Element | null;
      if (!t?.closest?.(".sh-sec")) {
        show(false);
        return;
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!on) { x = tx; y = ty; }
      show(true);
      raf ||= requestAnimationFrame(frame);
      const l = t.closest("[data-cur]")?.getAttribute("data-cur") ?? "";
      text.textContent = (ui.cur as Record<string, string>)[l] ?? l;
      text.hidden = !l;
      dot.classList.toggle("is-press", !!t.closest("a,button,[role='button'],summary,label,input,select,textarea"));
    };
    const out = () => show(false);
    window.addEventListener("pointermove", move, { passive: true });
    html.addEventListener("pointerleave", out);
    window.addEventListener("blur", out);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      html.removeEventListener("pointerleave", out);
      window.removeEventListener("blur", out);
      html.classList.remove("sh-has-cur");
    };
  }, []);
  return (
    <div ref={el} className="sh-cur" aria-hidden="true">
      <i />
      <span ref={label} hidden />
    </div>
  );
}
