import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { CharactersService } from '../../core/services/characters.service';
import { Character } from '../../core/models/character.model';
import { characterStats } from '../../core/utils/combat-score';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';

type Slot = 'a' | 'b';

@Component({
  selector: 'wda-compare',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './compare.page.html',
  styleUrl: './compare.page.css',
})
export class ComparePage {
  private readonly characters = inject(CharactersService);

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly results = signal<Character[]>([]);
  protected readonly searching = signal(false);
  protected readonly targetSlot = signal<Slot>('a');

  protected readonly slotA = signal<Character | null>(null);
  protected readonly slotB = signal<Character | null>(null);

  protected readonly statsA = computed(() => {
    const c = this.slotA();
    return c ? characterStats(c) : null;
  });
  protected readonly statsB = computed(() => {
    const c = this.slotB();
    return c ? characterStats(c) : null;
  });

  protected readonly winner = computed<Slot | 'tie' | null>(() => {
    const a = this.statsA();
    const b = this.statsB();
    if (!a || !b) {
      return null;
    }
    if (a.total === b.total) {
      return 'tie';
    }
    return a.total > b.total ? 'a' : 'b';
  });

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.runSearch(term.trim()));
  }

  protected setSlotTarget(slot: Slot): void {
    this.targetSlot.set(slot);
  }

  protected pick(character: Character): void {
    if (this.targetSlot() === 'a') {
      this.slotA.set(character);
    } else {
      this.slotB.set(character);
    }
    this.results.set([]);
    this.search.setValue('', { emitEvent: false });
  }

  private runSearch(term: string): void {
    if (!term) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    this.characters.list({ size: 8, filters: { name_cont: term } }).subscribe({
      next: (res) => {
        this.results.set(res.items);
        this.searching.set(false);
      },
      error: () => this.searching.set(false),
    });
  }
}
