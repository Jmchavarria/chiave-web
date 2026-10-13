import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Globo de chat con avatares que ilustra el autofill. Decorativa. */
@Component({
  selector: 'app-autofill-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './autofill-tile.component.html',
  styleUrl: './autofill-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutofillTileComponent {}
