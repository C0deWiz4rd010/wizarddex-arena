import { Routes } from '@angular/router';

export const CHARACTERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./characters-list.page').then((m) => m.CharactersListPage),
    title: 'Characters',
  },
  {
    path: ':id',
    loadComponent: () => import('./character-detail.page').then((m) => m.CharacterDetailPage),
    title: 'Character',
  },
];
