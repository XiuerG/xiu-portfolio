import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

export const metadata: Metadata = { title: "Contact — Xiuer Gu" };

const links = [
  { label: "Email", href: "mailto:you@example.com" },
  { label: "Résumé", href: "/resume.pdf" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Contact() {
  return (
    <section className="px-6 pb-24 pt-40 md:px-10 md:pt-48">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h1 className="font-display text-4xl font-bold leading-[1.1] md:text-5xl">
            Let&apos;s talk
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="mt-10 space-y-4">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group inline-flex items-baseline gap-4 transition-colors hover:text-accent"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">
                    {l.label}
                  </span>
                  <Magnetic>
                    <span className="font-display text-2xl font-semibold">
                      {l.href.replace(/^mailto:|^https?:\/\//, "")}
                    </span>
                  </Magnetic>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
