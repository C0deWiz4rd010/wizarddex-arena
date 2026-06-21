import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppSettingsStore, HouseId } from '../../core/stores/app-settings.store';
import { FavoritesStore } from '../../core/stores/favorites.store';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';

@Component({
  selector: 'wda-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
})
export class SettingsPage {
  private readonly settings = inject(AppSettingsStore);
  private readonly favorites = inject(FavoritesStore);

  protected readonly house = this.settings.house;
  protected readonly reducedMotion = this.settings.reducedMotion;
  protected readonly lowPower = this.settings.lowPower;
  protected readonly favCount = this.favorites.count;

  protected readonly houses: { id: HouseId; label: string }[] = [
    { id: 'gryffindor', label: 'Gryffindor' },
    { id: 'slytherin', label: 'Slytherin' },
    { id: 'ravenclaw', label: 'Ravenclaw' },
    { id: 'hufflepuff', label: 'Hufflepuff' },
  ];

  protected pickHouse(id: HouseId): void {
    this.settings.setHouse(this.house() === id ? null : id);
  }

  protected toggleMotion(event: Event): void {
    this.settings.setReducedMotion((event.target as HTMLInputElement).checked);
  }

  protected toggleLowPower(event: Event): void {
    this.settings.setLowPower((event.target as HTMLInputElement).checked);
  }

  protected clearFavorites(): void {
    this.favorites.clear();
  }
}
