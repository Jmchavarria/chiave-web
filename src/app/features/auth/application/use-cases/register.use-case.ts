import { Injectable, inject } from '@angular/core';
import type { RegisterUser } from '../../domain/models/register-user.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(user: RegisterUser): Promise<void> {
    return this.authRepository.register(user);
  }
}
