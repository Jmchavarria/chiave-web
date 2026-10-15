import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { AuthSessionService } from '../../../application/auth-session.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEyeSlashSolid, heroEyeSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
  providers: [
    provideIcons({
      heroEyeSlashSolid,
      heroEyeSolid,
    }),
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = signal<boolean>(false);
  isSubmitted = false;
  isLoading = signal<boolean>(false);
  serverError = signal<string | null>(null);
  private errorTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly loginUseCase: LoginUseCase,
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.serverError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.isLoading.set(true);

    this.loginUseCase
      .execute(email, password)
      .then((authSession) => {
        this.authSessionService.setSession(authSession);

        this.router.navigate(['/auth/verify-email']);
      })
      .catch((error) => {
        const message = error?.error?.error?.message || 'Error';

        if (this.errorTimer) {
          clearTimeout(this.errorTimer);
        }

        this.serverError.set(message);

        this.errorTimer = setTimeout(() => {
          this.serverError.set('');
        }, 5000);
      })
      .finally(() => this.isLoading.set(false));
  }
}
