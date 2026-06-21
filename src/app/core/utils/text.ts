/** Coerce a possibly-null array attribute into a clean string array. */
export function ensureArray(value: readonly string[] | null | undefined): string[] {
  if (!value) {
    return [];
  }
  return value.map((v) => v?.trim()).filter((v): v is string => !!v);
}

/**
 * Parse a free-text list field (PotterDB potion ingredients / side effects are
 * single strings) into individual items. Splits on commas, semicolons, " and ",
 * newlines and bullet separators.
 */
export function parseTextList(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(/\s*(?:,|;|\u2022|\n|\r|\sand\s)\s*/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** Returns a non-empty trimmed string or the provided fallback. */
export function valueOr(value: string | null | undefined, fallback = 'Unknown'): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}
