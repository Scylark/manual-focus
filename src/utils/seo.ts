// Search snippet helpers shared by Base and page templates.

/** Trim a description to fit a search snippet, preferring a sentence
 *  boundary, then a word boundary. */
export function fitDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '));
  if (sentenceEnd >= 70) return window.slice(0, sentenceEnd + 1);
  const wordEnd = window.slice(0, max - 1).lastIndexOf(' ');
  return `${window.slice(0, wordEnd).replace(/[,;:.\s]+$/, '')}…`;
}

/** Append the brand to a page title only when the result still fits in
 *  a search result (about 60 characters). */
export function brandTitle(title: string, brand = 'Manual Focus', max = 60): string {
  // Already branded, or already carries a section name ("X | The Lens").
  if (title.includes(brand) || title.includes(' | ')) return title;
  const withBrand = `${title} | ${brand}`;
  return withBrand.length <= max ? withBrand : title;
}
