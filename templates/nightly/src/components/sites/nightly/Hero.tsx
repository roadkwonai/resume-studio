"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { hero, heroProject, site } from "./data";
import { fill } from "./format";
import { Cover } from "./ui";
import s from "./nl.module.css";

const DRAFTS = hero.drafts;
const RESULT = hero.result;
const t = site.hero;
const STEPS = DRAFTS.length - 1;
const SCROLL_LEN = 60; // vh of scrolling per edit, read from the source's Commits component

const norm = (w: string) => w.toLowerCase().replace(/[.,;:!?]+$/g, "");

/** Word-level LCS: which words of `a` survive into `b`, and which words of `b` are new. */
function lcs(a: string[], b: string[]) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) dp[i][j] = norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const inA = new Array<boolean>(a.length).fill(false);
  const inB = new Array<boolean>(b.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (norm(a[i]) === norm(b[j])) {
      inA[i] = inB[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { inA, inB };
}

export function Hero() {
  const outer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ n: 0, strike: false });
  const words = useMemo(() => DRAFTS.map((d, i) => (i === STEPS ? [...d.text.split(/\s+/), ...RESULT.split(/\s+/)] : d.text.split(/\s+/))), []);
  const quietFrom = DRAFTS[STEPS].text.split(/\s+/).length;
  const marks = useMemo(
    () =>
      words.map((w, i) => ({
        out: i < STEPS ? lcs(w, words[i + 1]).inA.map((x) => !x) : w.map(() => false),
        added: i > 0 ? lcs(words[i - 1], w).inB.map((x) => !x) : w.map(() => false),
      })),
    [words],
  );

  useEffect(() => {
    const on = () => {
      const el = outer.current;
      if (!el) return;
      const pin = el.firstElementChild as HTMLElement;
      const range = el.getBoundingClientRect().height - pin.offsetHeight;
      const at = range <= 0 ? 0 : Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) * STEPS;
      const n = Math.min(STEPS, Math.max(0, Math.floor(at + 0.18)));
      const strike = n < STEPS && at - n > 0.3;
      setState((p) => (p.n === n && p.strike === strike ? p : { n, strike }));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const jump = (i: number) => {
    const el = outer.current;
    if (!el) return;
    const pin = el.firstElementChild as HTMLElement;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((el.offsetHeight - pin.offsetHeight) * i) / STEPS + 2, behavior: "smooth" });
  };

  const { n, strike } = state;
  const first = heroProject;
  return (
    <section className={s.ngc} ref={outer} aria-label={t.aria} style={{ ["--n" as string]: STEPS, ["--step" as string]: SCROLL_LEN }}>
      <div className={s.ngcPin}>
        <div className={s.ngcBox}>
          <h1 className={s.ngcSr}>{DRAFTS[n].text} {RESULT}</h1>
          <div className={s.ngcLog}>
            <p className={s.ngcLabel}>{t.history}</p>
            {DRAFTS.map((d, i) => (
              <button key={d.message} type="button" className={`${s.ngcItem} ${i === n ? s.cur : i < n ? s.done : ""}`} onClick={() => jump(i)} aria-label={fill(t.showEdit, { n: i + 1, total: DRAFTS.length, message: d.message })}>
                <b>{d.message}</b>
                <span>{d.when}</span>
              </button>
            ))}
            <div className={s.ngcNow} aria-hidden>
              <b>{DRAFTS[n].message}</b>
              <span>{fill(t.step, { n: n + 1, total: DRAFTS.length })}</span>
            </div>
          </div>
          <div className={s.ngcStage} aria-hidden>
            {words.map((ws, v) => {
              let k = 0;
              return (
                <p key={v} className={`${s.ngcV} ${v === n ? s.cur : ""} ${v === n && strike ? s.strike : ""}`}>
                  {ws.map((w, i) => (
                    <span key={i}>
                      <span className={`${s.ngcW} ${marks[v].out[i] ? s.out : ""} ${marks[v].added[i] ? s.in : ""} ${v === STEPS && i >= quietFrom ? s.q : ""}`} style={{ ["--k" as string]: marks[v].added[i] ? k++ : 0 }}>{w}</span>
                      {i < ws.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
          {first ? (
            <Link href={`/work/${first.slug}`} className={`${s.ngcStrip} ${n === STEPS ? s.shipped : ""}`}>
              <span className={s.ngcWait} aria-hidden>{t.wait}</span>
              <Cover src={first.image} alt={first.imageAlt} name={first.name} width={1200} height={750} sizes="(max-width: 809px) 92vw, 70vw" priority />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
