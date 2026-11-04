import { Contact } from "@/components/sites/sawad/Contact";
import { Blog, Experience, Hero, Projects, Tools } from "@/components/sites/sawad/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects limit={3} />
      <Experience limit={3} />
      <Tools />
      <Blog limit={3} />
      <Contact />
    </>
  );
}
