import { Component, Signal, computed, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEyeSlashSolid, heroEyeSolid } from '@ng-icons/heroicons/solid';
import { CreateUserUseCase } from '../../../../users/application/use-cases/create-user.use-case';
import {
  matchFields,
  PASSWORD_RULES,
  passwordRulesValidator,
} from '../../../../../shared/utils/password-rules';
import { CreateUserForm, UserStatus } from '../../../../users/types/user.type';

type Field = 'name' | 'email' | 'password' | 'confirmPassword';

const MESSAGES: Record<Field, Record<string, string>> = {
  name: { required: 'Enter your name.', maxlength: 'Maximum 100 characters.' },
  email: {
    required: 'Email is required.',
    email: 'Enter a valid email address.',
    maxlength: 'Maximum 254 characters.',
  },
  password: {
    required: 'Password is required.',
    maxlength: 'Maximum 128 characters.',
    passwordRules: 'Password doesn’t meet the requirements.',
  },
  confirmPassword: { required: 'Confirm your password.', mismatch: 'Passwords don’t match.' },
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ heroEyeSlashSolid, heroEyeSolid })],
  styleUrl: './register.component.scss',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  readonly registerForm: FormGroup<CreateUserForm>;

  // Declarado sin valor: se asigna en el constructor, cuando el formulario ya existe
  private readonly password: Signal<string>;

  isSubmitted = false;
  readonly registered = output<string>(); // emite el email al registrarse
  readonly signIn = output<void>();
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly rules = computed(() =>
    PASSWORD_RULES.map((rule) => ({ label: rule.label, ok: rule.test(this.password()) })),
  );

  protected readonly meter = computed(() => {
    const score = this.rules().filter((r) => r.ok).length;
    return [0, 1, 2, 3].map((i) => i < score);
  });

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly fb: FormBuilder,
  ) {
    this.registerForm = this.fb.nonNullable.group(
      {
        name: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
        password: ['', [Validators.required, Validators.maxLength(128), passwordRulesValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: matchFields('password', 'confirmPassword') },
    );

    this.password = toSignal(this.registerForm.controls.password.valueChanges, {
      initialValue: '',
    });
  }

  /** Primer error del campo, ya traducido a mensaje; null si no hay o aún no lo tocó. */
  protected error(field: Field): string | null {
    const control = this.registerForm.controls[field];
    if (!control.touched) return null;

    // El "mismatch" vive en el grupo, pero se muestra bajo el campo de confirmación
    const errors =
      field === 'confirmPassword'
        ? { ...control.errors, ...this.registerForm.errors }
        : control.errors;
    const key = Object.keys(errors ?? {})[0];
    return key ? (MESSAGES[field][key] ?? null) : null;
  }

  protected async onSubmit(): Promise<void> {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    this.loading.set(true);
    this.serverError.set(null);

    try {
      await this.createUserUseCase.execute({
        name,
        email,
        password,
      });
      this.registered.emit(email);
    } catch (e: any) {
      this.serverError.set(e?.error?.error?.message ?? 'Something went wrong. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
