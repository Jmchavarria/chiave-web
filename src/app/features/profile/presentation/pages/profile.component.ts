import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangleSolid, heroTrashSolid } from '@ng-icons/heroicons/solid';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserModel } from '../../../users/domain/models/user.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DeleteUserUseCase } from '../../../users/application/use-cases/delete-user/delete-user.use-case';

const CONFIRM_WORD = 'DELETE';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon, ModalComponent],
  providers: [provideIcons({ heroExclamationTriangleSolid, heroTrashSolid })],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  // Corregido: ya no dice deletFoerm
  readonly deleteForm: FormGroup;
  readonly user: UserModel | null = null;

  readonly confirmWord = CONFIRM_WORD;
  readonly showDelete = signal(false);
  readonly deleting = signal(false);
  readonly serverError = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {
    this.deleteForm = this.fb.nonNullable.group({
      confirmText: ['', [Validators.required, Validators.pattern(`^${CONFIRM_WORD}$`)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
    });

    this.user = this.authService.currentUser();
  }

  get initial(): string {
    return (this.user?.name?.trim().charAt(0) || '?').toUpperCase();
  }

  openDelete(): void {
    this.deleteForm.reset();
    this.serverError.set(null);
    this.showDelete.set(true);
  }

  closeDelete(): void {
    if (this.deleting()) return;
    this.showDelete.set(false);
  }

  async confirmDelete(): Promise<void> {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    this.deleting.set(true);
    this.serverError.set(null);

    try {
      // Si tu caso de uso o servicio HTTP necesita enviar la contraseña al backend:
      const { password } = this.deleteForm.getRawValue();
      await this.deleteUserUseCase.execute(password);

      this.authService.clearSession();
      await this.router.navigate(['/']);
    } catch (err) {
      const status = err instanceof HttpErrorResponse ? err.status : 0;
      this.serverError.set(
        status === 403 || status === 401
          ? 'Contraseña incorrecta.'
          : 'No pudimos eliminar tu cuenta. Intenta de nuevo.',
      );
      this.deleting.set(false);
    }
  }
}
