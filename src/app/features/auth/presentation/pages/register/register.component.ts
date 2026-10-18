import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateUserUseCase } from '../../../../users/application/use-cases/create-user.use-case';
import { CreateUserForm } from '../../../../users/types/user.type';
import { ApiErrorPayload } from '../../../../../shared/infrastructure/http/api-error.response';
import { Component, Signal, computed, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEyeSlashSolid, heroEyeSolid } from '@ng-icons/heroicons/solid';
import {
  matchFields,
  PASSWORD_RULES,
  passwordRulesValidator,
} from '../../../../../shared/utils/password-rules';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ heroEyeSlashSolid, heroEyeSolid })],
  styleUrl: './register.component.scss',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  readonly signIn = output<void>();
  readonly registerForm: FormGroup<CreateUserForm>;
  private readonly password: Signal<string>;

  isSubmitted = false;
  protected readonly loading = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly registeredEmail = signal<string | null>(null);

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
      await this.createUserUseCase.execute({ name, email, password });
      this.registeredEmail.set(email);
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        const payload = e.error as ApiErrorPayload | undefined;
        this.serverError.set(payload?.error?.message ?? 'Something went wrong. Try again.');
      } else {
        this.serverError.set('Something went wrong. Try again.');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
