import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { LabIndex } from "@/components/sites/sorenhale/LabIndex";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { labItems, labStats, live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.labTitle, description: ui.meta.labDescription };

export default function Page() {
  if (!live("/lab")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.labPage.eyebrow}
        heading={ui.labPage.heading}
        lead={ui.labPage.lead}
        facts={labStats.length ? labStats.map((f) => [f.label, f.value]) : [[ui.labPage.projects, String(labItems.length)]]}
      />
      <LabIndex />
      <Cta />
    </main>
  );
}
