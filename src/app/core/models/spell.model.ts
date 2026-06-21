import { BaseResource } from './base.model';

export interface SpellAttributes {
  category?: string | null;
  creator?: string | null;
  effect?: string | null;
  hand?: string | null;
  image?: string | null;
  incantation?: string | null;
  light?: string | null;
  name: string;
  slug: string;
  wiki?: string | null;
}

export interface Spell extends BaseResource {
  kind: 'spell';
  category?: string | null;
  creator?: string | null;
  effect?: string | null;
  hand?: string | null;
  incantation?: string | null;
  light?: string | null;
  raw: SpellAttributes;
}
