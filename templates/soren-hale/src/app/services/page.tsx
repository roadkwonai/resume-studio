import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { ServiceList } from "@/components/sites/sorenhale/ServiceList";
import { Reviews } from "@/components/sites/sorenhale/Reviews";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { counted, extras, live, services, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.servicesTitle, description: ui.meta.servicesDescription };

export default function Page() {
  if (!live("/services")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.servicesPage.eyebrow}
        heading={counted(ui.servicesPage.heading, services.length)}
        lead={ui.servicesPage.lead}
        buttons={live("/process") ? [{ label: ui.servicesPage.howItRuns, href: "/process", kind: "ghost", icon: "none" }] : []}
        facts={[[ui.servicesPage.count, String(services.length)], ...(extras.facts?.services ?? []).map((f): [string, string] => [f.label, f.value])]}
      />
      <ServiceList />
      <Reviews />
      <Cta />
    </main>
  );
}
