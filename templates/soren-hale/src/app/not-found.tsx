import type { Metadata } from "next";
import { NotFound } from "@/components/sites/sorenhale/NotFound";
import { ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.notFoundTitle, description: ui.meta.notFoundDescription };

export default function Page() {
  return (
    <main>
      <NotFound />
    </main>
  );
}
