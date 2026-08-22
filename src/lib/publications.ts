export type Publication = {
  title: string;
  /** Research theme used to group the card in the Research Work section. */
  category?: string;
  /** Authors as a single string; use † markers for equal contribution. */
  authors: string;
  /** Venue or publication status (journal name, "Preprint", etc.). */
  venue: string;
  year: string;
  /** Footnote clarifying author markers, if any. */
  note?: string;
  /** Topic tags. */
  tags: string[];
  /** External link (DOI, arXiv, …). */
  href: string;
  /** Internal research-highlight page, when one exists. The card links here
   *  instead of straight to the publisher; the highlight itself carries the
   *  DOI link. */
  page?: string;
  /** Call-to-action label for the link. */
  cta: string;
  /** Short title for the homepage card; the full title stays on the paper. */
  cardTitle?: string;
  /** Venue abbreviation shown in the card's meta line (e.g. "JSSWR"). */
  cardVenue?: string;
  /** Card description; falls back to "authors · venue". */
  cardDescription?: string;
  /** Cover image for the card. Publications without one fall back to an
   *  accent colour block. */
  cover?: { src?: string; alt: string };
  /** Authorship + artifact line on the card, mirroring a project's role line. */
  cardRole?: string;
  /** Higher weight = more visual prominence on the homepage. */
  featured?: boolean;
};

export const publications: Publication[] = [
  {
    title:
      "Same Prompt, Different Care? Evaluating Inequities in AI-Generated Mental Health Support for Immigrant Communities",
    category: "Digital Health",
    authors: "Cheng Chow†, Xiuer Gu†",
    venue: "Journal of the Society for Social Work and Research",
    year: "2026",
    note: "† Equal contribution",
    tags: [
      "Mental Health AI",
      "Health Equity",
      "Immigrant Communities",
      "Responsible AI",
    ],
    cardTitle: "Same Prompt, Different Care?",
    cardVenue: "JSSWR",
    cardDescription:
      "Evaluating inequities in AI-generated mental health support for immigrant communities.",
    cardRole: "Co-First Author · Peer-Reviewed Journal Article",
    cover: {
      src: "/research/same-prompt-cover.webp",
      alt: "Same Prompt, Different Care? — journal cover with the title, subtitle, DOI, and the three audited languages",
    },
    href: "https://doi.org/10.1086/743397",
    page: "/research/same-prompt-different-care",
    cta: "View Research Highlight",
    featured: true,
  },
];
