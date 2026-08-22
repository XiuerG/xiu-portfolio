/**
 * Site-wide constants that need to live in one editable place.
 */

/**
 * CV / résumé path. Resolve with getAssetPath() at the call site so the
 * GitHub Pages basePath is applied.
 */
export const CV_PATH = "/Xiuer-Gu-CV.pdf";

export const EMAIL = "gxe.melody@gmail.com";

/**
 * External profiles shown in the contact section.
 * TODO: confirm the LinkedIn URL points at the right profile.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xiuer-gu" },
];
