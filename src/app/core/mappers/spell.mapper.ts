import { Spell, SpellAttributes } from '../models/spell.model';
import { imageOrPlaceholder } from '../utils/image-fallback';

export function mapSpell(id: string, a: SpellAttributes): Spell {
  return {
    id,
    kind: 'spell',
    slug: a.slug,
    name: a.name,
    image: imageOrPlaceholder(a.image, 'spell', a.slug || a.name),
    wiki: a.wiki ?? null,
    category: a.category ?? null,
    creator: a.creator ?? null,
    effect: a.effect ?? null,
    hand: a.hand ?? null,
    incantation: a.incantation ?? null,
    light: a.light ?? null,
    raw: a,
  };
}
