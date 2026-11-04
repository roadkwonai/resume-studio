import type { Metadata } from "next";
import { site } from "@/components/sites/nightly/data";
import { StyleGuidePage } from "@/components/sites/nightly/StyleGuide";

export const metadata: Metadata = { title: site.styleGuide.title };
export default function Page() {
  return <StyleGuidePage />;
}
