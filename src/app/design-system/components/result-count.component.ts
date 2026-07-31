import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Compact "showing X of Y" summary for list pages. */
@Component({
  selector: 'wda-result-count',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="result-count" role="status" aria-live="polite">
      @if (loading()) {
        <span>Searching the archives…</span>
      } @else {
        <span
          ><strong>{{ shownLabel() }}</strong> {{ noun() }}</span
        >
      }
    </p>
  `,
  styles: [
    `
      .result-count {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
      strong {
        color: var(--color-text);
        font-variant-numeric: tabular-nums;
      }
    `,
  ],
})
export class ResultCountComponent {
  readonly shown = input.required<number>();
  readonly total = input<number | null>(null);
  readonly noun = input('results');
  readonly loading = input(false);

  protected readonly shownLabel = computed(() => {
    const total = this.total();
    const shown = this.shown().toLocaleString();
    if (total != null && total > this.shown()) {
      return `${shown} of ${total.toLocaleString()}`;
    }
    return total != null ? total.toLocaleString() : shown;
  });
}
