import Link from "next/link";
import { type ResearchCard as ResearchCardType } from "@/lib/research";
import { getAssetPath } from "@/lib/utils";

/**
 * One research-work card — used for both projects and publications so the two
 * read as a single body of work. Projects link internally to their case study
 * and lead with a cover image; publications link out and use an accent color
 * block in place of a cover. Hover gently zooms the cover and nudges the arrow
 * (motion-safe only); the whole card is one keyboard-focusable link.
 */
export function ResearchCard({
  card,
  accent,
}: {
  card: ResearchCardType;
  accent: string;
}) {
  const inner = (
    <>
      {/* Cover */}
      <div className="overflow-hidden rounded-2xl border border-line">
        {card.cover?.src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getAssetPath(card.cover.src)}
            alt={card.cover.alt}
            className="aspect-[16/10] w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="flex aspect-[16/10] w-full items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${accent}42, ${accent}12)`,
            }}
          >
            <span className="font-display text-lg font-semibold leading-snug text-bone/80">
              {card.kind === "Publication" ? (card.venue ?? card.title) : card.title}
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <p className="mt-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-mist">
        {card.meta}
      </p>

      <h4 className="mt-2.5 min-h-[2.28em] font-display text-[clamp(20px,2.2vw,27px)] font-bold leading-[1.14] tracking-[-0.01em] transition-colors duration-200 group-hover:text-accent">
        {card.title}
      </h4>

      <p className="mt-3 min-h-[4.875em] max-w-[48ch] text-[15px] leading-relaxed text-mist">
        {card.line}
      </p>
      {card.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-mist"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-auto block">
        {(card.role || card.note) && (
          <span className="mt-5 flex items-center gap-2 text-[13px] leading-relaxed text-bone/70">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-accent"
              aria-hidden
            />
            {card.role ?? card.note}
          </span>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-accent">
          {card.cta}
          <span
            aria-hidden
            className="transition-transform duration-200 motion-safe:group-hover:translate-x-1"
          >
            {card.external ? "↗" : "→"}
          </span>
        </span>
      </span>
    </>
  );

  const className = "group flex h-full flex-col rounded-2xl";

  return card.external ? (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${card.title} — ${card.cta}`}
      className={className}
    >
      {inner}
    </a>
  ) : (
    <Link
      href={card.href}
      aria-label={`${card.title} — ${card.cta}`}
      className={className}
    >
      {inner}
    </Link>
  );
}
