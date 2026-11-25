import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  success(message: string) {
    this.show(message, 'success', 5000);
  }

  error(message: string) {
    this.show(message, 'error', 8000);
  }

  dismiss(id: number) {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(message: string, type: Toast['type'], duration: number) {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, message, type }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), duration),
    );
  }
}
