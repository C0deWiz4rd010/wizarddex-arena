import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PagedResult } from '../api/json-api.types';
import { PotterDbClient } from '../api/potter-db-client';
import { PotterQuery } from '../api/query-builder';
import { mapMovie } from '../mappers/movie.mapper';
import { Movie, MovieAttributes } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private readonly client = inject(PotterDbClient);
  private readonly path = 'movies';

  list(query: PotterQuery = {}): Observable<PagedResult<Movie>> {
    return this.client
      .list<MovieAttributes>(this.path, { size: 25, sort: 'release_date', ...query })
      .pipe(map((res) => ({ ...res, items: res.items.map((i) => mapMovie(i.id, i.attributes)) })));
  }

  get(idOrSlug: string): Observable<Movie> {
    return this.client
      .get<MovieAttributes>(this.path, idOrSlug)
      .pipe(map((r) => mapMovie(r.id, r.attributes)));
  }
}
