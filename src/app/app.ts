import { Component, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  protected readonly title = signal('chiave-web');

  constructor() {
    console.log('[App] URL inicial:', this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('[Router] Navegación iniciada:', event.url);
      }

      if (event instanceof NavigationEnd) {
        console.log('[Router] Navegación finalizada:', event.urlAfterRedirects);
      }

      if (event instanceof NavigationCancel) {
        console.warn('[Router] Navegación cancelada:', event.url, event.reason);
      }

      if (event instanceof NavigationError) {
        console.error('[Router] Error:', event.url, event.error);
      }
    });
  }
}
