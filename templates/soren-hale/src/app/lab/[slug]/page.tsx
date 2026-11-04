import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabItem } from "@/components/sites/sorenhale/LabItem";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { fill, labItems, ui } from "@/components/sites/sorenhale/data";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => labItems.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = labItems.find((x) => x.slug === slug);
  return p ? { title: fill(ui.meta.labItemTitle, { title: p.name }), description: p.summary } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!labItems.some((x) => x.slug === slug)) notFound();
  return (
    <main>
      <LabItem slug={slug} />
      <Cta />
    </main>
  );
}
