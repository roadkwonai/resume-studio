"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Chip, Eb, F_D, Hd, More, Sec, rv, useSec } from "./ui";
import { counted, fill, stackItems, ui, type StackItem } from "./data";

/** section is full width, so the viewport stands in for its measured width (the board goes under the readout below 1240) */
export function useNarrow(limit: number) {
  const [n, setN] = useState(false);
  useEffect(() => {
    const f = () => setN(document.documentElement.clientWidth < limit);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [limit]);
  return n;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Inner() {
  const { on } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const items = stackItems;
  const groups = useMemo(() => {
    const g: { name: string; items: (StackItem & { i: number })[] }[] = [];
    items.forEach((it, i) => {
      let x = g.find((q) => q.name === it.group);
      if (!x) g.push((x = { name: it.group, items: [] }));
      x.items.push({ ...it, i });
    });
    return g;
  }, [items]);
  const max = Math.max(1, ...items.map((i) => parseFloat(i.years) || 0));
  const [cur, setCur] = useState(0);

  return (
    <div className="sh-wrap sh-pad">
      <div className="shst-top">
        <div className="sh-headblock">
          <Eb text={ui.stack.eyebrow} />
          <Hd text={ui.stack.heading} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.stack.lead}
          </p>
        </div>
        <div className="shst-side" style={rv(on, 260)}>
          <p className="sh-lbl shst-count">
            {counted(ui.stack.tools, items.length)} · {counted(ui.stack.groups, groups.length)}
          </p>
          <More href="/stack" n="02" label={ui.stack.full} cur="open stack" />
        </div>
      </div>
      <div className="shst-main">
        <div className="shst-board sh-plate is-well" role="group" aria-label={ui.stack.boardLabel} style={rv(on, 300)}>
          {groups.map((g, gi) => (
            <div className="shst-row" style={{ "--r": gi } as React.CSSProperties} key={g.name}>
              <p className="shst-g sh-lbl" id={`shst-g-${uid}-${gi}`}>
                <span>{g.name}</span>
                <em>{pad(g.items.length)}</em>
              </p>
              <ul className="shst-keys" aria-labelledby={`shst-g-${uid}-${gi}`}>
                {g.items.map((it) => (
                  <li style={rv(on, 300 + Math.min(it.i, 20) * 14, 10)} key={it.slug}>
                    <button
                      type="button"
                      className={`shst-key${it.i === cur ? " is-on" : ""}`}
                      aria-pressed={it.i === cur}
                      aria-controls={`shst-out-${uid}`}
                      data-cur="show key"
                      aria-label={[it.name, it.years && `${it.years} ${parseFloat(it.years) === 1 ? ui.stack.yearOne : ui.stack.yearMany}`, it.frequency, it.note].filter(Boolean).join(". ")}
                      onClick={() => setCur(it.i)}
                      onFocus={() => setCur(it.i)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setCur(it.i)}
                    >
                      <span className="shst-kl" aria-hidden="true">{it.years ? fill(ui.stack.yearShort, { n: it.years }) : " "}</span>
                      <span className="shst-kn" aria-hidden="true">{it.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="shst-out sh-plate" id={`shst-out-${uid}`} aria-label={ui.stack.outLabel} style={rv(on, 380)}>
          <div className="sh-swap shst-swap">
            {items.map((it, t) => {
              const y = parseFloat(it.years) || 0;
              return (
                <div className={`shst-o${t === cur ? " is-on" : ""}`} aria-hidden={t !== cur || undefined} key={it.slug}>
                  <p className="shst-ot">
                    <span className="sh-lbl">{fill(ui.stack.keyOf, { i: pad(t + 1), n: pad(items.length) })}</span>
                    <Chip t={it.group} />
                  </p>
                  <p className="shst-on" style={F_D}>{it.name}</p>
                  {it.years ? (
                    <div className="shst-oy">
                      <p className="shst-yn">
                        <b style={F_D} className="sh-num">{it.years}</b>
                        <span className="sh-lbl">{y === 1 ? ui.stack.yearOne : ui.stack.yearMany}</span>
                      </p>
                      <div className="shst-bar" aria-hidden="true">
                        <i style={{ width: `${Math.max(4, Math.min(1, y / max) * 100)}%` }} />
                      </div>
                    </div>
                  ) : null}
                  {it.frequency ? (
                    <p className="shst-lv sh-mono">
                      <span>{ui.stack.used}</span>
                      <b>{it.frequency}</b>
                    </p>
                  ) : null}
                  {it.note ? <p className="shst-ol">{it.note}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Stack() {
  const col = useNarrow(1240);
  if (!stackItems.length) return null;
  return (
    <Sec className={`shst${col ? " is-col" : ""}`}>
      <Inner />
    </Sec>
  );
}
