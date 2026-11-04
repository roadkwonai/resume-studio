import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { Faq } from "@/components/sites/sorenhale/Faq";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { counted, faqs, live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.faqTitle, description: ui.meta.faqDescription };

export default function Page() {
  if (!live("/faq")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.faqPage.eyebrow}
        heading={ui.faqPage.heading}
        lead={counted(ui.faqPage.lead, faqs.length)}
        buttons={[{ label: ui.faqPage.button, href: "/contact" }]}
      />
      <Faq openOnPhone eyebrow="" heading="" lead="" />
      <Cta />
    </main>
  );
}
