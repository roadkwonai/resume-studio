import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sites/sawad/Contact";
import { postDate, posts, siteTitle } from "@/components/sites/sawad/data";
import { renderMarkdown } from "@/components/sites/sawad/markdown";
import s from "@/components/sites/sawad/sawad.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post ? `${post.title} - ${siteTitle}` : siteTitle };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <div className={`${s.sub} ${s.postPage}`}>
      <article>
        {post.image && (
          <Image className={s.cover} src={post.image} alt={post.imageAlt ?? post.title} width={696} height={460} sizes="696px" priority />
        )}
        <div className={s.postMeta}>
          <p>{postDate(post.date)}</p>
          {post.readingTime && <p>{post.readingTime}</p>}
        </div>
        <h1 className={s.postTitle}>{post.title}</h1>
        <div className={s.prose} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      </article>
      <Contact />
    </div>
  );
}
