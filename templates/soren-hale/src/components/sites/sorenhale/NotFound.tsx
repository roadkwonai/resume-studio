"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Btn, Eb, Grid, Hd, Sec, rv, useSec } from "./ui";
import { live, ui } from "./data";

const PLACES = ([[ui.nav.work, "/work"], [ui.nav.services, "/services"], [ui.nav.writing, "/writing"], [ui.nav.lab, "/lab"], [ui.nav.contact, "/contact"]] as [string, string][]).filter(([, h]) => live(h));

function Inner() {
  const { on } = useSec();
  // the 404 is prerendered once for every bad address, so the real path can only be read in the browser
  const raw = useSyncExternalStore(() => () => {}, () => window.location.pathname, () => "");
  const path = raw && raw !== "/" ? raw.slice(0, 180) : "/this-page";
  const imp = "import page from";
  const lines = [`${imp} "${path}"\n`, `${" ".repeat(imp.length + 2)}^\n`, `// ${ui.notFound.error}\n`];
  return (
    <div className="sh-wrap pg pg-first sh4-in">
      <div className="pg-top">
        <div className="pg-top-copy">
          <Eb text={ui.notFound.eyebrow} />
          <Hd tag="h1" className="pg-h1" text={ui.notFound.heading} size="clamp(44px,5.4vw,84px)" lh={0.98} delay={70} />
          <p className="sh-lead pg-lead" style={rv(on, 220)}>{ui.notFound.lead}</p>
          <div className="pg-btns" style={rv(on, 300)}>
            <Btn href="/" label={ui.notFound.home} kind="solid" cur="go home" />
            {live("/work") ? <Btn href="/work" label={ui.notFound.work} kind="ghost" cur="open work" /> : null}
          </div>
        </div>
        <div className="pg-top-side" style={rv(on, 220)}>
          <div className="sh4-code">
            <figure className="pg-code">
              <figcaption><span className="sh-lbl">router.ts</span></figcaption>
              <pre tabIndex={0} className="sh-inring" aria-label={`${ui.notFound.error}: ${path}`}>
                <code>
                  {lines.map((l, i) => <span key={i} className={i === 2 ? "is-c" : undefined}>{l}</span>)}
                </code>
              </pre>
            </figure>
          </div>
        </div>
      </div>
      <nav className="sh4-places" aria-label={ui.notFound.didYouMean} style={rv(on, 460)}>
        <p className="sh-lbl">{ui.notFound.didYouMean}</p>
        <ul>
          {PLACES.map(([l, h], i) => (
            <li key={h}>
              <Link className="sh-more" href={h} data-cur="open">
                <span className="sh-more-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="sh-more-l">{l}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function NotFound() {
  return (
    <Sec className="sh4" eager>
      <Grid x={70} y={40} />
      <Inner />
    </Sec>
  );
}
