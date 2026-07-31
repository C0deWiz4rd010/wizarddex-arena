import { describe, expect, it } from 'vitest';

import { Potion } from '../../../core/models/potion.model';
import { buildRound, isCorrectIngredient, isPlayable } from './potion-lab.logic';

function potion(id: string, ingredients: string[], effect = 'Does something magical'): Potion {
  return {
    id,
    slug: id,
    name: `Potion ${id}`,
    kind: 'potion',
    image: null,
    wiki: null,
    effect,
    difficulty: 'Moderate',
    inventors: null,
    ingredients,
    manufacturers: null,
    sideEffects: [],
    characteristics: null,
    time: null,
    raw: {} as Potion['raw'],
  };
}

// Deterministic RNG for reproducible rounds.
function seededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('potion-lab logic', () => {
  const target = potion('a', ['Bezoar', 'Wormwood', 'Nightshade']);
  const others = [
    potion('b', ['Mandrake', 'Boomslang skin']),
    potion('c', ['Fluxweed', 'Leech juice']),
  ];

  it('marks potions with enough ingredients as playable', () => {
    expect(isPlayable(target)).toBe(true);
    expect(isPlayable(potion('x', ['Only one']))).toBe(false);
    expect(isPlayable(potion('y', [], ''))).toBe(false);
  });

  it('builds a round containing all correct ingredients plus distractors', () => {
    const round = buildRound(target, [target, ...others], seededRng(1));
    expect(round.correct).toEqual(['Bezoar', 'Wormwood', 'Nightshade']);
    for (const c of round.correct) {
      expect(round.chips).toContain(c);
    }
    // Chips include at least one distractor from other potions.
    expect(round.chips.length).toBeGreaterThan(round.correct.length);
  });

  it('never includes the correct ingredients as distractors', () => {
    const round = buildRound(target, [target, ...others], seededRng(7));
    const distractors = round.chips.filter((c) => !isCorrectIngredient(round, c));
    for (const d of distractors) {
      expect(round.correct.map((c) => c.toLowerCase())).not.toContain(d.toLowerCase());
    }
  });

  it('recognises correct ingredients case-insensitively', () => {
    const round = buildRound(target, [target, ...others], seededRng(3));
    expect(isCorrectIngredient(round, 'bezoar')).toBe(true);
    expect(isCorrectIngredient(round, 'Definitely wrong')).toBe(false);
  });

  it('de-duplicates repeated ingredients', () => {
    const dupe = potion('d', ['Salt', 'salt', 'SALT', 'Pepper']);
    const round = buildRound(dupe, [dupe, ...others], seededRng(2));
    expect(round.correct).toEqual(['Salt', 'Pepper']);
  });
});
