import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterUseCase } from '../../../application/use-cases/register.use-case';

interface RegisterFormControls {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterPage {
  readonly form: FormGroup<RegisterFormControls>;
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly success = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly registerUseCase: RegisterUseCase,
  ) {
    // 3. Asignamos el formulario. Al usar `nonNullable`, automáticamente coincidirá con `FormControl<string>` en lugar de `<string | null>`
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);

    try {
      await this.registerUseCase.execute({ name, email, password });
      this.success.set(true);
      this.form.reset();
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
      return 'No fue posible conectar con el servidor.';
    }

    const response: unknown = error.error;

    if (typeof response === 'object' && response !== null) {
      const body = response as Record<string, unknown>;

      if (typeof body['message'] === 'string') {
        return body['message'];
      }

      if (
        Array.isArray(body['message']) &&
        body['message'].every((item: unknown) => typeof item === 'string')
      ) {
        return body['message'].join(' ');
      }
    }

    if (error.status === 409) {
      return 'Ya existe una cuenta con ese correo electrónico.';
    }

    return 'No fue posible crear la cuenta. Verifica los datos e inténtalo nuevamente.';
  }
}
