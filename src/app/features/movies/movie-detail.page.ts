import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { MoviesService } from '../../core/services/movies.service';
import { Movie } from '../../core/models/movie.model';
import { initialLoadable, loadable } from '../../core/utils/loadable';
import { ErrorStateComponent } from '../../design-system/components/error-state.component';
import { SkeletonCardComponent } from '../../design-system/components/skeleton-card.component';

@Component({
  selector: 'wda-movie-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink, SkeletonCardComponent, ErrorStateComponent],
  templateUrl: './movie-detail.page.html',
  styleUrl: './movie-detail.page.css',
})
export class MovieDetailPage {
  private readonly service = inject(MoviesService);

  readonly id = input.required<string>();

  protected readonly state = toSignal(
    toObservable(this.id).pipe(switchMap((id) => loadable(this.service.get(id)))),
    { initialValue: initialLoadable<Movie>() },
  );
}
