import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Post } from "@/components/sites/sorenhale/Post";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { fill, posts, ui } from "@/components/sites/sorenhale/data";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return p ? { title: fill(ui.meta.postTitle, { title: p.title }), description: p.excerpt } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!posts.some((x) => x.slug === slug)) notFound();
  return (
    <main>
      <Post slug={slug} />
      <Cta />
    </main>
  );
}
