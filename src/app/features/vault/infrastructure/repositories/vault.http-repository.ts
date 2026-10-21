import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PaginatedResult } from '../../../../core/types/paginated-response';
import { VaultModel } from '../../domain/models/vault.model';
import { FindByUserId, VaultRepository } from '../../domain/repositories/vault.repository';

@Injectable({
  providedIn: 'root',
})
export class VaultHttpRepository implements VaultRepository {
  private readonly baseUrl = `${environment.apiUrl}/vault`;

  constructor(private readonly http: HttpClient) {}

  async findByUserId(userId: number, filters?: FindByUserId): Promise<PaginatedResult<VaultModel>> {
    let params = new HttpParams();

    if (filters?.filter) {
      filters.filter.forEach((element) => {
        if (element.value !== undefined && element.value !== null) {
          params = params.set(element.name as string, element.value as string);
        }
      });
    }

    return await firstValueFrom(
      this.http.get<PaginatedResult<VaultModel>>(`${this.baseUrl}/${userId}`, { params }),
    );
  }
}
