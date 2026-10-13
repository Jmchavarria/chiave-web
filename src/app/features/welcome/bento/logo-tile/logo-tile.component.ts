import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Tarjeta blanca con el logotipo de Chieva. Decorativa. */
@Component({
  selector: 'app-logo-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './logo-tile.component.html',
  styleUrl: './logo-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoTileComponent {}
