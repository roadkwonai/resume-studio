import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, pageTitle, site } from "@/components/sites/nightly/data";
import { ServicesPage } from "@/components/sites/nightly/Pages";

export const metadata: Metadata = { title: pageTitle(site.nav.services) };
export default function Page() {
  if (!services.length) notFound();
  return <ServicesPage />;
}
