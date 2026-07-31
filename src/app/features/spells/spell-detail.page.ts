import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { SpellsService } from '../../core/services/spells.service';
import { Spell } from '../../core/models/spell.model';
import { FavoritesStore } from '../../core/stores/favorites.store';
import { ToastService } from '../../core/services/toast.service';
import { spellStats } from '../../core/utils/combat-score';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { ShareButtonComponent } from '../../design-system/components/share-button.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

const LIGHT_COLORS: Record<string, string> = {
  green: '#5dffb1',
  red: '#ff5f6d',
  blue: '#66d9ff',
  gold: '#f6d782',
  white: '#f8f2df',
  purple: '#a878ff',
  yellow: '#ffd166',
  orange: '#ff9f43',
};

@Component({
  selector: 'wda-spell-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink, SkeletonCardComponent, ErrorStateComponent, ShareButtonComponent],
  templateUrl: './spell-detail.page.html',
  styleUrl: './spell-detail.page.css',
})
export class SpellDetailPage {
  private readonly service = inject(SpellsService);
  protected readonly favorites = inject(FavoritesStore);
  private readonly toast = inject(ToastService);
  protected readonly isDev = isDevMode();

  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => loadable(this.service.get(id)))),
    { initialValue: initialLoadable<Spell>() },
  );

  protected readonly stats = computed(() => {
    const s = this.state().data;
    return s ? spellStats(s) : null;
  });

  protected readonly glow = computed(() => {
    const light = (this.state().data?.light ?? '').toLowerCase();
    for (const key of Object.keys(LIGHT_COLORS)) {
      if (light.includes(key)) {
        return LIGHT_COLORS[key];
      }
    }
    return 'var(--color-magic-purple)';
  });

  protected toggleFavorite(): void {
    const s = this.state().data;
    if (!s) {
      return;
    }
    const wasFavorite = this.favorites.isFavorite('spell', s.id);
    this.favorites.toggle({ kind: 'spell', id: s.id, slug: s.slug, name: s.name, image: s.image });
    this.toast.success(
      wasFavorite ? `Removed ${s.name} from collection` : `Saved ${s.name} to collection`,
    );
  }
}
