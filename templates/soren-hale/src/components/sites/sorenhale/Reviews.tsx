"use client";

import { Eb, Hd, Sec, rv, useSec } from "./ui";
import { fill, reviews, ui } from "./data";

interface Props {
  eyebrow?: string;
  heading?: string;
  lead?: string;
}

const Tick = ({ s }: { s: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Inner({ eyebrow = ui.reviews.eyebrow, heading = ui.reviews.heading, lead = ui.reviews.lead }: Props) {
  const { on } = useSec();
  const lines = Array.from({ length: reviews.length * 4 }, (_, i) => i + 1).join("\n");
  return (
    <div className="sh-wrap sh-pad">
      <div className="sh-headblock">
        {eyebrow ? <Eb text={eyebrow} /> : null}
        {heading ? <Hd text={heading} delay={60} /> : null}
        {lead ? <p className="sh-lead" style={rv(on, 200)}>{lead}</p> : null}
      </div>
      <div className="shrv-file sh-plate" style={rv(on, 260)}>
        <div className="shrv-bar sh-mono">
          <span className="shrv-tab"><i aria-hidden="true" /><span className="shrv-fn">{ui.reviews.file}</span></span>
          <span className="shrv-sum"><Tick s={12} />{fill(ui.reviews.summary, { n: reviews.length })}</span>
        </div>
        <div className="shrv-sheet">
          <pre className="shrv-gutter" aria-hidden="true">{lines}</pre>
          <ol className="shrv-list">
            {reviews.map((r) => (
              <li className="shrv-item" key={r.slug}>
                <figure className="shrv-fig">
                  <figcaption className="shrv-who">
                    <span className="shui-av" aria-hidden="true" style={{ width: 40, height: 40, fontSize: 16 }}>
                      {r.avatar ? <img src={r.avatar} alt="" width={40} height={40} loading="eager" decoding="async" draggable={false} /> : Array.from(r.name)[0]}
                    </span>
                    <span className="shrv-name">{r.name}</span>
                    {r.role ? <span className="shrv-role sh-mono">{r.role}</span> : null}
                  </figcaption>
                  <blockquote className="shrv-quote">{r.quote}</blockquote>
                  <span className="shrv-ok sh-mono"><b><Tick s={11} />{ui.reviews.approved}</b></span>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export function Reviews(props: Props) {
  if (!reviews.length) return null;
  return (
    <Sec className="shrv">
      <Inner {...props} />
    </Sec>
  );
}
