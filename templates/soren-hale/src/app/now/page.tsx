import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { Now } from "@/components/sites/sorenhale/Now";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { extras, live, site, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.nowTitle, description: ui.meta.nowDescription };

export default function Page() {
  if (!live("/now")) notFound();
  return (
    <main>
      <PageHero eyebrow={ui.nowPage.eyebrow} heading={ui.nowPage.heading} lead={ui.nowPage.lead} commit={extras.commits?.now} />
      <Now status={site.status} />
      <Cta />
    </main>
  );
}
