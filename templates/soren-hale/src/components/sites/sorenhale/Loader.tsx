"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site, ui } from "./data";

/* First visit: a one-line "compile" loader. Internal links: a lime scan line closes the page, then opens the next one. */

const LINE = `${site.name} — ${site.role}`.toLowerCase();
const GLYPHS = "01{}<>/=;()[]#$";
const DURATION = 900;

/** Runs before hydration (see layout.tsx) so the page starts covered instead of flashing. */
export const LOADER_BOOT = `(function(){try{var h=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(sessionStorage.getItem('sh-loaded'))return;h.classList.add('shl-go','sh-hold-ld');setTimeout(function(){if(!window.__shlRun)h.classList.remove('shl-go','sh-hold-ld')},5000)}catch(e){}})()`;

type Mode = "boot" | "load" | "lift" | "idle" | "leave";

export function Loader() {
  const router = useRouter();
  const path = usePathname();
  const [mode, setMode] = useState<Mode>("boot");
  const [ready, setReady] = useState(false);
  const [scramble, setScramble] = useState<string | null>(null);
  const modeRef = useRef<Mode>("boot");
  const timers = useRef<number[]>([]);
  const finish = useRef<() => void>(() => {});
  const first = useRef(true);

  const set = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
  };
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    const html = document.documentElement;
    (window as unknown as { __shlRun?: number }).__shlRun = 1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clear = () => html.classList.remove("shl-go", "shl-arrive", "shl-leave", "sh-hold-ld", "sh-hold-pt");
    const lift = () => {
      if (modeRef.current === "lift" || modeRef.current === "idle") return;
      html.classList.remove("sh-hold-ld", "sh-hold-pt");
      set("lift");
      later(() => {
        clear();
        set("idle");
      }, 560);
    };
    finish.current = lift;

    if (!html.classList.contains("shl-go") || reduced) {
      clear();
      // the pre-hydration boot script decides the first mode
      // eslint-disable-next-line react-hooks/set-state-in-effect
      set("idle");
    } else {
      try {
        sessionStorage.setItem("sh-loaded", "1");
      } catch {
        /* private mode: the loader just shows again next visit */
      }
      html.style.setProperty("--shl-d", DURATION + "ms");
      set("load");
      later(() => setReady(true), DURATION);
      later(lift, DURATION + 100);
      later(lift, 4000);
    }

    const key = (e: KeyboardEvent) => {
      if (modeRef.current === "load" && e.key !== "Tab") lift();
    };
    const click = (e: MouseEvent) => {
      if (reduced || modeRef.current !== "idle" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.closest("[data-no-trans]")) return;
      const raw = a.getAttribute("href") ?? "";
      if (/^(mailto|tel|sms|javascript):/i.test(raw) || raw.startsWith("#")) return;
      const u = new URL(a.href, location.href);
      const norm = (p: string) => p.replace(/\/+$/, "") || "/";
      if (u.origin !== location.origin || norm(u.pathname) === norm(location.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      html.classList.add("shl-leave", "sh-hold-pt");
      set("leave");
      later(() => router.push(u.pathname.slice((process.env.NEXT_PUBLIC_BASE ?? "").length) + u.search + u.hash), 520);
      later(() => {
        // safety: the next page never arrived
        if (modeRef.current === "leave") lift();
      }, 4000);
    };
    window.addEventListener("keydown", key, true);
    // capture phase so we run before next/link's own handler
    window.addEventListener("click", click, true);
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      window.removeEventListener("keydown", key, true);
      window.removeEventListener("click", click, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the next route has rendered: open the cover
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (modeRef.current === "leave") later(() => finish.current(), 70);
  }, [path]);

  // scramble the boot line while loading
  useEffect(() => {
    if (mode !== "load") return;
    let raf = 0;
    let t0 = 0;
    let last = -1;
    const span = Math.min(820, DURATION * 0.72);
    const step = (now: number) => {
      t0 ||= now;
      const p = Math.min(1, (now - t0) / Math.min(900, span));
      const n = Math.floor((now - t0) / 45);
      if (n !== last || p >= 1) {
        last = n;
        const k = Math.floor(p * LINE.length);
        setScramble(p >= 1 ? null : LINE.slice(0, k) + LINE.slice(k).replace(/\S/g, () => GLYPHS[(Math.random() * 15) | 0]));
      }
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  if (mode === "idle") return null;
  return (
    <div className={`shl is-${mode}`} data-shl={mode} aria-hidden={mode !== "load"} onClick={() => modeRef.current === "load" && finish.current()}>
      <div className="shl-wipe" />
      <div className="shl-scan">
        <i />
      </div>
      <div className="shl-mid" role="status" aria-live="polite">
        <p className="shl-line f-m">
          <span className="shl-p" aria-hidden="true">&gt;</span>
          <span className="shl-t">
            <span className={scramble === null ? "shl-f" : "shl-f is-h"}>{LINE}</span>
            {scramble === null ? null : <span className="shl-g" aria-hidden="true">{scramble}</span>}
          </span>
          <i className="shl-caret" aria-hidden="true" />
        </p>
        <div className="shl-bar" aria-hidden="true">
          <i />
        </div>
        <p className="shl-sub f-m" aria-hidden="true">
          <span>{ready ? ui.loader.ready : " "}</span>
        </p>
      </div>
      <button
        type="button"
        className="shl-skip f-m"
        onClick={(e) => {
          e.stopPropagation();
          finish.current();
        }}
      >
        {ui.loader.skip}
      </button>
    </div>
  );
}
