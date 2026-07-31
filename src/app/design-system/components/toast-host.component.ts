import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'wda-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-host" aria-live="polite" aria-atomic="false">
      @for (toast of toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.kind" role="status">
          <span class="dot" aria-hidden="true"></span>
          <span class="msg">{{ toast.message }}</span>
          <button type="button" class="close" aria-label="Dismiss" (click)="dismiss(toast.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-host {
        position: fixed;
        inset-block-end: calc(var(--bottom-nav-height) + var(--space-3));
        inset-inline: 0;
        z-index: var(--z-toast);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        padding-inline: var(--space-4);
        pointer-events: none;
      }
      @media (min-width: 900px) {
        .toast-host {
          inset-block-end: var(--space-5);
          inset-inline-start: var(--sidebar-width);
        }
      }
      .toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        max-width: min(28rem, 92vw);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-full);
        background: color-mix(in srgb, var(--color-bg-elevated) 94%, transparent);
        border: 1px solid var(--border-soft);
        box-shadow: var(--shadow-card);
        color: var(--color-text);
        font-size: var(--text-sm);
        backdrop-filter: blur(12px);
        animation: toast-in var(--motion-base) var(--ease-magic);
      }
      .dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: var(--radius-full);
        flex: none;
        background: var(--color-magic-blue);
      }
      .toast-success .dot {
        background: var(--color-success);
      }
      .toast-error .dot {
        background: var(--color-danger);
      }
      .msg {
        flex: 1;
      }
      .close {
        color: var(--color-text-soft);
        font-size: 1.2rem;
        line-height: 1;
        padding: 0 var(--space-1);
      }
      .close:hover {
        color: var(--color-text);
      }
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(0.75rem) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `,
  ],
})
export class ToastHostComponent {
  private readonly service = inject(ToastService);
  protected readonly toasts = this.service.toasts;

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
