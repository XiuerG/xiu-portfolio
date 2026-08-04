import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "About — Xiuer Gu" };

export default function About() {
  return (
    <section className="px-6 pb-24 pt-40 md:px-10 md:pt-48">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="font-display text-4xl font-bold leading-[1.1] md:text-5xl">
            About
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-8 text-lg leading-relaxed text-mist">
            Replace this with your story: how you work, the through-line across
            art, technology, and information science, and the tools you reach for
            (React, Next.js, Tailwind, Cursor, v0). Keep it in your own voice —
            this is the page that makes you a person, not a résumé.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
