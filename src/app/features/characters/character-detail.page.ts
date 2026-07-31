import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { CharactersService } from '../../core/services/characters.service';
import { Character } from '../../core/models/character.model';
import { characterStats } from '../../core/utils/combat-score';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { EntityChipComponent } from '../../design-system/components/entity-chip.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { HouseBadgeComponent } from '../../design-system/components/house-badge.component';
import { ShareButtonComponent } from '../../design-system/components/share-button.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';
import { FavoritesStore } from '../../core/stores/favorites.store';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'wda-character-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    RouterLink,
    HouseBadgeComponent,
    SkeletonCardComponent,
    ErrorStateComponent,
    EntityChipComponent,
    ShareButtonComponent,
  ],
  templateUrl: './character-detail.page.html',
  styleUrl: './character-detail.page.css',
})
export class CharacterDetailPage {
  private readonly service = inject(CharactersService);
  protected readonly favorites = inject(FavoritesStore);
  private readonly toast = inject(ToastService);
  protected readonly isDev = isDevMode();

  /** Route param bound via withComponentInputBinding(). */
  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => loadable(this.service.get(id)))),
    { initialValue: initialLoadable<Character>() },
  );

  protected readonly stats = computed(() => {
    const c = this.state().data;
    return c ? characterStats(c) : null;
  });

  protected toggleFavorite(): void {
    const c = this.state().data;
    if (!c) {
      return;
    }
    const wasFavorite = this.favorites.isFavorite('character', c.id);
    this.favorites.toggle({
      kind: 'character',
      id: c.id,
      slug: c.slug,
      name: c.name,
      image: c.image,
    });
    this.toast.success(
      wasFavorite ? `Removed ${c.name} from collection` : `Saved ${c.name} to collection`,
    );
  }
}
