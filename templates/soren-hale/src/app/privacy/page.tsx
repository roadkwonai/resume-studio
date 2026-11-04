import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/sites/sorenhale/Legal";
import { live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.privacyTitle, description: ui.meta.privacyDescription };

export default function Page() {
  if (!live("/privacy")) notFound();
  return (
    <main>
      <Legal doc="privacy" />
    </main>
  );
}
