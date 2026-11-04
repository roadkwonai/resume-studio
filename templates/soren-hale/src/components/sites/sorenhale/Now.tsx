"use client";

import { F_D, Sec, rv, useSec } from "./ui";
import { nowItems as items, ui } from "./data";

const pad = (n: number) => String(n).padStart(2, "0");

function Inner({ status }: { status: string }) {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg">
      {status || items[0].d ? (
        <p className="shnw-bar sh-mono" style={rv(on, 120)}>
          {status ? <span className="shnw-st"><i className="sh-dot" aria-hidden="true" />{status}</span> : null}
          {items[0].d ? <span className="shnw-up"><span className="shnw-ul">{ui.nowPage.lastUpdated}</span><span className="shnw-ud">{items[0].d}</span></span> : null}
        </p>
      ) : null}
      <ul className="pg-rows" aria-label={ui.nowPage.label}>
        {items.map((it, i) => (
          <li key={it.t} style={rv(on, 160 + i * 70)}>
            <div className="pg-row">
              <span className="pg-row-m sh-mono">{it.d || pad(i + 1)}</span>
              <span className="pg-row-t" style={F_D}>{it.t}</span>
              <span className="pg-row-l">{it.l}</span>
            </div>
          </li>
        ))}
      </ul>
      {ui.nowPage.note ? <p className="shnw-note sh-lbl" style={rv(on, 300)}>{ui.nowPage.note}</p> : null}
    </div>
  );
}

export function Now({ status }: { status: string }) {
  return (
    <Sec className="shnw">
      <Inner status={status} />
    </Sec>
  );
}
