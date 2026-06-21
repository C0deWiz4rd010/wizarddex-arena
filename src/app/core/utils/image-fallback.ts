import { ResourceKind } from '../models/base.model';

const KIND_GLYPH: Record<ResourceKind, string> = {
  character: '\u2727', // sparkle
  spell: '\u269A', // staff of hermes-ish
  potion: '\u2697', // alembic
  book: '\u269C', // fleur-de-lis
  movie: '\u2730', // shadowed star
  chapter: '\u00A7', // section
};

/** Deterministic hue from a string so each resource gets a stable color. */
function hashHue(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

/**
 * Generate an inline SVG data-URI placeholder for resources without an image.
 * Used as a fallback so the UI never shows a broken image.
 */
export function generatePlaceholder(kind: ResourceKind, seed: string): string {
  const hue = hashHue(seed);
  const glyph = KIND_GLYPH[kind];
  const initial = (seed.trim()[0] ?? '?').toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue} 55% 22%)"/>
          <stop offset="100%" stop-color="hsl(${(hue + 40) % 360} 60% 12%)"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)"/>
      <text x="100" y="84" font-size="64" text-anchor="middle" fill="hsl(${hue} 80% 78%)" font-family="serif">${glyph}</text>
      <text x="100" y="150" font-size="56" text-anchor="middle" fill="rgba(248,242,223,.85)" font-family="serif" font-weight="700">${initial}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

/** Returns the resource image or a generated placeholder fallback. */
export function imageOrPlaceholder(
  image: string | null | undefined,
  kind: ResourceKind,
  seed: string,
): string {
  return image && image.trim().length > 0 ? image : generatePlaceholder(kind, seed);
}
