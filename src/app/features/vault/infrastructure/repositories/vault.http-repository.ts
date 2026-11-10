import {
  CreateVaultProps,
  FindByUserId,
  UpdateVaultProps,
  VaultRepository,
} from '../../domain/repositories/vault.repository';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../../../core/interfaces/api-response.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../shared/services/auth.service';
import { VaultModel } from '../../domain/models/vault.model';

@Injectable({
  providedIn: 'root',
})
export class VaultHttpRepository implements VaultRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) {}

  private readonly baseUrl = `${environment.apiUrl}/vault`;

  async findByUserId(filters?: FindByUserId): Promise<PaginatedApiResponse<VaultModel>> {
    let params = new HttpParams();

    if (filters?.filter) {
      filters.filter.forEach((element) => {
        if (element.value !== undefined && element.value !== null) {
          params = params.set(element.name as string, element.value as string);
        }
      });
    }

    return await firstValueFrom(
      this.http.get<PaginatedApiResponse<VaultModel>>(`${this.baseUrl}/by-user`, {
        params,
      }),
    );
  }

  async save(input: CreateVaultProps): Promise<ApiResponse<VaultModel>> {
    return await firstValueFrom(this.http.post<ApiResponse<VaultModel>>(`${this.baseUrl}`, input));
  }

  async update(id: number, input: UpdateVaultProps): Promise<ApiResponse<VaultModel>> {
    return await firstValueFrom(
      this.http.patch<ApiResponse<VaultModel>>(`${this.baseUrl}/${id}`, input),
    );
  }

  async findById(id: number): Promise<ApiResponse<VaultModel>> {
    return await firstValueFrom(this.http.get<ApiResponse<VaultModel>>(`${this.baseUrl}/${id}`));
  }
}
