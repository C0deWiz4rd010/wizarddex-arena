import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { BooksService } from '../../core/services/books.service';
import { Book } from '../../core/models/book.model';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink, SkeletonCardComponent, ErrorStateComponent],
  templateUrl: './book-detail.page.html',
  styleUrl: './book-detail.page.css',
})
export class BookDetailPage {
  private readonly service = inject(BooksService);

  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => loadable(this.service.get(id)))),
    { initialValue: initialLoadable<Book>() },
  );

  private readonly bookId = computed(() => this.state().data?.id ?? null);

  protected readonly chapters = toSignal(
    toObservable(this.bookId).pipe(
      switchMap((bookId) =>
        bookId ? this.service.chapters(bookId).pipe(map((r) => r.items)) : of([]),
      ),
    ),
    { initialValue: [] },
  );
}
