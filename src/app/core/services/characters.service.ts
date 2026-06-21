import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PagedResult } from '../api/json-api.types';
import { PotterDbClient } from '../api/potter-db-client';
import { DEFAULT_PAGE_SIZE, PotterQuery } from '../api/query-builder';
import { mapCharacter } from '../mappers/character.mapper';
import { Character, CharacterAttributes } from '../models/character.model';
import { seededIndex } from '../utils/seed-random';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private readonly client = inject(PotterDbClient);
  private readonly path = 'characters';

  list(query: PotterQuery = {}): Observable<PagedResult<Character>> {
    return this.client
      .list<CharacterAttributes>(this.path, { size: DEFAULT_PAGE_SIZE, ...query })
      .pipe(
        map((res) => ({
          ...res,
          items: res.items.map((i) => mapCharacter(i.id, i.attributes)),
        })),
      );
  }

  get(idOrSlug: string): Observable<Character> {
    return this.client
      .get<CharacterAttributes>(this.path, idOrSlug)
      .pipe(map((r) => mapCharacter(r.id, r.attributes)));
  }

  /** Deterministic "random" pick using a seed and the known total count. */
  randomBySeed(seed: string, total: number): Observable<Character> {
    const size = 1;
    const page = seededIndex(seed, Math.max(1, total)) + 1;
    return this.client
      .list<CharacterAttributes>(this.path, { size, page })
      .pipe(map((res) => mapCharacter(res.items[0].id, res.items[0].attributes)));
  }
}
