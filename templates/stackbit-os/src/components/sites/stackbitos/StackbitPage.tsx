import Image from "next/image";
import { ArrowUpRight, GitPullRequest, MessageSquareCode, Star } from "lucide-react";
import {
  INITIALS,
  OS_LABEL,
  codeSample,
  contactLinks,
  extras,
  metrics,
  openSourceStats,
  principles,
  principlesPerColumn,
  profile,
  profileFacts,
  projects,
  repositories,
  sectionLabel,
  sectionNumber,
  site,
  skillLevel,
  skillPanels,
  techGroups,
  visibleSections,
} from "./data";
import type { SectionKey } from "./data";
import { CodeTyper, Globe, GridBackground, LedMatrix, LetterGlitch, ParticleShape, RollingNumber } from "./effects";
import { ContactForm, ExperienceList, Header, Preloader } from "./interactive";
import styles from "./stackbit.module.css";

const ROW_GLITCH = ["rgb(171, 171, 171)", "rgba(34, 163, 41, 0.2)", "rgba(80, 117, 32, 0.2)"];
const IMAGE_GLITCH = ["rgb(161, 161, 161)", "rgba(101, 201, 151, 0.5)", "rgb(59, 191, 79)"];
const BAR_CELLS = 19;
const BUILD_YEAR = new Date().getFullYear();
const BARCODE_WIDTHS = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 3, 1, 2];
const BARCODE_BARS = Array.from({ length: 110 }, (_, index) => BARCODE_WIDTHS[index % BARCODE_WIDTHS.length]).reduce<
  { x: number; bars: [number, number][] }
>(
  ({ x, bars }, width, index) => ({ x: x + width, bars: index % 2 === 0 ? [...bars, [x, width]] : bars }),
  { x: 0, bars: [] },
).bars;

function Frame({
  section,
  aside,
  className,
  children,
}: {
  section?: SectionKey;
  aside?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={section && String(sectionNumber(section))} className={className ? `${styles.frame} ${className}` : styles.frame}>
      <i className={styles.cornerTL} />
      <i className={styles.cornerTR} />
      <i className={styles.cornerBL} />
      <i className={styles.cornerBR} />
      {section && (
        <div className={styles.frameHead}>
          <p className={styles.tag}>[ {sectionLabel(section)} ]</p>
          {aside && <p className={styles.frameAside}>{aside}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Barcode() {
  return (
    <svg className={styles.barcode} viewBox="0 0 186 20" preserveAspectRatio="none" aria-hidden="true">
      {BARCODE_BARS.map(([x, width]) => (
        <rect key={x} x={x} width={width} height="20" fill="currentColor" />
      ))}
    </svg>
  );
}

function DeveloperProfile() {
  const { name, label, photo, photoAlt } = profile.basics;
  return (
    <Frame section="profile" className={styles.profile}>
      <div className={styles.portrait}>
        {photo ? (
          <Image src={photo} alt={photoAlt ?? name} fill sizes="(max-width: 809px) 100vw, 500px" preload />
        ) : (
          <span className={styles.portraitInitials} aria-hidden="true">
            {INITIALS}
          </span>
        )}
        <LetterGlitch colors={IMAGE_GLITCH} />
        <div className={styles.scanlines} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <i className={styles.cornerTL} />
        <i className={styles.cornerTR} />
      </div>
      <div className={styles.identity}>
        <h1>{name.toUpperCase()}</h1>
        <Barcode />
      </div>
      <p className={styles.role}>{label.toUpperCase()}</p>
      <dl className={styles.facts}>
        {profileFacts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd className={fact.accent ? styles.accent : undefined}>{fact.value}</dd>
          </div>
        ))}
        <div>
          <dt>{site.profile.status}</dt>
          <dd className={styles.accent}>
            <i className={styles.pulse} />
            {site.profile.online}
          </dd>
        </div>
      </dl>
    </Frame>
  );
}

function HeroColumn() {
  return (
    <div className={styles.heroColumn}>
      <Frame section="bio" className={styles.bio}>
        <h2>{profile.basics.headline}</h2>
        {profile.basics.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {extras.quote && <p className={styles.quote}>{extras.quote}</p>}
      </Frame>
      {visibleSections.principles && (
        <Frame section="principles">
          <div className={styles.principles}>
            {principles.map((column, columnIndex) => (
              <ol key={columnIndex}>
                {column.map((item, index) => (
                  <li key={item} className={styles.principle}>
                    <LetterGlitch colors={ROW_GLITCH} />
                    <i />
                    <span>{item}</span>
                    <b>{String(columnIndex * principlesPerColumn + index + 1).padStart(2, "0")}</b>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </Frame>
      )}
      {visibleSections.performance && (
        <Frame section="performance" className={styles.performance}>
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <div key={metric.label}>
                <RollingNumber value={metric.value} className={styles.metricValue} />
                <p>{metric.label}</p>
              </div>
            ))}
          </div>
          <ParticleShape />
        </Frame>
      )}
    </div>
  );
}

function TechStack() {
  return (
    <section className={`${styles.section} ${styles.techSection}`}>
      <Frame section="tech">
        {techGroups.length > 0 && (
          <div className={styles.techColumns}>
            {techGroups.map((group) => (
              <div key={group.group}>
                <div className={styles.techHead}>
                  <h3>{group.group}</h3>
                  <span>{site.tech.items.replace("{n}", String(group.items.length))}</span>
                </div>
                <ul className={styles.techGrid}>
                  {group.items.map((item) => {
                    const level = skillLevel(item);
                    return (
                      <li key={item.name} className={styles.techCard}>
                        <LetterGlitch colors={ROW_GLITCH} />
                        <div className={styles.techName}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG logo */}
                          {item.icon && <img src={item.icon} alt="" width={24} height={24} />}
                          <span>{item.name}</span>
                        </div>
                        {level && <p>{level}</p>}
                        {item.progress !== undefined && (
                          <div className={styles.bar} role="img" aria-label={`${item.progress}%`}>
                            {Array.from({ length: BAR_CELLS }, (_, index) => (
                              <i
                                key={index}
                                className={index < Math.round(((item.progress ?? 0) / 100) * BAR_CELLS) ? styles.barOn : undefined}
                              />
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
        {skillPanels.length > 0 && (
          <div className={styles.skillPanels}>
            {skillPanels.map((panel) => (
              <div key={panel.group} className={styles.skillPanel}>
                <h3>{panel.group}</h3>
                <ul>
                  {panel.items.map((item) => (
                    <li key={item.name} className={styles.badge}>
                      <LetterGlitch colors={ROW_GLITCH} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Frame>
    </section>
  );
}

function OutLink({ href, label }: { href: string; label: string }) {
  return (
    <a className={styles.outLink} href={href} target="_blank" rel="noopener noreferrer">
      {label}
      <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

function Projects() {
  return (
    <section className={styles.section}>
      <Frame section="projects" aside={site.asides.projects}>
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.projectCard}>
              <div className={styles.projectImage}>
                {project.image ? (
                  <Image src={project.image} alt={project.imageAlt ?? ""} fill sizes="(max-width: 809px) 100vw, 50vw" />
                ) : (
                  <span className={styles.projectFallback} aria-hidden="true">
                    {project.name}
                  </span>
                )}
              </div>
              <div className={styles.projectTitle}>
                <h3>{project.name}</h3>
                {project.date && <span>{project.date}</span>}
              </div>
              <p className={styles.projectBody}>{project.summary}</p>
              {project.tags && project.tags.length > 0 && (
                <ul className={styles.tags}>
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.badge}>
                      <LetterGlitch colors={ROW_GLITCH} />
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              )}
              {project.links.length > 0 && (
                <div className={styles.projectLinks}>
                  {project.links.map((link) => (
                    <OutLink key={link.label} {...link} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Frame>
    </section>
  );
}

function OpenSource() {
  return (
    <section className={styles.section}>
      <Frame section="openSource" aside={site.asides.openSource}>
        {openSourceStats.length > 0 && (
          <div className={styles.stats}>
            {openSourceStats.map((stat) => (
              <div key={stat.label}>
                <RollingNumber value={stat.value} className={styles.statValue} />
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        <div className={styles.contribution}>
          <p className={styles.tag}>[ {site.openSource.map} ]</p>
          <LedMatrix />
        </div>
        {repositories.length > 0 && (
          <div className={styles.repoGrid}>
            {repositories.map((repo) => (
              <article key={repo.name} className={styles.repoCard}>
                <div className={styles.repoHead}>
                  <GithubIcon />
                  <h3>{repo.name}</h3>
                  {(repo.stars || repo.pulls) && (
                    <span className={styles.repoCounts}>
                      {repo.stars && <Star size={16} strokeWidth={1.5} aria-label={site.openSource.stars} />}
                      {repo.stars}
                      {repo.pulls && <GitPullRequest size={16} strokeWidth={1.5} aria-label={site.openSource.pulls} />}
                      {repo.pulls}
                    </span>
                  )}
                </div>
                <p>{repo.summary}</p>
                {repo.url && <OutLink href={repo.url} label={site.openSource.viewRepo} />}
              </article>
            ))}
          </div>
        )}
      </Frame>
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.section}>
      <Frame section="contact" aside={profile.contact?.headline}>
        <div className={styles.contactGrid}>
          <div className={styles.contactPanel}>
            {profile.contact?.note && <p>{profile.contact.note}</p>}
            {profile.basics.availability && <p>{profile.basics.availability}</p>}
            <ul className={styles.contactLinks}>
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <span>{link.label}</span>
                  <a href={link.href} target={link.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {link.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contactPanel}>
            <h3 className={styles.formTitle}>
              <MessageSquareCode size={24} strokeWidth={1.5} aria-hidden="true" />
              {site.contact.formTitle}
            </h3>
            <ContactForm>
              <div className={styles.globe}>
                <Globe marker={extras.globeMarker} />
              </div>
            </ContactForm>
          </div>
        </div>
      </Frame>
    </section>
  );
}

export function StackbitPage() {
  return (
    <div className={styles.page}>
      <Preloader />
      <GridBackground />
      <Header badge={`${INITIALS.toUpperCase()}-${BUILD_YEAR}-001`} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <DeveloperProfile />
          <HeroColumn />
        </section>
        {visibleSections.tech && <TechStack />}
        {visibleSections.experience && (
          <section className={styles.section}>
            <Frame section="experience" aside={site.asides.experience}>
              <ExperienceList />
            </Frame>
          </section>
        )}
        {visibleSections.projects && <Projects />}
        {visibleSections.openSource && <OpenSource />}
        <section className={styles.section}>
          <Frame className={styles.code}>
            <CodeTyper code={codeSample} label={site.code.label} />
          </Frame>
        </section>
        <Contact />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>
            © {BUILD_YEAR} {profile.basics.name.toUpperCase()} · {OS_LABEL} OS {site.boot.version.toUpperCase()}
          </p>
          <div className={styles.footerStatus}>
            {site.footer.statuses.map((status) => (
              <span key={status}>
                <i className={styles.pulse} />
                {status}
              </span>
            ))}
            <a href="#1">{site.footer.top}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
