import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string) {
    return this.authRepository.login(email, password);
  }
}
