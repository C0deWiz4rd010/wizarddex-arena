import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wda-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty" role="status">
      <div class="glyph" aria-hidden="true">{{ glyph() }}</div>
      <h3>{{ title() }}</h3>
      @if (message()) {
        <p>{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-2);
        padding: var(--space-7) var(--space-4);
        color: var(--color-text-muted);
      }
      .glyph {
        font-size: 2.6rem;
        filter: drop-shadow(var(--shadow-glow));
      }
      h3 {
        color: var(--color-text);
        font-size: var(--text-lg);
      }
      p {
        max-width: 32ch;
        font-size: var(--text-sm);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly message = input<string>('');
  readonly glyph = input('\u2727');
}
