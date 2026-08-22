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
  /** Looping demo clip, shown in place of the still cover. */
  video?: string;
  /** Poster frame for the clip — also what shows under reduced-motion. */
  poster?: string;
  /** Opens the section, ahead of the case-study card. */
  lead?: boolean;
};

/**
 * Art & Interaction — creative and interaction work outside the main research
 * projects. Drop images in /public and add entries here.
 */
export const artworks: ArtWork[] = [
  {
    title: "An Atlas of Crossings",
    category: "Interactive Narrative · Web",
    year: "2026",
    description:
      "Four interactive storybooks on memory, return, and home across the Asian diaspora. Each spread turns a feeling into something the reader operates.",
    href: "/work/atlas-of-crossings",
    video: "/design/atlas-of-crossings.mp4",
    poster: "/design/atlas-of-crossings.webp",
    lead: true,
  },
];
