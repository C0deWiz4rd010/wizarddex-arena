import { describe, expect, it } from 'vitest';

import { Character } from '../../../core/models/character.model';
import { seededRandom } from '../../../core/utils/seed-random';
import { makeCombatant, simulateDuel } from './duel-engine';

function makeCharacter(id: string, overrides: Partial<Character> = {}): Character {
  return {
    id,
    slug: id,
    name: `Wizard ${id}`,
    kind: 'character',
    image: null,
    wiki: null,
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

describe('duel-engine', () => {
  it('builds a combatant with positive derived stats', () => {
    const c = makeCombatant(makeCharacter('a', { house: 'slytherin', titles: ['Lord'] }));
    expect(c.maxHp).toBeGreaterThan(0);
    expect(c.attack).toBeGreaterThan(0);
    expect(c.defense).toBeGreaterThan(0);
  });

  it('is deterministic for the same seed', () => {
    const a = makeCharacter('a', { titles: ['x'] });
    const b = makeCharacter('b', { jobs: ['Auror'] });
    const r1 = simulateDuel(a, b, seededRandom('fixed'));
    const r2 = simulateDuel(a, b, seededRandom('fixed'));
    expect(r1.winnerId).toBe(r2.winnerId);
    expect(r1.events.length).toBe(r2.events.length);
  });

  it('always declares a winner that is one of the fighters', () => {
    const a = makeCharacter('a');
    const b = makeCharacter('b');
    const result = simulateDuel(a, b, seededRandom('seed'));
    expect(['a', 'b']).toContain(result.winnerId);
    expect(result.events.length).toBeGreaterThan(0);
  });
});
