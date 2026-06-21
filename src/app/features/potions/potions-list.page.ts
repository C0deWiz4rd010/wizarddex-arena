import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { PotterQuery } from '../../core/api/query-builder';
import { Potion } from '../../core/models/potion.model';
import { PotionsService } from '../../core/services/potions.service';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-potions-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './potions-list.page.html',
})
export class PotionsListPage {
  private readonly service = inject(PotionsService);

  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly items = signal<Potion[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadingMore = signal(false);
  protected readonly error = signal(false);

  private page = 1;
  private nextPage: number | null = null;

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.reload());
    this.reload();
  }

  protected get hasMore(): boolean {
    return this.nextPage !== null;
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
    const query: PotterQuery = { page: this.page, sort: 'name', filters: {} };
    const term = this.search.value.trim();
    if (term) {
      query.filters!['name_cont'] = term;
    }
    this.service.list(query).subscribe({
      next: (res) => {
        this.items.update((cur) => (reset ? res.items : [...cur, ...res.items]));
        this.nextPage = res.nextPage;
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }
}
