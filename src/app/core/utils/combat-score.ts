import { Character } from '../models/character.model';
import { Potion } from '../models/potion.model';
import { Spell } from '../models/spell.model';

export interface CharacterStats {
  power: number;
  defense: number;
  mystery: number;
  wisdom: number;
  total: number;
}

export interface SpellStats {
  attack: number;
  accuracy: number;
  control: number;
  total: number;
}

export interface PotionStats {
  effectPower: number;
  risk: number;
  craft: number;
  total: number;
}

const HOUSE_BONUS: Record<string, number> = {
  gryffindor: 3,
  slytherin: 3,
  ravenclaw: 2,
  hufflepuff: 2,
};

const present = (value: unknown): number =>
  value !== null && value !== undefined && String(value).trim().length > 0 ? 1 : 0;

function houseBonus(house?: string | null): number {
  return HOUSE_BONUS[(house ?? '').toLowerCase()] ?? 1;
}

function speciesBonus(species?: string | null): number {
  const s = (species ?? '').toLowerCase();
  if (!s || s.includes('human')) {
    return 1;
  }
  return 2; // non-human species are rarer / stronger
}

export function characterStats(c: Character): CharacterStats {
  const power =
    c.titles.length + c.jobs.length + c.wand.length + present(c.patronus) + present(c.animagus);
  const defense = c.familyMembers.length + houseBonus(c.house) + speciesBonus(c.species);
  const mystery = c.aliasNames.length + present(c.boggart) + (c.romances.length > 0 ? 1 : 0);
  const wisdom = present(c.born) + present(c.nationality) + present(c.wiki);
  return { power, defense, mystery, wisdom, total: power + defense + mystery + wisdom };
}

const ATTACK_CATEGORIES: Record<string, number> = {
  curse: 6,
  jinx: 4,
  hex: 5,
  charm: 3,
  transfiguration: 4,
  'counter-spell': 2,
  'healing spell': 1,
};

const LIGHT_RARITY: Record<string, number> = {
  green: 6,
  red: 4,
  blue: 3,
  gold: 5,
  white: 2,
  purple: 4,
};

const DANGEROUS_KEYWORDS = ['kill', 'death', 'pain', 'tortur', 'burn', 'poison', 'curse', 'fatal'];

function effectKeywordScore(effect?: string | null): number {
  const e = (effect ?? '').toLowerCase();
  return DANGEROUS_KEYWORDS.reduce((acc, kw) => acc + (e.includes(kw) ? 1 : 0), 0);
}

export function spellStats(s: Spell): SpellStats {
  const categoryWeight = ATTACK_CATEGORIES[(s.category ?? '').toLowerCase()] ?? 2;
  const lightRarity = LIGHT_RARITY[(s.light ?? '').toLowerCase()] ?? 1;
  const attack = categoryWeight + effectKeywordScore(s.effect) + lightRarity;
  const accuracy = present(s.hand) + present(s.incantation) + 2;
  const control = present(s.creator) + (s.category ? 2 : 0) + 1;
  return { attack, accuracy, control, total: attack + accuracy + control };
}

const DIFFICULTY_WEIGHT: Record<string, number> = {
  beginner: 1,
  easy: 1,
  moderate: 2,
  advanced: 3,
  difficult: 3,
  expert: 4,
  'one of a kind': 5,
};

export function potionStats(p: Potion): PotionStats {
  const difficultyWeight = DIFFICULTY_WEIGHT[(p.difficulty ?? '').toLowerCase()] ?? 2;
  const effectPower = Math.min(10, Math.ceil((p.effect?.length ?? 0) / 40)) + difficultyWeight;
  const risk =
    (p.sideEffects.length > 0 ? p.sideEffects.length : 0) +
    effectKeywordScore(p.effect) +
    effectKeywordScore(p.raw.side_effects);
  const craft = p.ingredients.length + present(p.time);
  return { effectPower, risk, craft, total: effectPower + risk + craft };
}
