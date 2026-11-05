import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, switchMap, throwError, from } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

// Bandera global para evitar bucles infinitos de llamadas al refresh
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Usamos el Injector en lugar de inyectar AuthService directamente arriba
  const injector = inject(Injector);

  // Obtenemos el AuthService de manera perezosa cuando se necesita
  const authService = injector.get(AuthService);
  const token = authService.getToken();

  // 1. Si tenemos un token en memoria, lo inyectamos
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 2. Enviamos la petición y atrapamos posibles errores 401
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 y no estamos refrescando ya
      if (error.status === 401 && !isRefreshing) {
        // Evitamos bucles si la petición que falló fue la de login o refresh
        if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login')) {
          return throwError(() => error);
        }

        isRefreshing = true;

        return from(authService.refreshToken()).pipe(
          switchMap((newAccessToken) => {
            isRefreshing = false;

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authService.clearSession();
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
