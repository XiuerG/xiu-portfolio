/**
 * Site-wide constants that need to live in one editable place.
 */

/**
 * CV / résumé path. Resolve with getAssetPath() at the call site so the
 * GitHub Pages basePath is applied.
 *
 * TODO: Drop the real CV PDF into /public and update this path if the
 * filename differs. Until the file exists this link will 404.
 */
export const CV_PATH = "/Xiuer-Gu-CV.pdf";

export const EMAIL = "gxe.melody@gmail.com";

/**
 * External profiles shown in the contact section.
 * TODO: confirm the LinkedIn/GitHub URLs point at the right profiles.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Email", href: `mailto:${EMAIL}` },
  { label: "GitHub", href: "https://github.com/XiuerG" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xiuer-gu" },
];
