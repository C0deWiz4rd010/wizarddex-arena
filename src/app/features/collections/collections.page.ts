import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BaseResource, ResourceKind } from '../../core/models/base.model';
import { FavoriteRef, FavoritesStore } from '../../core/stores/favorites.store';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';

interface KindTab {
  id: ResourceKind | 'all';
  label: string;
}

const TABS: KindTab[] = [
  { id: 'all', label: 'All' },
  { id: 'character', label: 'Characters' },
  { id: 'spell', label: 'Spells' },
  { id: 'potion', label: 'Potions' },
  { id: 'book', label: 'Books' },
  { id: 'movie', label: 'Movies' },
];

@Component({
  selector: 'wda-collections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, ResourceCardComponent, EmptyStateComponent],
  templateUrl: './collections.page.html',
})
export class CollectionsPage {
  private readonly favorites = inject(FavoritesStore);
  private readonly toast = inject(ToastService);

  protected readonly tabs = TABS;
  protected readonly count = this.favorites.count;
  protected readonly activeKind = signal<ResourceKind | 'all'>('all');

  private readonly allItems = computed<BaseResource[]>(
    () => this.favorites.all().map((f) => ({ ...f, slug: f.slug })) as BaseResource[],
  );

  protected readonly items = computed<BaseResource[]>(() => {
    const kind = this.activeKind();
    return kind === 'all' ? this.allItems() : this.allItems().filter((i) => i.kind === kind);
  });

  protected countFor(id: ResourceKind | 'all'): number {
    return id === 'all' ? this.count() : this.favorites.byKind(id).length;
  }

  protected select(id: ResourceKind | 'all'): void {
    this.activeKind.set(id);
  }

  protected clear(): void {
    this.favorites.clear();
    this.toast.success('Collection cleared');
  }

  protected exportCollection(): void {
    const data = JSON.stringify(this.favorites.all(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wizarddex-collection.json';
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success('Collection exported');
  }

  protected async importCollection(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as FavoriteRef[];
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid file');
      }
      const added = this.favorites.addMany(parsed);
      this.toast.success(added > 0 ? `Imported ${added} favourite(s)` : 'Nothing new to import');
    } catch {
      this.toast.error('Could not read that collection file');
    } finally {
      input.value = '';
    }
  }
}
