import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, forkJoin, map } from 'rxjs';

import { PotterQuery } from '../../core/api/query-builder';
import { BaseResource } from '../../core/models/base.model';
import { CharactersService } from '../../core/services/characters.service';
import { MoviesService } from '../../core/services/movies.service';
import { PotionsService } from '../../core/services/potions.service';
import { SpellsService } from '../../core/services/spells.service';
import { BooksService } from '../../core/services/books.service';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

type Tab = 'all' | 'characters' | 'spells' | 'potions' | 'books' | 'movies';

@Component({
  selector: 'wda-wizarddex',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './wizarddex.page.html',
})
export class WizardDexPage {
  private readonly characters = inject(CharactersService);
  private readonly spells = inject(SpellsService);
  private readonly potions = inject(PotionsService);
  private readonly books = inject(BooksService);
  private readonly movies = inject(MoviesService);

  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'characters', label: 'Characters' },
    { id: 'spells', label: 'Spells' },
    { id: 'potions', label: 'Potions' },
    { id: 'books', label: 'Books' },
    { id: 'movies', label: 'Movies' },
  ];

  protected readonly activeTab = signal<Tab>('all');
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly items = signal<BaseResource[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);
  protected readonly searched = signal(false);

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.run());
  }

  protected selectTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.run();
  }

  protected run(): void {
    const term = this.search.value.trim();
    if (!term) {
      this.items.set([]);
      this.searched.set(false);
      return;
    }
    this.loading.set(true);
    this.error.set(false);
    this.searched.set(true);

    this.source(term).subscribe({
      next: (results) => {
        this.items.set(results);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private source(term: string): Observable<BaseResource[]> {
    const byName: PotterQuery = { size: 24, filters: { name_cont: term } };
    const byTitle: PotterQuery = { size: 24, filters: { title_cont: term } };
    const tab = this.activeTab();

    switch (tab) {
      case 'characters':
        return this.characters.list(byName).pipe(map((r) => r.items));
      case 'spells':
        return this.spells.list(byName).pipe(map((r) => r.items));
      case 'potions':
        return this.potions.list(byName).pipe(map((r) => r.items));
      case 'books':
        return this.books.list(byTitle).pipe(map((r) => r.items));
      case 'movies':
        return this.movies.list(byTitle).pipe(map((r) => r.items));
      case 'all':
      default:
        return forkJoin({
          c: this.characters.list({ ...byName, size: 12 }).pipe(map((r) => r.items)),
          s: this.spells.list({ ...byName, size: 8 }).pipe(map((r) => r.items)),
          p: this.potions.list({ ...byName, size: 8 }).pipe(map((r) => r.items)),
        }).pipe(map(({ c, s, p }) => [...c, ...s, ...p] as BaseResource[]));
    }
  }
}
