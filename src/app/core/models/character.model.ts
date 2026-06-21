import { BaseResource } from './base.model';

/** Raw PotterDB character attributes (see docs/03-api.md). */
export interface CharacterAttributes {
  alias_names?: string[] | null;
  animagus?: string | null;
  blood_status?: string | null;
  boggart?: string | null;
  born?: string | null;
  died?: string | null;
  eye_color?: string | null;
  family_member?: string[] | null;
  gender?: string | null;
  hair_color?: string | null;
  height?: string | null;
  house?: string | null;
  image?: string | null;
  jobs?: string[] | null;
  name: string;
  nationality?: string | null;
  patronus?: string | null;
  romances?: string[] | null;
  skin_color?: string | null;
  slug: string;
  species?: string | null;
  titles?: string[] | null;
  wand?: string[] | null;
  weight?: string | null;
  wiki?: string | null;
}

export interface Character extends BaseResource {
  kind: 'character';
  aliasNames: string[];
  animagus?: string | null;
  bloodStatus?: string | null;
  boggart?: string | null;
  born?: string | null;
  died?: string | null;
  eyeColor?: string | null;
  familyMembers: string[];
  gender?: string | null;
  hairColor?: string | null;
  height?: string | null;
  house?: string | null;
  jobs: string[];
  nationality?: string | null;
  patronus?: string | null;
  romances: string[];
  skinColor?: string | null;
  species?: string | null;
  titles: string[];
  wand: string[];
  weight?: string | null;
  raw: CharacterAttributes;
}
