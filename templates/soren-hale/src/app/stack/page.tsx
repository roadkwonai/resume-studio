import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { StackPage } from "@/components/sites/sorenhale/StackPage";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { counted, extras, live, stackItems, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.stackTitle, description: ui.meta.stackDescription };

export default function Page() {
  if (!live("/stack")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.stackPage.eyebrow}
        heading={counted(ui.stackPage.heading, stackItems.length)}
        lead={ui.stackPage.lead}
        buttons={live("/uses") ? [{ label: ui.stackPage.uses, href: "/uses" }] : []}
        commit={extras.commits?.stack}
      />
      <StackPage />
      <Cta />
    </main>
  );
}
