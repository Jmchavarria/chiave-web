import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Tarjeta blanca con la frase grande. Decorativa. */
@Component({
  selector: 'app-statement-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './statement-tile.component.html',
  styleUrl: './statement-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementTileComponent {}
