import Link from "next/link";
import { EMAIL, NAME, byline, experience, extras, hasScreens, howIWork, initials, pages, place, posts, profile, projects, services, site, tools } from "./data";
import { figureWidth, parseBody, type ProseItem } from "./format";
import { Breakpoints } from "./Scenes";
import { Roll } from "./Counter";
import { Faq, PostList, ProjectRows, SvcLink } from "./Rows";
import { Arrow, Cover, Cta, PageHero, SideRow } from "./ui";
import { ContactForm } from "./ContactForm";
import s from "./nl.module.css";

export function WorkPage() {
  return (
    <>
      <PageHero {...pages.work} />
      <div className={s.workList}>
        <ProjectRows desc />
      </div>
      <div style={{ height: 110 }} />
      <Cta />
    </>
  );
}

export function AboutPage() {
  const { basics } = profile;
  const t = site.about;
  const [firstPara, ...paras] = basics.about;
  const resumeNote = extras.resumeNote ?? (basics.resumeFile ? t.resumeDownloadNote : "");
  return (
    <>
      <PageHero {...pages.about} />
      <div className={s.aboutPhoto}>
        <Cover src={basics.aboutImage ?? basics.photo} alt={basics.aboutImageAlt ?? basics.photoAlt ?? ""} name={initials} width={2400} height={1603} sizes="1329px" priority />
      </div>
      {experience.length ? (
        <div className={`${s.exp} ${s.expTop}`}>
          <p className={s.label}>{t.experience}</p>
          <div className={s.expList}>
            {experience.map(({ years, role, org, text }) => (
              <div key={`${org}${years}`} className={s.expRow}>
                <span className={s.label}>{years}</span>
                <div>
                  <h3 className={s.title22}>{role}</h3>
                  <div className={`${s.label} ${s.meta}`}>{org}</div>
                </div>
                <p className={s.body}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className={s.spacerStory} />
      <SideRow label={t.story}>
        <p className={s.big22}>{firstPara}</p>
        {paras.map((p) => (
          <p key={p} className={s.body} style={{ marginTop: 21 }}>{p}</p>
        ))}
      </SideRow>
      {howIWork.length ? (
        <SideRow label={t.how} wide>
          <div className={s.how}>
            {howIWork.map(({ title, summary }) => (
              <div key={title}>
                <h3>{title}</h3>
                <p className={s.body}>{summary}</p>
              </div>
            ))}
          </div>
        </SideRow>
      ) : null}
      {tools ? (
        <SideRow label={t.tools}>
          <p className={s.big22}>{tools}</p>
        </SideRow>
      ) : null}
      {resumeNote ? (
        <SideRow label={t.resume}>
          <p className={s.big22}>{resumeNote}</p>
          <a href={basics.resumeFile ?? `mailto:${EMAIL}?subject=${encodeURIComponent(t.resumeSubject)}`} className={`${s.btn} ${s.btnGhost}`} style={{ marginTop: 40 }}>
            {basics.resumeFile ? t.resumeDownload : t.resumeRequest} <Arrow />
          </a>
        </SideRow>
      ) : null}
      <div className={s.sp} style={{ ["--d" as string]: "90px", ["--p" as string]: "35px" }} />
      <Cta />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHero {...pages.services} />
      <div className={s.svcList}>
        {services.map((v) => (
          <SvcLink key={v.slug} href={`/services/${v.slug}`} name={v.name} blurb={v.summary} price={v.price} terms={v.terms} />
        ))}
      </div>
      <Faq />
      <div style={{ height: 112 }} />
      <Cta />
    </>
  );
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 680 }}>
      {items.map((g, i) => (
        <li key={g} style={{ display: "grid", gridTemplateColumns: "48px 1fr", padding: "0 0 28px" }}>
          <span className={s.label}>{String(i + 1).padStart(2, "0")}</span>
          <span className={s.big22}>{g}</span>
        </li>
      ))}
    </ol>
  );
}

export function ServiceDetail({ slug }: { slug: string }) {
  const v = services.find((x) => x.slug === slug)!;
  const t = site.service;
  const others = services.filter((x) => x.slug !== slug);
  return (
    <>
      <PageHero label={t.label} lead={v.name} rest={v.tagline} text={v.summary} />
      <div className={s.svcGap} />
      {v.price || v.terms ? (
        <SideRow label={v.price ? t.price : t.duration}>
          {v.price ? <div className={s.priceBig}>{v.price}</div> : null}
          {v.terms ? <div className={s.label} style={{ marginTop: 6 }}>{v.terms}</div> : null}
        </SideRow>
      ) : null}
      {v.get.length ? <SideRow label={t.get}><Numbered items={v.get} /></SideRow> : null}
      {v.steps.length ? (
        <SideRow label={t.runs}>
          {v.steps.length === 1 ? <p className={s.big22}>{v.steps[0]}</p> : <Numbered items={v.steps} />}
        </SideRow>
      ) : null}
      {v.fit ? <SideRow label={t.fit}><p className={s.big22}>{v.fit}</p></SideRow> : null}
      {others.length ? (
        <SideRow label={t.other}>
          {others.map((x) => (
            <Link key={x.slug} href={`/services/${x.slug}`} className={s.nextT} style={{ display: "block", marginBottom: 10 }}>
              {x.name}
            </Link>
          ))}
        </SideRow>
      ) : null}
      <div className={s.sp} style={{ ["--d" as string]: "60px", ["--p" as string]: "22px" }} />
      <Cta />
    </>
  );
}

export function WritingPage() {
  return (
    <>
      <PageHero {...pages.writing} />
      <PostList className={s.tlPage} />
      <div style={{ height: 109 }} />
      <Cta />
    </>
  );
}

export function PostPage({ slug }: { slug: string }) {
  const p = posts.find((x) => x.slug === slug)!;
  const nxt = p.next;
  return (
    <>
      <header className={s.hero}>
        <p className={s.label}>{p.long} {p.readingTime ? <span style={{ marginLeft: 14 }}>{p.readingTime}</span> : null}</p>
        <h1 className={s.h1}>{p.title}</h1>
        <p className={s.lead}>{p.summary}</p>
      </header>
      <div className={s.artRule} />
      <div className={s.articleGrid} style={{ marginTop: 0, paddingTop: 48 }}>
        <div className={s.byline}>
          {NAME}
          <span>{byline}</span>
        </div>
        <Prose body={p.body} />
      </div>
      {nxt ? (
        <div className={s.next} style={{ marginTop: 112 }}>
          <p className={s.label}>{site.post.next}</p>
          <Link href={`/writing/${nxt.slug}`}><h3 className={s.nextT}>{nxt.title}</h3></Link>
        </div>
      ) : null}
      <div className={s.sp} style={{ ["--d" as string]: "118px", ["--p" as string]: "66px" }} />
      <Cta />
    </>
  );
}

function ProseItems({ items }: { items: ProseItem[] }) {
  return items.map((b, i) =>
    b.kind === "p" ? (
      <p key={i}>{b.text}</p>
    ) : b.kind === "ul" ? (
      <ul key={i}>{b.items.map((li) => <li key={li}>{li}</li>)}</ul>
    ) : (
      <pre key={i} className={s.code}>
        {b.lines.map((l, n) => (
          <div key={n}>{highlight(l)}</div>
        ))}
      </pre>
    ),
  );
}

function Prose({ body }: { body: string }) {
  return (
    <div className={s.prose}>
      {parseBody(body).map((sec, i) =>
        sec.h ? (
          <div key={i}>
            <h2>{sec.h}</h2>
            <ProseItems items={sec.items} />
          </div>
        ) : (
          <ProseItems key={i} items={sec.items} />
        ),
      )}
    </div>
  );
}

function highlight(line: string) {
  if (line.startsWith("//")) return <span className={s.cm}>{line}</span>;
  const parts = line.split(/(\bconst\b|\bawait\b|\.\w+(?=\()|[(){}=])/g).filter(Boolean);
  return parts.map((t, i) => {
    if (t === "const" || t === "await") return <span key={i} className={s.kw}>{t}</span>;
    if (/^\.\w+/.test(t)) return <span key={i}><span style={{ color: "#eee" }}>.</span><span className={s.fn}>{t.slice(1)}</span></span>;
    if (/^[(){}]$/.test(t)) return <span key={i} className={s.pn}>{t}</span>;
    return <span key={i}>{t}</span>;
  });
}

export function ProjectPage({ slug }: { slug: string }) {
  const p = projects.find((x) => x.slug === slug)!;
  const nxt = p.next;
  const t = site.project;
  const meta = [[t.client, p.client], [t.role, p.role], [t.timeline, p.timeline], [t.stack, p.stack]].filter(([, v]) => v);
  const out = [[t.live, p.url], [t.code, p.repo]].filter(([, v]) => v);
  return (
    <>
      <header className={s.hero} style={{ paddingBottom: 0 }}>
        <p className={s.label}>{p.kind} {p.year ? <span style={{ marginLeft: p.kind ? 11 : 0 }}>{p.year}</span> : null}</p>
        <h1 className={s.h1}>{p.name}</h1>
        <p className={s.lead}>{p.summary}</p>
      </header>
      {p.metric || meta.length || out.length ? (
        <div className={s.projTop}>
          <div>
            {p.metric ? (
              <>
                {/* a word instead of a number still has to fit: scale it down past the width of about five digits */}
                <div className={s.rollBig}><Roll figure={p.digits} unit={p.unit} size={`calc(var(--roll-size) * ${Math.min(1, 2.8 / figureWidth(p.digits)).toFixed(3)})`} unitSize="var(--roll-unit)" /></div>
                <p className={s.big22} style={{ marginTop: 14 }}>{p.metric.label}</p>
                {p.note ? <p className={s.big22} style={{ color: "var(--nl-mid)" }}>{p.note}</p> : null}
              </>
            ) : null}
          </div>
          <div className={s.meta2}>
            {meta.map(([k, v]) => (
              <div key={k}><span>{k}</span><b>{v}</b></div>
            ))}
            {out.map(([k, v]) => (
              <div key={k}><span>{k}</span><b><a href={v} className={s.under}>{v?.replace(/^https?:\/\//, "")}</a></b></div>
            ))}
          </div>
        </div>
      ) : null}
      <div className={s.projImg}>
        <Cover src={p.image} alt={p.imageAlt} name={p.name} width={2400} height={1500} sizes="1329px" priority />
      </div>
      <div className={s.sp} style={{ ["--d" as string]: "109px", ["--p" as string]: "80px" }} />
      {p.problem ? <SideRow label={t.problem}><p className={s.big22}>{p.problem}</p></SideRow> : null}
      {p.solution ? <SideRow label={t.did}><p className={s.big22}>{p.solution}</p></SideRow> : null}
      {p.result ? <SideRow label={t.changed}><p className={s.big22}>{p.result}</p></SideRow> : null}
      {p.body ? <SideRow label={t.notes}><Prose body={p.body} /></SideRow> : null}
      {hasScreens(p) ? (
        <div className={s.cbpGap}>
          <Breakpoints project={p} heading={[t.bpLead, t.bpRest]} />
        </div>
      ) : null}
      {nxt ? (
        <div className={`${s.next} ${s.nextProj}`}>
          <p className={s.label}>{t.next}</p>
          <Link href={`/work/${nxt.slug}`}><h3 className={s.h2}>{nxt.name}</h3></Link>
        </div>
      ) : null}
      <div className={s.sp} style={{ ["--d" as string]: "110px", ["--t" as string]: "72px", ["--p" as string]: "67px" }} />
      <Cta />
    </>
  );
}

export function ContactPage() {
  const t = site.contact;
  const { phone, availability, responseTime } = profile.basics;
  const facts = [[t.phone, phone], [t.basedIn, place], [t.hours, extras.hours ?? responseTime], [t.nextFree, availability]].filter(([, v]) => v);
  return (
    <>
      <PageHero {...pages.contact} />
      <div className={s.contactGrid}>
        <div className={s.facts}>
          <div className={s.fact}><span>{t.email}</span><b><a href={`mailto:${EMAIL}`}>{EMAIL}</a></b></div>
          {facts.map(([k, v]) => (
            <div key={k} className={s.fact}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
        <ContactForm />
      </div>
      <div style={{ height: 150 }} />
    </>
  );
}

export function NotFoundPage() {
  const t = site.notFound;
  return (
    <div className={s.nf}>
      <div className={s.nfBig}>
        <div className={s.nfNum}><Roll figure="404" size="var(--nf-size)" tracking={-0.055} /></div>
        <span className={s.nfSub}>{t.sub}</span>
      </div>
      <h1 className={s.h1} style={{ marginTop: 36, maxWidth: 900 }}>
        {t.lead} <span className={s.dim}>{t.rest}</span>
      </h1>
      <Link href="/" className={`${s.btn} ${s.btnPrimary}`} style={{ marginTop: 40 }}>
        {t.back} <Arrow />
      </Link>
      <div style={{ height: 96 }} />
    </div>
  );
}

export function LegalPage({ title, sections }: { title: string; sections: string[][] }) {
  const t = site.legal;
  return (
    <>
      <PageHero label={t.label} lead={title} />
      <div style={{ marginTop: 78, borderTop: "1px solid var(--nl-line)" }} />
      <div className={s.articleGrid} style={{ marginTop: 0, paddingTop: 48 }}>
        <div className={s.byline}>
          <span style={{ fontSize: 14 }}>{t.updatedLabel}</span>
          {t.updated}
        </div>
        <div className={s.prose}>
          <p><b style={{ fontWeight: 700 }}>{t.placeholderLead}</b> {t.placeholder}</p>
          {sections.map(([h, p]) => (
            <div key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 130 }} />
    </>
  );
}
