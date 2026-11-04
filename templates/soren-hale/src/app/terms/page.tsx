import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/sites/sorenhale/Legal";
import { live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.termsTitle, description: ui.meta.termsDescription };

export default function Page() {
  if (!live("/terms")) notFound();
  return (
    <main>
      <Legal doc="terms" />
    </main>
  );
}
