import { Shell } from "@/components/chrome/Shell";
import { About } from "@/components/sections/About";
import { Contact, Footer } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <Shell>
      <main id="main">
        <Hero />
        <About />
        <QuoteBand text="Innovation starts with *curiosity* and thrives through *persistence*." />
        <Experience />
        <Projects />
        <QuoteBand text="The best AI isn't the one people notice — it's the one that quietly makes their work *easier*." />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}
