import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { PotionsService } from '../../core/services/potions.service';
import { Potion } from '../../core/models/potion.model';
import { FavoritesStore } from '../../core/stores/favorites.store';
import { ToastService } from '../../core/services/toast.service';
import { potionStats } from '../../core/utils/combat-score';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { ShareButtonComponent } from '../../design-system/components/share-button.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-potion-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink, SkeletonCardComponent, ErrorStateComponent, ShareButtonComponent],
  templateUrl: './potion-detail.page.html',
  styleUrl: './potion-detail.page.css',
})
export class PotionDetailPage {
  private readonly service = inject(PotionsService);
  protected readonly favorites = inject(FavoritesStore);
  private readonly toast = inject(ToastService);
  protected readonly isDev = isDevMode();

  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => loadable(this.service.get(id)))),
    { initialValue: initialLoadable<Potion>() },
  );

  protected readonly stats = computed(() => {
    const p = this.state().data;
    return p ? potionStats(p) : null;
  });

  protected toggleFavorite(): void {
    const p = this.state().data;
    if (!p) {
      return;
    }
    const wasFavorite = this.favorites.isFavorite('potion', p.id);
    this.favorites.toggle({ kind: 'potion', id: p.id, slug: p.slug, name: p.name, image: p.image });
    this.toast.success(
      wasFavorite ? `Removed ${p.name} from collection` : `Saved ${p.name} to collection`,
    );
  }
}
