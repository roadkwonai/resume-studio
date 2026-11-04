"use client";

import Link from "next/link";
import { useState } from "react";
import { posts, projects, faq, site, type Project } from "./data";
import { Arrow, Cover, useSeen } from "./ui";
import s from "./nl.module.css";

function Row({ p, desc }: { p: Project; desc: boolean }) {
  const [ref, seen] = useSeen<HTMLAnchorElement>("0px 0px -30% 0px");
  return (
    <Link ref={ref} href={`/work/${p.slug}`} className={`${s.row} ${desc ? "" : s.rowHome} ${seen ? s.struck : ""}`}>
      <div className={s.rowText}>
        <h3>{p.name}</h3>
        <div className={s.rowMeta}>
          {p.kind ? <span>{p.kind}</span> : null}
          {p.year ? <span>{p.year}</span> : null}
        </div>
        {desc ? <p className={`${s.body} ${s.rowDesc}`}>{p.summary}</p> : null}
      </div>
      <div className={s.dgrid}>
        {p.metric?.before ? (
          <div className={`${s.drow} ${s.old}`}>
            <span className={s.mk}>−</span>
            <span className={`${s.txt} ${s.dtxt}`}>{p.metric.label}</span>
            <span className={`${s.num} ${s.oldNum}`}>{p.metric.before}</span>
          </div>
        ) : null}
        {p.metric ? (
          <div className={`${s.drow} ${s.nw}`}>
            <span className={`${s.mk} ${s.plus}`}>+</span>
            <span className={s.dtxt}>{p.metric.label}</span>
            <span className={`${s.num} ${s.newNum}`}>{p.metric.after}</span>
          </div>
        ) : desc ? null : <p className={s.body}>{p.summary}</p>}
      </div>
      <Cover className={s.thumb} src={p.image} alt={p.imageAlt} name={p.name} width={480} height={300} sizes="240px" />
    </Link>
  );
}

export function ProjectRows({ desc = false }: { desc?: boolean }) {
  return (
    <div className={s.rows}>
      {projects.map((p) => (
        <Row key={p.slug} p={p} desc={desc} />
      ))}
    </div>
  );
}

export function PostList({ className = "" }: { className?: string }) {
  return (
    <div className={`${s.tl} ${className}`}>
      {posts.map((p) => (
        <Link key={p.slug} href={`/writing/${p.slug}`} className={s.post}>
          <span className={s.mark} />
          <div>
            <div className={s.postV}>{p.v}</div>
            <div className={s.postDate}>{p.short}</div>
          </div>
          <div className={s.postBody}>
            <h3 className={s.title22}>{p.title}</h3>
            <p className={`${s.body} ${s.postBlurb}`}>{p.summary}</p>
          </div>
          {p.readingTime ? <span className={s.postMin}>{p.readingTime}</span> : null}
        </Link>
      ))}
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  if (!faq.length) return null;
  return (
    <div className={s.faq}>
      <p className={s.label}>{site.service.questions}</p>
      <div className={s.faqList}>
        {faq.map(({ question: q, answer: a }, i) => (
          <div key={q} className={s.faqItem}>
            <button className={`${s.faqQ} ${open === i ? s.faqQOn : ""}`} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              {q}
              <span className={s.plusIc} />
            </button>
            <div className={`${s.faqA} ${open === i ? s.faqAOn : ""}`}>
              <div><p className={s.body}>{a}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SvcLink({ href, name, blurb, price, terms }: { href: string; name: string; blurb: string; price?: string; terms?: string }) {
  return (
    <Link href={href} className={s.svc}>
      <div>
        <h3 className={s.svcName}>{name}</h3>
        <p className={`${s.body} ${s.svcBlurb}`}>{blurb}</p>
      </div>
      <div>
        {price ? <div className={s.svcPrice}>{price}</div> : null}
        {terms ? <div className={s.svcTerms}>{terms}</div> : null}
      </div>
      <span className={s.svcArrow}><Arrow /></span>
    </Link>
  );
}
