/**
 * Turns a text into an SEO-friendly slug.
 * Strips accents, lowercases, replaces spaces with hyphens, removes
 * non-alphanumeric characters and collapses repeated hyphens.
 *
 * @param text - The original text.
 * @returns The resulting slug.
 *
 * @example
 * slugify("Camiseta de Pádel Premium!") // "camiseta-de-padel-premium"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD') // split accented characters into base + mark
    .replace(/[̀-ͯ]/g, '') // drop the diacritical marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces -> hyphens
    .replace(/[^\w-]+/g, '') // drop everything except word characters and hyphens
    .replace(/--+/g, '-') // collapse repeated hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens at both ends
}
