import type { Metadata } from "next";
import { Form } from "@/components/sites/sorenhale/Form";
import { Faq } from "@/components/sites/sorenhale/Faq";
import { ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.contactTitle, description: ui.meta.contactDescription };

export default function Page() {
  return (
    <main>
      <Form />
      <Faq eyebrow={ui.faq.contactEyebrow} heading={ui.faq.contactHeading} lead="" limit={4} open={-1} />
    </main>
  );
}
