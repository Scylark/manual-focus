// Shared helpers for blog listings and post pages.

// Tag slugs are lowercase-hyphenated ("ai", "fractional-cmo"). The old
// approach — CSS text-transform: capitalize — rendered "ai" as "Ai" and
// "cmo" as "Cmo". Format labels in JS instead so acronyms read correctly.
const ACRONYMS = new Set(['ai', 'seo', 'cmo', 'faq', 'ftp']);

export function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((word, i) => {
      if (ACRONYMS.has(word)) return word.toUpperCase();
      if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    })
    .join(' ');
}

// Estimated minutes to read a markdown body at ~220 wpm. Code blocks and
// markdown punctuation are stripped so they don't inflate the word count.
export function readingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()!]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
