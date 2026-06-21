import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NAV_ITEMS, PRIMARY_NAV } from './core/config/nav.config';
import { ConnectivityService } from './core/services/connectivity.service';

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
}
