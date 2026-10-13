import { Injectable } from '@angular/core';

export interface PasswordOptions {
  length: number;
  symbols: boolean;
  numbers: boolean;
}

@Injectable({ providedIn: 'root' })
export class PasswordGeneratorService {
  // Se omiten caracteres ambiguos (l, I, O, 0, 1)
  private static readonly LOWER = 'abcdefghijkmnopqrstuvwxyz';
  private static readonly UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  private static readonly DIGITS = '23456789';
  private static readonly SYMBOLS = '!@#$%^&*-_+=?';

  /** Genera una contraseña con crypto.getRandomValues, garantizando al menos un carácter de cada grupo activo. */
  generate(options: PasswordOptions): string {
    const length = Math.min(Math.max(options.length, 8), 64);

    const groups = [PasswordGeneratorService.LOWER, PasswordGeneratorService.UPPER];
    if (options.numbers) groups.push(PasswordGeneratorService.DIGITS);
    if (options.symbols) groups.push(PasswordGeneratorService.SYMBOLS);

    const pool = groups.join('');
    const chars = groups.map((group) => group[this.randomInt(group.length)]);

    while (chars.length < length) {
      chars.push(pool[this.randomInt(pool.length)]);
    }

    return this.shuffle(chars).join('');
  }

  /** Puntaje de 1 a 5 para pintar el medidor de fortaleza. */
  strength(options: PasswordOptions): number {
    const score =
      (options.length >= 12 ? 1 : 0) +
      (options.length >= 16 ? 1 : 0) +
      (options.length >= 24 ? 1 : 0) +
      (options.symbols ? 1 : 0) +
      (options.numbers ? 1 : 0);

    return Math.max(1, Math.min(5, score));
  }

  // Entero aleatorio sin sesgo de módulo
  private randomInt(max: number): number {
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    do {
      crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);
    return buffer[0] % max;
  }

  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
