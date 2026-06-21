import { Character, CharacterAttributes } from '../models/character.model';
import { imageOrPlaceholder } from '../utils/image-fallback';
import { ensureArray } from '../utils/text';

export function mapCharacter(id: string, a: CharacterAttributes): Character {
  return {
    id,
    kind: 'character',
    slug: a.slug,
    name: a.name,
    image: imageOrPlaceholder(a.image, 'character', a.slug || a.name),
    wiki: a.wiki ?? null,
    aliasNames: ensureArray(a.alias_names),
    animagus: a.animagus ?? null,
    bloodStatus: a.blood_status ?? null,
    boggart: a.boggart ?? null,
    born: a.born ?? null,
    died: a.died ?? null,
    eyeColor: a.eye_color ?? null,
    familyMembers: ensureArray(a.family_member),
    gender: a.gender ?? null,
    hairColor: a.hair_color ?? null,
    height: a.height ?? null,
    house: a.house ?? null,
    jobs: ensureArray(a.jobs),
    nationality: a.nationality ?? null,
    patronus: a.patronus ?? null,
    romances: ensureArray(a.romances),
    skinColor: a.skin_color ?? null,
    species: a.species ?? null,
    titles: ensureArray(a.titles),
    wand: ensureArray(a.wand),
    weight: a.weight ?? null,
    raw: a,
  };
}
