import { notFound } from "next/navigation";
import { pageTitle, posts, site } from "@/components/sites/nightly/data";
import { PostPage } from "@/components/sites/nightly/Pages";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return { title: p ? pageTitle(p.title) : site.nav.writing };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!posts.some((p) => p.slug === slug)) notFound();
  return <PostPage slug={slug} />;
}
