import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SortOption {
  value: string;
  label: string;
}

/** Accessible sort dropdown used across list pages. */
@Component({
  selector: 'wda-sort-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="sort">
      <span class="sort-label">Sort</span>
      <select [value]="value()" (change)="onChange($event)" [attr.aria-label]="'Sort results'">
        @for (opt of options(); track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
    </label>
  `,
  styles: [
    `
      .sort {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .sort-label {
        font-size: var(--text-sm);
        color: var(--color-text-soft);
      }
      select {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-full);
        background: var(--color-surface);
        border: 1px solid var(--border-soft);
        color: var(--color-text);
        font-size: var(--text-sm);
        cursor: pointer;
      }
      select:focus-visible {
        border-color: var(--color-gold);
      }
    `,
  ],
})
export class SortSelectComponent {
  readonly options = input.required<SortOption[]>();
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  protected onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
