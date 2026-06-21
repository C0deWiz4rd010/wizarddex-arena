import { BaseResource } from './base.model';

export interface ChapterAttributes {
  order?: number | null;
  title: string;
  summary?: string | null;
  slug: string;
}

export interface Chapter extends BaseResource {
  kind: 'chapter';
  order?: number | null;
  summary?: string | null;
  raw: ChapterAttributes;
}
