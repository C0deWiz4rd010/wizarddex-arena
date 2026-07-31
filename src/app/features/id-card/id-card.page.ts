import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { ToastService } from '../../core/services/toast.service';
import { AppSettingsStore, HouseId } from '../../core/stores/app-settings.store';
import { PageHeaderComponent } from '../../design-system/components/page-header.component';

interface HousePalette {
  bg: string;
  accent: string;
  emblem: string;
  motto: string;
}

const HOUSE_PALETTES: Record<Exclude<HouseId, null>, HousePalette> = {
  gryffindor: { bg: '#7f0909', accent: '#ffc500', emblem: '🦁', motto: 'Courage & daring' },
  slytherin: { bg: '#0d6217', accent: '#cfd3d6', emblem: '🐍', motto: 'Ambition & cunning' },
  ravenclaw: { bg: '#000a90', accent: '#946b2d', emblem: '🦅', motto: 'Wit & wisdom' },
  hufflepuff: { bg: '#ecb939', accent: '#372e29', emblem: '🦡', motto: 'Loyalty & patience' },
};

const NEUTRAL_PALETTE: HousePalette = {
  bg: '#1b1630',
  accent: '#d9a441',
  emblem: '✦',
  motto: 'Unsorted, for now',
};

@Component({
  selector: 'wda-id-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  templateUrl: './id-card.page.html',
  styleUrl: './id-card.page.css',
})
export class IdCardPage {
  private readonly settings = inject(AppSettingsStore);
  private readonly toast = inject(ToastService);
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly houses: { id: Exclude<HouseId, null>; label: string }[] = [
    { id: 'gryffindor', label: 'Gryffindor' },
    { id: 'slytherin', label: 'Slytherin' },
    { id: 'ravenclaw', label: 'Ravenclaw' },
    { id: 'hufflepuff', label: 'Hufflepuff' },
  ];

  protected readonly name = signal('A. Wizard');
  protected readonly patronus = signal('Stag');
  protected readonly wand = signal('Holly, phoenix feather, 11"');
  protected readonly species = signal('Human');
  protected readonly house = signal<HouseId>(this.settings.house());

  private readonly palette = computed<HousePalette>(() => {
    const h = this.house();
    return h ? HOUSE_PALETTES[h] : NEUTRAL_PALETTE;
  });

  constructor() {
    effect(() => this.draw());
  }

  protected setName(value: string): void {
    this.name.set(value.slice(0, 28));
  }

  protected setPatronus(value: string): void {
    this.patronus.set(value.slice(0, 28));
  }

  protected setWand(value: string): void {
    this.wand.set(value.slice(0, 40));
  }

  protected setSpecies(value: string): void {
    this.species.set(value.slice(0, 28));
  }

  protected pickHouse(id: HouseId): void {
    this.house.set(this.house() === id ? null : id);
  }

  protected download(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'wizard-id-card.png';
    a.click();
    this.toast.success('Card saved as image');
  }

  protected async share(): Promise<void> {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png'),
    );
    if (blob && typeof navigator.canShare === 'function') {
      const file = new File([blob], 'wizard-id-card.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] }) && typeof navigator.share === 'function') {
        try {
          await navigator.share({ files: [file], title: 'My Wizard ID' });
          return;
        } catch {
          /* cancelled — fall through */
        }
      }
    }
    this.download();
  }

  private draw(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 640;
    const h = 400;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.aspectRatio = '640 / 400';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pal = this.palette();

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0715');
    grad.addColorStop(1, pal.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Border frame
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Header
    ctx.fillStyle = pal.accent;
    ctx.font = '600 16px Cinzel, Georgia, serif';
    ctx.textBaseline = 'top';
    ctx.fillText('MINISTRY OF MAGIC', 40, 40);
    ctx.fillStyle = 'rgba(248,242,223,0.75)';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText('Official Wizarding Identification', 40, 62);

    // Emblem
    ctx.font = '64px serif';
    ctx.textAlign = 'right';
    ctx.fillText(pal.emblem, w - 44, 44);
    ctx.textAlign = 'left';

    // Name
    ctx.fillStyle = '#f8f2df';
    ctx.font = '700 40px Cinzel, Georgia, serif';
    ctx.fillText(this.name() || 'A. Wizard', 40, 120);

    // House line
    ctx.fillStyle = pal.accent;
    ctx.font = '600 20px Inter, system-ui, sans-serif';
    const houseLabel = this.house()
      ? this.house()!.charAt(0).toUpperCase() + this.house()!.slice(1)
      : 'Unsorted';
    ctx.fillText(`House ${houseLabel} — ${pal.motto}`, 40, 172);

    // Fields
    const fields: [string, string][] = [
      ['Patronus', this.patronus() || '—'],
      ['Wand', this.wand() || '—'],
      ['Species', this.species() || '—'],
    ];
    let y = 214;
    for (const [label, value] of fields) {
      ctx.fillStyle = 'rgba(248,242,223,0.6)';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText(label.toUpperCase(), 40, y);
      ctx.fillStyle = '#f8f2df';
      ctx.font = '16px Inter, system-ui, sans-serif';
      ctx.fillText(value, 40, y + 16);
      y += 48;
    }

    // Footer
    ctx.fillStyle = 'rgba(248,242,223,0.55)';
    ctx.font = '12px Fira Code, monospace';
    ctx.fillText('WizardDex Arena · unofficial fan project', 40, h - 44);
  }
}
