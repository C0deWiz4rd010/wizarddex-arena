import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BaseResource } from '../../core/models/base.model';
import { FavoritesStore } from '../../core/stores/favorites.store';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';

@Component({
  selector: 'wda-collections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, ResourceCardComponent, EmptyStateComponent],
  templateUrl: './collections.page.html',
})
export class CollectionsPage {
  private readonly favorites = inject(FavoritesStore);

  protected readonly count = this.favorites.count;
  protected readonly items = computed<BaseResource[]>(
    () => this.favorites.all().map((f) => ({ ...f, slug: f.slug })) as BaseResource[],
  );

  protected clear(): void {
    this.favorites.clear();
  }
}
