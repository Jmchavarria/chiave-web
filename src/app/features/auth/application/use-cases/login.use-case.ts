import { Injectable } from '@angular/core';
import { AuthRepository, loginResponse } from '../../domain/repositories/auth.repository';
import { promises } from 'dns';
import { PaginatedResult } from '../../../../core/types/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<loginResponse> {
    return this.authRepository.login(email, password);
  }
}
