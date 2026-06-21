import { Observable, catchError, map, of, startWith } from 'rxjs';

/** Common async UI state for a loaded value. */
export interface Loadable<T> {
  loading: boolean;
  error: boolean;
  data?: T;
}

/** Typed initial value for `toSignal` so `data` stays accessible after narrowing. */
export function initialLoadable<T>(): Loadable<T> {
  return { loading: true, error: false };
}

/** Wrap a source observable into a Loadable stream (loading -> data | error). */
export function loadable<T>(source: Observable<T>): Observable<Loadable<T>> {
  return source.pipe(
    map((data): Loadable<T> => ({ loading: false, error: false, data })),
    startWith<Loadable<T>>({ loading: true, error: false }),
    catchError(() => of<Loadable<T>>({ loading: false, error: true })),
  );
}
