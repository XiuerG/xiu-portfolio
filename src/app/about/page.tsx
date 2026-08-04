import type { Metadata } from "next";
import { AboutSection } from "@/components/AboutSection";

export const metadata: Metadata = { title: "About — Xiuer Gu" };

export default function About() {
  return (
    <div className="pt-24 md:pt-28">
      <AboutSection />
    </div>
  );
}
