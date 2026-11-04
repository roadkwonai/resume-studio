import type { Metadata } from "next";
import { Hero } from "@/components/sites/sorenhale/Hero";
import { Marks } from "@/components/sites/sorenhale/Marks";
import { Work } from "@/components/sites/sorenhale/Work";
import { About } from "@/components/sites/sorenhale/About";
import { Bench } from "@/components/sites/sorenhale/Bench";
import { Stack } from "@/components/sites/sorenhale/Stack";
import { Services } from "@/components/sites/sorenhale/Services";
import { Log } from "@/components/sites/sorenhale/Log";
import { Lab } from "@/components/sites/sorenhale/Lab";
import { Reviews } from "@/components/sites/sorenhale/Reviews";
import { Writing } from "@/components/sites/sorenhale/Writing";
import { Faq } from "@/components/sites/sorenhale/Faq";
import { Cta } from "@/components/sites/sorenhale/Cta";
import { ui } from "@/components/sites/sorenhale/data";

export const metadata: Metadata = { title: ui.meta.homeTitle, description: ui.meta.homeDescription };

export default function Home() {
  return (
    <main>
      <Hero />
      <Marks />
      <Work />
      <About />
      <Bench />
      <Stack />
      <Services />
      <Log />
      <Lab />
      <Reviews />
      <Writing />
      <Faq />
      <Cta />
    </main>
  );
}
