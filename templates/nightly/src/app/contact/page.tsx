import type { Metadata } from "next";
import { pageTitle, site } from "@/components/sites/nightly/data";
import { ContactPage } from "@/components/sites/nightly/Pages";

export const metadata: Metadata = { title: pageTitle(site.nav.contact) };
export default function Page() {
  return <ContactPage />;
}
