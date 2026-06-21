import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wda-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="titles">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <div class="actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: var(--space-3);
        margin-block-end: var(--space-5);
      }
      h1 {
        font-size: var(--text-2xl);
      }
      p {
        color: var(--color-text-muted);
        font-size: var(--text-sm);
        margin-block-start: var(--space-1);
      }
      .actions {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
    `,
  ],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
