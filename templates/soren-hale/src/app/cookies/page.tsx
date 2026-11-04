import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Legal } from "@/components/sites/sorenhale/Legal";
import { live, ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.cookiesTitle, description: ui.meta.cookiesDescription };

export default function Page() {
  if (!live("/cookies")) notFound();
  return (
    <main>
      <Legal doc="cookies" />
    </main>
  );
}
