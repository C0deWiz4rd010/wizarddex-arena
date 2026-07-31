import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, forkJoin, of, switchMap } from 'rxjs';

import { CharactersService } from '../../core/services/characters.service';
import { CommandPaletteService } from '../../core/services/command-palette.service';
import { PotionsService } from '../../core/services/potions.service';
import { SpellsService } from '../../core/services/spells.service';

interface PaletteItem {
  label: string;
  sublabel: string;
  link: string;
  glyph: string;
}

const NAV_COMMANDS: PaletteItem[] = [
  { label: 'Home', sublabel: 'Go to', link: '/', glyph: '🏠' },
  { label: 'WizardDex', sublabel: 'Go to', link: '/dex', glyph: '🔍' },
  { label: 'Characters', sublabel: 'Go to', link: '/characters', glyph: '🧙' },
  { label: 'Spells', sublabel: 'Go to', link: '/spells', glyph: '✨' },
  { label: 'Potions', sublabel: 'Go to', link: '/potions', glyph: '⚗️' },
  { label: 'Books', sublabel: 'Go to', link: '/books', glyph: '📚' },
  { label: 'Movies', sublabel: 'Go to', link: '/movies', glyph: '🎬' },
  { label: 'Games', sublabel: 'Go to', link: '/games', glyph: '🎮' },
  { label: 'Compare', sublabel: 'Go to', link: '/compare', glyph: '⚔️' },
  { label: 'Collections', sublabel: 'Go to', link: '/collections', glyph: '💛' },
  { label: 'Settings', sublabel: 'Go to', link: '/settings', glyph: '⚙️' },
];

@Component({
  selector: 'wda-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css',
})
export class CommandPaletteComponent {
  private readonly router = inject(Router);
  private readonly characters = inject(CharactersService);
  private readonly spells = inject(SpellsService);
  private readonly potions = inject(PotionsService);
  private readonly palette = inject(CommandPaletteService);

  protected readonly open = this.palette.open;
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly items = signal<PaletteItem[]>(NAV_COMMANDS);
  protected readonly active = signal(0);
  protected readonly loading = signal(false);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    this.search.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const q = term.trim();
          const nav = NAV_COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
          if (q.length < 2) {
            this.loading.set(false);
            return of({ nav, resources: [] as PaletteItem[] });
          }
          this.loading.set(true);
          const filters = { name_cont: q };
          return forkJoin({
            characters: this.characters.list({ size: 5, filters }),
            spells: this.spells.list({ size: 5, filters }),
            potions: this.potions.list({ size: 5, filters }),
          }).pipe(
            switchMap((res) => {
              const resources: PaletteItem[] = [
                ...res.characters.items.map((c) => ({
                  label: c.name,
                  sublabel: 'Character',
                  link: `/characters/${c.slug}`,
                  glyph: '🧙',
                })),
                ...res.spells.items.map((s) => ({
                  label: s.name,
                  sublabel: 'Spell',
                  link: `/spells/${s.slug}`,
                  glyph: '✨',
                })),
                ...res.potions.items.map((p) => ({
                  label: p.name,
                  sublabel: 'Potion',
                  link: `/potions/${p.slug}`,
                  glyph: '⚗️',
                })),
              ];
              return of({ nav, resources });
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe(({ nav, resources }) => {
        this.loading.set(false);
        this.items.set([...nav, ...resources]);
        this.active.set(0);
      });

    // Reset results whenever the query is cleared while closing/opening.
    toObservable(this.open)
      .pipe(takeUntilDestroyed())
      .subscribe((isOpen) => {
        if (isOpen) {
          this.search.setValue('', { emitEvent: false });
          this.items.set(NAV_COMMANDS);
          this.active.set(0);
          setTimeout(() => this.searchInput()?.nativeElement.focus(), 0);
        }
      });
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    const isTrigger = (event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey);
    if (isTrigger) {
      event.preventDefault();
      this.toggle();
      return;
    }
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.activate(this.active());
    }
  }

  protected toggle(): void {
    this.palette.toggle();
  }

  protected close(): void {
    this.palette.close();
  }

  protected move(delta: number): void {
    const count = this.items().length;
    if (count === 0) {
      return;
    }
    this.active.set((this.active() + delta + count) % count);
  }

  protected activate(index: number): void {
    const item = this.items()[index];
    if (!item) {
      return;
    }
    this.close();
    void this.router.navigateByUrl(item.link);
  }
}
