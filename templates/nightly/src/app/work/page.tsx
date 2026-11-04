import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, pageTitle, site } from "@/components/sites/nightly/data";
import { WorkPage } from "@/components/sites/nightly/Pages";

export const metadata: Metadata = { title: pageTitle(site.nav.work) };
export default function Page() {
  if (!projects.length) notFound();
  return <WorkPage />;
}
