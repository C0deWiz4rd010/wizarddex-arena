import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./books-list.page').then((m) => m.BooksListPage),
    title: 'Books',
  },
  {
    path: ':id',
    loadComponent: () => import('./book-detail.page').then((m) => m.BookDetailPage),
    title: 'Book',
  },
];
