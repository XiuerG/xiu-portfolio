import { type Publication } from "@/lib/publications";

/**
 * PublicationCard — one publication: title, authors, venue/year, topic tags,
 * and an external link. `featured` cards read slightly larger to give the most
 * on-topic paper more weight.
 */
export function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article className="relative h-full overflow-hidden rounded-2xl border border-line bg-raised/50 p-7 md:p-9">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-mist">
        <span>{pub.venue}</span>
        <span aria-hidden>·</span>
        <span>{pub.year}</span>
      </div>

      <h3
        className={`mt-4 font-display font-semibold leading-snug ${
          pub.featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
        }`}
      >
        {pub.title}
      </h3>

      <p className="mt-3 text-[15px] leading-relaxed text-bone/85">
        {pub.authors}
      </p>
      {pub.note && (
        <p className="mt-1 font-mono text-xs text-mist">{pub.note}</p>
      )}

      <ul className="mt-5 flex flex-wrap gap-2">
        {pub.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mist"
          >
            {tag}
          </li>
        ))}
      </ul>

      <a
        href={pub.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        {pub.cta}
        <span aria-hidden>↗</span>
      </a>
    </article>
  );
}
