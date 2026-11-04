import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { Uses } from "@/components/sites/sorenhale/Uses";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.usesTitle, description: ui.meta.usesDescription };

export default function Page() {
  if (!live("/uses")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.usesPage.eyebrow}
        heading={ui.usesPage.heading}
        lead={ui.usesPage.lead}
        buttons={live("/stack") ? [{ label: ui.usesPage.stack, href: "/stack" }] : []}
      />
      <Uses />
      <Cta />
    </main>
  );
}
