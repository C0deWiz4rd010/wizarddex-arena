import { Injectable, computed, effect, signal } from '@angular/core';

export type HouseId = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff' | null;
export type ThemeId = 'system' | 'dark' | 'light';

interface AppSettings {
  house: HouseId;
  theme: ThemeId;
  reducedMotion: boolean;
  lowPower: boolean;
}

const STORAGE_KEY = 'wda.settings.v1';

function load(): AppSettings {
  const fallback: AppSettings = {
    house: null,
    theme: 'dark',
    reducedMotion: false,
    lowPower: false,
  };
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
  readonly theme = computed(() => this.state().theme);
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

    // Reflect visual settings onto <html> so global CSS can react.
    effect(() => {
      const { theme, reducedMotion, lowPower } = this.state();
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      if (reducedMotion) {
        root.setAttribute('data-motion', 'reduced');
      } else {
        root.removeAttribute('data-motion');
      }
      if (lowPower) {
        root.setAttribute('data-power', 'low');
      } else {
        root.removeAttribute('data-power');
      }
    });
  }

  setHouse(house: HouseId): void {
    this.state.update((s) => ({ ...s, house }));
  }

  setTheme(theme: ThemeId): void {
    this.state.update((s) => ({ ...s, theme }));
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.state.update((s) => ({ ...s, reducedMotion }));
  }

  setLowPower(lowPower: boolean): void {
    this.state.update((s) => ({ ...s, lowPower }));
  }
}
