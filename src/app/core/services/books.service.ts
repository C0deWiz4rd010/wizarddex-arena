import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PagedResult } from '../api/json-api.types';
import { PotterDbClient } from '../api/potter-db-client';
import { PotterQuery } from '../api/query-builder';
import { mapBook } from '../mappers/book.mapper';
import { mapChapter } from '../mappers/chapter.mapper';
import { Book, BookAttributes } from '../models/book.model';
import { Chapter, ChapterAttributes } from '../models/chapter.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly client = inject(PotterDbClient);
  private readonly path = 'books';

  list(query: PotterQuery = {}): Observable<PagedResult<Book>> {
    return this.client
      .list<BookAttributes>(this.path, { size: 25, sort: 'release_date', ...query })
      .pipe(map((res) => ({ ...res, items: res.items.map((i) => mapBook(i.id, i.attributes)) })));
  }

  get(idOrSlug: string): Observable<Book> {
    return this.client
      .get<BookAttributes>(this.path, idOrSlug)
      .pipe(map((r) => mapBook(r.id, r.attributes)));
  }

  chapters(bookId: string, query: PotterQuery = {}): Observable<PagedResult<Chapter>> {
    return this.client
      .list<ChapterAttributes>(`books/${bookId}/chapters`, { size: 100, sort: 'order', ...query })
      .pipe(
        map((res) => ({ ...res, items: res.items.map((i) => mapChapter(i.id, i.attributes)) })),
      );
  }
}
