import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BentoTileComponent } from '../bento-tile/bento-tile.component';
import { PasswordGeneratorService } from '../../../../shared/services/password-generator.service';

/** Generador de contraseñas funcional: longitud, símbolos, números, regenerar y copiar. */
@Component({
  selector: 'app-generator-tile',
  standalone: true,
  imports: [BentoTileComponent],
  templateUrl: './generator-tile.component.html',
  styleUrl: './generator-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorTileComponent {
  private readonly generator = inject(PasswordGeneratorService);

  protected readonly length = signal(16);
  protected readonly symbols = signal(true);
  protected readonly numbers = signal(true);
  protected readonly password = signal('');
  protected readonly copied = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  private readonly options = computed(() => ({
    length: this.length(),
    symbols: this.symbols(),
    numbers: this.numbers(),
  }));

  /** Cinco segmentos del medidor: true = encendido. */
  protected readonly segments = computed(() => {
    const on = this.generator.strength(this.options());
    return Array.from({ length: 5 }, (_, i) => i < on);
  });

  /** Tamaño de fuente para que la contraseña siempre quepa. */
  protected readonly fontSize = computed(() => {
    const length = this.length();
    return length <= 16 ? 26 : length <= 24 ? 20 : 16;
  });

  /** Porcentaje relleno del slider (8 a 32). */
  protected readonly fill = computed(() => ((this.length() - 8) / 24) * 100);

  constructor() {
    this.regenerate();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected regenerate(): void {
    this.password.set(this.generator.generate(this.options()));
  }

  protected onLength(event: Event): void {
    this.length.set(Number((event.target as HTMLInputElement).value));
    this.regenerate();
  }

  protected toggleSymbols(): void {
    this.symbols.update((value) => !value);
    this.regenerate();
  }

  protected toggleNumbers(): void {
    this.numbers.update((value) => !value);
    this.regenerate();
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.password());
    } catch {
      // Sin permiso de portapapeles: el feedback visual se muestra igual.
    }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 1500);
  }
}
