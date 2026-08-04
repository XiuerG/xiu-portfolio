import { Hero } from "@/components/Hero";
import { ResearchProfile } from "@/components/ResearchProfile";
import { WorkIndex } from "@/components/WorkIndex";
import { Publications } from "@/components/Publications";
import { Experience } from "@/components/Experience";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ResearchProfile />
      <WorkIndex />
      <Publications />
      <Experience />
      <AboutSection />
      <ContactSection />
    </>
  );
}
