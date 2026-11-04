"use client";

import { useId } from "react";
import Link from "next/link";
import { Chip, Eb, F_D, Face, Hd, More, Sec, rv, useSec } from "./ui";
import { fill, posts, ui, type Post } from "./data";

const Arrow = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const read = (p: Post) => (p.read ? fill(ui.writing.read, { time: p.read }) : "");

function Inner() {
  const { on, ph, tb } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [big, ...side] = posts.slice(0, 5);
  return (
    <div className="sh-wrap sh-pad">
      <div className="shwr-top">
        <div className="sh-headblock" id={`shwr-h-${uid}`}>
          <Eb text={ui.writing.eyebrow} />
          <Hd text={ui.writing.heading} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.writing.lead}
          </p>
        </div>
        {!ph ? (
          <div className="shwr-more" style={rv(on, 260)}>
            <More href="/writing" n="01" label={ui.writing.all} cur="open writing" />
          </div>
        ) : null}
      </div>
      {big ? (
        <div className={`shwr-grid${side.length ? "" : " is-solo"}`}>
          <Link className="shwr-big sh-plate" href={`/writing/${big.slug}`} data-cur="read post" aria-label={`${big.title}. ${big.excerpt}`} style={rv(on, 300)}>
            <span className="sh-pic" style={{ aspectRatio: side.length && !ph && !tb ? "16/10" : "16/9", borderRadius: 9 }}>
              {big.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={big.image} alt={big.alt} width={1600} height={1000} loading="lazy" decoding="async" draggable={false} style={{ objectPosition: "50% 50%" }} />
              ) : (
                <Face text={big.title} />
              )}
              <span className="shwr-flag">
                <Chip t={ui.writing.latest} tone="fill" />
              </span>
            </span>
            <span className="shwr-body">
              <span className="shwr-meta">
                <Chip t={big.tag} tone="acc" />
                <time className="sh-lbl" dateTime={big.date}>
                  <span className="sh-sr">{ui.writing.posted}</span>
                  {big.date}
                </time>
                <span className="sh-lbl">{read(big)}</span>
              </span>
              <span className="shwr-title" style={F_D}>{big.title}</span>
              <span className="shwr-line">{big.excerpt}</span>
              <span className="shwr-go sh-mono" aria-hidden="true">
                {ui.writing.readPost} <Arrow s={14} />
              </span>
            </span>
          </Link>
          {side.length ? (
            <div className="shwr-side">
              <p className="shwr-cap sh-lbl" style={rv(on, 340)}>
                <span aria-hidden="true">{"// "}</span>{ui.writing.earlier}
              </p>
              <ul className="shwr-list">
                {side.map((p, t) => (
                  <li style={rv(on, 380 + t * 60)} key={p.slug}>
                    <Link className="shwr-row" href={`/writing/${p.slug}`} data-cur="read post" aria-label={`${p.title}. ${[p.date, read(p)].filter(Boolean).join(", ")}`}>
                      <time className="shwr-date sh-mono" dateTime={p.date}>{p.date}</time>
                      <span className="shwr-name" style={F_D}>{p.title}</span>
                      <span className="shwr-read sh-mono">{read(p)}</span>
                      <span className="shwr-arr" aria-hidden="true"><Arrow s={16} /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {ph ? (
        <div className="shwr-foot">
          <More href="/writing" n="01" label={ui.writing.all} cur="open writing" />
        </div>
      ) : null}
    </div>
  );
}

export function Writing() {
  if (!posts.length) return null;
  return (
    <Sec className="shwr">
      <Inner />
    </Sec>
  );
}
