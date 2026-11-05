import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[AuthGuard] Ejecutando guard...');
  console.log('[AuthGuard] Inicializando:', authService.isInitializing());
  console.log('[AuthGuard] Autenticado:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    console.log('[AuthGuard] Acceso permitido.');
    return true;
  }

  console.log('[AuthGuard] Acceso denegado. Redirigiendo al login.');

  return router.createUrlTree(['/auth/login']);
};
