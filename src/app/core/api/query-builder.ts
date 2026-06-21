import { HttpParams } from '@angular/common/http';

export type SortDirection = 'asc' | 'desc';

export type FilterValue = string | number | boolean | null;

export interface PotterQuery {
  page?: number;
  size?: number;
  sort?: string;
  direction?: SortDirection;
  filters?: Record<string, FilterValue>;
}

/** PotterDB `page[size]` maximum is 100 (see docs/03-api.md). */
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 24;

/**
 * Builds JSON:API / Ransack compatible HttpParams from a PotterQuery.
 *  - page[number], page[size]
 *  - sort=field or sort=-field
 *  - filter[field_predicate]=value
 */
export function buildQueryParams(query: PotterQuery = {}): HttpParams {
  let params = new HttpParams();

  if (query.page && query.page > 0) {
    params = params.set('page[number]', String(query.page));
  }

  if (query.size && query.size > 0) {
    const size = Math.min(Math.max(1, Math.trunc(query.size)), MAX_PAGE_SIZE);
    params = params.set('page[size]', String(size));
  }

  if (query.sort) {
    const prefix = query.direction === 'desc' ? '-' : '';
    params = params.set('sort', `${prefix}${query.sort}`);
  }

  if (query.filters) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (value === null || value === undefined || value === '') {
        continue;
      }
      params = params.set(`filter[${key}]`, String(value));
    }
  }

  return params;
}
