import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError, timer } from 'rxjs';

export interface ApiError {
  status: number;
  message: string;
  isNetwork: boolean;
}

/**
 * Functional interceptor that normalizes errors and retries transient failures
 * (network / 5xx / 429) with a short backoff.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount) => {
        const retriable = error.status === 0 || error.status >= 500 || error.status === 429;
        if (!retriable) {
          throw error;
        }
        return timer(retryCount * 400);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      const apiError: ApiError = {
        status: error.status,
        isNetwork: error.status === 0,
        message:
          error.status === 0
            ? 'Network error — the magical archives are unreachable.'
            : (error.error?.error ?? error.message ?? `Request failed (${error.status}).`),
      };
      return throwError(() => apiError);
    }),
  );
};
