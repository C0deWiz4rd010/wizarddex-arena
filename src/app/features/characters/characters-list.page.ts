import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { PotterQuery } from '../../core/api/query-builder';
import { Character } from '../../core/models/character.model';
import { CharactersService } from '../../core/services/characters.service';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { ResultCountComponent } from '../../design-system/components/result-count.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';
import { SortOption, SortSelectComponent } from '../../design-system/components/sort-select.component';

const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
const BLOOD_STATUSES = ['Pure-blood', 'Half-blood', 'Muggle-born'];

interface CharacterSort {
  value: string;
  sort: string;
  direction: 'asc' | 'desc';
}

const SORTS: CharacterSort[] = [
  { value: 'name', sort: 'name', direction: 'asc' },
  { value: 'house', sort: 'house', direction: 'asc' },
  { value: 'species', sort: 'species', direction: 'asc' },
  { value: 'born', sort: 'born', direction: 'asc' },
];

@Component({
  selector: 'wda-characters-list',
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
  templateUrl: './characters-list.page.html',
  styleUrl: './characters-list.page.css',
})
export class CharactersListPage {
  private readonly service = inject(CharactersService);

  protected readonly houses = HOUSES;
  protected readonly bloodStatuses = BLOOD_STATUSES;
  protected readonly sortOptions: SortOption[] = [
    { value: 'name', label: 'Name (A–Z)' },
    { value: 'house', label: 'House' },
    { value: 'species', label: 'Species' },
    { value: 'born', label: 'Born' },
  ];
  protected readonly search = new FormControl('', { nonNullable: true });

  protected readonly items = signal<Character[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly searching = signal(false);
  protected readonly error = signal(false);
  protected readonly house = signal<string | null>(null);
  protected readonly bloodStatus = signal<string | null>(null);
  protected readonly livingOnly = signal(false);
  protected readonly sortValue = signal('name');
  protected readonly total = signal<number | null>(null);

  protected readonly hasActiveFilters = computed(
    () =>
      this.house() !== null ||
      this.bloodStatus() !== null ||
      this.livingOnly() ||
      this.search.value.trim().length > 0,
  );

  private page = 1;
  private nextPage: number | null = null;

  constructor() {
    const initialQuery = inject(ActivatedRoute).snapshot.queryParamMap.get('q');
    if (initialQuery) {
      this.search.setValue(initialQuery, { emitEvent: false });
    }
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

  protected selectHouse(house: string | null): void {
    this.house.set(house);
    this.reload();
  }

  protected selectBlood(status: string | null): void {
    this.bloodStatus.set(this.bloodStatus() === status ? null : status);
    this.reload();
  }

  protected toggleLiving(): void {
    this.livingOnly.update((v) => !v);
    this.reload();
  }

  protected changeSort(value: string): void {
    this.sortValue.set(value);
    this.reload();
  }

  protected clearFilters(): void {
    this.house.set(null);
    this.bloodStatus.set(null);
    this.livingOnly.set(false);
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
    const sortDef = SORTS.find((s) => s.value === this.sortValue()) ?? SORTS[0];
    const query: PotterQuery = {
      page: this.page,
      sort: sortDef.sort,
      direction: sortDef.direction,
      filters: {},
    };
    const term = this.search.value.trim();
    if (term) {
      query.filters!['name_cont'] = term;
    }
    if (this.house()) {
      query.filters!['house_eq'] = this.house();
    }
    if (this.bloodStatus()) {
      query.filters!['blood_status_cont'] = this.bloodStatus();
    }
    if (this.livingOnly()) {
      query.filters!['died_null'] = true;
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
