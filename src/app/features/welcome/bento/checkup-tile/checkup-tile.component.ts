import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Tarjeta lima con la tarjeta blanca de "Security check-up". Decorativa por ahora. */
@Component({
  selector: 'app-checkup-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './checkup-tile.component.html',
  styleUrl: './checkup-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckupTileComponent {
  readonly date = input('13 Oct');
  readonly time = input('09:00');
  readonly note = input('all passwords strong');
}
