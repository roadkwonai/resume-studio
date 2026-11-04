import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sites/sawad/Contact";
import { tools, site, siteTitle } from "@/components/sites/sawad/data";
import { Tools } from "@/components/sites/sawad/Sections";
import s from "@/components/sites/sawad/sawad.module.css";

export const metadata: Metadata = { title: `${siteTitle} | ${site.nav.tools}` };

export default function Page() {
  if (!tools.length) notFound();
  return (
    <div className={s.sub}>
      <Tools lead />
      <Contact />
    </div>
  );
}
