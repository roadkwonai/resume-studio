import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, pageTitle, site } from "@/components/sites/nightly/data";
import { WritingPage } from "@/components/sites/nightly/Pages";

export const metadata: Metadata = { title: pageTitle(site.nav.writing) };
export default function Page() {
  if (!posts.length) notFound();
  return <WritingPage />;
}
