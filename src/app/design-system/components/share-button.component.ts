import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { ToastService } from '../../core/services/toast.service';

/** Shares the current page via the Web Share API, falling back to clipboard copy. */
@Component({
  selector: 'wda-share-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="share" (click)="share()" [attr.aria-label]="'Share ' + title()">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M18 8a3 3 0 1 0-2.8-4L8.9 7.6a3 3 0 1 0 0 4.8l6.3 3.6A3 3 0 1 0 18 16a3 3 0 0 0-2 .8l-6.3-3.6a3 3 0 0 0 0-2.4L16 7.2A3 3 0 0 0 18 8z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Share</span>
    </button>
  `,
  styles: [
    `
      .share {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-full);
        background: var(--color-surface-2);
        border: 1px solid var(--border-soft);
        color: var(--color-text);
        font-size: var(--text-sm);
        transition:
          border-color var(--motion-fast) var(--ease-magic),
          transform var(--motion-fast) var(--ease-magic);
      }
      .share:hover {
        border-color: var(--color-gold);
        transform: translateY(-1px);
      }
    `,
  ],
})
export class ShareButtonComponent {
  private readonly toast = inject(ToastService);

  readonly title = input('this page');

  protected async share(): Promise<void> {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: this.title(), url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      this.toast.success('Link copied to clipboard');
    } catch {
      this.toast.error('Could not copy the link');
    }
  }
}
