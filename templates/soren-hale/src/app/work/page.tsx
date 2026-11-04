import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { WorkIndex } from "@/components/sites/sorenhale/WorkIndex";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { counted, extras, live, projects, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.workTitle, description: ui.meta.workDescription };

export default function Page() {
  if (!live("/work")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.workPage.eyebrow}
        heading={counted(ui.workPage.heading, projects.length)}
        lead={ui.workPage.lead}
        facts={[[ui.workPage.cases, String(projects.length)], ...(extras.facts?.work ?? []).map((f): [string, string] => [f.label, f.value])]}
      />
      <WorkIndex />
      <Cta />
    </main>
  );
}
