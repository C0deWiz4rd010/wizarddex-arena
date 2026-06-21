import Dexie, { Table } from 'dexie';

/** A single cached HTTP payload keyed by request signature. */
export interface CachedEntry {
  key: string;
  payload: unknown;
  updatedAt: number;
}

/**
 * Offline cache for PotterDB responses.
 * Keeps the app usable without a network connection (read-only mirror).
 */
export class WizardDexDb extends Dexie {
  entries!: Table<CachedEntry, string>;

  constructor() {
    super('wizarddex-cache');
    this.version(1).stores({
      entries: 'key, updatedAt',
    });
  }
}

export const wizardDexDb = new WizardDexDb();
