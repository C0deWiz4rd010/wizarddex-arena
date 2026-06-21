import { Routes } from '@angular/router';

export const POTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./potions-list.page').then((m) => m.PotionsListPage),
    title: 'Potions',
  },
  {
    path: ':id',
    loadComponent: () => import('./potion-detail.page').then((m) => m.PotionDetailPage),
    title: 'Potion',
  },
];
