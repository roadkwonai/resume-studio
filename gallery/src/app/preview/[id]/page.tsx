import { Suspense } from "react";
import { notFound } from "next/navigation";
import { byId, templates } from "@/templates";
import { Preview } from "./Preview";

export const generateStaticParams = () => templates.map((t) => ({ id: t.id }));

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = byId(id);
  if (!template) notFound();
  return (
    <Suspense>
      <Preview template={template} templates={templates} />
    </Suspense>
  );
}
