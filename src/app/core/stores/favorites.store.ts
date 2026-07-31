import { Injectable, computed, effect, signal } from '@angular/core';

import { ResourceKind } from '../models/base.model';

export interface FavoriteRef {
  kind: ResourceKind;
  id: string;
  slug: string;
  name: string;
  image?: string | null;
}

const STORAGE_KEY = 'wda.favorites.v1';

function load(): FavoriteRef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteRef[]) : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly state = signal<FavoriteRef[]>(load());

  readonly all = computed(() => this.state());
  readonly count = computed(() => this.state().length);

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
      } catch {
        /* ignore storage errors */
      }
    });
  }

  isFavorite(kind: ResourceKind, id: string): boolean {
    return this.state().some((f) => f.kind === kind && f.id === id);
  }

  toggle(ref: FavoriteRef): void {
    const exists = this.isFavorite(ref.kind, ref.id);
    this.state.update((list) =>
      exists ? list.filter((f) => !(f.kind === ref.kind && f.id === ref.id)) : [...list, ref],
    );
  }

  byKind(kind: ResourceKind): FavoriteRef[] {
    return this.state().filter((f) => f.kind === kind);
  }

  /** Merge in favourites (e.g. from an imported file), skipping duplicates. */
  addMany(refs: FavoriteRef[]): number {
    let added = 0;
    this.state.update((list) => {
      const next = [...list];
      for (const ref of refs) {
        if (!ref || !ref.kind || !ref.id) {
          continue;
        }
        if (!next.some((f) => f.kind === ref.kind && f.id === ref.id)) {
          next.push(ref);
          added++;
        }
      }
      return next;
    });
    return added;
  }

  clear(): void {
    this.state.set([]);
  }
}
