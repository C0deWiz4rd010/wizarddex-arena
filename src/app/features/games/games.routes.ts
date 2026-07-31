import { Routes } from '@angular/router';

export const GAMES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./games.page').then((m) => m.GamesPage),
    title: 'Arena',
  },
  {
    path: 'duel',
    loadComponent: () => import('./duel/duel.page').then((m) => m.DuelPage),
    title: 'Wizard Duel',
  },
  {
    path: 'guess',
    loadComponent: () => import('./guess/guess.page').then((m) => m.GuessPage),
    title: 'Daily Challenge',
  },
  {
    path: 'trivia',
    loadComponent: () => import('./trivia/trivia.page').then((m) => m.TriviaPage),
    title: 'Spell Trivia',
  },
  {
    path: 'potion-lab',
    loadComponent: () => import('./potion-lab/potion-lab.page').then((m) => m.PotionLabPage),
    title: 'Potion Lab',
  },
];
