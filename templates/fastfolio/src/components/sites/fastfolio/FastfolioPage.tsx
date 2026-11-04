import { initialsOf, period } from "@/lib/profile";
import { avatar, contactHref, extras, navLinks, profile, projects, site, skills, socials, testimonials, ticker, work } from "./data";
import { hasSocialIcon, Quote, Social } from "./Icons";
import { Job, MobileMenu, SmoothScroll } from "./Interactive";
import { Roll } from "./Roll";

const { basics, contact, locale } = profile;
const year = new Date().getFullYear();

function Head({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <header className="ff-head">
      <p className="ff-tag">{tag}</p>
      <h2>{title}</h2>
      <p>{sub}</p>
    </header>
  );
}

function Brand() {
  return (
    <a className="ff-brand" href="#top">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {avatar ? <img src={avatar} alt="" width={40} height={40} /> : <span className="ff-initials">{initialsOf(profile)}</span>}
      <h6>{basics.name}</h6>
    </a>
  );
}

function Icons({ repeat }: { repeat: number }) {
  return Array.from({ length: repeat }, (_, round) =>
    ticker.map((skill) => (
      <li key={`${round}-${skill.name}`} aria-hidden={round > 0 || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={skill.icon} alt={round ? "" : skill.name} width={48} height={43} />
      </li>
    )),
  );
}

function Voice({ item }: { item: (typeof testimonials)[number] }) {
  const role = [item.role, item.company].filter(Boolean).join(", ");
  return (
    <figure className="ff-voice">
      <figcaption>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item.avatar ? <img src={item.avatar} alt="" width={48} height={48} /> : null}
        <span>
          <strong>{item.name}</strong>
          {role ? <small>{role}</small> : null}
        </span>
        <Quote />
      </figcaption>
      <blockquote>{item.quote}</blockquote>
    </figure>
  );
}

function Row({ items, reverse }: { items: typeof testimonials; reverse?: boolean }) {
  // A set must be wider than the belt, or few testimonials leave a gap as it loops.
  const filled = Array.from({ length: Math.ceil(3 / items.length) }, () => items).flat();
  return (
    <div className="ff-belt">
      <div className="ff-belt-track" data-reverse={reverse ? "" : undefined}>
        {[0, 1].map((round) => (
          <div key={round} className="ff-belt-set" aria-hidden={round > 0 || undefined}>
            {filled.map((item, index) => (
              <Voice key={index} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FastfolioPage() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <div id="top" className="ff">
      <SmoothScroll />
      <nav className="ff-nav">
        <div className="ff-wrap">
          <Brand />
          <div className="ff-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                <span className="ff-roll" data-text={link.label}>
                  <span>{link.label}</span>
                </span>
              </a>
            ))}
            <Roll href={contactHref} label={site.nav.contact} solid arrow small />
          </div>
          <MobileMenu links={navLinks} contact={contactHref} openLabel={site.nav.menu} closeLabel={site.nav.close} contactLabel={site.nav.contact} />
        </div>
      </nav>

      <main>
        <section className="ff-hero">
          <div className="ff-wrap">
            <div className="ff-intro">
              {basics.availability ? (
                <p className="ff-status">
                  <i />
                  {basics.availability}
                </p>
              ) : null}
              <h1>{basics.headline}</h1>
              <p className="ff-lead">{basics.summary}</p>
              <div className="ff-actions">
                {projects.length ? <Roll href="#projects" label={site.hero.works} /> : null}
                <Roll href={contactHref} label={site.nav.contact} solid arrow />
              </div>
              {ticker.length ? (
                <div className="ff-icons">
                  <ul>
                    <Icons repeat={4} />
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="ff-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {basics.photo ? <img src={basics.photo} alt={basics.photoAlt ?? basics.name} /> : <span>{initialsOf(profile)}</span>}
            </div>
          </div>
        </section>

        {skills.length ? (
          <section id="skills" className="ff-band">
            <Head {...site.skills} />
            <ul className="ff-pills">
              {skills.map((skill) => (
                <li key={skill.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {skill.icon ? <img src={skill.icon} alt="" width={28} height={21} /> : null}
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {projects.length ? (
          <section id="projects" className="ff-plain">
            <Head {...site.projects} />
            <div className="ff-projects">
              {projects.map((project) => (
                <article key={project.slug} className="ff-project">
                  <div className="ff-shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {project.image ? <img src={project.image} alt={project.imageAlt ?? project.name} /> : <span>{project.name}</span>}
                  </div>
                  <div className="ff-detail">
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    {project.repo || project.url ? (
                      <div className="ff-actions">
                        {project.repo ? <Roll href={project.repo} label={site.projects.source} small /> : null}
                        {project.url ? <Roll href={project.url} label={site.projects.live} solid arrow small /> : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {work.length ? (
          <section id="experience" className="ff-band">
            <Head {...site.experience} />
            <div className="ff-jobs">
              {work.map((job, index) => (
                <Job
                  key={`${job.company}-${job.start}`}
                  title={`${job.position} — ${job.company}`}
                  period={period(job.start, job.end, locale)}
                  items={job.highlights?.length ? job.highlights : job.summary ? [job.summary] : []}
                  open={index === 0}
                  toggle={site.experience.toggle}
                />
              ))}
            </div>
            {basics.resumeFile ? (
              <div className="ff-center">
                <Roll href={basics.resumeFile} label={site.experience.cv} solid arrow download={basics.resumeFile.startsWith("/")} />
              </div>
            ) : null}
          </section>
        ) : null}

        {testimonials.length ? (
          <section id="testimonials" className="ff-plain ff-voices">
            <Head {...site.testimonials} />
            <div className="ff-belts">
              <Row items={testimonials.slice(0, half)} />
              {testimonials.length > 1 ? <Row items={testimonials.slice(half)} reverse /> : null}
            </div>
            <div className="ff-voice-list">
              {testimonials.map((item) => (
                <Voice key={item.name} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <section className="ff-cta">
        <div className="ff-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {extras.ctaImage ? <img src={extras.ctaImage} alt="" /> : null}
          <div>
            <h2>{contact?.headline ?? site.contact.headline}</h2>
            {contact?.note ? <p>{contact.note}</p> : null}
            <Roll href={contactHref} label={site.nav.contact} solid arrow />
          </div>
        </div>
      </section>

      <footer className="ff-foot">
        <div className="ff-wrap">
          <div>
            <Brand />
            {basics.about[0] ? <p>{basics.about[0]}</p> : null}
            <div className="ff-socials">
              {socials.filter((link) => hasSocialIcon(link.network)).map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer" aria-label={link.network}>
                  <Social network={link.network} />
                </a>
              ))}
            </div>
          </div>
          <nav>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                <span className="ff-roll" data-text={link.label}>
                  <span>{link.label}</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
        <p className="ff-copy">{site.footer.copyright.replace("{year}", String(year))}</p>
      </footer>
    </div>
  );
}
