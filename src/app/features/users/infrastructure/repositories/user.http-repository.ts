import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserModel } from '../../domain/models/user.model';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserHttpRepository implements UserRepository {
  constructor(private readonly http: HttpClient) {}

  async save(input: UserModel): Promise<UserModel> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<UserModel>>(`${environment.apiUrl}/users/`, input),
    );
    return response.data;
  }

  async delete(): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/users/me`));
  }
}
