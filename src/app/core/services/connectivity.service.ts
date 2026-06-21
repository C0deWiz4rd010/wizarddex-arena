import { Injectable, signal } from '@angular/core';

/**
 * Tracks browser online/offline state as a signal so the UI can surface an
 * offline banner and switch to cached data messaging.
 */
@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly _online = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);

  /** Reactive online state. */
  readonly online = this._online.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._online.set(true));
      window.addEventListener('offline', () => this._online.set(false));
    }
  }
}
