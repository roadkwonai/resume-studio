import type { Metadata } from "next";
import { pageTitle, site } from "@/components/sites/nightly/data";
import { AboutPage } from "@/components/sites/nightly/Pages";

export const metadata: Metadata = { title: pageTitle(site.nav.about) };
export default function Page() {
  return <AboutPage />;
}
