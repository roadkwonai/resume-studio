"use client";

import { useId, useState } from "react";
import { Btn, Eb, F_D, Hd, More, Sec, rv, useSec } from "./ui";
import { counted, fill, services, ui } from "./data";

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const Check = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Inner() {
  const { on } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [open, setOpen] = useState(0);
  return (
    <div className="sh-wrap sh-pad">
      <div className="shsv-top">
        <div className="sh-headblock">
          <Eb text={ui.services.eyebrow} />
          <Hd text={counted(ui.services.heading, Math.min(services.length, 4))} delay={60} />
          <p className="sh-lead" style={rv(on, 200)}>
            {ui.services.lead}
          </p>
        </div>
        <div className="shsv-side" style={rv(on, 260)}>
          <More href="/services" n="03" label={ui.services.all} cur="open services" />
        </div>
      </div>
      <ul className="shsv-list" aria-label={ui.services.listLabel}>
        {services.slice(0, 4).map((s, t) => {
          const o = open === t;
          const b = `shsv-b-${uid}-${t}`;
          const p = `shsv-p-${uid}-${t}`;
          const list = s.includes;
          return (
            <li className={`shsv-row${o ? " is-open" : ""}`} style={rv(on, 300 + t * 80)} key={s.slug}>
              <h3 className="shsv-h">
                <button type="button" id={b} className="shsv-btn sh-inring" aria-expanded={o} aria-controls={p} data-cur={o ? "close row" : "open row"} onClick={() => setOpen(o ? -1 : t)}>
                  <span className="shsv-n sh-mono">{String(t + 1).padStart(2, "0")}</span>
                  <span className="shsv-name" style={F_D}>{s.name}</span>
                  <span className="shsv-line">{s.tagline}</span>
                  <span className="shsv-from sh-mono">{s.price}</span>
                  <span className="shsv-ic" aria-hidden="true"><Plus /></span>
                </button>
              </h3>
              <div id={p} role="region" aria-labelledby={b} className="shsv-panel">
                <div className="shsv-clip">
                  <div className="shsv-in">
                    <div className="shsv-body">
                      {s.summary ? <p className="shsv-text">{s.summary}</p> : null}
                      <Btn href={`/services/${s.slug}`} label={ui.services.see} kind="solid" cur="open service" ariaLabel={fill(ui.services.seeAria, { title: s.name })} />
                    </div>
                    {list.length ? (
                      <div className="shsv-inc">
                        <p className="sh-lbl">{ui.services.includes}</p>
                        <ul>
                          {list.map((x) => (
                            <li key={x}>
                              <span className="shsv-ck" aria-hidden="true"><Check /></span>
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {s.price || s.duration ? (
                      <dl className="shsv-spec sh-plate">
                        {s.price ? (
                          <div>
                            <dt className="sh-lbl">{ui.services.price}</dt>
                            <dd className="sh-mono">{s.price}</dd>
                          </div>
                        ) : null}
                        {s.duration ? (
                          <div>
                            <dt className="sh-lbl">{ui.services.timeline}</dt>
                            <dd className="sh-mono">{s.duration}</dd>
                          </div>
                        ) : null}
                      </dl>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Services() {
  if (!services.length) return null;
  return (
    <Sec className="shsv">
      <Inner />
    </Sec>
  );
}
