import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'wda-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error" role="alert">
      <div class="glyph" aria-hidden="true">⚠</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (showRetry()) {
        <button type="button" class="retry" (click)="retry.emit()">Try again</button>
      }
    </div>
  `,
  styles: [
    `
      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-3);
        padding: var(--space-7) var(--space-4);
      }
      .glyph {
        font-size: 2.4rem;
        color: var(--color-danger);
      }
      h3 {
        color: var(--color-text);
      }
      p {
        max-width: 40ch;
        color: var(--color-text-muted);
        font-size: var(--text-sm);
      }
      .retry {
        margin-top: var(--space-2);
        padding: var(--space-2) var(--space-5);
        border-radius: var(--radius-full);
        background: var(--color-surface-2);
        border: 1px solid var(--border-soft);
        color: var(--color-text);
        transition: transform var(--motion-fast) var(--ease-magic);
      }
      .retry:hover {
        transform: translateY(-1px);
        border-color: var(--color-gold);
      }
    `,
  ],
})
export class ErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly message = input('The magical archives could not be reached.');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}
