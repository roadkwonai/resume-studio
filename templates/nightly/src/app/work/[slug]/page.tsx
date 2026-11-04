import { notFound } from "next/navigation";
import { pageTitle, projects, site } from "@/components/sites/nightly/data";
import { ProjectPage } from "@/components/sites/nightly/Pages";

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? pageTitle(p.name) : site.nav.work };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!projects.some((p) => p.slug === slug)) notFound();
  return <ProjectPage slug={slug} />;
}
