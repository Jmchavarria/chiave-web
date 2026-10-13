import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { AuthSession } from '../../domain/models/auth-session.model';
import type { RegisterUser } from '../../domain/models/register-user.model';
import { AuthRepository } from '../../domain/repositories/auth.repository';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async login(email: string, password: string): Promise<AuthSession> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthSession>>(`${this.apiUrl}/auth/login`, { email, password }),
    );

    return response.data;
  }

  async register(user: RegisterUser): Promise<void> {
    await firstValueFrom(this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/users`, user));
  }

  async verifyEmail(token: string): Promise<void> {
    await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/auth/verify-email`, null, {
        params: { token },
      }),
    );
  }
}
