import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Decorative starfield / sparkle background. Pure CSS, respects reduced motion.
 * Render behind content with position: absolute in a positioned container.
 */
@Component({
  selector: 'wda-sparkle-layer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sparkles" aria-hidden="true">
      @for (s of stars(); track s.id) {
        <span
          class="star"
          [style.left.%]="s.x"
          [style.top.%]="s.y"
          [style.width.px]="s.size"
          [style.height.px]="s.size"
          [style.animation-delay.ms]="s.delay"
          [style.animation-duration.ms]="s.duration"
        ></span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .star {
        position: absolute;
        border-radius: var(--radius-full);
        background: radial-gradient(circle, var(--color-gold-light), transparent 70%);
        opacity: 0.7;
        animation: twinkle ease-in-out infinite;
      }
      @keyframes twinkle {
        0%,
        100% {
          opacity: 0.15;
          transform: scale(0.7);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.15);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .star {
          animation: none;
          opacity: 0.4;
        }
      }
    `,
  ],
})
export class SparkleLayerComponent {
  readonly count = input(36);

  protected readonly stars = computed(() =>
    Array.from({ length: this.count() }, (_, id) => ({
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 4000,
      duration: 2200 + Math.random() * 3000,
    })),
  );
}
