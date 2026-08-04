/**
 * Resolves static asset paths to account for the Next.js basePath
 * when deployed to GitHub Pages.
 */
export function getAssetPath(src: string): string {
  if (!src) return "";
  
  // If the path is already external or a data URL, return it as is
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  // Ensure we don't duplicate the base path if it's already there
  if (basePath && src.startsWith(basePath)) {
    return src;
  }
  
  // Standardize leading slash
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${cleanSrc}`;
}
