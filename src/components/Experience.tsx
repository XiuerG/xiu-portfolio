import { experience } from "@/lib/experience";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Research & Design Experience — a compact vertical timeline. One line of
 * summary per role; time, position, and institution kept in a clear hierarchy.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <SectionHeader
        eyebrow="Experience"
        title="Research & Design Experience"
        description="Working across human-centered AI, interactive systems, and interdisciplinary research."
      />
      <div className="mx-auto mt-12 max-w-[860px] px-6 md:px-10">
        <ol className="space-y-0">
          {experience.map((item, i) => (
            <Reveal key={`${item.role}-${item.period}`} delay={i * 0.05}>
              <li className="grid grid-cols-1 gap-2 border-t border-line py-8 md:grid-cols-[160px_1fr] md:gap-8">
                <p className="font-mono text-sm text-mist tabular-nums">
                  {item.period}
                </p>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-snug">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-[15px] text-bone/85">
                    {item.org}
                    {item.detail && (
                      <span className="text-mist"> · {item.detail}</span>
                    )}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-mist">
                    {item.summary}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
