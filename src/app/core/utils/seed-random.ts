/**
 * Deterministic seeded pseudo-random number generator (mulberry32).
 * Used for daily challenges so all users get the same result on a given day.
 */
export function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function mulberry32(seedNumber: number): () => number {
  let a = seedNumber >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Create a deterministic RNG from a string seed. */
export function seededRandom(seed: string): () => number {
  return mulberry32(hashSeed(seed));
}

/** Deterministically pick an index in [0, length) from a string seed. */
export function seededIndex(seed: string, length: number): number {
  if (length <= 0) {
    return 0;
  }
  return Math.floor(seededRandom(seed)() * length);
}

/** Today's daily seed, e.g. "2026-06-21:character". */
export function dailySeed(challengeType: string, date = new Date()): string {
  return `${date.toISOString().slice(0, 10)}:${challengeType}`;
}
