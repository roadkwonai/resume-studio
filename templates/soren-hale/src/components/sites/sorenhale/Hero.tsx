"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Btn, F_D } from "./ui";
import { Count } from "./Count";
import { accent, extras, live as routeOn, site, ui } from "./data";

// heroLines fixes the line breaks; a plain headline is one line that wraps
const HEADING = extras.heroLines ?? [accent(site.headline)];
const STATS = site.metrics.slice(0, 3);
const COMMIT = extras.commits?.home;
const FOCUS_X = 50;
const FOCUS_Y = 18;
// the glyphs painted over the portrait: this snippet, whitespace removed, tiled across the grid
const CODE = `export function Checkout({ cart, user }: Props) { const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]); const [state, send] = useMachine(checkoutMachine); useEffect(() => { prefetch("/api/payment-intent"); }, []); if (state.matches("done")) return <Receipt order={state.context.order} />; return (<Form onSubmit={(e) => send({ type: "PAY", total })}><Summary items={cart} total={total} /><PayButton busy={state.matches("paying")}>Pay {format(total)}</PayButton></Form>); } const format = (n: number) => new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(n / 100); async function prefetch(url: string) { try { await fetch(url, { priority: "low" }) } catch { /* offline is fine */ } }`;

const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};

/** The headline words: `*...*` marks lime words, lines are fixed. */
const lines = (() => {
  let i = 0;
  return HEADING.map((l) => {
    const out: { t: string; em: boolean; d: number }[] = [];
    let em = false;
    for (const part of l.split("*")) {
      for (const w of part.split(/\s+/).filter(Boolean)) out.push({ t: w, em, d: 120 + 70 * i++ });
      em = !em;
    }
    return out;
  });
})();

/** Resolve a CSS color (e.g. var(--sh-brass)) to "r,g,b" for canvas fills. */
function rgb(host: HTMLElement, color: string, fallback: string) {
  const i = document.createElement("i");
  i.style.display = "none";
  i.style.color = color;
  host.appendChild(i);
  const c = getComputedStyle(i).color;
  i.remove();
  const m = c.match(/(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/);
  return m ? `${Math.round(+m[1])},${Math.round(+m[2])},${Math.round(+m[3])}` : fallback;
}

type Mode = (source: boolean) => void;

/**
 * The portrait is repainted as source code: a grid of monospace glyphs sized by the picture's light (bright parts get
 * strong glyphs), a row sweep that opens/closes it (intro + the "View source" toggle), a soft glow under the pointer
 * and an idle diagonal wave. Parameters (cell 10x20, pointer radius 136, glow decay 1.05/s, sweep 2400/900 ms) are the source's.
 */
function useCodePicture(on: boolean, root: React.RefObject<HTMLElement | null>, pic: React.RefObject<HTMLDivElement | null>, cv: React.RefObject<HTMLCanvasElement | null>) {
  const mode = useRef<Mode | null>(null);
  useEffect(() => {
    const host = root.current;
    const box = pic.current;
    const cvs = cv.current;
    if (!on || !host || !box || !cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const code = CODE.replace(/\s+/g, "");
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cw = 10;
    let ch = 20;
    let cols = 0;
    let rows = 0;
    let light = new Float32Array(0); // 0..1 luminance per cell
    let glow = new Float32Array(0); // transient glow per cell
    let cur = new Float32Array(0); // current source-ness per row
    let tgt = new Uint8Array(0); // target source-ness per row
    let sweep = -1; // sweeping row (-3 = idle)
    let sweepTo = 0;
    let sweepT = 0;
    let sweepMs = 1900;
    let wave = -1;
    let raf = 0;
    let last = 0;
    let px = -9999;
    let py = -9999;
    let moved = 0;
    let visible = true;
    let dead = false;
    let idle = 0;
    let ready = false;
    const col = { g: rgb(host, "var(--sh-bone)", "11,12,14"), i: rgb(host, "var(--sh-ink)", "241,242,236"), a: rgb(host, "var(--sh-brass)", "198,255,61") };
    const probe = document.createElement("i");
    probe.className = "f-m";
    probe.style.display = "none";
    host.appendChild(probe);
    const family = getComputedStyle(probe).fontFamily || "monospace";
    probe.remove();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const sample = () => {
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const c = off.getContext("2d", { willReadFrequently: true });
      light = new Float32Array(cols * rows).fill(0.5);
      if (!c || !img.naturalWidth) return;
      const k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const iw = img.naturalWidth * k;
      const ih = img.naturalHeight * k;
      const ox = (W - iw) * (FOCUS_X / 100);
      const oy = (H - ih) * (FOCUS_Y / 100);
      try {
        c.drawImage(img, ox / cw, oy / ch, iw / cw, ih / ch);
        const d = c.getImageData(0, 0, cols, rows).data;
        let lo = 1;
        let hi = 0;
        for (let t = 0; t < cols * rows; t++) {
          const v = (d[t * 4] * 0.299 + d[t * 4 + 1] * 0.587 + d[t * 4 + 2] * 0.114) / 255;
          light[t] = v;
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
        const s = hi - lo > 0.05 ? 1 / (hi - lo) : 1;
        for (let t = 0; t < light.length; t++) light[t] = ((light[t] - lo) * s) ** 0.62;
      } catch {
        for (let t = 0; t < light.length; t++) light[t] = 0.35 + 0.4 * Math.abs(((Math.sin(t * 12.9898) * 43758.5453) % 1));
      }
    };

    const kick = () => {
      if (!raf && !dead && visible) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const resize = () => {
      const r = box.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) return;
      W = r.width;
      H = r.height;
      dpr = (window.devicePixelRatio || 1) >= 1.5 ? 1.5 : 1;
      cw = W < 520 ? 6 : 10;
      ch = cw * 2;
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      cols = Math.ceil(W / cw);
      rows = Math.ceil(H / ch);
      const first = cur.length ? cur[0] : 1;
      glow = new Float32Array(cols * rows);
      cur = new Float32Array(rows).fill(first);
      tgt = new Uint8Array(rows).fill(first > 0.5 ? 1 : 0);
      sample();
      kick();
    };
    const startSweep = (to: number, ms: number) => {
      sweep = -2;
      sweepTo = to;
      sweepT = 0;
      sweepMs = ms;
      kick();
    };

    function frame(now: number) {
      raf = 0;
      if (dead) return;
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      let busy = false;
      if (sweep > -3 && sweepT < 1 && ready) {
        sweepT = Math.min(1, sweepT + (dt * 1000) / sweepMs);
        sweep = easeInOut(sweepT) * (rows + 3) - 2;
        for (let r = 0; r < rows; r++) if (r <= sweep) tgt[r] = sweepTo;
        if (sweepT >= 1) sweep = -3;
        busy = true;
      }
      if (wave >= 0) {
        wave += (dt * (cols + rows)) / 1.5;
        if (wave > cols + rows + 8) wave = -1;
        busy = true;
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      ctx!.font = `700 ${Math.round(cw * 1.55)}px ${family}`;
      ctx!.textBaseline = "top";
      const R = W < 520 ? 80 : 136;
      const R2 = R * R;
      const pointer = now - moved < 2400 && px > -999;
      for (let r = 0; r < rows; r++) {
        const v = cur[r] + (tgt[r] - cur[r]) * Math.min(1, dt * 9);
        cur[r] = Math.abs(tgt[r] - v) < 0.004 ? tgt[r] : v;
        if (cur[r] !== tgt[r]) busy = true;
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let r = 0; r < rows; r++) {
          const y = r * ch;
          const hot = sweep > -2 && Math.abs(r - sweep) < 1.6;
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            let g = glow[idx];
            if (pass === 0) {
              if (pointer) {
                const dx = c * cw + cw / 2 - px;
                const dy = y + ch / 2 - py;
                const d2 = dx * dx + dy * dy;
                if (d2 < R2) g = Math.max(g, Math.min(1, (1 - d2 / R2) * 1.6));
              }
              if (wave >= 0) {
                const e = Math.abs(c + r - wave);
                if (e < 5) g = Math.max(g, (1 - e / 5) * 0.85);
              }
              g = Math.max(0, g - dt * 1.05);
              glow[idx] = g;
            }
            const amt = Math.max(g, cur[r]);
            if (amt < 0.02) continue;
            if (g > 0.02) busy = true;
            if (pass === 0) {
              ctx!.globalAlpha = Math.min(0.84, amt * 0.84);
              ctx!.fillStyle = `rgb(${col.g})`;
              ctx!.fillRect(c * cw, y, cw, ch);
            } else {
              const lum = Math.min(1, Math.max(0, ((light[idx] || 0) - 0.1) * 1.5));
              const strong = hot || lum > 0.66;
              ctx!.globalAlpha = Math.min(1, amt * (hot ? 1 : 0.1 + 0.9 * lum));
              ctx!.fillStyle = strong ? `rgb(${col.i})` : `rgb(${col.a})`;
              ctx!.fillText(code[idx % code.length], c * cw, y + 2);
            }
          }
        }
      }
      if (sweep > -2 && sweep < rows + 1) {
        ctx!.globalAlpha = 0.9;
        ctx!.fillStyle = `rgb(${col.a})`;
        ctx!.fillRect(0, (sweep + 1) * ch, W, 1.5);
      }
      ctx!.globalAlpha = 1;
      // untouched for 5.2 s with the picture showing: a diagonal wave of glyphs crosses it
      if (!busy && !pointer && visible && !idle) {
        idle = window.setTimeout(() => {
          idle = 0;
          if (!dead && visible && tgt[0] === 0) {
            wave = -6;
            kick();
          }
        }, 5200);
      }
      if ((busy || pointer) && visible) raf = requestAnimationFrame(frame);
    }

    const rel = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      moved = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      rel(e);
      if (idle) {
        clearTimeout(idle);
        idle = 0;
      }
      kick();
    };
    const onLeave = () => {
      px = py = -9999;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      rel(e);
      kick();
      window.setTimeout(onLeave, 500);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    const io = new IntersectionObserver(
      (e) => {
        visible = e[0].isIntersecting;
        if (visible) kick();
      },
      { threshold: 0.05 },
    );
    io.observe(box);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    box.addEventListener("pointerdown", onDown);
    img.onload = () => {
      if (dead) return;
      resize();
      const go = () => {
        if (dead) return;
        ready = true;
        box.classList.add("is-ready");
        startSweep(0, 2400);
      };
      if (document.fonts?.load) document.fonts.load(`700 12px ${family}`).then(go, go);
      else go();
    };
    img.onerror = () => box.classList.add("is-ready");
    img.src = site.heroImage;
    mode.current = (source) => startSweep(source ? 1 : 0, 900);
    return () => {
      dead = true;
      mode.current = null;
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointerdown", onDown);
      box.classList.remove("is-ready");
    };
  }, [on, root, pic, cv]);
  return mode;
}

/** true once nothing holds the page (the loader sets html.sh-hold-*). */
function useReleased() {
  const [free, setFree] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const open = () => !/(^|\s)sh-hold/.test(html.className);
    if (open()) {
      const r = requestAnimationFrame(() => setFree(true));
      return () => cancelAnimationFrame(r);
    }
    const mo = new MutationObserver(() => {
      if (open()) {
        mo.disconnect();
        setFree(true);
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    const t = window.setTimeout(() => setFree(true), 9000);
    return () => {
      mo.disconnect();
      clearTimeout(t);
    };
  }, []);
  return free;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [inn, setInn] = useState(false);
  const [fine, setFine] = useState(false);
  const [rm, setRm] = useState(false);
  const [src, setSrc] = useState(false);
  const [label, setLabel] = useState("");
  const [w, setW] = useState(1440);
  const free = useReleased();

  useEffect(() => {
    // media queries are only readable after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(true);
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    setRm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const x = Math.round(el.offsetWidth);
      if (x > 0) setW(x);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!live || !free) return;
    const r = requestAnimationFrame(() => setInn(true));
    return () => cancelAnimationFrame(r);
  }, [live, free]);

  const mode = useCodePicture(live && !rm, root, pic, cv);

  // lime cursor dot with a label (from data-cur) and magnetic keys, mouse only
  useEffect(() => {
    const host = root.current;
    const dot = cursor.current;
    if (!live || !fine || rm || !host || !dot) return;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let shown = false;
    let key: HTMLElement | null = null;
    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      dot.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        dot.classList.add("is-on");
      }
      raf ||= requestAnimationFrame(loop);
      const t = e.target as Element;
      const next = t.closest?.("[data-cur]")?.getAttribute("data-cur") ?? "";
      setLabel((p) => (p === next ? p : next));
      const k = t.closest<HTMLElement>(".shh-key");
      if (key && key !== k) {
        key.style.translate = "";
        key = null;
      }
      if (k) {
        key = k;
        const b = k.getBoundingClientRect();
        k.style.translate = `${((e.clientX - b.left - b.width / 2) * 0.16).toFixed(1)}px ${((e.clientY - b.top - b.height / 2) * 0.22).toFixed(1)}px`;
      }
    };
    const leave = () => {
      shown = false;
      dot.classList.remove("is-on");
      if (key) {
        key.style.translate = "";
        key = null;
      }
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [live, fine, rm]);

  const ph = w < 810;
  const tb = !ph && w < 1100;
  const toggle = () => {
    setSrc(!src);
    mode.current?.(!src);
  };
  return (
    <section ref={root} data-sh-hero="true" data-src={src ? "1" : "0"} className={`sh shh${live ? " is-live" : ""}${inn || rm ? " is-in" : ""}${fine && !rm ? " is-fine" : ""}${ph ? " is-ph" : tb ? " is-tb" : ""}`}>
      <div className="shh-grid" aria-hidden="true" />
      <div ref={pic} className="shh-pic" data-cur="read source">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="shh-img" src={site.heroImage} alt={site.heroAlt} decoding="async" fetchPriority="high" style={{ objectPosition: `${FOCUS_X}% ${FOCUS_Y}%` }} />
        <canvas ref={cv} className="shh-cv" aria-hidden="true" />
        <div className="shh-fade" aria-hidden="true" />
      </div>
      <div className="shh-wrap">
        <div className="shh-nav shh-nav-sp" aria-hidden="true" />
        <div className="shh-body">
          <div className="shh-copy">
            <p className="shh-eb f-m">
              <span aria-hidden="true">{"//"}</span> {site.eyebrow}
            </p>
            <h1 className="shh-h" style={F_D}>
              {lines.map((l, li) => (
                <span className={extras.heroLines ? "shh-l" : "shh-l is-wrap"} key={li}>
                  {l.map((x) => (
                    <span key={x.t + x.d}>
                      <span className="shh-w">
                        <span className={x.em ? "shh-wi shh-em" : "shh-wi"} style={{ transitionDelay: `${x.d}ms` }}>
                          {x.t}
                        </span>
                      </span>{" "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="shh-row">
              <p className="shh-sub">{site.intro}</p>
              <div className="shh-keys">
                {routeOn(site.workHref) ? <Btn className="shh-key" kind="solid" href={site.workHref} label={ui.hero.seeWork} cur="open" /> : null}
                <Btn className="shh-key" kind="ghost" icon="down" href={site.cvHref} label={ui.hero.downloadCv} cur="get the pdf" />
              </div>
            </div>
            {STATS.length ? (
              <dl className="shh-stats">
                {STATS.map(({ value, label: l }, i) => (
                  <div className="shh-st" style={{ transitionDelay: `${620 + i * 90}ms` }} key={l}>
                    <dt className="f-m">{l}</dt>
                    <dd style={{ ...F_D, fontVariantNumeric: "tabular-nums lining-nums" }}>
                      <Count to={value} on={inn} />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
        <div className="shh-hud">
          <button type="button" className="shh-tog f-m" aria-pressed={src} data-cur={src ? "compile" : "decompile"} onClick={toggle}>
            <i aria-hidden="true">{"{ }"}</i>
            {src ? ui.hero.viewRender : ui.hero.viewSource}
          </button>
          {COMMIT ? (
            <Link className="shh-commit f-m" href={routeOn(site.workHref) ? site.workHref : "/about"} data-cur="open case">
              <span className="shh-c1">
                <i aria-hidden="true" />
                main<em>{COMMIT.repo}</em>
              </span>
              <strong>{COMMIT.subject}</strong>
              <span className="shh-c3">{COMMIT.meta}</span>
            </Link>
          ) : null}
          {ph ? null : (
            <p className="shh-hint f-m" aria-hidden="true">
              {ui.hero.hint}
            </p>
          )}
        </div>
      </div>
      <div ref={cursor} className="shh-cur" aria-hidden="true">
        <i />
        {label ? <span className="f-m">{(ui.cur as Record<string, string>)[label] ?? label}</span> : null}
      </div>
    </section>
  );
}
