"use client";

import { useRef } from "react";
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
  video?: string;
  poster?: string;
  href?: string;
  internal?: boolean;
  cta?: string;
};

/** Per-card accent tint so placeholder blocks aren't flat grey. */
const ACCENTS = ["#5c93a0", "#84b59f", "#4e8d76", "#c08457"];

/** The design/interaction projects with full case studies lead this section,
 *  followed by the standalone art & interaction pieces. */
const CASE_STUDY_SLUGS = ["ocean-vr"];

function buildCards(): Card[] {
  const lead: Card[] = CASE_STUDY_SLUGS.flatMap((slug) => {
    const p = projects.find((project) => project.slug === slug);
    if (!p) return [];
    return [
      {
        title: p.title,
        category: p.domain,
        accent: p.accent,
        year: p.year,
        description: p.cardDescription ?? p.summary,
        image: p.cover.src,
        href: `/work/${p.slug}`,
        internal: true,
        cta: "View Project",
      },
    ];
  });

  const art: Card[] = artworks.map((a, i) => {
    // Art pieces link out to the live work; a leading "/" means the piece has
    // a case study on this site instead.
    const internal = a.href?.startsWith("/") ?? false;
    return {
      title: a.title,
      category: a.category,
      accent: ACCENTS[(i + 1) % ACCENTS.length],
      year: a.year,
      description: a.description,
      image: a.image,
      video: a.video,
      poster: a.poster,
      href: a.href,
      internal,
      cta: a.href
        ? internal
          ? "View Project"
          : a.video
            ? "View Live"
            : "View"
        : undefined,
    };
  });

  // Pieces flagged `lead` open the section, ahead of the case-study card.
  const leading = art.filter((_, i) => artworks[i].lead);
  const rest = art.filter((_, i) => !artworks[i].lead);

  return [...leading, ...lead, ...rest];
}

/**
 * Design & Interaction — interaction and creative work as a plain responsive
 * grid, so every card is reachable without a horizontal scroll. Cards without
 * an image render a labeled, accent-tinted placeholder block.
 */
export function ArtWork() {
  const cards = buildCards();

  return (
    <section
      id="design"
      className="scroll-mt-24 border-t border-line py-24 md:py-28"
    >
      <SectionHeader
        eyebrow="Design & Interaction"
        title="Design & Interaction"
        description="Interaction design and creative work."
      />

      <div className="mx-auto mt-12 w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <div>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => {
                const CardInner = (
                  <article className="group flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-raised/40 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_30px_rgba(224,118,77,0.06)]">
                    {card.video ? (
                      <CardVideo card={card} />
                    ) : card.image ? (
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
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-display text-sm font-semibold text-accent">
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
                  "flex h-full flex-col rounded-2xl transition-transform duration-300 hover:-translate-y-1";

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
                    className="flex h-full flex-col"
                  >
                    {CardInner}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * A card whose cover is a short clip. The file only downloads once someone
 * actually points at it (`preload="none"`), so a multi-megabyte demo never
 * costs anything on first paint; the poster carries the card until then. Under
 * prefers-reduced-motion the clip never starts and the poster simply stays.
 */
function CardVideo({ card }: { card: Card }) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {
      /* autoplay can be refused; the poster is a fine fallback */
    });
  };

  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      className="relative"
      onPointerEnter={play}
      onPointerLeave={stop}
      onFocus={play}
      onBlur={stop}
    >
      <video
        ref={ref}
        src={getAssetPath(card.video!)}
        poster={card.poster ? getAssetPath(card.poster) : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${card.title} — demo clip`}
        className="aspect-[16/10] w-full object-cover"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ground/70 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-bone/80 backdrop-blur-sm"
      >
        <span className="text-[0.6rem] leading-none">▶</span>
        Hover to play
      </span>
    </div>
  );
}
