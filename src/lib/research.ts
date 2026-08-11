import { projects } from "./projects";
import { publications } from "./publications";

/** A project or a publication, normalized into one card shape. */
export type ResearchCard = {
  kind: "Project" | "Publication";
  title: string;
  year: string;
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
};

export type ResearchGroup = {
  category: string;
  accent: string;
  cards: ResearchCard[];
};

/** Research-type order + accent per type (drives grouping and color covers). */
const CATEGORY_ORDER: { name: string; accent: string }[] = [
  { name: "Digital Health", accent: "#84b59f" },
  { name: "Machine Learning & AI Research", accent: "#c08457" },
];

const projectCards: ResearchCard[] = projects.map((p) => ({
  kind: "Project",
  title: p.title,
  year: p.year,
  line: p.cardDescription ?? p.summary,
  role: p.cardRole ?? p.role,
  tags: (p.cardTags ?? p.tags ?? []).slice(0, 3),
  href: `/work/${p.slug}`,
  external: false,
  cta: "View Case Study",
  cover: p.cover,
}));

const publicationCards: ResearchCard[] = publications.map((pub) => ({
  kind: "Publication",
  title: pub.title,
  year: pub.year,
  line: `${pub.authors} · ${pub.venue}`,
  note: pub.note,
  tags: pub.tags.slice(0, 3),
  href: pub.href,
  external: true,
  cta: pub.cta,
  // No image — the card renders an accent color block instead.
  cover: undefined,
}));

/** Look up an item's theme from its source record. */
function categoryOf(card: ResearchCard): string | undefined {
  if (card.kind === "Project") {
    return projects.find((p) => p.title === card.title)?.category;
  }
  return publications.find((p) => p.title === card.title)?.category;
}

const allCards = [...projectCards, ...publicationCards];

/** Research work grouped by theme, in a fixed display order. Empty themes drop. */
export const researchGroups: ResearchGroup[] = CATEGORY_ORDER.map(
  ({ name, accent }) => ({
    category: name,
    accent,
    cards: allCards.filter((c) => categoryOf(c) === name),
  }),
).filter((g) => g.cards.length > 0);
