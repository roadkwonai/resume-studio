import { notFound } from "next/navigation";
import { pageTitle, services, site } from "@/components/sites/nightly/data";
import { ServiceDetail } from "@/components/sites/nightly/Pages";

export const dynamicParams = false;
export const generateStaticParams = () => services.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = services.find((x) => x.slug === slug);
  return { title: p ? pageTitle(p.name) : site.nav.services };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some((p) => p.slug === slug)) notFound();
  return <ServiceDetail slug={slug} />;
}
