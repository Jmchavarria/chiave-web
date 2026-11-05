import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { AuthRepository } from './features/auth/domain/repositories/auth.repository';
import { AuthHttpRepository } from './features/auth/infrastructure/repositories/auth.http-repository';

import { UserRepository } from './features/users/domain/repositories/user.repository';
import { UserHttpRepository } from './features/users/infrastructure/repositories/user.http-repository';

import { VaultRepository } from './features/vault/domain/repositories/vault.repository';
import { VaultHttpRepository } from './features/vault/infrastructure/repositories/vault.http-repository';

import { authInterceptor } from './features/auth/infrastructure/interceptors/auth.interceptor';
import { AuthService } from './shared/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),

    provideHttpClient(withInterceptors([authInterceptor])),

    provideAppInitializer(() => {
      console.log('🚀 Ejecutando inicializador de autenticación');

      return inject(AuthService).initializeSession();
    }),

    {
      provide: AuthRepository,
      useExisting: AuthHttpRepository,
    },
    {
      provide: UserRepository,
      useExisting: UserHttpRepository,
    },
    {
      provide: VaultRepository,
      useExisting: VaultHttpRepository,
    },
  ],
};
