import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { AuthSessionService } from '../../../application/auth-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isSubmitted = false;
  isLoading = signal<boolean>(false);

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

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.isLoading.set(true);

    this.loginUseCase.execute(email, password);
  }
}
