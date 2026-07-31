import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { PotterQuery } from '../../core/api/query-builder';
import { Spell } from '../../core/models/spell.model';
import { SpellsService } from '../../core/services/spells.service';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { ResultCountComponent } from '../../design-system/components/result-count.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';
import { SortOption, SortSelectComponent } from '../../design-system/components/sort-select.component';

const CATEGORIES = ['Charm', 'Curse', 'Hex', 'Jinx', 'Transfiguration'];

@Component({
  selector: 'wda-spells-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ResultCountComponent,
    SortSelectComponent,
  ],
  templateUrl: './spells-list.page.html',
})
export class SpellsListPage {
  private readonly service = inject(SpellsService);

  protected readonly categories = CATEGORIES;
  protected readonly sortOptions: SortOption[] = [
    { value: 'name', label: 'Name (A–Z)' },
    { value: 'category', label: 'Category' },
  ];
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly items = signal<Spell[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly searching = signal(false);
  protected readonly error = signal(false);
  protected readonly category = signal<string | null>(null);
  protected readonly sortValue = signal('name');
  protected readonly total = signal<number | null>(null);

  protected readonly hasActiveFilters = computed(
    () => this.category() !== null || this.search.value.trim().length > 0,
  );

  private page = 1;
  private nextPage: number | null = null;

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.searching.set(true);
        this.reload();
      });
    this.reload();
  }

  protected get hasMore(): boolean {
    return this.nextPage !== null;
  }

  protected selectCategory(category: string | null): void {
    this.category.set(this.category() === category ? null : category);
    this.reload();
  }

  protected changeSort(value: string): void {
    this.sortValue.set(value);
    this.reload();
  }

  protected clearFilters(): void {
    this.category.set(null);
    this.search.setValue('', { emitEvent: false });
    this.reload();
  }

  protected reload(): void {
    this.page = 1;
    this.loading.set(true);
    this.error.set(false);
    this.fetch(true);
  }

  protected loadMore(): void {
    if (this.nextPage === null || this.loadingMore()) {
      return;
    }
    this.page = this.nextPage;
    this.loadingMore.set(true);
    this.fetch(false);
  }

  private fetch(reset: boolean): void {
    const query: PotterQuery = { page: this.page, sort: this.sortValue(), filters: {} };
    const term = this.search.value.trim();
    if (term) {
      query.filters!['name_cont'] = term;
    }
    if (this.category()) {
      query.filters!['category_cont'] = this.category();
    }
    this.service.list(query).subscribe({
      next: (res) => {
        this.items.update((cur) => (reset ? res.items : [...cur, ...res.items]));
        this.nextPage = res.nextPage;
        this.total.set(res.total);
        this.loading.set(false);
        this.loadingMore.set(false);
        this.searching.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.loadingMore.set(false);
        this.searching.set(false);
      },
    });
  }
}
