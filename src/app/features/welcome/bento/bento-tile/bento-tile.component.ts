import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BentoVariant = 'dark' | 'strong' | 'white' | 'solid' | 'lime';

/**
 * Envoltorio visual de cada tarjeta del bento.
 * El contenido se proyecta con <ng-content />.
 */
@Component({
  selector: 'app-bento-tile',
  standalone: true,
  templateUrl: './bento-tile.component.html',
  styleUrl: './bento-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BentoTileComponent {
  readonly variant = input<BentoVariant>('dark');
  readonly padding = input('22px');
  /** Si es false, la tarjeta no se eleva al pasar el mouse (útil para la tarjeta principal). */
  readonly interactive = input(true);

  protected readonly classes = computed(() =>
    ['tile', `tile--${this.variant()}`, this.interactive() ? '' : 'tile--static']
      .filter(Boolean)
      .join(' '),
  );
}
