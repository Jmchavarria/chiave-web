import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';

@Component({
  selector: 'app-illustration-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './illustration-tile.component.html',
  styleUrl: './illustration-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IllustrationTileComponent {}
