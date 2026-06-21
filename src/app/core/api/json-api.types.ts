/**
 * JSON:API response primitives for the PotterDB API.
 * See docs/03-api.md.
 */

export interface JsonApiResource<TAttributes> {
  id: string;
  type: string;
  attributes: TAttributes;
  links?: { self?: string };
}

export interface JsonApiLinks {
  self?: string;
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
}

export interface JsonApiPaginationMeta {
  pagination?: {
    current?: number;
    next?: number | null;
    prev?: number | null;
    last?: number;
    records?: number;
  };
}

export interface JsonApiListResponse<TAttributes> {
  data: JsonApiResource<TAttributes>[];
  links?: JsonApiLinks;
  meta?: JsonApiPaginationMeta;
}

export interface JsonApiSingleResponse<TAttributes> {
  data: JsonApiResource<TAttributes>;
  links?: JsonApiLinks;
}

/** Normalized paged result handed to feature services. */
export interface PagedResult<T> {
  items: T[];
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number | null;
  total: number | null;
}
