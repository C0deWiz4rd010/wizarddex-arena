import { describe, expect, it } from 'vitest';

import { dailySeed, seededIndex, seededRandom } from './seed-random';

describe('seed-random', () => {
  it('is deterministic for the same seed', () => {
    const a = seededRandom('hermione');
    const b = seededRandom('hermione');
    expect(a()).toBe(b());
  });

  it('produces values within [0, 1)', () => {
    const rng = seededRandom('seed');
    for (let i = 0; i < 50; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('seededIndex stays in range and is stable', () => {
    expect(seededIndex('x', 10)).toBe(seededIndex('x', 10));
    expect(seededIndex('x', 10)).toBeGreaterThanOrEqual(0);
    expect(seededIndex('x', 10)).toBeLessThan(10);
    expect(seededIndex('x', 0)).toBe(0);
  });

  it('dailySeed embeds an ISO date and challenge type', () => {
    const seed = dailySeed('guess', new Date('2026-06-21T12:00:00Z'));
    expect(seed).toBe('2026-06-21:guess');
  });
});
