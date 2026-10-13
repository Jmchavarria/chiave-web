import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

export interface VaultItem {
  id: string;
  initial: string;
  name: string;
  username: string;
}

const SAMPLE_ITEMS: VaultItem[] = [
  { id: '1', initial: 'N', name: 'Northwind Mail', username: 'you@example.com' },
  { id: '2', initial: 'A', name: 'Acme Bank', username: 'you_01' },
  { id: '3', initial: 'S', name: 'Studio Git', username: 'you-dev' },
  { id: '4', initial: 'C', name: 'Cloud Console', username: 'you@example.com' },
];

/**
 * Vista previa de la bóveda. Hoy usa datos de ejemplo;
 * al pulsar copiar emite `copyPassword` y muestra el check un momento.
 */
@Component({
  selector: 'app-vault-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './vault-tile.component.html',
  styleUrl: './vault-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultTileComponent {
  readonly items = input<VaultItem[]>(SAMPLE_ITEMS);
  readonly copyPassword = output<VaultItem>();

  protected readonly copiedId = signal<string | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected copy(item: VaultItem): void {
    this.copyPassword.emit(item);
    this.copiedId.set(item.id);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copiedId.set(null), 1500);
  }
}
