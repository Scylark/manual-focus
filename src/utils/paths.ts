const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Build an internal URL with a trailing slash so it matches GitHub Pages'
 * canonical directory-index URLs and avoids the 301 redirect hop.
 *
 * Skips trailing-slash addition for:
 * - Anchor links (#section)
 * - File-extension paths (.xml, .png, .pdf, etc.)
 * - The root path
 * - Paths that already end with a slash
 */
export const url = (path: string) => {
  if (!path) return `${base}/`;
  if (path.startsWith('#')) return path;
  if (path === '/') return `${base}/`;

  const withBase = `${base}${path}`;

  // Don't append slash to files (anything with an extension)
  if (/\.[a-z0-9]+$/i.test(withBase)) return withBase;

  // Don't double up if already present
  if (withBase.endsWith('/')) return withBase;

  return `${withBase}/`;
};
