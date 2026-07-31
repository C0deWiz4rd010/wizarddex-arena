import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'WizardDex Arena',
  },
  {
    path: 'dex',
    loadComponent: () => import('./features/wizarddex/wizarddex.page').then((m) => m.WizardDexPage),
    title: 'WizardDex',
  },
  {
    path: 'characters',
    loadChildren: () =>
      import('./features/characters/characters.routes').then((m) => m.CHARACTERS_ROUTES),
  },
  {
    path: 'spells',
    loadChildren: () => import('./features/spells/spells.routes').then((m) => m.SPELLS_ROUTES),
  },
  {
    path: 'potions',
    loadChildren: () => import('./features/potions/potions.routes').then((m) => m.POTIONS_ROUTES),
  },
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.routes').then((m) => m.BOOKS_ROUTES),
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movies.routes').then((m) => m.MOVIES_ROUTES),
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare.page').then((m) => m.ComparePage),
    title: 'Compare',
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./features/collections/collections.page').then((m) => m.CollectionsPage),
    title: 'Collections',
  },
  {
    path: 'id-card',
    loadComponent: () => import('./features/id-card/id-card.page').then((m) => m.IdCardPage),
    title: 'Wizarding ID Card',
  },
  {
    path: 'games',
    loadChildren: () => import('./features/games/games.routes').then((m) => m.GAMES_ROUTES),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage),
    title: 'Settings',
  },
  { path: '**', redirectTo: '' },
];
