import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { Process } from "@/components/sites/sorenhale/Process";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { Faq } from "@/components/sites/sorenhale/Faq";
import { live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.processTitle, description: ui.meta.processDescription };

export default function Page() {
  if (!live("/process")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.processPage.eyebrow}
        heading={ui.processPage.heading}
        lead={ui.processPage.lead}
        buttons={[
          { label: ui.processPage.start, href: "/contact", kind: "solid", icon: "arrow" },
          ...(live("/services") ? [{ label: ui.processPage.services, href: "/services" }] : []),
        ]}
      />
      <Process />
      <Faq heading={ui.faq.processHeading} lead="" limit={4} />
      <Cta />
    </main>
  );
}
