import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../design-system/components/page-header.component';

interface GameCard {
  title: string;
  glyph: string;
  description: string;
  route: string | null;
}

@Component({
  selector: 'wda-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent],
  templateUrl: './games.page.html',
  styleUrl: './games.page.css',
})
export class GamesPage {
  protected readonly games: GameCard[] = [
    {
      title: 'Wizard Duel',
      glyph: '\u26A1',
      description:
        'Pit two random characters against each other and watch their stats duel it out.',
      route: '/games/duel',
    },
    {
      title: 'Daily Challenge',
      glyph: '\u2728',
      description: 'A new mystery wizard every day — guess who from the clues.',
      route: '/games/guess',
    },
    {
      title: 'Spell Trivia',
      glyph: '\u{1F4DC}',
      description: 'Match each incantation to its magical effect and beat your best score.',
      route: '/games/trivia',
    },
    {
      title: 'Potion Lab',
      glyph: '\u2697',
      description: 'Brew potions by matching ingredients before the cauldron boils over.',
      route: null,
    },
  ];
}
