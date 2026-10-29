import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginatedApiResponse, ApiResponse } from '../interfaces/api-response.interface';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        const body = event.body as PaginatedApiResponse<unknown>;

        if (body && typeof body === 'object' && body.success !== undefined) {
          // Caso 1: Respuesta Paginada (Mantiene success, message y metadatos)
          if ('page' in body && body.page !== undefined) {
            const paginatedResult: PaginatedApiResponse<unknown> = {
              success: body.success,
              message: body.message,
              data: (body.data as unknown[]) ?? [],
              page: body.page,
              limit: body.limit ?? 0,
              total: body.total ?? 0,
              totalPages: body.totalPages ?? 0,
            };

            return event.clone({ body: paginatedResult });
          }

          // Caso 2: Operaciones Simples (Mantiene success, message y data)
          const singleResult: ApiResponse<unknown> = {
            success: body.success,
            message: body.message,
            data: body.data,
          };

          return event.clone({ body: singleResult });
        }
      }
      return event;
    }),
  );
};
