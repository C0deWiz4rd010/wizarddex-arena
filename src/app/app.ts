import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

import { NAV_ITEMS, PRIMARY_NAV } from './core/config/nav.config';
import { ConnectivityService } from './core/services/connectivity.service';
import { CommandPaletteService } from './core/services/command-palette.service';
import { ToastService } from './core/services/toast.service';
import { AppSettingsStore } from './core/stores/app-settings.store';
import { CommandPaletteComponent } from './design-system/components/command-palette.component';
import { ToastHostComponent } from './design-system/components/toast-host.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastHostComponent, CommandPaletteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navItems = NAV_ITEMS;
  protected readonly primaryNav = PRIMARY_NAV;
  protected readonly online = inject(ConnectivityService).online;
  private readonly palette = inject(CommandPaletteService);

  protected openSearch(): void {
    this.palette.show();
  }

  constructor() {
    // Instantiate settings early so theme/motion attributes are applied app-wide.
    inject(AppSettingsStore);

    const updates = inject(SwUpdate);
    if (updates.isEnabled) {
      const toast = inject(ToastService);
      updates.versionUpdates
        .pipe(filter((event) => event.type === 'VERSION_READY'))
        .subscribe(() => {
          // A fresh build is available — let the user know, then activate and reload.
          toast.success('A new version is ready — updating…');
          void updates.activateUpdate().then(() => document.location.reload());
        });
    }
  }
}
