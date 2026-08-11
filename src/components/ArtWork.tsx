"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { artworks } from "@/lib/art";
import { projects } from "@/lib/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { getAssetPath } from "@/lib/utils";

type Card = {
  title: string;
  category: string;
  accent: string;
  year?: string;
  description?: string;
  image?: string;
  href?: string;
  internal?: boolean;
  cta?: string;
};

/** Per-card accent tint so placeholder blocks aren't flat grey. */
const ACCENTS = ["#5c93a0", "#84b59f", "#4e8d76", "#c08457"];

/** Jasmine's Beat leads this section — a design/interaction project with a case
 *  study — followed by the standalone art & interaction pieces. */
function buildCards(): Card[] {
  const jasmine = projects.find((p) => p.slug === "jasmines-beat");
  const lead: Card[] = jasmine
    ? [
        {
          title: jasmine.title,
          category: jasmine.domain,
          accent: jasmine.accent,
          year: jasmine.year,
          description: jasmine.cardDescription ?? jasmine.summary,
          image: jasmine.cover.src,
          href: `/work/${jasmine.slug}`,
          internal: true,
          cta: "View Case Study",
        },
      ]
    : [];

  const rest: Card[] = artworks.map((art, i) => ({
    title: art.title,
    category: art.category,
    accent: ACCENTS[(i + 1) % ACCENTS.length],
    year: art.year,
    description: art.description,
    image: art.image,
    href: art.href,
    cta: art.href ? "View" : undefined,
  }));

  return [...lead, ...rest];
}

/**
 * Design & Interaction — interaction and creative work, led by Jasmine's Beat
 * (an accessibility evaluation & redesign with a full case study) and followed
 * by standalone art/interaction pieces. Cards without an image render a
 * labeled, accent-tinted placeholder block.
 */
export function ArtWork() {
  const cards = buildCards();
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    // Small delay to let browser settle rendering
    const timer = setTimeout(handleScroll, 100);
    window.addEventListener("resize", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="design"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <div className="relative">
        <SectionHeader
          eyebrow="Design & Interaction"
          title="Design & Interaction"
          description="Interaction design and creative work — accessibility, installations, generative pieces, and experiments."
        />

        {/* Navigation Controls */}
        <div className="mx-auto mt-6 flex max-w-[1200px] justify-end gap-3 px-6 md:px-10">
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-raised/40 text-bone hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Scroll left"
          >
            <span className="translate-y-[-1px]">←</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-raised/40 text-bone hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Scroll right"
          >
            <span className="translate-y-[-1px]">→</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full">
        <Reveal>
          <div className="relative w-full overflow-hidden">
            {/* Ambient gradients to fade out edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ground to-transparent md:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ground to-transparent md:w-24" />

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="scrollbar-none flex gap-6 overflow-x-auto scroll-smooth px-6 pb-6 md:px-10"
            >
              {cards.map((card) => {
                const CardInner = (
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised/40">
                    {card.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getAssetPath(card.image)}
                        alt={card.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={card.title}
                        className="flex aspect-[16/10] w-full items-center justify-center p-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.16em] text-bone/70"
                        style={{
                          background: `linear-gradient(135deg, ${card.accent}52, ${card.accent}14)`,
                        }}
                      >
                        {card.category}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="font-display text-xl font-semibold leading-snug transition-colors duration-200 group-hover:text-accent">
                          {card.title}
                        </h3>
                        {card.year && (
                          <span className="font-mono text-xs text-mist">
                            {card.year}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mist">
                        {card.category}
                      </p>
                      {card.description && (
                        <p className="mt-3 text-[15px] leading-relaxed text-mist">
                          {card.description}
                        </p>
                      )}
                      {card.href && card.cta && (
                        <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-accent">
                          {card.cta}
                          <span
                            aria-hidden
                            className="transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                          >
                            {card.internal ? "→" : "↗"}
                          </span>
                        </span>
                      )}
                    </div>
                  </article>
                );

                const cardClass =
                  "block w-[280px] sm:w-[320px] md:w-[360px] shrink-0 h-full rounded-2xl transition-transform duration-300 hover:-translate-y-1";

                if (card.href && card.internal) {
                  return (
                    <Link
                      key={card.title}
                      href={card.href}
                      aria-label={`${card.title} — ${card.cta}`}
                      className={cardClass}
                    >
                      {CardInner}
                    </Link>
                  );
                }
                if (card.href) {
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${card.title} — ${card.cta}`}
                      className={cardClass}
                    >
                      {CardInner}
                    </a>
                  );
                }
                return (
                  <div
                    key={card.title}
                    className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 h-full"
                  >
                    {CardInner}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-2 max-w-[1200px] px-6 md:px-10">
        <div className="h-[2px] w-full bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-150 rounded-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </section>
  );}
