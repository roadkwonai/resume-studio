import type { Metadata } from "next";
import { Resume } from "@/components/sites/sorenhale/Resume";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.resumeTitle, description: ui.meta.resumeDescription };

export default function Page() {
  return (
    <main>
      <Resume />
      <Cta />
    </main>
  );
}
