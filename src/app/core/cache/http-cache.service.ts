import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap, throwError } from 'rxjs';

import { CachedEntry, wizardDexDb } from './wizard-db';

/**
 * Network-first caching helper backed by IndexedDB (Dexie).
 *
 * Services try the network first; on success the payload is mirrored to the
 * cache, and on failure we fall back to the last known good copy so the app
 * keeps working offline.
 */
@Injectable({ providedIn: 'root' })
export class HttpCacheService {
  private readonly db = wizardDexDb;

  /** Persist a payload under a stable key (fire-and-forget). */
  write(key: string, payload: unknown): void {
    void this.db.entries.put({ key, payload, updatedAt: Date.now() }).catch(() => undefined);
  }

  /** Read a cached payload, or `undefined` when missing/unavailable. */
  async read<T>(key: string): Promise<T | undefined> {
    try {
      const entry = await this.db.entries.get(key);
      return entry?.payload as T | undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Fall back to cache as an observable. Emits the cached value if present,
   * otherwise re-throws the original network error.
   */
  fallback<T>(key: string, originalError: unknown): Observable<T> {
    return from(this.read<T>(key)).pipe(
      switchMap((cached) => (cached !== undefined ? of(cached) : throwError(() => originalError))),
    );
  }

  /** Drop every cached entry. */
  async clear(): Promise<void> {
    try {
      await this.db.entries.clear();
    } catch {
      /* ignore */
    }
  }

  /** Approximate cache size + freshness for the settings screen. */
  async stats(): Promise<{ count: number; newest: number | null }> {
    try {
      const count = await this.db.entries.count();
      const newest = await this.db.entries.orderBy('updatedAt').last();
      return { count, newest: (newest as CachedEntry | undefined)?.updatedAt ?? null };
    } catch {
      return { count: 0, newest: null };
    }
  }
}
