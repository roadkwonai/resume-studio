import { notFound } from "next/navigation";
import { legalOn, site } from "@/components/sites/nightly/data";
import { LegalPage } from "@/components/sites/nightly/Pages";

const DOCS: Record<string, { title: string; sections: string[][] }> = site.legal.docs;

export const dynamicParams = false;
export const generateStaticParams = () => (legalOn ? Object.keys(DOCS).map((slug) => ({ slug })) : []);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const d = DOCS[(await params).slug];
  if (!d || !legalOn) notFound();
  return <LegalPage {...d} />;
}
