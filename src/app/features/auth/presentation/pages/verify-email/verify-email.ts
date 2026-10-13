import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.html',
})
export class VerifyEmailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly verifyEmailUseCase = inject(VerifyEmailUseCase);

  readonly loading = signal(true);
  readonly success = signal(false);
  readonly errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading.set(false);
      this.errorMessage.set('El enlace de confirmación no contiene un token válido.');
      return;
    }

    try {
      await this.verifyEmailUseCase.execute(token);
      this.success.set(true);
    } catch (error: unknown) {
      this.errorMessage.set(this.getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
    }

    if (error.status === 0) {
      return 'No fue posible conectar con el servidor. Inténtalo nuevamente.';
    }

    const response: unknown = error.error;

    if (typeof response === 'object' && response !== null) {
      const body = response as Record<string, unknown>;
      const message = body['message'];

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message) && message.every((item: unknown) => typeof item === 'string')) {
        return message.join(' ');
      }
    }

    if (error.status === 400 || error.status === 401 || error.status === 404) {
      return 'El enlace de confirmación es inválido o ha caducado. Solicita un nuevo enlace si está disponible.';
    }

    return 'No fue posible confirmar tu correo electrónico.';
  }
}
