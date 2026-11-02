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
        <QuoteBand slot={0} />
        <Experience />
        <Projects />
        <QuoteBand slot={1} />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}
