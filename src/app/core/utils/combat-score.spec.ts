import { describe, expect, it } from 'vitest';

import { Character } from '../models/character.model';
import { characterStats } from './combat-score';

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'id',
    slug: 'slug',
    name: 'Test Wizard',
    kind: 'character',
    image: null,
    wiki: 'https://example.com',
    aliasNames: [],
    familyMembers: [],
    jobs: [],
    romances: [],
    titles: [],
    wand: [],
    raw: {} as Character['raw'],
    ...overrides,
  };
}

describe('characterStats', () => {
  it('total equals the sum of all stat dimensions', () => {
    const stats = characterStats(
      makeCharacter({ house: 'gryffindor', titles: ['The Chosen One'] }),
    );
    expect(stats.total).toBe(stats.power + stats.defense + stats.mystery + stats.wisdom);
  });

  it('rewards richer profiles with higher power', () => {
    const plain = characterStats(makeCharacter());
    const decorated = characterStats(
      makeCharacter({ titles: ['a', 'b'], jobs: ['Auror'], wand: ['holly'], patronus: 'Stag' }),
    );
    expect(decorated.power).toBeGreaterThan(plain.power);
  });

  it('produces non-negative integers', () => {
    const stats = characterStats(makeCharacter());
    for (const value of Object.values(stats)) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });
});
