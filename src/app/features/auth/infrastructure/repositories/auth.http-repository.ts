import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthRepository, loginResponse } from '../../domain/repositories/auth.repository';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async login(email: string, password: string): Promise<loginResponse> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<loginResponse>>(`${this.apiUrl}/auth/login`, { email, password }),
    );

    return response.data;
  }

  async verifyEmail(userId: number, token: string): Promise<void> {
    await firstValueFrom(
      this.http.post<ApiResponse<void>>(`${this.apiUrl}/auth/verify-email`, null, {
        params: { token, userId },
      }),
    );
  }
}
