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
    const cardEl = el.firstElementChild as HTMLElement;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 360; // Card width + gap
    // Scroll by exactly 3 cards
    const scrollAmount = direction === "left" ? -(cardWidth * 3) : (cardWidth * 3);
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="design"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <SectionHeader
        eyebrow="Design & Interaction"
        title="Design & Interaction"
        description="Interaction design and creative work — accessibility, installations, generative pieces, and experiments."
      />

      <div className="mx-auto mt-12 w-full max-w-[1200px] px-6 md:px-10 relative group/carousel">
        <Reveal>
          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="scrollbar-none flex gap-6 overflow-x-auto scroll-smooth pb-6 items-stretch"
            >
              {cards.map((card) => {
                const CardInner = (
                  <article className="group flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-raised/40 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_30px_rgba(224,118,77,0.06)]">
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
                  "flex flex-col flex-[0_0_100%] sm:flex-[0_0_calc((100%-1.5rem)/2)] lg:flex-[0_0_calc((100%-3rem)/3)] shrink-0 h-full rounded-2xl transition-transform duration-300 hover:-translate-y-1";

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
                    className="flex flex-col flex-[0_0_100%] sm:flex-[0_0_calc((100%-1.5rem)/2)] lg:flex-[0_0_calc((100%-3rem)/3)] shrink-0 h-full"
                  >
                    {CardInner}
                  </div>
                );
              })}
            </div>

            {/* Left Button */}
            {scrollProgress > 1 && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-[42%] -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/90 text-bone hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Scroll left"
              >
                <span className="translate-y-[-1px] text-lg">←</span>
              </button>
            )}

            {/* Right Button */}
            {scrollProgress < 99 && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-[42%] -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/90 text-bone hover:border-accent hover:text-accent transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Scroll right"
              >
                <span className="translate-y-[-1px] text-lg">→</span>
              </button>
            )}
          </div>
        </Reveal>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-4 max-w-[1200px] px-6 md:px-10">
        <div className="h-[2px] w-full bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-150 rounded-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </section>
  );}
