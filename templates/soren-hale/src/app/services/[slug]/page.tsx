import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Service } from "@/components/sites/sorenhale/Service";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { fill, services, ui } from "@/components/sites/sorenhale/data";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: fill(ui.meta.serviceTitle, { title: s.name }), description: s.tagline || s.summary } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!services.some((s) => s.slug === slug)) notFound();
  return (
    <main>
      <Service slug={slug} />
      <Cta />
    </main>
  );
}
