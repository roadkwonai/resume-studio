import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sites/sorenhale/PageHero";
import { WritingList } from "@/components/sites/sorenhale/WritingList";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { extras, live, posts, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.writingTitle, description: ui.meta.writingDescription };

export default function Page() {
  if (!live("/writing")) notFound();
  return (
    <main>
      <PageHero
        eyebrow={ui.writingPage.eyebrow}
        heading={ui.writingPage.heading}
        lead={ui.writingPage.lead}
        facts={[[ui.writingPage.articles, String(posts.length)], ...(extras.facts?.writing ?? []).map((f): [string, string] => [f.label, f.value])]}
      />
      <WritingList />
      <Cta />
    </main>
  );
}
