import { Potion } from '../../../core/models/potion.model';

export interface PotionRound {
  potionId: string;
  potionName: string;
  effect: string;
  difficulty: string | null;
  /** Normalised, de-duplicated correct ingredients (display casing). */
  correct: string[];
  /** Shuffled pool of ingredient chips (correct + distractors). */
  chips: string[];
}

const MAX_CHIPS = 9;
const MIN_CORRECT = 2;

function normalizeList(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.trim();
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

/** A potion is playable if it has a usable effect and enough ingredients. */
export function isPlayable(potion: Potion): boolean {
  return !!potion.effect && normalizeList(potion.ingredients).length >= MIN_CORRECT;
}

/**
 * Builds a single Potion Lab round: the target potion's real ingredients plus
 * distractor ingredients drawn from other potions, shuffled together.
 * `rng` returns a value in [0, 1) so rounds can be made deterministic in tests.
 */
export function buildRound(
  target: Potion,
  pool: Potion[],
  rng: () => number = Math.random,
): PotionRound {
  const correct = normalizeList(target.ingredients).slice(0, MAX_CHIPS - 1);
  const correctKeys = new Set(correct.map((c) => c.toLowerCase()));

  const distractorPool = normalizeList(
    pool.filter((p) => p.id !== target.id).flatMap((p) => p.ingredients),
  ).filter((ing) => !correctKeys.has(ing.toLowerCase()));

  const shuffledDistractors = shuffle(distractorPool, rng);
  const slots = Math.max(0, MAX_CHIPS - correct.length);
  const distractors = shuffledDistractors.slice(0, slots);

  return {
    potionId: target.id,
    potionName: target.name,
    effect: target.effect ?? '',
    difficulty: target.difficulty ?? null,
    correct,
    chips: shuffle([...correct, ...distractors], rng),
  };
}

export function isCorrectIngredient(round: PotionRound, chip: string): boolean {
  const key = chip.toLowerCase();
  return round.correct.some((c) => c.toLowerCase() === key);
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
