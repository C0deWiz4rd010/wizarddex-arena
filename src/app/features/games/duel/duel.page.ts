import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { RESOURCE_TOTALS } from '../../../core/config/resource-totals';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';
import { AppSettingsStore } from '../../../core/stores/app-settings.store';
import { seededRandom } from '../../../core/utils/seed-random';
import { ErrorStateComponent } from '../../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../../design-system/components/page-header.component';
import { SkeletonCardComponent } from '../../../design-system/components/skeleton-card.component';
import { BattleEvent, BattleResult, Combatant, simulateDuel } from './duel-engine';

@Component({
  selector: 'wda-duel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent, SkeletonCardComponent, ErrorStateComponent],
  templateUrl: './duel.page.html',
  styleUrl: './duel.page.css',
})
export class DuelPage {
  private readonly characters = inject(CharactersService);
  private readonly settings = inject(AppSettingsStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly fighterA = signal<Character | null>(null);
  protected readonly fighterB = signal<Character | null>(null);

  protected readonly combatantA = signal<Combatant | null>(null);
  protected readonly combatantB = signal<Combatant | null>(null);
  protected readonly hpA = signal(0);
  protected readonly hpB = signal(0);
  protected readonly log = signal<BattleEvent[]>([]);
  protected readonly phase = signal<'idle' | 'fighting' | 'done'>('idle');
  protected readonly winnerId = signal<string | null>(null);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopTimer());
    this.newOpponents();
  }

  protected pctA(): number {
    const c = this.combatantA();
    return c ? Math.round((this.hpA() / c.maxHp) * 100) : 0;
  }

  protected pctB(): number {
    const c = this.combatantB();
    return c ? Math.round((this.hpB() / c.maxHp) * 100) : 0;
  }

  protected newOpponents(): void {
    this.stopTimer();
    this.loading.set(true);
    this.error.set(false);
    this.phase.set('idle');
    this.log.set([]);
    this.winnerId.set(null);

    const total = RESOURCE_TOTALS.character;
    const seedA = `duel-${Date.now()}-${Math.floor(Math.random() * 1e6)}-a`;
    const seedB = `duel-${Date.now()}-${Math.floor(Math.random() * 1e6)}-b`;

    forkJoin({
      a: this.characters.randomBySeed(seedA, total),
      b: this.characters.randomBySeed(seedB, total),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ a, b }) => {
          this.fighterA.set(a);
          this.fighterB.set(b);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  protected fight(): void {
    const a = this.fighterA();
    const b = this.fighterB();
    if (!a || !b) {
      return;
    }
    this.stopTimer();
    const seed = `${a.id}:${b.id}:${Date.now()}`;
    const result = simulateDuel(a, b, seededRandom(seed));

    this.combatantA.set(result.combatantA);
    this.combatantB.set(result.combatantB);
    this.hpA.set(result.combatantA.maxHp);
    this.hpB.set(result.combatantB.maxHp);
    this.log.set([]);
    this.phase.set('fighting');

    if (this.settings.reducedMotion()) {
      this.applyAll(result);
      return;
    }

    let i = 0;
    this.timer = setInterval(() => {
      if (i >= result.events.length) {
        this.finish(result);
        return;
      }
      this.applyEvent(result, result.events[i]);
      i++;
    }, 750);
  }

  private applyEvent(result: BattleResult, event: BattleEvent): void {
    if (event.defender === result.combatantA.name) {
      this.hpA.set(event.defenderHp);
    } else {
      this.hpB.set(event.defenderHp);
    }
    this.log.update((entries) => [event, ...entries]);
  }

  private applyAll(result: BattleResult): void {
    for (const event of result.events) {
      this.applyEvent(result, event);
    }
    this.finish(result);
  }

  private finish(result: BattleResult): void {
    this.stopTimer();
    this.winnerId.set(result.winnerId);
    this.phase.set('done');
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
