import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { BooksService } from '../../core/services/books.service';
import { Book } from '../../core/models/book.model';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { ShareButtonComponent } from '../../design-system/components/share-button.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-book-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink, SkeletonCardComponent, ErrorStateComponent, ShareButtonComponent],
  templateUrl: './book-detail.page.html',
  styleUrl: './book-detail.page.css',
})
export class BookDetailPage {
  private readonly service = inject(BooksService);
  protected readonly isDev = isDevMode();

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
