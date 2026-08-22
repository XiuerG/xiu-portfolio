import { projects } from "./projects";
import { publications } from "./publications";

/** A project or a publication, normalized into one card shape. */
export type ResearchCard = {
  kind: "Project" | "Publication";
  title: string;
  year: string;
  /** Composed eyebrow, e.g. "Project · 2026" or "Publication · JSSWR · 2026". */
  meta: string;
  /** Secondary line: project description, or "authors · venue" for a paper. */
  line: string;
  /** Small footnote (e.g. equal-contribution marker). */
  note?: string;
  /** Project role line; publications omit it. */
  role?: string;
  tags: string[];
  href: string;
  external: boolean;
  cta: string;
  /** Cover image (projects) — publications fall back to a color block. */
  cover?: { src?: string; alt: string };
  /** Research theme this card is grouped under. */
  category?: string;
  /** Venue label for the colour-block fallback (publications without a cover). */
  venue?: string;
};

export type ResearchGroup = {
  category: string;
  accent: string;
  cards: ResearchCard[];
};

/** Research-type order + accent per type (drives grouping and color covers). */
const CATEGORY_ORDER: { name: string; accent: string }[] = [
  { name: "Digital Health", accent: "#84b59f" },
];

const projectCards: ResearchCard[] = projects.map((p) => ({
  kind: "Project",
  title: p.title,
  year: p.year,
  meta: `Project · ${p.year}`,
  line: p.cardDescription ?? p.summary,
  role: p.cardRole ?? p.role,
  tags: (p.cardTags ?? p.tags ?? []).slice(0, 3),
  href: `/work/${p.slug}`,
  external: false,
  cta: "View Case Study",
  cover: p.cover,
  category: p.category,
}));

const publicationCards: ResearchCard[] = publications.map((pub) => ({
  kind: "Publication",
  title: pub.cardTitle ?? pub.title,
  year: pub.year,
  meta: ["Publication", pub.cardVenue, pub.year].filter(Boolean).join(" · "),
  line: pub.cardDescription ?? `${pub.authors} · ${pub.venue}`,
  role: pub.cardRole,
  note: pub.cardRole ? undefined : pub.note,
  tags: pub.tags.slice(0, 3),
  href: pub.page ?? pub.href,
  external: !pub.page,
  cta: pub.cta,
  // Publications without a cover fall back to an accent colour block.
  cover: pub.cover,
  category: pub.category,
  venue: pub.venue,
}));

const allCards = [...projectCards, ...publicationCards];

/** Research work grouped by theme, in a fixed display order. Empty themes drop. */
export const researchGroups: ResearchGroup[] = CATEGORY_ORDER.map(
  ({ name, accent }) => ({
    category: name,
    accent,
    cards: allCards.filter((c) => c.category === name),
  }),
).filter((g) => g.cards.length > 0);
