import { ResourceKind } from '../models/base.model';

/**
 * Known resource totals from the PotterDB API (docs.potterdb.com, 2026-06-21).
 * Used to seed deterministic "random" picks without an extra count request.
 * These are approximate and only affect featured/daily selection ranges.
 */
export const RESOURCE_TOTALS: Record<Exclude<ResourceKind, 'chapter'>, number> = {
  book: 7,
  character: 5246,
  movie: 11,
  potion: 168,
  spell: 333,
};

export const RESOURCE_LABELS: Record<ResourceKind, string> = {
  character: 'Characters',
  spell: 'Spells',
  potion: 'Potions',
  book: 'Books',
  movie: 'Movies',
  chapter: 'Chapters',
};
