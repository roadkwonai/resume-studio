import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sites/sawad/Contact";
import { jobs, site, siteTitle } from "@/components/sites/sawad/data";
import { Experience } from "@/components/sites/sawad/Sections";
import s from "@/components/sites/sawad/sawad.module.css";

export const metadata: Metadata = { title: `${siteTitle} | ${site.nav.experience}` };

export default function Page() {
  if (!jobs.length) notFound();
  return (
    <div className={s.sub}>
      <Experience lead />
      <Contact />
    </div>
  );
}
