import { Routes } from '@angular/router';

export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./movies-list.page').then((m) => m.MoviesListPage),
    title: 'Movies',
  },
  {
    path: ':id',
    loadComponent: () => import('./movie-detail.page').then((m) => m.MovieDetailPage),
    title: 'Movie',
  },
];
