import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthRepository } from './features/auth/domain/repositories/auth.repository';
import { AuthHttpRepository } from './features/auth/infrastructure/repositories/auth-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    {
      provide: AuthRepository,
      useExisting: AuthHttpRepository,
    },
  ],
};
