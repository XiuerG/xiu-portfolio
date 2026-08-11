export type ArtWork = {
  title: string;
  /** Short category / medium label (e.g. "Interactive Installation"). */
  category: string;
  year?: string;
  /** One-line description. */
  description?: string;
  /** Image path in /public. Leave unset to render a labeled placeholder. */
  image?: string;
  /** Optional external link (live piece, video, write-up). */
  href?: string;
};

/**
 * Art & Interaction — creative and interaction work outside the three main
 * research projects. Placeholder entries for now; drop images in /public and
 * fill in real titles / descriptions / links.
 *
 * TODO: replace these placeholders with real pieces (set `image`, `href`).
 */
export const artworks: ArtWork[] = [
  {
    title: "Untitled Interactive Installation",
    category: "Interactive Installation · TouchDesigner",
    year: "2024",
    description: "Placeholder — add a real piece, image, and link.",
  },
  {
    title: "Generative Visual Study",
    category: "Generative Art",
    year: "2023",
    description: "Placeholder — add a real piece, image, and link.",
  },
  {
    title: "Interaction Experiment",
    category: "Interaction Design · Web",
    year: "2023",
    description: "Placeholder — add a real piece, image, and link.",
  },
  {
    title: "Sensor-Based Prototype",
    category: "Physical Computing",
    year: "2023",
    description: "Placeholder — add a real piece, image, and link.",
  },
];
