"use client";

import { useId, useState } from "react";
import { Btn, Eb, F_D, Hd, Sec, rv, useSec } from "./ui";
import { faqs, site, ui } from "./data";

interface Props {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  limit?: number;
  /** index of the row that starts open (-1 = all closed) */
  open?: number;
  /** keep the first answer open on phones too */
  openOnPhone?: boolean;
}

function Inner({ eyebrow = ui.faq.eyebrow, heading = ui.faq.heading, lead = ui.faq.lead, limit, open: start = 0, openOnPhone }: Props) {
  const { on, ph } = useSec();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  // the first answer starts open except on phones (as in the source)
  const [picked, setPicked] = useState<number | null>(null);
  const open = picked ?? (ph && !openOnPhone ? -1 : start);
  const setOpen = setPicked;
  const rows = faqs.slice(0, limit ?? faqs.length);
  const ask = (
    <div className="shfq-ask sh-plate" style={rv(on, 280)}>
            <p className="shfq-ask-t" style={F_D}>{ui.faq.something}</p>
            {site.replyNote ? <p className="shfq-ask-l">{site.replyNote}</p> : null}
            <Btn href={`mailto:${site.email}`} label={ui.faq.askEmail} kind="ghost" icon="arrow" cur="write email" />
          </div>
  );
  return (
    <div className="sh-wrap sh-pad">
      <div className="shfq-grid">
        <div className="shfq-left">
          <div className="sh-headblock">
            {eyebrow ? <Eb text={eyebrow} /> : null}
            {heading ? <Hd text={heading} delay={60} /> : null}
            {lead ? <p className="sh-lead" style={rv(on, 200)}>{lead}</p> : null}
          </div>
          {ph ? null : ask}
        </div>
        <div className="shfq-right">
          <ul className="shfq-list" aria-label={ui.faq.listLabel}>
            {rows.map((f, i) => {
              const isOpen = open === i;
              return (
                <li className={`shfq-row${isOpen ? " is-open" : ""}`} key={f.slug} style={rv(on, 240 + i * 50)}>
                  <h3 className="shfq-h">
                    <button
                      type="button"
                      className="shfq-q"
                      id={`shfq-q-${uid}-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`shfq-a-${uid}-${i}`}
                      data-cur={isOpen ? "close answer" : "open answer"}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className="shfq-n sh-mono" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <span className="shfq-t" style={F_D}>{f.question}</span>
                      <span className="shfq-ic" aria-hidden="true"><i /><i /></span>
                    </button>
                  </h3>
                  <div className="shfq-a" id={`shfq-a-${uid}-${i}`} role="region" aria-labelledby={`shfq-q-${uid}-${i}`}>
                    <div className="shfq-a-in"><p>{f.answer}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
          {ph ? ask : null}
        </div>
      </div>
    </div>
  );
}

export function Faq(props: Props) {
  if (!faqs.length) return null;
  return (
    <Sec className="shfq">
      <Inner {...props} />
    </Sec>
  );
}
