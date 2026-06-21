import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { MoviesService } from '../../core/services/movies.service';
import { Movie } from '../../core/models/movie.model';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { EmptyStateComponent } from '../../design-system/components/empty-state.component';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';
import { ResourceCardComponent } from '../../design-system/components/resource-card.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-movies-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    ResourceCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './movies-list.page.html',
})
export class MoviesListPage {
  private readonly service = inject(MoviesService);

  protected readonly state = toSignal(loadable(this.service.list().pipe(map((res) => res.items))), {
    initialValue: initialLoadable<Movie[]>(),
  });
}
