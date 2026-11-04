import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow, Icon } from "./icons";
import { chipText, headings, jobPeriod, jobs, showPosition, postDate, posts, profile, projects, site, splitLast, tools } from "./data";
import s from "./sawad.module.css";

// The first heading of a subpage is the page's h1 and uses the larger hero size.
export function Heading({ a, b, lead }: { a: string; b?: string; lead?: boolean }) {
  const Tag = lead ? "h1" : "h2";
  return (
    <Tag className={lead ? s.h1 : s.h2}>
      {a}
      {b && (
        <>
          <br />
          <span className={s.dim}>{b}</span>
        </>
      )}
    </Tag>
  );
}

function Ext({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function Hero() {
  const [role, roleTail] = splitLast(profile.basics.label);
  const metrics = profile.metrics ?? [];
  const [first, second] = profile.principles ?? [];
  return (
    <section className={`${s.hero} ${s.appear}`}>
      <Heading a={role} b={roleTail} lead />
      <p className={s.heroText}>{profile.basics.summary}</p>
      {metrics.length > 0 && (
        <div className={s.stats}>
          {metrics.map((x) => {
            const [a, b] = splitLast(x.label);
            return (
              <div className={s.stat} key={x.label}>
                <p className={s.statNum}>{x.value}</p>
                <p className={s.statLabel}>
                  {a}
                  {b && <br />}
                  {b}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {first && (
        <div className={s.cards}>
          <div className={s.heroCard}>
            <div className={s.line} style={{ left: -44, top: -9, width: 388, height: 155, backgroundImage: "url(/sites/sawad/icons/line-orange.svg)" }} />
            <div className={s.line} style={{ left: -54, top: 86, width: 388, height: 155, backgroundImage: "url(/sites/sawad/icons/line-orange.svg)" }} />
            <Icon name="layers" className={s.heroIcon} />
            <p className={s.heroTitle}>{first}</p>
            {jobs.length > 0 && (
              <Link className={s.heroArrow} href="/experience" aria-label={site.nav.experience}>
                <Arrow />
              </Link>
            )}
          </div>
          {second && (
            <div className={s.heroCard}>
              <div className={s.line} style={{ left: -20, top: -60, width: 422, height: 284, backgroundImage: "url(/sites/sawad/icons/line-green.svg)" }} />
              <div className={s.line} style={{ left: -49.5, top: 77.5, width: 422, height: 284, transform: "rotate(4deg)", backgroundImage: "url(/sites/sawad/icons/line-green.svg)" }} />
              <Icon name="layout" className={s.heroIcon} />
              <p className={s.heroTitle}>{second}</p>
              {projects.length > 0 && (
                <Link className={s.heroArrow} href="/projects" aria-label={site.nav.projects}>
                  <Arrow />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function Projects({ limit, lead }: { limit?: number; lead?: boolean }) {
  if (!projects.length) return null;
  const [a, b] = headings.projects;
  return (
    <section className={s.section}>
      <Heading a={a} b={b} lead={lead} />
      <div className={s.list}>
        {projects.slice(0, limit).map((p) => {
          const href = p.url ?? p.repo;
          return (
            <Ext key={p.slug} href={href} className={`${s.row} ${s.project}`}>
              {p.image ? (
                <Image className={s.thumb} src={p.image} alt={p.imageAlt ?? p.name} width={130} height={135} sizes="130px" />
              ) : (
                <div className={`${s.thumb} ${s.thumbType}`} aria-hidden="true">
                  {p.name}
                </div>
              )}
              <div>
                <h3 className={s.itemTitle}>{p.name}</h3>
                <p className={s.itemText}>{p.kind ?? p.summary}</p>
              </div>
              {href && <Arrow className={s.rowArrow} />}
            </Ext>
          );
        })}
      </div>
    </section>
  );
}

export function Experience({ limit, lead }: { limit?: number; lead?: boolean }) {
  if (!jobs.length) return null;
  const [a, b] = headings.experience;
  return (
    <section className={s.section}>
      <Heading a={a} b={b} lead={lead} />
      <div className={s.list}>
        {jobs.slice(0, limit).map((j) => (
          <Ext key={`${j.company}-${j.start}`} href={j.url} className={`${s.row} ${s.job}`}>
            <h3 className={s.itemTitle}>{showPosition ? `${j.company}, ${j.position}` : j.company}</h3>
            <p className={s.itemText}>{j.summary}</p>
            <p className={s.period}>{jobPeriod(j.start, j.end)}</p>
            {j.url && <Arrow className={s.rowArrow} />}
          </Ext>
        ))}
      </div>
    </section>
  );
}

export function Tools({ lead }: { lead?: boolean }) {
  if (!tools.length) return null;
  const [a, b] = headings.tools;
  return (
    <section className={s.section}>
      <Heading a={a} b={b} lead={lead} />
      <div className={`${s.list} ${s.toolGrid}`}>
        {tools.map((t) => (
          <Ext key={`${t.group}-${t.name}`} href={t.url} className={`${s.row} ${s.tool}`}>
            {t.icon ? (
              <Image className={s.toolIcon} src={t.icon} alt={t.name} width={60} height={60} />
            ) : (
              <div className={`${s.toolIcon} ${s.toolChip}`} aria-hidden="true">
                {chipText(t.name)}
              </div>
            )}
            <div>
              <h3 className={s.toolName}>{t.name}</h3>
              <p className={s.itemText}>{t.note ?? t.group}</p>
            </div>
          </Ext>
        ))}
      </div>
    </section>
  );
}

export function Blog({ limit, lead }: { limit?: number; lead?: boolean }) {
  if (!posts.length) return null;
  const [a, b] = headings.blog;
  return (
    <section className={s.section}>
      <Heading a={a} b={b} lead={lead} />
      <div className={s.list}>
        {posts.slice(0, limit).map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className={`${s.row} ${s.post}`}>
            <h3 className={s.itemTitle}>{p.title}</h3>
            <p className={s.itemText}>{p.summary}</p>
            <div className={s.meta}>
              <p>{postDate(p.date)}</p>
              {p.readingTime && <p>{p.readingTime}</p>}
            </div>
            <Arrow className={s.rowArrow} />
          </Link>
        ))}
      </div>
    </section>
  );
}
