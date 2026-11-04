import type { Metadata } from "next";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { AboutPage } from "@/components/sites/sorenhale/AboutPage";
import { Reviews } from "@/components/sites/sorenhale/Reviews";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { accent, extras, site, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.aboutTitle, description: ui.meta.aboutDescription };

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow={ui.about.eyebrow}
        heading={ui.aboutPage.heading || accent(site.headline)}
        lead={ui.aboutPage.lead || site.intro}
        buttons={[{ label: ui.aboutPage.start, href: "/contact", kind: "solid", icon: "arrow" }, { label: ui.aboutPage.resume, href: "/resume" }]}
        facts={(extras.facts?.about ?? site.metrics).map((f) => [f.label, f.value])}
      />
      <AboutPage />
      <Reviews />
      <Cta />
    </main>
  );
}
