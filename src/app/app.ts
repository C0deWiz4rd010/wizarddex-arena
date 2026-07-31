import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

import { NAV_ITEMS, PRIMARY_NAV } from './core/config/nav.config';
import { ConnectivityService } from './core/services/connectivity.service';
import { AppSettingsStore } from './core/stores/app-settings.store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navItems = NAV_ITEMS;
  protected readonly primaryNav = PRIMARY_NAV;
  protected readonly online = inject(ConnectivityService).online;

  constructor() {
    // Instantiate settings early so theme/motion attributes are applied app-wide.
    inject(AppSettingsStore);

    const updates = inject(SwUpdate);
    if (updates.isEnabled) {
      updates.versionUpdates
        .pipe(filter((event) => event.type === 'VERSION_READY'))
        .subscribe(() => {
          // A fresh build is available — activate it and reload to apply.
          void updates.activateUpdate().then(() => document.location.reload());
        });
    }
  }
}
