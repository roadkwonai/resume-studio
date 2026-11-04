import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sites/sawad/Contact";
import { posts, site, siteTitle } from "@/components/sites/sawad/data";
import { Blog } from "@/components/sites/sawad/Sections";
import s from "@/components/sites/sawad/sawad.module.css";

export const metadata: Metadata = { title: `${siteTitle} | ${site.nav.blog}` };

export default function Page() {
  if (!posts.length) notFound();
  return (
    <div className={s.sub}>
      <Blog lead />
      <Contact />
    </div>
  );
}
