import Image from "next/image";
import { initialsOf } from "@/lib/profile";
import { ContactForm } from "./ContactForm";
import { MatrixRain } from "./MatrixRain";
import {
  AWARDS,
  BRAND,
  FAQ,
  LOCATION_LINE,
  METRICS,
  NAV_LINKS,
  PRINCIPLES,
  PROCESS,
  PROJECTS,
  PROMPT,
  SKILLS,
  SOCIALS,
  TERMINAL_LINES,
  TIMELINE,
  USE_CASES,
  extras,
  profile,
  sectionLabel,
  site,
  type Card,
} from "./data";
import s from "./kerneldev.module.css";

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <>
      <p className={s.monoAccent}>{label}</p>
      <h2 className={s.h2}>{title}</h2>
    </>
  );
}

function CardView({ card }: { card: Card }) {
  return (
    <div className={s.card}>
      <p className={s.cardNum}>{card.num}</p>
      <h3 className={s.h3}>{card.title}</h3>
      <p className={s.body}>{card.body}</p>
    </div>
  );
}

export function KernelDevPage() {
  const { basics, contact } = profile;
  const { sections } = site;
  const copyright = [`© ${new Date().getFullYear()} ${basics.name}`, BRAND === basics.name ? "" : BRAND].filter(Boolean).join(" / ");

  return (
    <div className={s.root} id="top">
      <div className={s.page}>
        <nav className={s.nav}>
          <p className={s.brand}>&gt; {BRAND}</p>
          <ul className={s.coreLinks}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a className={`${s.btnPrimary} ${s.wTalk}`} href="#contact">
            {site.nav.cta}
          </a>
        </nav>

        <header className={s.hero}>
          <MatrixRain className={s.rain} />
          {basics.availability && (
            <div className={s.availability}>
              <span className={s.dot} />
              <p className={s.monoAccent}>{basics.availability}</p>
            </div>
          )}
          <div className={s.heroSplit}>
            <div className={s.heroCopy}>
              <h1 className={s.h1}>{basics.headline}</h1>
              <p className={s.body}>{basics.summary}</p>
              <div className={s.actions}>
                {PROJECTS.length > 0 && (
                  <a className={`${s.btnPrimary} ${s.wExplore}`} href="#projects">
                    {site.hero.primary}
                  </a>
                )}
                <a className={`${s.btnSecondary} ${s.wStart}`} href="#contact">
                  {site.hero.secondary}
                </a>
              </div>
              {LOCATION_LINE && <p className={s.mono}>{LOCATION_LINE}</p>}
            </div>
            <figure className={`${s.box} ${s.portrait}`} style={{ margin: 0 }}>
              {basics.photo ? (
                <Image
                  className={s.portraitImg}
                  src={basics.photo}
                  alt={basics.photoAlt ?? basics.name}
                  width={1254}
                  height={1254}
                  sizes="480px"
                  preload
                />
              ) : (
                <div className={`${s.portraitImg} ${s.portraitInitials}`} aria-hidden="true">
                  {initialsOf(profile)}
                </div>
              )}
              <div>
                <p className={s.monoAccent}>{`${basics.name} / ${basics.label}`.toUpperCase()}</p>
                {extras.portraitNote && <p className={s.mono}>{extras.portraitNote}</p>}
              </div>
            </figure>
          </div>
          <div className={`${s.box} ${s.terminal}`}>
            <p className={s.mono}>●&nbsp;●&nbsp;●&nbsp;&nbsp;&nbsp;{PROMPT}</p>
            <p className={s.termOutput}>{TERMINAL_LINES.join("\n")}</p>
            <div className={s.cursor} />
          </div>
        </header>

        {METRICS.length > 0 && (
          <div className={s.metrics}>
            {METRICS.map((m) => (
              <div key={m.label} className={`${s.box} ${s.metric}`}>
                <p className={s.metricValue}>{m.value}</p>
                <p className={s.mono}>{m.label}</p>
              </div>
            ))}
          </div>
        )}

        <section id="about" className={s.section}>
          <SectionHead label={sectionLabel("about")} title={sections.about.title} />
          <div className={s.bioGrid}>
            <div className={s.bio}>
              {basics.about.map((p) => (
                <p key={p} className={s.body}>
                  {p}
                </p>
              ))}
            </div>
            {PRINCIPLES.length > 0 && (
              <div className={`${s.box} ${s.principles}`}>
                {PRINCIPLES.map((p) => (
                  <p key={p} className={s.principle}>
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>

        {SKILLS.length > 0 && (
          <section id="stack" className={s.section}>
            <SectionHead label={sectionLabel("stack")} title={sections.stack.title} />
            <p className={`${s.body} ${s.sectionIntro}`}>{sections.stack.intro}</p>
            <div className={s.cardGrid}>
              {SKILLS.map((c) => (
                <CardView key={c.num} card={c} />
              ))}
            </div>
          </section>
        )}

        {TIMELINE.length + AWARDS.length > 0 && (
          <section id="experience" className={s.section}>
            <SectionHead label={sectionLabel("experience")} title={sections.experience.title} />
            <div className={s.timeline}>
              {TIMELINE.map((t) => (
                <div key={`${t.role}${t.date}`} className={`${s.box} ${s.row}`}>
                  <p className={s.date}>{t.date}</p>
                  <div className={s.roleDetails}>
                    <h3 className={s.h3}>{t.role}</h3>
                    {t.summary && <p className={s.body}>{t.summary}</p>}
                  </div>
                </div>
              ))}
              {AWARDS.map((a) => (
                <div key={a.title} className={`${s.box} ${s.credentials}`}>
                  <h3 className={s.h3}>{a.title}</h3>
                  {a.summary && <p className={s.body}>{a.summary}</p>}
                  {a.meta && <p className={s.mono}>{a.meta}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {PROJECTS.length > 0 && (
          <section id="projects" className={s.section}>
            <SectionHead label={sectionLabel("projects")} title={sections.projects.title} />
            {extras.projectsIntro && <p className={`${s.body} ${s.sectionIntro}`}>{extras.projectsIntro}</p>}
            <div className={s.projectGrid}>
              {PROJECTS.map((p) => (
                <article key={p.path} className={`${s.box} ${s.project}`}>
                  <div className={s.visual}>
                    <p className={s.mockLabel}>{p.path}</p>
                    <p className={s.mockCode}>{p.mock}</p>
                  </div>
                  {p.type && <p className={s.monoAccent}>{p.type}</p>}
                  <h3 className={s.h3}>{p.name}</h3>
                  <div className={s.projectDesc}>
                    <p className={s.body}>{p.description}</p>
                  </div>
                  {p.tags && <p className={s.mono}>{p.tags}</p>}
                  {(p.live || p.github) && (
                    <div className={s.projectActions}>
                      {p.live && (
                        <a className={`${s.btnPrimary} ${s.wLive}`} href={p.live}>
                          {sections.projects.live}
                        </a>
                      )}
                      {p.github && (
                        <a className={s.btnSecondary} href={p.github} target="_blank" rel="noopener">
                          {sections.projects.repo}
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
            {extras.projectsNote && <p className={s.mono}>{extras.projectsNote}</p>}
          </section>
        )}

        {USE_CASES.length > 0 && (
          <section className={s.section}>
            <SectionHead label={sectionLabel("useCases")} title={sections.useCases.title} />
            <div className={s.cardRow}>
              {USE_CASES.map((c) => (
                <div key={c.num} className={s.cardSlot}>
                  <CardView card={c} />
                </div>
              ))}
            </div>
          </section>
        )}

        {PROCESS.length > 0 && (
          <section className={s.section}>
            <SectionHead label={sectionLabel("process")} title={sections.process.title} />
            <div className={s.cardRowProcess}>
              {PROCESS.map((c) => (
                <div key={c.num} className={s.cardSlot}>
                  <CardView card={c} />
                </div>
              ))}
            </div>
          </section>
        )}

        {FAQ.length > 0 && (
          <section className={s.section}>
            <SectionHead label={sectionLabel("faq")} title={sections.faq.title} />
            {FAQ.map((f) => (
              <div key={f.q} className={`${s.box} ${s.faqItem}`}>
                <h3 className={s.h3}>{f.q}</h3>
                <p className={s.body}>{f.a}</p>
              </div>
            ))}
          </section>
        )}

        <section id="contact" className={s.section}>
          <SectionHead label={sectionLabel("contact")} title={sections.contact.title} />
          <p className={`${s.body} ${s.sectionIntro}`}>{sections.contact.intro}</p>
          <div className={s.contactLayout}>
            <div className={s.contactLinks}>
              {contact?.headline && <h3 className={s.h3}>{contact.headline}</h3>}
              {contact?.note && <p className={s.body}>{contact.note}</p>}
              <a className={`${s.btnPrimary} ${s.wEmail}`} href={`mailto:${basics.email}`}>
                {sections.contact.email}
              </a>
              {SOCIALS.map((l) => (
                <a key={l.href} className={s.link} href={l.href} target="_blank" rel="noopener">
                  {l.label}
                </a>
              ))}
            </div>
            <div className={`${s.box} ${s.formPanel}`}>
              <ContactForm email={basics.email} budgets={contact?.budgets ?? []} labels={site.form} />
            </div>
          </div>
        </section>

        <footer className={s.footer}>
          <p className={s.mono}>{copyright.toUpperCase()}</p>
          <a className={s.link} href="#top">
            {site.footer.top}
          </a>
        </footer>
      </div>
    </div>
  );
}
