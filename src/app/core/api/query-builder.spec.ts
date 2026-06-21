import { describe, expect, it } from 'vitest';

import { buildQueryParams, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './query-builder';

describe('buildQueryParams', () => {
  it('returns empty params for an empty query', () => {
    expect(buildQueryParams().keys().length).toBe(0);
  });

  it('sets page[number] and page[size]', () => {
    const params = buildQueryParams({ page: 3, size: 24 });
    expect(params.get('page[number]')).toBe('3');
    expect(params.get('page[size]')).toBe('24');
  });

  it('clamps size to the API maximum', () => {
    const params = buildQueryParams({ size: 999 });
    expect(params.get('page[size]')).toBe(String(MAX_PAGE_SIZE));
  });

  it('encodes ascending and descending sort', () => {
    expect(buildQueryParams({ sort: 'name' }).get('sort')).toBe('name');
    expect(buildQueryParams({ sort: 'name', direction: 'desc' }).get('sort')).toBe('-name');
  });

  it('builds ransack filter keys and skips empty values', () => {
    const params = buildQueryParams({ filters: { name_cont: 'harry', house_eq: '' } });
    expect(params.get('filter[name_cont]')).toBe('harry');
    expect(params.has('filter[house_eq]')).toBe(false);
  });

  it('exposes sensible page-size constants', () => {
    expect(DEFAULT_PAGE_SIZE).toBeLessThanOrEqual(MAX_PAGE_SIZE);
  });
});
