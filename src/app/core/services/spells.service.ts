import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PagedResult } from '../api/json-api.types';
import { PotterDbClient } from '../api/potter-db-client';
import { DEFAULT_PAGE_SIZE, PotterQuery } from '../api/query-builder';
import { mapSpell } from '../mappers/spell.mapper';
import { Spell, SpellAttributes } from '../models/spell.model';
import { seededIndex } from '../utils/seed-random';

@Injectable({ providedIn: 'root' })
export class SpellsService {
  private readonly client = inject(PotterDbClient);
  private readonly path = 'spells';

  list(query: PotterQuery = {}): Observable<PagedResult<Spell>> {
    return this.client
      .list<SpellAttributes>(this.path, { size: DEFAULT_PAGE_SIZE, ...query })
      .pipe(map((res) => ({ ...res, items: res.items.map((i) => mapSpell(i.id, i.attributes)) })));
  }

  get(idOrSlug: string): Observable<Spell> {
    return this.client
      .get<SpellAttributes>(this.path, idOrSlug)
      .pipe(map((r) => mapSpell(r.id, r.attributes)));
  }

  randomBySeed(seed: string, total: number): Observable<Spell> {
    const page = seededIndex(seed, Math.max(1, total)) + 1;
    return this.client
      .list<SpellAttributes>(this.path, { size: 1, page })
      .pipe(map((res) => mapSpell(res.items[0].id, res.items[0].attributes)));
  }
}
