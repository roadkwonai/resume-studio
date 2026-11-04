"use client";

import { Sec, rv, useSec } from "./ui";
import { Md } from "./md";
import { Next, PicFig, Toc, Top } from "./Detail";
import { accent, fill, posts, site, ui, type Post as PostRow } from "./data";

const IDP = "po";

function Side({ p }: { p: PostRow }) {
  return (
    <>
      <Toc md={p.body} idPrefix={IDP} label={ui.post.onPage} />
      <p className="shpo-q">
        {ui.post.thought}{" "}
        <a href={`mailto:${site.email}?subject=${encodeURIComponent(fill(ui.post.re, { title: p.title }))}`} data-cur="write mail">
          {ui.post.write}
        </a>
      </p>
    </>
  );
}

function Inner({ p }: { p: PostRow }) {
  const { on } = useSec();
  const i = posts.findIndex((x) => x.slug === p.slug);
  const next = posts.length > 1 ? posts[(i + 1) % posts.length] : null;
  return (
    <div className="sh-wrap pg pg-first">
      <Top
        trail={[{ label: ui.nav.writing, href: "/writing" }]}
        here={p.title}
        eyebrow={ui.writing.eyebrow}
        heading={accent(p.title)}
        size="clamp(40px,4.6vw,72px)"
        lead={p.excerpt}
        facts={([
          [ui.post.toRead, p.read],
          [ui.post.published, p.date],
          [ui.post.filed, p.tag],
        ] as [string, string][]).filter(([, v]) => v)}
        side={p.image ? <PicFig src={p.image} alt={p.alt} ratio="4/3" eager /> : undefined}
      />
      <div className="shpo-body">
        {/* the side column is rendered twice: above the text on narrow screens, after it on wide ones (CSS shows one) */}
        <div className="pg-prose has-side">
          <aside className="pg-prose-side is-top" style={rv(on, 360)}>
            <Side p={p} />
          </aside>
          <div className="pg-prose-main" style={rv(on, 260, 22)}>
            <Md md={p.body} idPrefix={IDP} />
          </div>
          <aside className="pg-prose-side is-end" style={rv(on, 360)}>
            <Side p={p} />
          </aside>
        </div>
      </div>
      {next ? (
        <div className="shpo-next">
          <Next href={`/writing/${next.slug}`} label={ui.post.next} title={next.title} line={next.excerpt} meta={next.tag} cur="read next" />
        </div>
      ) : null}
    </div>
  );
}

export function Post({ slug }: { slug: string }) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <Sec className="shpo" >
      <Inner p={p} />
    </Sec>
  );
}
