import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(userId: number, token: string): Promise<void> {
    return this.authRepository.verifyEmail(userId, token);
  }
}
