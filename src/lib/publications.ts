export type Publication = {
  title: string;
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
  /** Call-to-action label for the link. */
  cta: string;
  /** Higher weight = more visual prominence on the homepage. */
  featured?: boolean;
};

export const publications: Publication[] = [
  {
    title:
      "Same Prompt, Different Care? Evaluating Inequities in AI-Generated Mental Health Support for Immigrant Communities",
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
    href: "https://doi.org/10.1086/743397",
    cta: "Read Paper",
    featured: true,
  },
  {
    title:
      "HieroAction: Hierarchically Guided VLM for Fine-Grained Action Analysis",
    authors: "J. Wu, Xiuer Gu, et al.",
    venue: "Preprint",
    year: "2025",
    tags: ["Vision-Language Models", "Action Analysis", "Interpretable AI"],
    href: "https://arxiv.org/abs/2508.16942",
    cta: "View Preprint",
  },
];
