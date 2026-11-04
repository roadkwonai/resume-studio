"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip, F_D, Sec, rv, useSec, ArrowSvg } from "./ui";
import { Filter } from "./Detail";
import { fill, posts, ui } from "./data";

const tags = Array.from(new Set(posts.map((p) => p.tag).filter(Boolean)));
const counts = posts.reduce<Record<string, number>>((a, p) => ({ ...a, [p.tag]: (a[p.tag] ?? 0) + 1 }), {});
const noun = (n: number) => (n === 1 ? ui.writingPage.one : ui.writingPage.many);
const read = (t: string) => (t ? fill(ui.writing.read, { time: t }) : "");

function Inner() {
  const { on } = useSec();
  const [tag, setTag] = useState("");
  const shown = posts.filter((p) => !tag || p.tag === tag);
  return (
    <div className="sh-wrap pg pg-flush">
      <div className="shwl-bar" style={rv(on, 60)}>
        <Filter label={ui.writingPage.filter} all={ui.workPage.all} options={tags} value={tag} onChange={setTag} counts={counts} total={posts.length} />
        <p className="shwl-count sh-mono" role="status" aria-live="polite" data-shwl-count={shown.length}>
          <span aria-hidden="true">{"// "}</span>
          {tag ? `${shown.length} ${ui.writingPage.of} ${posts.length} ${noun(posts.length)}` : `${posts.length} ${noun(posts.length)}`}
        </p>
      </div>
      <ul className="shwl-list" aria-label={tag ? `${ui.writingPage.posts}: ${tag}` : ui.writingPage.posts}>
        {shown.map((p, i) => (
          <li key={p.slug} style={rv(on, 140 + Math.min(i, 8) * 55, 14)}>
            <Link
              className="shwl-row"
              href={`/writing/${p.slug}`}
              data-cur="read post"
              aria-label={`${p.title}. ${[p.tag, p.date, read(p.read)].filter(Boolean).join(", ")}`}
            >
              <time className="shwl-date sh-mono" dateTime={p.date}>
                <span className="sh-sr">{ui.writing.posted}</span>
                {p.date}
              </time>
              <div className="shwl-main">
                <h2 className="shwl-t" style={F_D}>{p.title}</h2>
                <p className="shwl-l">{p.excerpt}</p>
              </div>
              <span className="shwl-meta">
                <Chip t={p.tag} tone={tag ? "acc" : ""} />
                <span className="shwl-read sh-mono">{read(p.read)}</span>
              </span>
              <b className="shwl-a" aria-hidden="true">
                <ArrowSvg />
              </b>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WritingList() {
  return (
    <Sec className="shwl">
      <Inner />
    </Sec>
  );
}
