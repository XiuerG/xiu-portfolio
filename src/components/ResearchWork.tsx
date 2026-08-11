import { researchGroups } from "@/lib/research";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ResearchCard } from "@/components/ResearchCard";

/**
 * Research Work — projects and publications shown as one body of work, grouped
 * by research theme. Every item uses the same card treatment (projects lead
 * with a cover image; publications use an accent color block). Everything is
 * reachable by scrolling; project routing to /work/[slug] is unchanged.
 */
export function ResearchWork() {
  return (
    <section
      id="research"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <SectionHeader
        eyebrow="Research Work"
        title="Research Work"
        description="Projects and publications grouped by area — digital health and machine-learning research."
      />

      <div className="mx-auto mt-14 max-w-[1200px] px-6 md:px-10">
        {researchGroups.map((group, gi) => (
          <div
            key={group.category}
            className={
              gi > 0 ? "mt-16 border-t border-line pt-14 md:mt-20 md:pt-16" : ""
            }
          >
            <Reveal>
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: group.accent }}
                  aria-hidden
                />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-bone/80">
                  {group.category}
                </h3>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-x-6 gap-y-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-8">
              {group.cards.map((card, i) => (
                <Reveal key={card.title} delay={(i % 3) * 0.06}>
                  <ResearchCard card={card} accent={group.accent} />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
