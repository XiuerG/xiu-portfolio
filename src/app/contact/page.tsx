import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = { title: "Contact — Xiuer Gu" };

export default function Contact() {
  return (
    <div className="pt-24 md:pt-28">
      <ContactSection />
    </div>
  );
}
