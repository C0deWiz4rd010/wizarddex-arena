import { Routes } from '@angular/router';

export const SPELLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./spells-list.page').then((m) => m.SpellsListPage),
    title: 'Spells',
  },
  {
    path: ':id',
    loadComponent: () => import('./spell-detail.page').then((m) => m.SpellDetailPage),
    title: 'Spell',
  },
];
