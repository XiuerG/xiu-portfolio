import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ResearchWork } from "@/components/ResearchWork";
import { ArtWork } from "@/components/ArtWork";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ResearchWork />
      <ArtWork />
      <ContactSection />
    </>
  );
}
