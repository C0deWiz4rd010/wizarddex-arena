import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PagedResult } from '../api/json-api.types';
import { PotterDbClient } from '../api/potter-db-client';
import { DEFAULT_PAGE_SIZE, PotterQuery } from '../api/query-builder';
import { mapPotion } from '../mappers/potion.mapper';
import { Potion, PotionAttributes } from '../models/potion.model';
import { seededIndex } from '../utils/seed-random';

@Injectable({ providedIn: 'root' })
export class PotionsService {
  private readonly client = inject(PotterDbClient);
  private readonly path = 'potions';

  list(query: PotterQuery = {}): Observable<PagedResult<Potion>> {
    return this.client
      .list<PotionAttributes>(this.path, { size: DEFAULT_PAGE_SIZE, ...query })
      .pipe(map((res) => ({ ...res, items: res.items.map((i) => mapPotion(i.id, i.attributes)) })));
  }

  get(idOrSlug: string): Observable<Potion> {
    return this.client
      .get<PotionAttributes>(this.path, idOrSlug)
      .pipe(map((r) => mapPotion(r.id, r.attributes)));
  }

  randomBySeed(seed: string, total: number): Observable<Potion> {
    const page = seededIndex(seed, Math.max(1, total)) + 1;
    return this.client
      .list<PotionAttributes>(this.path, { size: 1, page })
      .pipe(map((res) => mapPotion(res.items[0].id, res.items[0].attributes)));
  }
}
