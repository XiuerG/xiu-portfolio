import { CV_PATH, SOCIAL_LINKS } from "@/lib/site";
import { getAssetPath } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

/**
 * Contact — the closing section the nav scrolls to. Positioning line, a primary
 * "Download CV" action, and the direct links (email, GitHub, LinkedIn).
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-line px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(32px,5vw,60px)] font-bold leading-[1.05] tracking-[-0.01em]">
            Let&apos;s talk.
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-mist">
            I&apos;m open to Health HCI research assistant and research associate
            roles, research collaborations, and PhD opportunities.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={getAssetPath(CV_PATH)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.04]"
            >
              Download CV
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 flex flex-col gap-4 border-t border-line pt-10">
            {SOCIAL_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-baseline gap-4 transition-colors hover:text-accent"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">
                    {l.label}
                  </span>
                  <Magnetic>
                    <span className="font-display text-xl font-semibold md:text-2xl">
                      {l.href.replace(/^mailto:|^https?:\/\/(www\.)?/, "")}
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
