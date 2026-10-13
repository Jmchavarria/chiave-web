import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

/** Tarjeta principal: título y los dos botones que abren los modales. */
@Component({
  selector: 'app-hero-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './hero-tile.component.html',
  styleUrl: './hero-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTileComponent {
  readonly createAccount = output<void>();
  readonly signIn = output<void>();
}
