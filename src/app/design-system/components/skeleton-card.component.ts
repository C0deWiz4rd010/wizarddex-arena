import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wda-skeleton-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton" [attr.aria-hidden]="true">
      <div class="thumb"></div>
      <div class="lines">
        <span class="line w70"></span>
        <span class="line w40"></span>
      </div>
    </div>
  `,
  styles: [
    `
      .skeleton {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-3);
        background: var(--color-surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg);
      }
      .thumb {
        aspect-ratio: 1 / 1;
        border-radius: var(--radius-md);
      }
      .lines {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .line {
        height: 0.75rem;
        border-radius: var(--radius-full);
      }
      .w70 {
        width: 70%;
      }
      .w40 {
        width: 40%;
      }
      .thumb,
      .line {
        background: linear-gradient(
          100deg,
          var(--color-surface-2) 30%,
          rgba(255, 255, 255, 0.08) 50%,
          var(--color-surface-2) 70%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease-in-out infinite;
      }
      @keyframes shimmer {
        from {
          background-position: 200% 0;
        }
        to {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .thumb,
        .line {
          animation: none;
        }
      }
    `,
  ],
})
export class SkeletonCardComponent {
  readonly count = input(1);
}
