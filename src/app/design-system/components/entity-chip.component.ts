import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * A clickable chip that links to another resource or a filtered search.
 * Used to cross-reference related entities (family, romances, crew, inventors).
 */
@Component({
  selector: 'wda-entity-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a class="entity-chip" [routerLink]="link()" [queryParams]="queryParams()">
      <span class="label">{{ label() }}</span>
      <span class="arrow" aria-hidden="true">›</span>
    </a>
  `,
  styles: [
    `
      .entity-chip {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-full);
        background: var(--color-surface-2);
        border: 1px solid var(--border-soft);
        color: var(--color-text);
        font-size: var(--text-sm);
        text-decoration: none;
        transition:
          border-color var(--motion-fast) var(--ease-magic),
          transform var(--motion-fast) var(--ease-magic);
      }
      .entity-chip:hover {
        text-decoration: none;
        border-color: var(--color-gold);
        transform: translateY(-1px);
      }
      .arrow {
        color: var(--color-gold);
      }
    `,
  ],
})
export class EntityChipComponent {
  readonly label = input.required<string>();
  readonly link = input.required<string | unknown[]>();
  readonly queryParams = input<Record<string, unknown> | null>(null);
}
