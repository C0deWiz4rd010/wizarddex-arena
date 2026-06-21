import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Spell } from '../../../core/models/spell.model';
import { SpellsService } from '../../../core/services/spells.service';
import { ErrorStateComponent } from '../../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../../design-system/components/page-header.component';
import { SkeletonCardComponent } from '../../../design-system/components/skeleton-card.component';

interface Question {
  prompt: string;
  options: string[];
  answer: string;
}

const QUESTION_COUNT = 10;
const BEST_KEY = 'wda.trivia.best.v1';

@Component({
  selector: 'wda-trivia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent, SkeletonCardComponent, ErrorStateComponent],
  templateUrl: './trivia.page.html',
  styleUrl: './trivia.page.css',
})
export class TriviaPage {
  private readonly spells = inject(SpellsService);
  private readonly destroyRef = inject(DestroyRef);

  private pool: Spell[] = [];

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly questions = signal<Question[]>([]);
  protected readonly index = signal(0);
  protected readonly score = signal(0);
  protected readonly picked = signal<string | null>(null);
  protected readonly best = signal(this.loadBest());

  protected readonly current = computed(() => this.questions()[this.index()] ?? null);
  protected readonly finished = computed(
    () => this.questions().length > 0 && this.index() >= this.questions().length,
  );
  protected readonly total = QUESTION_COUNT;

  constructor() {
    this.load();
  }

  protected pick(option: string): void {
    if (this.picked()) {
      return;
    }
    this.picked.set(option);
    if (option === this.current()?.answer) {
      this.score.update((s) => s + 1);
    }
  }

  protected next(): void {
    this.picked.set(null);
    this.index.update((i) => i + 1);
    if (this.finished()) {
      this.saveBest(this.score());
    }
  }

  protected restart(): void {
    this.index.set(0);
    this.score.set(0);
    this.picked.set(null);
    this.questions.set(this.buildQuestions(this.pool));
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);
    // Pull a healthy batch of spells that have a usable effect description.
    this.spells
      .list({ size: 100, filters: { effect_present: 'true' } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.pool = res.items.filter((s) => !!s.effect && !!s.name);
          this.questions.set(this.buildQuestions(this.pool));
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  private buildQuestions(pool: Spell[]): Question[] {
    if (pool.length < 4) {
      return [];
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(QUESTION_COUNT, shuffled.length));
    return chosen.map((spell) => {
      const distractors = pool
        .filter((s) => s.id !== spell.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((s) => s.name);
      const options = [spell.name, ...distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `Which spell has this effect: “${spell.effect}”?`,
        options,
        answer: spell.name,
      };
    });
  }

  private loadBest(): number {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  }

  private saveBest(score: number): void {
    if (score > this.best()) {
      this.best.set(score);
      try {
        localStorage.setItem(BEST_KEY, String(score));
      } catch {
        /* ignore */
      }
    }
  }
}
