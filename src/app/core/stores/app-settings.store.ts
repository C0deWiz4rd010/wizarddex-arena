import { Injectable, computed, effect, signal } from '@angular/core';

export type HouseId = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff' | null;

interface AppSettings {
  house: HouseId;
  reducedMotion: boolean;
  lowPower: boolean;
}

const STORAGE_KEY = 'wda.settings.v1';

function load(): AppSettings {
  const fallback: AppSettings = { house: null, reducedMotion: false, lowPower: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<AppSettings>) } : fallback;
  } catch {
    return fallback;
  }
}

@Injectable({ providedIn: 'root' })
export class AppSettingsStore {
  private readonly state = signal<AppSettings>(load());

  readonly house = computed(() => this.state().house);
  readonly reducedMotion = computed(() => this.state().reducedMotion);
  readonly lowPower = computed(() => this.state().lowPower);

  constructor() {
    effect(() => {
      const value = this.state();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
        /* storage may be unavailable (private mode) — ignore */
      }
    });
  }

  setHouse(house: HouseId): void {
    this.state.update((s) => ({ ...s, house }));
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.state.update((s) => ({ ...s, reducedMotion }));
  }

  setLowPower(lowPower: boolean): void {
    this.state.update((s) => ({ ...s, lowPower }));
  }
}
