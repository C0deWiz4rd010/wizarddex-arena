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

import { Potion } from '../../../core/models/potion.model';
import { PotionsService } from '../../../core/services/potions.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorStateComponent } from '../../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../../design-system/components/page-header.component';
import { SkeletonCardComponent } from '../../../design-system/components/skeleton-card.component';
import { PotionRound, buildRound, isCorrectIngredient, isPlayable } from './potion-lab.logic';

const BEST_KEY = 'wda.potionlab.best.v1';
const START_STABILITY = 100;
const MISTAKE_COST = 25;

type ChipState = 'idle' | 'correct' | 'wrong';

@Component({
  selector: 'wda-potion-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent, SkeletonCardComponent, ErrorStateComponent],
  templateUrl: './potion-lab.page.html',
  styleUrl: './potion-lab.page.css',
})
export class PotionLabPage {
  private readonly potions = inject(PotionsService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private pool: Potion[] = [];

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly round = signal<PotionRound | null>(null);
  protected readonly chipState = signal<Record<string, ChipState>>({});
  protected readonly stability = signal(START_STABILITY);
  protected readonly score = signal(0);
  protected readonly brewed = signal(0);
  protected readonly best = signal(this.loadBest());

  protected readonly found = computed(
    () => Object.values(this.chipState()).filter((s) => s === 'correct').length,
  );
  protected readonly needed = computed(() => this.round()?.correct.length ?? 0);
  protected readonly solved = computed(
    () => this.needed() > 0 && this.found() >= this.needed(),
  );
  protected readonly failed = computed(() => this.stability() <= 0);

  constructor() {
    this.load();
  }

  protected pick(chip: string): void {
    if (this.solved() || this.failed()) {
      return;
    }
    const state = this.chipState();
    if (state[chip] && state[chip] !== 'idle') {
      return;
    }
    const round = this.round();
    if (!round) {
      return;
    }
    if (isCorrectIngredient(round, chip)) {
      this.chipState.set({ ...state, [chip]: 'correct' });
      this.score.update((s) => s + 10);
      if (this.solved()) {
        const bonus = Math.round(this.stability() / 5);
        this.score.update((s) => s + 20 + bonus);
        this.brewed.update((b) => b + 1);
        this.saveBest();
        this.toast.success(`Potion brewed! +${20 + bonus} bonus`);
      }
    } else {
      this.chipState.set({ ...state, [chip]: 'wrong' });
      this.stability.update((v) => Math.max(0, v - MISTAKE_COST));
      if (this.failed()) {
        this.saveBest();
        this.toast.error('The cauldron boiled over!');
      }
    }
  }

  protected nextPotion(): void {
    if (this.pool.length === 0) {
      return;
    }
    const target = this.pool[Math.floor(Math.random() * this.pool.length)];
    this.round.set(buildRound(target, this.pool));
    this.chipState.set({});
    this.stability.set(START_STABILITY);
  }

  protected retry(): void {
    this.score.set(0);
    this.brewed.set(0);
    this.nextPotion();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.potions
      .list({ size: 100, filters: { ingredients_present: 'true' } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.pool = res.items.filter(isPlayable);
          if (this.pool.length < 4) {
            this.error.set(true);
          } else {
            this.nextPotion();
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  private loadBest(): number {
    const raw = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(raw) ? raw : 0;
  }

  private saveBest(): void {
    if (this.score() > this.best()) {
      this.best.set(this.score());
      try {
        localStorage.setItem(BEST_KEY, String(this.score()));
      } catch {
        /* ignore storage errors */
      }
    }
  }
}
