"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Diff } from "./Detail";
import { Btn, Chip, Eb, F_D, Face, Hd, More, Sec, rv, useSec } from "./ui";
import { counted, fill, projects, ui } from "./data";

const SHOWN = 5;
const TOP = 72; // sticky offset of the first card
const STEP = 14; // each later card sticks this much lower
const GLYPHS = "<>/{}[]()=+*#;:01";
const pad = (n: number) => String(n).padStart(2, "0");
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Text "decodes" from glyphs into the real title once `on` is true. */
function Scramble({ text, on, rm }: { text: string; on: boolean; rm: boolean }) {
  const [g, setG] = useState<string | null>(null);
  useEffect(() => {
    if (!on || rm) {
      // motion preference and viewport are only readable after hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setG(null);
      return;
    }
    let raf = 0;
    let t0 = 0;
    let last = -1;
    const tick = (t: number) => {
      t0 ||= t;
      const p = clamp01((t - t0) / 700);
      const step = Math.floor((t - t0) / 45);
      if (step !== last || p >= 1) {
        last = step;
        const keep = Math.floor(p * text.length);
        setG(p >= 1 ? null : text.slice(0, keep) + text.slice(keep).replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, rm, text]);
  return (
    <span className={`sh-cmp${on ? " is-on" : ""}`}>
      <span className={g === null ? "sh-cmp-f" : "sh-cmp-f is-h"}>{text}</span>
      {g === null ? null : (
        <span className="sh-cmp-g" aria-hidden="true">
          {g}
        </span>
      )}
    </span>
  );
}

const featured = projects.filter((p) => p.featured);
const rows = (featured.length ? featured : projects).slice(0, SHOWN);
const COVERABLE = ".shwk-meta,.shwk-name,.shwk-line,.shwk-role,.shwk-metric,.shwk-stack,.shwk-btn,.shwk-kind";

function Inner({ onDeck }: { onDeck: (v: boolean) => void }) {
  const { on, ph, tb } = useSec();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ul = useRef<HTMLUListElement>(null);
  const [live, setLive] = useState(false);
  const [rm, setRm] = useState(false);
  const [vh, setVh] = useState(900);
  const [fits, setFits] = useState(false);
  const [seen, setSeen] = useState<Record<number, boolean>>({});
  const N = rows.length;

  useEffect(() => {
    // motion preference and viewport are only readable after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(true);
    setRm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const f = () => setVh(window.innerHeight);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const mh = ph ? 0 : Math.round(Math.max(440, Math.min(tb ? 760 : 640, vh - TOP - Math.max(0, N - 1) * STEP - 36)));
  const stacking = live && !rm && !ph && N > 1;

  // the stacked deck is only used when one card fits the viewport under the pinned ones
  useEffect(() => {
    const el = ul.current;
    if (!stacking || !el) {
      setFits(false);
      return;
    }
    const check = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (first) setFits(first.offsetHeight <= window.innerHeight - TOP - Math.max(0, N - 1) * STEP - 12);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [stacking, N, mh]);
  const deck = stacking && fits;
  useEffect(() => onDeck(deck), [deck, onDeck]);

  // each card decodes its title and strikes its metric the first time it scrolls into view
  useEffect(() => {
    const el = ul.current;
    if (!live || rm || !el) return;
    const io = new IntersectionObserver(
      (es) => {
        const hit: number[] = [];
        es.forEach((e) => {
          if (e.isIntersecting) {
            hit.push(+((e.target as HTMLElement).dataset.i ?? 0));
            io.unobserve(e.target);
          }
        });
        if (hit.length) setSeen((s) => ({ ...s, ...Object.fromEntries(hit.map((i) => [i, true])) }));
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [live, rm]);
  const lit = (i: number) => on && (rm || !!seen[i]);

  // deck scene: scroll-linked depth (--k, scale + dim) for the cards under the front one, and their copy fades once covered
  useEffect(() => {
    const el = ul.current;
    if (!deck || !el) return;
    const lis = Array.from(el.children) as HTMLElement[];
    const cov = lis.map((li) => Array.from(li.querySelectorAll<HTMLElement>(COVERABLE)));
    const k = lis.map(() => -1);
    const tops: number[] = [];
    const hs: number[] = [];
    const bottoms: number[][] = lis.map(() => []);
    let near = true;
    let raf = 0;
    const io = new IntersectionObserver((e) => (near = e[0].isIntersecting), { rootMargin: "20% 0px 20% 0px" });
    io.observe(el);
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!near) return;
      lis.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        tops[i] = r.top;
        hs[i] = r.height;
        bottoms[i] = cov[i].map((c) => c.getBoundingClientRect().bottom);
      });
      let acc = 0;
      for (let i = lis.length - 1; i >= 0; i--) {
        const v = Math.round(acc * 1000) / 1000;
        if (v !== k[i]) {
          k[i] = v;
          lis[i].style.setProperty("--k", String(v));
          lis[i].classList.toggle("is-under", v > 0.985);
        }
        acc += clamp01(1 - (tops[i] - (TOP + i * STEP)) / Math.max(1, hs[i] * 0.92));
      }
      for (let i = 0; i < lis.length - 1; i++) {
        const next = tops[i + 1];
        cov[i].forEach((c, j) => {
          const covered = next < (bottoms[i][j] ?? 0) - 1;
          if (c.classList.contains("is-cov") !== covered) c.classList.toggle("is-cov", covered);
        });
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      lis.forEach((li) => {
        li.style.removeProperty("--k");
        li.classList.remove("is-under");
        li.querySelectorAll(".is-cov").forEach((c) => c.classList.remove("is-cov"));
      });
    };
  }, [deck]);

  // keyboard focus on a covered card scrolls so that card is the front one
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const el = ul.current;
    if (!deck || !el) return;
    let vis = false;
    try {
      vis = (e.target as HTMLElement).matches(":focus-visible");
    } catch {
      /* :focus-visible unsupported */
    }
    if (!vis) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>("li[data-i]");
    if (!li) return;
    const i = +(li.dataset.i ?? 0);
    const gap = parseFloat(getComputedStyle(el).rowGap) || 0;
    let y = 0;
    for (let j = 0; j < i; j++) y += (el.children[j] as HTMLElement).offsetHeight + gap;
    const to = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY + y - TOP - i * STEP));
    if (Math.abs(window.scrollY - to) < 6) return;
    const lenis = (window as unknown as { __ltLenis?: { scrollTo: (y: number, o: object) => void } }).__ltLenis;
    if (lenis) lenis.scrollTo(to, { immediate: true, force: true });
    else window.scrollTo(0, to);
  };

  return (
    <div className="sh-wrap sh-pad">
      <div className="shwk-top">
        <div className="sh-headblock" id={`shwk-h-${id}`}>
          <Eb text={ui.work.eyebrow} />
          <Hd text={counted(ui.work.heading, rows.length)} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.work.lead}
          </p>
        </div>
        <div className="shwk-topmore" style={rv(on, 260)}>
          <More href="/work" n={pad(projects.length)} label={ui.work.all} cur="open work" />
        </div>
      </div>
      <ul ref={ul} className="shwk-deck" aria-label={ui.work.listLabel} onFocus={onFocus} style={{ ["--top" as string]: `${TOP}px`, ["--step" as string]: `${STEP}px`, ["--mh" as string]: mh ? `${mh}px` : "0px" }}>
        {rows.map((p, i) => {
          const href = `/work/${p.slug}`;
          const n = lit(i);
          return (
            <li data-i={i} className="shwk-li" style={{ ["--i" as string]: i }} key={p.slug}>
              <article className="shwk-card sh-plate" style={rv(on, Math.min(i, 2) * 90, 24)}>
                <div className="shwk-body">
                  <p className="shwk-meta sh-lbl">
                    <span className="shwk-idx">
                      <b>{pad(i + 1)}</b> {ui.work.of} {pad(N)}
                    </span>
                    <span className="shwk-who">{[p.client, p.year].filter(Boolean).join(" · ")}</span>
                  </p>
                  <div className="shwk-main">
                    <h3 className="shwk-name" style={F_D}>
                      <Link href={href} data-cur="open case">
                        <Scramble text={p.title} on={n} rm={rm} />
                      </Link>
                    </h3>
                    <p className="shwk-line">{p.summary}</p>
                    {p.role ? <p className="shwk-role sh-lbl">{p.role}</p> : null}
                  </div>
                  <div className="shwk-foot">
                    {p.after ? (
                      <p className="shwk-metric">
                        <Diff from={p.before} to={p.after} on={n} delay={320} className="shwk-diff" />
                        <span className="sh-lbl">{p.metricLabel}</span>
                      </p>
                    ) : null}
                    {p.stack.length ? (
                      <p className="shwk-stack">
                        {p.stack.slice(0, 5).map((s) => (
                          <Chip t={s} key={s} />
                        ))}
                      </p>
                    ) : null}
                    <Btn href={href} label={ui.work.openCase} kind="ghost" icon="arrow" cur="open case" className="shwk-btn" ariaLabel={fill(ui.work.openCaseAria, { title: p.title })} />
                  </div>
                </div>
                <Link className="shwk-media" href={href} tabIndex={-1} aria-hidden="true" data-cur="open case">
                  <span className="sh-pic shwk-pic" style={{ aspectRatio: ph ? "16/10" : "auto", borderRadius: 9 }}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" width={1600} height={1000} loading={i === 0 ? "eager" : "lazy"} decoding="async" draggable={false} style={{ objectPosition: "50% 50%" }} />
                    ) : (
                      <Face text={p.title} />
                    )}
                    <span className="shwk-kind">
                      <Chip t={p.tag} tone="fill" />
                    </span>
                  </span>
                </Link>
                <i className="shwk-dim" aria-hidden="true" />
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Work() {
  const [deck, setDeck] = useState(false);
  if (!rows.length) return null;
  return (
    <Sec className={`shwk${deck ? " is-deck" : ""}`} threshold={0.1}>
      <Inner onDeck={setDeck} />
    </Sec>
  );
}
