import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { JsonApiListResponse, JsonApiSingleResponse, PagedResult } from './json-api.types';
import { PotterQuery, buildQueryParams } from './query-builder';

export const POTTER_DB_BASE_URL = 'https://api.potterdb.com/v1';

/**
 * Generic JSON:API client for the PotterDB API.
 * Feature services build on top of this — components never call it directly.
 */
@Injectable({ providedIn: 'root' })
export class PotterDbClient {
  private readonly http = inject(HttpClient);

  /** Fetch a paginated list of resources of a given collection path. */
  list<TAttributes>(
    path: string,
    query: PotterQuery = {},
  ): Observable<PagedResult<{ id: string; attributes: TAttributes }>> {
    const params = buildQueryParams(query);
    return this.http
      .get<JsonApiListResponse<TAttributes>>(`${POTTER_DB_BASE_URL}/${path}`, { params })
      .pipe(map((res) => this.toPagedResult(res, query.page ?? 1)));
  }

  /** Fetch a single resource by UUID or slug. */
  get<TAttributes>(path: string, id: string): Observable<{ id: string; attributes: TAttributes }> {
    return this.http
      .get<JsonApiSingleResponse<TAttributes>>(`${POTTER_DB_BASE_URL}/${path}/${id}`)
      .pipe(map((res) => ({ id: res.data.id, attributes: res.data.attributes })));
  }

  private toPagedResult<TAttributes>(
    res: JsonApiListResponse<TAttributes>,
    requestedPage: number,
  ): PagedResult<{ id: string; attributes: TAttributes }> {
    const pagination = res.meta?.pagination;
    return {
      items: res.data.map((d) => ({ id: d.id, attributes: d.attributes })),
      page: pagination?.current ?? requestedPage,
      nextPage: pagination?.next ?? this.pageFromLink(res.links?.next),
      prevPage: pagination?.prev ?? this.pageFromLink(res.links?.prev),
      lastPage: pagination?.last ?? this.pageFromLink(res.links?.last),
      total: pagination?.records ?? null,
    };
  }

  private pageFromLink(link?: string | null): number | null {
    if (!link) {
      return null;
    }
    const match = /page(?:\[|%5B)number(?:\]|%5D)=(\d+)/.exec(link);
    return match ? Number(match[1]) : null;
  }
}
