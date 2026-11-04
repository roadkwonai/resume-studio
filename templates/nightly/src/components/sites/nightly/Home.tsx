import Link from "next/link";
import { extras, initials, movedProject, place, posts, profile, projects, screensProject, services, servicesLead, site, testimonials } from "./data";
import { Hero } from "./Hero";
import { Rail } from "./Rail";
import { AboutStatement, Breakpoints, KindWords, Moved, Pushes, ServiceBranches } from "./Scenes";
import { PostList, ProjectRows } from "./Rows";
import { Arrow, Cover, Cta, CtaRow } from "./ui";
import s from "./nl.module.css";

export function Home() {
  const { basics } = profile;
  const t = site.home;
  const story = extras.homeStory ?? basics.about.slice(0, 2);
  const facts = [
    [t.basedIn, place],
    [t.workingAs, extras.workingAs ?? basics.label],
    [t.takingOn, extras.takingOn],
    [t.nextFree, basics.availability],
  ].filter(([, v]) => v);
  return (
    <div className={s.homeShift}>
      <Rail />
      <Hero />
      <section className={s.aboutSec} data-ng-ship>
        <p className={s.label}>{t.about}</p>
        <AboutStatement />
      </section>
      <div className={s.photoBox}>
        <Cover src={basics.aboutImage ?? basics.photo} alt={basics.aboutImageAlt ?? basics.photoAlt ?? ""} name={initials} width={2400} height={1603} sizes="1329px" />
        <Pushes />
      </div>
      <div className={s.story}>
        {story.map((p) => (
          <p key={p} className={s.body}>{p}</p>
        ))}
        <div className={s.factsRow}>
          {facts.map(([k, v]) => (
            <div key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
      </div>
      {screensProject ? (
        <>
          <div className={s.bpGap} />
          <Breakpoints project={screensProject} heading={[t.bpLead, t.bpRest]} />
        </>
      ) : null}
      {projects.length ? (
        <section className={s.secPad} data-ng-ship>
          <h2 className={s.h2} style={{ maxWidth: 1000 }}>
            {t.selectedLead} <span className={s.dim}>{t.selectedRest}</span>
          </h2>
          <div style={{ height: 56 }} />
          <ProjectRows />
          <div className={s.moreBtn}>
            <Link href="/work" className={`${s.btn} ${s.btnGhost}`}>
              {t.allProjects} <Arrow />
            </Link>
          </div>
        </section>
      ) : null}
      {services.length ? (
        <section className={s.secPad} data-ng-ship>
          <h2 className={s.h2}>
            {servicesLead} <span className={s.dim}>{t.servicesRest}</span>
          </h2>
          <ServiceBranches />
        </section>
      ) : null}
      {posts.length ? (
        <section className={s.wrSec} data-ng-ship>
          <p className={s.label}>{t.writing}</p>
          <PostList />
        </section>
      ) : null}
      {testimonials.length ? (
        <section className={`${s.wrSec} ${s.wrKind}`} data-ng-ship>
          <p className={s.label}>{t.kindWords}</p>
          <KindWords />
        </section>
      ) : null}
      <div className={s.movedGap} />
      {movedProject ? (
        <>
          <Moved project={movedProject} />
          <section className={s.contactSec} data-ng-ship>
            <CtaRow />
          </section>
        </>
      ) : (
        <div data-ng-ship>
          <Cta />
        </div>
      )}
    </div>
  );
}
