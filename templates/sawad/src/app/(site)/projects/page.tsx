import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sites/sawad/Contact";
import { projects, site, siteTitle } from "@/components/sites/sawad/data";
import { Projects } from "@/components/sites/sawad/Sections";
import s from "@/components/sites/sawad/sawad.module.css";

export const metadata: Metadata = { title: `${siteTitle} | ${site.nav.projects}` };

export default function Page() {
  if (!projects.length) notFound();
  return (
    <div className={s.sub}>
      <Projects lead />
      <Contact />
    </div>
  );
}
