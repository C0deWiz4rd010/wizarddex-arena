import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { BooksService } from '../../core/services/books.service';
import { Book } from '../../core/models/book.model';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-books-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './books-list.page.html',
})
export class BooksListPage {
  private readonly service = inject(BooksService);

  protected readonly state = toSignal(loadable(this.service.list().pipe(map((res) => res.items))), {
    initialValue: initialLoadable<Book[]>(),
  });
}
