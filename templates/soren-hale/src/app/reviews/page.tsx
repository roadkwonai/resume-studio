import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { Reviews } from "@/components/sites/sorenhale/Reviews";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { counted, live, reviews, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.reviewsTitle, description: ui.meta.reviewsDescription };

export default function Page() {
  if (!live("/reviews")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.reviewsPage.eyebrow}
        heading={ui.reviewsPage.heading}
        lead={counted(ui.reviewsPage.lead, reviews.length)}
        buttons={live("/work") ? [{ label: ui.reviewsPage.button, href: "/work" }] : []}
      />
      <Reviews eyebrow="" heading="" lead="" />
      <Cta />
    </main>
  );
}
