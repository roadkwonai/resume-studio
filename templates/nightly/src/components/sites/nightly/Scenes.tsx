"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ctaHeading, extras, profile, services, site, testimonials, type Project } from "./data";
import { figureWidth, fill, glyphWidth, splitFigure } from "./format";
import s from "./nl.module.css";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function AboutStatement() {
  const [lead, rest] = extras.statement ?? [profile.basics.summary];
  return (
    <p className={s.stmt}>
      {lead}
      {rest ? <> <span className={s.dim}>{rest}</span></> : null}
    </p>
  );
}

/** Port of the source's Pushes component: squares cover the photo and clear, left to right, as it scrolls into view. */
export function Pushes({ cell = 28 }: { cell?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const box = c?.parentElement;
    if (!c || !box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let cols = 0;
    let size = 0;
    let w = 0;
    let h = 0;
    let order: number[] = [];
    let last = -1;
    let raf = 0;
    const layout = () => {
      w = box.offsetWidth;
      h = box.offsetHeight;
      if (!w) return; // not laid out yet: a zero cell size would ask for an endless grid, and the observer calls back
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(6, Math.round(w / Math.max(12, cell)));
      size = w / cols;
      const rows = Math.ceil(h / size);
      let m = 7;
      const rnd = () => (m = (m * 16807) % 2147483647) / 2147483647;
      order = Array.from({ length: cols * rows }, (_, i) => ((i % cols) / cols) * 0.55 + rnd() * 0.45)
        .map((v, i) => [v, i] as const)
        .sort((a, b) => a[0] - b[0])
        .map((v) => v[1]);
      last = -1;
      c.style.opacity = "1";
    };
    const draw = () => {
      raf = 0;
      const top = box.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.92 - top) / (window.innerHeight * 0.62)));
      const cleared = Math.round(order.length * p);
      if (cleared === last) return;
      last = cleared;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0D0C0A";
      ctx.strokeStyle = "rgba(240,236,228,0.1)";
      ctx.lineWidth = 1;
      for (let k = cleared; k < order.length; k++) {
        const i = order[k];
        const x = (i % cols) * size;
        const y = Math.floor(i / cols) * size;
        ctx.fillRect(x, y, size + 0.5, size + 0.5);
        ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
      }
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(draw);
    };
    layout();
    draw();
    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(box);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cell]);
  return <canvas ref={ref} aria-hidden style={{ opacity: 0 }} />;
}

const ease = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);
const mixv = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const r = clamp((v - a) / (b - a));
  return r * r * (3 - 2 * r);
};

/** Port of the source's Breakpoints component: a pinned frame that scroll drags from desktop to tablet to phone width. */
export function Breakpoints({ project, heading, mode = "home" }: { project: Project; heading: [string, string]; mode?: "home" | "case" }) {
  const root = useRef<HTMLDivElement>(null);
  const px = useRef<(HTMLSpanElement | null)[]>([]);
  const WIDTHS = [1440, 810, 390];
  const ratios = [1, clamp(810 / 1440, 0.2, 0.9), clamp(390 / 1440, 0.1, 0.6)];
  const labels = WIDTHS.map((v) => String(v).padStart(4, " "));
  void mode;
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const pin = el.querySelector<HTMLElement>("[data-pin]");
    const stage = el.querySelector<HTMLElement>("[data-stage]");
    const frame = el.querySelector<HTMLElement>("[data-frame]");
    const well = el.querySelector<HTMLElement>("[data-well]");
    const read = el.querySelector<HTMLElement>("[data-read]");
    const imgs = Array.from(el.querySelectorAll<HTMLElement>("[data-frame] img"));
    const infoA = el.querySelector<HTMLElement>("[data-a]");
    const infoB = el.querySelector<HTMLElement>("[data-b]");
    if (!pin || !stage || !frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let target = 0;
    let target0 = 0;
    let raf = 0;
    let last = 0;
    let timer: ReturnType<typeof setTimeout>;
    let shown = NaN;
    let sw = 0;
    let sh = 0;
    let narrow = false;
    const measure = () => {
      narrow = getComputedStyle(frame.closest("[data-box]") as Element).getPropertyValue("--narrow").trim() === "1";
      const t = narrow && well ? well : stage;
      sw = t.offsetWidth;
      sh = t.offsetHeight;
      shown = NaN;
    };
    const render = (e: number) => {
      if (e === shown) return;
      shown = e;
      const i = Math.min(1, Math.floor(e));
      const f = ease(clamp(e - i));
      const r = mixv(ratios[i], ratios[i + 1], f);
      if (narrow) {
        const full = sh;
        const a0 = Math.min(full, (sw * 900) / 1440);
        const hs = [a0, Math.min(full, a0 + (full - a0) * 0.7), full];
        frame.style.width = "";
        frame.style.setProperty("--fh", `${mixv(hs[i], hs[i + 1], f).toFixed(1)}px`);
        if (read) read.style.transform = "";
      } else {
        frame.style.width = `${(sw * r).toFixed(1)}px`;
        if (read) read.style.transform = `translate3d(${(-(1 - r) * sw).toFixed(1)}px,0,0)`;
      }
      imgs.forEach((im, n) => {
        im.style.opacity = String(n === 0 ? 1 : smooth(n - 0.62, n - 0.38, e));
      });
      const L = labels[0].length;
      px.current.forEach((sp, n) => {
        if (!sp) return;
        const rr = L - 1 - n;
        const ii = Math.min(1, Math.floor(e));
        const a = ease(clamp((e - ii) * (1 + 0.12 * (L - 1)) - 0.12 * rr));
        sp.style.transform = `translate3d(0,${(-(ii + a) * 100).toFixed(2)}%,0)`;
      });
      infoA?.classList.toggle(s.bpShow, e > 0.72);
      infoB?.classList.toggle(s.bpShow, e > 1.72);
    };
    const progress = () => {
      const r = el.getBoundingClientRect();
      const range = r.height - pin.offsetHeight;
      return r.width === 0 || range <= 0 ? 0 : clamp(-r.top / range) * 2;
    };
    const tick = (now: number) => {
      const dt = Math.min(64, now - last || 16);
      last = now;
      cur += (target - cur) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - cur) < 0.0015) cur = target;
      render(cur);
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onScroll = () => {
      target0 = progress();
      if (reduce) {
        cur = target = Math.round(target0);
        render(cur);
        return;
      }
      target = target0;
      kick();
      clearTimeout(timer);
      timer = setTimeout(() => {
        target = Math.round(target0);
        kick();
      }, 170);
    };
    const onResize = () => {
      measure();
      onScroll();
      render(cur);
    };
    measure();
    target0 = progress();
    cur = target = Math.round(target0);
    render(cur);
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const t = site.project;
  const facts = [
    [t.role, project.role],
    [t.year, project.year],
    [t.stack, project.stack],
    [t.result, project.line],
  ].filter(([, v]) => v);
  const shots = [project.image, ...(project.gallery ?? []).slice(0, 2).map((g) => g.src)].filter((v) => v !== undefined);
  const sizes = ["94vw", "56vw", "40vw"];
  return (
    <div className={s.ngb} data-ng-ship ref={root} style={{ ["--f1" as string]: ratios[1].toFixed(4), ["--f2" as string]: ratios[2].toFixed(4) }}>
      <div className={s.ngbPin} data-pin>
        <div className={s.ngbBox} data-box>
          <h2 className={s.ngbH}>
            {heading[0]} <span>{heading[1]}</span>
          </h2>
          <div className={s.ngbRuler} aria-hidden>
            {ratios.map((r, i) => (
              <span key={i} className={s.ngbTick} style={{ left: `calc(${(r * 100).toFixed(3)}% - ${i === 0 ? 1 : 0}px)` }} />
            ))}
            <div className={s.ngbRead} data-read>
              <div>
                {Array.from({ length: labels[0].length }).map((_, t) => (
                  <span key={t} className={s.ngbCol}>
                    <span ref={(e) => { px.current[t] = e; }}>
                      {labels.map((l, n) => (
                        <i key={n}>{l[t] === " " ? "\u00a0" : l[t]}</i>
                      ))}
                    </span>
                  </span>
                ))}
                <span className={s.ngbPx}>px</span>
              </div>
            </div>
            <span className={s.ngbStops}>{WIDTHS.join(" / ")}</span>
          </div>
          <div className={s.ngbStage} data-stage>
            <div className={s.ngbWell} data-well>
              <div className={s.ngbFrame} data-frame>
                {shots.map((src, i) => (
                  <Image key={i} src={src} alt={i === 0 ? (project.imageAlt ?? project.name) : ""} aria-hidden={i !== 0 || undefined} width={1440} height={900} sizes={sizes[i]} style={{ opacity: i === 0 ? 1 : 0 }} />
                ))}
              </div>
            </div>
            <div className={`${s.ngbInfo} ${s.ngbA}`} data-a>
              <h3 className={s.ngbT}>{project.name}</h3>
              <p className={s.ngbS}>{project.summary}</p>
              <Link className={s.ngbLink} href={`/work/${project.slug}`}>
                {t.readCase}
                <svg viewBox="0 0 13 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                  <path d="M0 5h12M8 1l4 4-4 4" />
                </svg>
              </Link>
            </div>
            <div className={`${s.ngbInfo} ${s.ngbB}`} data-b>
              <dl className={s.ngbFacts}>
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceBranches() {
  const step = 102.48 / services.length; // three columns sit 34.16% apart in the source
  return (
    <div className={s.branches} style={{ ["--cw" as string]: `${(95.25 / services.length).toFixed(2)}%` }}>
      <div className={s.brTop}>
        {services.map((v, x) => (
          <span key={v.slug} className={s.brNode} style={{ left: `${x * step}%` }} />
        ))}
      </div>
      <div className={s.brBot}>
        {services.map((v, x) => (
          <span key={v.slug} className={s.brNode} style={{ left: `${x * step}%`, top: -5, background: "var(--nl-text)" }} />
        ))}
      </div>
      {services.map((v, i) => (
        <Link key={v.slug} href={`/services/${v.slug}`} className={s.svcCard} style={{ left: `${i * step}%` }}>
          <h3 className={s.title22}>{v.name}</h3>
          <p className={s.body}>{v.summary}</p>
          {v.price || v.terms ? (
            <div className={s.svcPrice2}>
              {v.price ? <div>{v.price}</div> : null}
              {v.terms ? <span>{v.terms}</span> : null}
            </div>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

export function KindWords() {
  return (
    <div className={s.tl}>
      {testimonials.map((t) => (
        <div key={t.name} className={s.quote}>
          <span className={s.mark} style={{ top: 5 }} />
          <div className={s.quoteHead}>
            <span>{t.name}</span>
            {t.role ? <em>{t.role}</em> : null}
            <u>
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M1 4.5 4.5 8 11 1" />
              </svg>
              {site.home.approved}
            </u>
          </div>
          <p className={s.quoteT}>{t.quote}</p>
        </div>
      ))}
    </div>
  );
}

/** Port of the source's Moved component: one number rolls from before to after, pinned, with a progress line. */
export function Moved({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLSpanElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const before = project.metric?.before ?? "";
  const after = project.metric?.after ?? "";
  const a = splitFigure(before);
  const b = splitFigure(after);
  const sameUnit = a.unit === b.unit; // 3일 to 4시간 has no shared unit, so each value rolls whole
  const unit = sameUnit ? b.unit : "";
  const FROM = sameUnit ? a.digits : before;
  const TO = sameUnit ? b.digits : after;
  const E = Math.max(FROM.length, TO.length);
  const D = FROM.padEnd(E, " ");
  const O = TO.padEnd(E, " ");
  const len = Array.from(D).reduce((sum, ch, i) => sum + Math.max(glyphWidth(ch), glyphWidth(O[i])), 0) + 0.1 + Math.max((figureWidth(unit) * 0.145) / 0.56, 0.1);
  const noteA = extras.moved?.before ?? fill(site.moved.before, { label: project.metric?.label });
  const noteB = extras.moved?.after ?? site.moved.after;
  useEffect(() => {
    const el = root.current;
    const pin = el?.firstElementChild as HTMLElement | null;
    if (!el || !pin) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let target = 0;
    let raf = 0;
    let last = 0;
    let timer: ReturnType<typeof setTimeout>;
    let shown = NaN;
    let raw = 0;
    const render = (t: number) => {
      if (t === shown) return;
      shown = t;
      cols.current.forEach((sp, n) => {
        if (!sp) return;
        const r = ease(clamp(t * (1 + 0.16 * (E - 1)) - 0.16 * n));
        sp.style.transform = `translate3d(0,${(-r * 50).toFixed(3)}%,0)`;
        const par = sp.parentElement as HTMLElement;
        if (O[n] === " " && D[n] !== " ") par.style.maxWidth = `${((1 - r) * glyphWidth(D[n]) * 1.25).toFixed(3)}em`;
        else if (D[n] === " " && O[n] !== " ") par.style.maxWidth = `${(r * glyphWidth(O[n]) * 1.25).toFixed(3)}em`;
      });
      if (bar.current) bar.current.style.transform = `scaleX(${t.toFixed(4)})`;
      el.classList.toggle(s.ngvDone, t > 0.86);
    };
    const progress = () => {
      const r = el.getBoundingClientRect();
      const range = r.height - pin.offsetHeight;
      return r.width === 0 || range <= 0 ? 0 : clamp(-r.top / range);
    };
    const tick = (now: number) => {
      const dt = Math.min(64, now - last || 16);
      last = now;
      cur += (target - cur) * (1 - Math.exp(-dt / 120));
      if (Math.abs(target - cur) < 0.001) cur = target;
      render(cur);
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onScroll = () => {
      raw = progress();
      if (reduce) {
        cur = target = Math.round(raw);
        render(cur);
        return;
      }
      target = raw;
      kick();
      clearTimeout(timer);
      timer = setTimeout(() => {
        target = +(raw > 0.5);
        kick();
      }, 220);
    };
    raw = progress();
    cur = target = +(raw > 0.5);
    render(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [D, O, E]);
  return (
    <div className={s.ngv} data-ng-ship ref={root} style={{ ["--len" as string]: len.toFixed(3) }}>
      <div className={s.ngvPin}>
        <div className={s.ngvBox}>
          <div className={s.ngvRule} />
          <h2 className={s.ngvH}>
            {ctaHeading}
            {extras.contactRest ? <> <span>{extras.contactRest}</span></> : null}
          </h2>
          <div className={s.ngvGap} />
          <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{noteA} {before}; {noteB} {after}.</p>
          <div className={s.ngvNote} aria-hidden>
            <span className={s.a}>{noteA}</span>
            <span className={s.b}>{noteB}</span>
          </div>
          <div className={s.ngvRow} aria-hidden>
            <div className={s.ngvNum}>
              {Array.from({ length: E }).map((_, t) => (
                <span key={t} className={s.ngvCol}>
                  <span ref={(e) => { cols.current[t] = e; }}>
                    <i>{D[t] === " " ? "\u00a0" : D[t]}</i>
                    <i>{O[t] === " " ? "\u00a0" : O[t]}</i>
                  </span>
                </span>
              ))}
            </div>
            {unit ? <div className={s.ngvUnit}>{unit}</div> : null}
          </div>
          <div className={s.ngvBar}>
            <span ref={bar} style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

