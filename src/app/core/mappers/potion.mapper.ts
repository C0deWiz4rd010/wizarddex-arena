import { Potion, PotionAttributes } from '../models/potion.model';
import { imageOrPlaceholder } from '../utils/image-fallback';
import { parseTextList } from '../utils/text';

export function mapPotion(id: string, a: PotionAttributes): Potion {
  return {
    id,
    kind: 'potion',
    slug: a.slug,
    name: a.name,
    image: imageOrPlaceholder(a.image, 'potion', a.slug || a.name),
    wiki: a.wiki ?? null,
    characteristics: a.characteristics ?? null,
    difficulty: a.difficulty ?? null,
    effect: a.effect ?? null,
    inventors: a.inventors ?? null,
    ingredients: parseTextList(a.ingredients),
    ingredientsRaw: a.ingredients ?? null,
    manufacturers: a.manufacturers ?? null,
    sideEffects: parseTextList(a.side_effects),
    sideEffectsRaw: a.side_effects ?? null,
    time: a.time ?? null,
    raw: a,
  };
}
