import { BaseResource } from './base.model';

export interface BookAttributes {
  author?: string | null;
  cover?: string | null;
  dedication?: string | null;
  pages?: number | null;
  release_date?: string | null;
  summary?: string | null;
  slug: string;
  title: string;
  wiki?: string | null;
}

export interface Book extends BaseResource {
  kind: 'book';
  author?: string | null;
  /** Mapped from the API `cover` field; also exposed as `image` on BaseResource. */
  cover?: string | null;
  dedication?: string | null;
  pages?: number | null;
  releaseDate?: string | null;
  summary?: string | null;
  raw: BookAttributes;
}
