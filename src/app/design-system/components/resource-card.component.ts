import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseResource, ResourceKind } from '../../core/models/base.model';

const KIND_ROUTE: Record<ResourceKind, string> = {
  character: '/characters',
  spell: '/spells',
  potion: '/potions',
  book: '/books',
  movie: '/movies',
  chapter: '/books',
};

const KIND_LABEL: Record<ResourceKind, string> = {
  character: 'Character',
  spell: 'Spell',
  potion: 'Potion',
  book: 'Book',
  movie: 'Movie',
  chapter: 'Chapter',
};

@Component({
  selector: 'wda-resource-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a class="card" [routerLink]="link()" [attr.aria-label]="resource().name + ' — ' + label()">
      <div class="thumb">
        <img
          [src]="resource().image"
          [alt]="resource().name"
          loading="lazy"
          decoding="async"
          width="200"
          height="200"
        />
        <span class="kind">{{ label() }}</span>
      </div>
      <div class="body">
        <h3 class="name">{{ resource().name }}</h3>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
      </div>
    </a>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition:
          transform var(--motion-base) var(--ease-magic),
          border-color var(--motion-base) var(--ease-magic),
          box-shadow var(--motion-base) var(--ease-magic);
      }
      .card:hover,
      .card:focus-visible {
        transform: translateY(-4px);
        border-color: var(--color-gold);
        box-shadow: var(--shadow-card);
        text-decoration: none;
      }
      .thumb {
        position: relative;
        aspect-ratio: 1 / 1;
        background: var(--color-surface-2);
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .kind {
        position: absolute;
        top: var(--space-2);
        left: var(--space-2);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0.15rem 0.5rem;
        border-radius: var(--radius-full);
        background: rgba(7, 5, 15, 0.72);
        color: var(--color-gold-light);
        border: 1px solid var(--border-soft);
      }
      .body {
        padding: var(--space-3);
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .name {
        font-size: var(--text-base);
        font-family: var(--font-display);
        line-height: 1.2;
      }
      .subtitle {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class ResourceCardComponent {
  readonly resource = input.required<BaseResource>();
  readonly subtitle = input<string>('');

  protected readonly label = computed(() => KIND_LABEL[this.resource().kind]);
  protected readonly link = computed(() => {
    const r = this.resource();
    return [KIND_ROUTE[r.kind], r.slug || r.id];
  });
}
