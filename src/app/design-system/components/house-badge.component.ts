import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'wda-house-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (houseId(); as id) {
      <span class="badge" [attr.data-house]="id">
        <span class="dot" aria-hidden="true"></span>
        {{ house() }}
      </span>
    } @else {
      <span class="badge unknown">No house</span>
    }
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 0.2rem 0.65rem;
        border-radius: var(--radius-full);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.03em;
        background: color-mix(in srgb, var(--house-color, var(--color-surface-2)) 30%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--house-accent, var(--border-soft)) 55%, transparent);
        color: var(--color-text);
      }
      .dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: var(--radius-full);
        background: var(--house-accent, var(--color-text-soft));
        box-shadow: 0 0 8px var(--house-accent, transparent);
      }
      .unknown {
        color: var(--color-text-soft);
        border-color: var(--border-soft);
      }
    `,
  ],
})
export class HouseBadgeComponent {
  readonly house = input<string | null | undefined>(null);

  protected readonly houseId = computed(() => {
    const h = (this.house() ?? '').toLowerCase();
    if (h.includes('gryffindor')) return 'gryffindor';
    if (h.includes('slytherin')) return 'slytherin';
    if (h.includes('ravenclaw')) return 'ravenclaw';
    if (h.includes('hufflepuff')) return 'hufflepuff';
    return null;
  });
}
