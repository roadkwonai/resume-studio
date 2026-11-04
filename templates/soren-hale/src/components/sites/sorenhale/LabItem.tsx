"use client";

import Link from "next/link";
import { Chip, F_D, Hd, More, Sec, rv, useSec } from "./ui";
import { Code, Md } from "./md";
import { PicFig, Toc, Top } from "./Detail";
import { fill, labItems, ui, type LabItem as Row } from "./data";

const IDP = "lt";
const host = (u: string) => {
  const m = u.match(/^https?:\/\/([^/?#]+)([^?#]*)/);
  return m ? m[1].replace(/^www\./, "") + m[2].replace(/\/$/, "") : u;
};
const Arr = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Side({ p, cls }: { p: Row; cls: string }) {
  const { on } = useSec();
  const meta = [
    [ui.labItem.kind, p.kind],
    [ui.labItem.license, p.license],
  ].filter(([, v]) => v);
  const ext = /^https?:\/\//.test(p.repo);
  return (
    <aside className={`shlt-side ${cls}${meta.length || p.repo ? "" : " no-meta"}`} style={rv(on, 400)}>
      <Toc md={p.body} idPrefix={IDP} label={ui.labItem.inReadme} />
      {meta.length || p.repo ? (
        <dl className="shlt-meta">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="sh-lbl">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          {p.repo ? (
            <div>
              <dt className="sh-lbl">{ui.labItem.repository}</dt>
              <dd>
                <a href={p.repo} target={ext ? "_blank" : undefined} rel={ext ? "noopener" : undefined} data-cur="open repo" aria-label={fill(ui.labItem.openRepo, { host: host(p.repo) })}>
                  {host(p.repo)}
                  <Arr />
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </aside>
  );
}

function Inner({ p }: { p: Row }) {
  const { on } = useSec();
  const i = labItems.findIndex((x) => x.slug === p.slug);
  const more = [1, 2, 3].filter((n) => n < labItems.length).map((n) => labItems[(i + n) % labItems.length]);
  const facts = [
    [ui.labItem.statStars, p.stars],
    [ui.labItem.statDownloads, p.downloads],
    [ui.labItem.statLicense, p.license],
  ].filter(([, v]) => v) as [string, string][];
  const side =
    p.install || p.image ? (
      <>
        {p.install ? (
          <div className="shlt-inst">
            <Code lang={ui.labItem.install} text={p.install} label={ui.labItem.installLabel} />
          </div>
        ) : null}
        <PicFig src={p.image} alt={p.alt} ratio="16/10" eager className="shlt-pic" />
      </>
    ) : undefined;
  return (
    <div className="sh-wrap pg pg-first">
      <Top
        trail={[{ label: ui.nav.lab, href: "/lab" }]}
        here={p.name}
        eyebrow={p.kind || ui.labItem.eyebrow}
        heading={p.name}
        size="clamp(42px,5vw,78px)"
        lead={p.summary}
        button={p.repo ? { label: ui.labItem.viewRepo, href: p.repo, cur: "open repo" } : undefined}
        facts={facts}
        side={side}
      />
      <div className="shlt-doc">
        <Side p={p} cls="is-top" />
        {p.body ? (
          <article className="shlt-readme sh-plate" style={rv(on, 300, 22)}>
            <p className="shlt-rh">
              <span className="sh-lbl">{ui.labItem.readme}</span>
              {p.license ? <Chip t={p.license} tone="mut" /> : null}
            </p>
            <div className="shlt-rb">
              <Md md={p.body} idPrefix={IDP} />
            </div>
          </article>
        ) : null}
        <Side p={p} cls="is-end" />
      </div>
      {more.length ? (
        <div className="shlt-more">
          <div className="shlt-more-h">
            <Hd text={ui.labItem.moreHeading} size="clamp(32px,3.2vw,48px)" lh={1} delay={100} />
            <More href="/lab" n={String(labItems.length).padStart(2, "0")} label={ui.lab.all} cur="open lab" />
          </div>
          <ul className="pg-rows" aria-label={ui.labItem.moreLabel}>
            {more.map((m, n) => (
              <li key={m.slug} style={rv(on, 160 + n * 50, 14)}>
                <Link className="pg-row" href={`/lab/${m.slug}`} data-cur="open project">
                  <span className="pg-row-m sh-mono">{[m.kind, m.stars ? fill(ui.labItem.starsLine, { value: m.stars }) : ""].filter(Boolean).join(" · ")}</span>
                  <span className="pg-row-t" style={F_D}>{m.name}</span>
                  <span className="pg-row-l">{m.summary}</span>
                  <b className="pg-row-a" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </b>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function LabItem({ slug }: { slug: string }) {
  const p = labItems.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <Sec className="shlt">
      <Inner p={p} />
    </Sec>
  );
}
