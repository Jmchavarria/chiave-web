import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { ApiResponse } from '../../../auth/infrastructure/repositories/auth.http-repository';

@Injectable({
  providedIn: 'root',
})
export class UserHttpRepository extends UserRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async save(input: UserModel): Promise<UserModel> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<UserModel>>(`${this.apiUrl}/users/`, input),
    );
    return response.data;
  }
}
