export type ResourceKind = 'character' | 'spell' | 'potion' | 'book' | 'movie' | 'chapter';

/** Common shape every domain model shares, used by generic UI (cards, search). */
export interface BaseResource {
  id: string;
  slug: string;
  name: string;
  kind: ResourceKind;
  image?: string | null;
  wiki?: string | null;
}
