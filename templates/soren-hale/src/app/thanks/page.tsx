import type { Metadata } from "next";
import { Thanks } from "@/components/sites/sorenhale/Thanks";
import { ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.thanksTitle, description: ui.meta.thanksDescription };

export default function Page() {
  return (
    <main>
      <Thanks />
    </main>
  );
}
