import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Código de doble factor con un anillo que se vacía cada 30 segundos. Decorativa por ahora. */
@Component({
  selector: 'app-totp-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './totp-tile.component.html',
  styleUrl: './totp-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotpTileComponent {
  readonly code = input('482 913');
}
