import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent } from '../../design-system/components/page-header.component';

interface GameCard {
  title: string;
  glyph: string;
  description: string;
  status: 'available' | 'soon';
}

@Component({
  selector: 'wda-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  templateUrl: './games.page.html',
  styleUrl: './games.page.css',
})
export class GamesPage {
  protected readonly games: GameCard[] = [
    {
      title: 'Wizard Duel',
      glyph: '\u26A1',
      description: 'Pit two characters against each other and let their stats decide the victor.',
      status: 'soon',
    },
    {
      title: 'Daily Challenge',
      glyph: '\u2728',
      description: 'A new deterministic puzzle every day — guess the witch or wizard.',
      status: 'soon',
    },
    {
      title: 'Potion Lab',
      glyph: '\u2697',
      description: 'Brew potions by matching ingredients before the cauldron boils over.',
      status: 'soon',
    },
    {
      title: 'Spell Trivia',
      glyph: '\u{1F4DC}',
      description: 'How well do you know your incantations? Beat the clock.',
      status: 'soon',
    },
  ];
}
