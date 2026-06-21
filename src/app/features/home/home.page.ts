import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, catchError, forkJoin, map, of, startWith } from 'rxjs';

import { RESOURCE_TOTALS } from '../../core/config/resource-totals';
import { Character } from '../../core/models/character.model';
import { Potion } from '../../core/models/potion.model';
import { Spell } from '../../core/models/spell.model';
import { CharactersService } from '../../core/services/characters.service';
import { PotionsService } from '../../core/services/potions.service';
import { SpellsService } from '../../core/services/spells.service';
import { dailySeed } from '../../core/utils/seed-random';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';
import { SparkleLayerComponent } from '../../design-system/components/sparkle-layer.component';

interface Featured {
  character: Character;
  spell: Spell;
  potion: Potion;
}

interface FeaturedState {
  loading: boolean;
  error: boolean;
  data?: Featured;
}

@Component({
  selector: 'wda-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    SparkleLayerComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly characters = inject(CharactersService);
  private readonly spells = inject(SpellsService);
  private readonly potions = inject(PotionsService);

  protected readonly totals = RESOURCE_TOTALS;

  protected readonly quickLinks = [
    { path: '/characters', label: 'Characters', count: RESOURCE_TOTALS.character },
    { path: '/spells', label: 'Spells', count: RESOURCE_TOTALS.spell },
    { path: '/potions', label: 'Potions', count: RESOURCE_TOTALS.potion },
    { path: '/books', label: 'Books', count: RESOURCE_TOTALS.book },
    { path: '/movies', label: 'Movies', count: RESOURCE_TOTALS.movie },
    { path: '/games', label: 'Games', count: null },
  ];

  protected readonly featured$: Observable<FeaturedState> = forkJoin({
    character: this.characters.randomBySeed(dailySeed('character'), RESOURCE_TOTALS.character),
    spell: this.spells.randomBySeed(dailySeed('spell'), RESOURCE_TOTALS.spell),
    potion: this.potions.randomBySeed(dailySeed('potion'), RESOURCE_TOTALS.potion),
  }).pipe(
    map((data): FeaturedState => ({ loading: false, error: false, data })),
    startWith<FeaturedState>({ loading: true, error: false }),
    catchError(() => of<FeaturedState>({ loading: false, error: true })),
  );
}
