import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { RESOURCE_TOTALS } from '../../../core/config/resource-totals';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';
import { dailySeed } from '../../../core/utils/seed-random';
import { valueOr } from '../../../core/utils/text';
import { ErrorStateComponent } from '../../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../../design-system/components/page-header.component';
import { SkeletonCardComponent } from '../../../design-system/components/skeleton-card.component';

interface Clue {
  label: string;
  value: string;
}

interface Guess {
  name: string;
  correct: boolean;
}

const MAX_GUESSES = 6;
const STREAK_KEY = 'wda.guess.streak.v1';

@Component({
  selector: 'wda-guess',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    SkeletonCardComponent,
    ErrorStateComponent,
  ],
  templateUrl: './guess.page.html',
  styleUrl: './guess.page.css',
})
export class GuessPage {
  private readonly characters = inject(CharactersService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly target = signal<Character | null>(null);

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly results = signal<Character[]>([]);
  protected readonly guesses = signal<Guess[]>([]);
  protected readonly status = signal<'playing' | 'won' | 'lost'>('playing');
  protected readonly streak = signal(this.loadStreak());

  protected readonly maxGuesses = MAX_GUESSES;
  protected readonly remaining = computed(() => MAX_GUESSES - this.guesses().length);

  /** Clues revealed grows with each wrong guess. */
  protected readonly revealedClues = computed<Clue[]>(() => {
    const c = this.target();
    if (!c) {
      return [];
    }
    const all: Clue[] = [
      { label: 'Species', value: valueOr(c.species) },
      { label: 'Gender', value: valueOr(c.gender) },
      { label: 'House', value: valueOr(c.house) },
      { label: 'Blood status', value: valueOr(c.bloodStatus) },
      { label: 'Patronus', value: valueOr(c.patronus) },
      { label: 'Born', value: valueOr(c.born) },
    ];
    const reveal = Math.min(all.length, 1 + this.guesses().length);
    return all.slice(0, reveal);
  });

  constructor() {
    this.loadTarget();
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => this.runSearch(term.trim()));
  }

  protected guess(character: Character): void {
    if (this.status() !== 'playing') {
      return;
    }
    const target = this.target();
    if (!target) {
      return;
    }
    const correct = character.id === target.id;
    this.guesses.update((g) => [...g, { name: character.name, correct }]);
    this.results.set([]);
    this.search.setValue('', { emitEvent: false });

    if (correct) {
      this.status.set('won');
      this.bumpStreak(true);
    } else if (this.guesses().length >= MAX_GUESSES) {
      this.status.set('lost');
      this.bumpStreak(false);
    }
  }

  private loadTarget(): void {
    this.loading.set(true);
    this.error.set(false);
    this.characters
      .randomBySeed(dailySeed('guess'), RESOURCE_TOTALS.character)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (c) => {
          this.target.set(c);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  private runSearch(term: string): void {
    if (!term || this.status() !== 'playing') {
      this.results.set([]);
      return;
    }
    this.characters.list({ size: 8, filters: { name_cont: term } }).subscribe({
      next: (res) => this.results.set(res.items),
      error: () => this.results.set([]),
    });
  }

  private loadStreak(): number {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      return raw ? (JSON.parse(raw) as { streak: number }).streak : 0;
    } catch {
      return 0;
    }
  }

  private bumpStreak(won: boolean): void {
    const next = won ? this.streak() + 1 : 0;
    this.streak.set(next);
    try {
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ streak: next, date: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
  }
}
