import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Case } from "@/components/sites/sorenhale/Case";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { fill, projects, ui } from "@/components/sites/sorenhale/data";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: fill(ui.meta.caseTitle, { title: p.title }), description: p.summary } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!projects.some((x) => x.slug === slug)) notFound();
  return (
    <main>
      <Case slug={slug} />
      <Cta />
    </main>
  );
}
