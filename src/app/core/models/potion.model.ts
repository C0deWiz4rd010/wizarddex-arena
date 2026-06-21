import { BaseResource } from './base.model';

/** Note: ingredients/side_effects/inventors/manufacturers are STRINGS in the API. */
export interface PotionAttributes {
  characteristics?: string | null;
  difficulty?: string | null;
  effect?: string | null;
  image?: string | null;
  inventors?: string | null;
  ingredients?: string | null;
  manufacturers?: string | null;
  name: string;
  side_effects?: string | null;
  slug: string;
  time?: string | null;
  wiki?: string | null;
}

export interface Potion extends BaseResource {
  kind: 'potion';
  characteristics?: string | null;
  difficulty?: string | null;
  effect?: string | null;
  inventors?: string | null;
  /** Parsed list derived from the `ingredients` string. */
  ingredients: string[];
  ingredientsRaw?: string | null;
  manufacturers?: string | null;
  /** Parsed list derived from the `side_effects` string. */
  sideEffects: string[];
  sideEffectsRaw?: string | null;
  time?: string | null;
  raw: PotionAttributes;
}
