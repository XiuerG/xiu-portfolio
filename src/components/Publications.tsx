import { publications } from "@/lib/publications";
import { SectionHeader } from "@/components/SectionHeader";
import { PublicationCard } from "@/components/PublicationCard";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Selected Publications — the featured (most on-topic) paper spans full width;
 * the rest follow in a responsive grid.
 */
export function Publications() {
  return (
    <section
      id="publications"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <SectionHeader
        eyebrow="Selected Publications"
        title="Selected Publications"
        description="Research on equitable mental health AI and interpretable multimodal systems."
      />
      <div className="mx-auto mt-12 max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {publications.map((pub, i) => (
            <Reveal
              key={pub.title}
              delay={i * 0.06}
              className={pub.featured ? "md:col-span-2" : ""}
            >
              <PublicationCard pub={pub} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
