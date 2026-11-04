"use client";

import Link from "next/link";
import { ArrowSvg, Chip, F_D, Sec, rv, useSec } from "./ui";
import { services, ui } from "./data";

export const Check = ({ s = 11 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Cards() {
  const { on } = useSec();
  return (
    <div className="sh-wrap pg pg-flush">
      <ul className="shsl-grid" aria-label={ui.services.listLabel}>
        {services.map((s, i) => (
          <li key={s.slug} style={rv(on, 80 + i * 70, 22)}>
            <article className="shsl-card sh-plate">
              <div className="shsl-top">
                <span className="shsl-n sh-mono">{String(i + 1).padStart(2, "0")}</span>
                <Chip t={s.duration} tone="mut" />
              </div>
              <h2 className="shsl-name" style={F_D}>
                <Link href={`/services/${s.slug}`} data-cur="open service">{s.name}</Link>
              </h2>
              <p className="shsl-line">{s.tagline || s.summary}</p>
              {s.includes.length ? (
                <div className="shsl-inc">
                  <p className="sh-lbl">{ui.services.includes}</p>
                  <ul>
                    {s.includes.map((t) => (
                      <li key={t}>
                        <span className="shsl-ck" aria-hidden="true"><Check /></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="shsl-foot">
                {s.price ? (
                  <p className="shsl-price">
                    <span className="sh-lbl">{ui.services.price}</span>
                    <span className="shsl-from" style={{ ...F_D, fontVariantNumeric: "tabular-nums lining-nums" }}>{s.price}</span>
                  </p>
                ) : <span />}
                <span className="shsl-go" aria-hidden="true">
                  <span className="sh-mono">{ui.services.see}</span>
                  <b className="shsl-a"><ArrowSvg /></b>
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceList() {
  return (
    <Sec className="shsl">
      <Cards />
    </Sec>
  );
}
