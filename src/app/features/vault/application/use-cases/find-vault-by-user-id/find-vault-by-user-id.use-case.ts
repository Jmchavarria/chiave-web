import { Injectable } from '@angular/core';
import { FindByUserId, VaultRepository } from '../../../domain/repositories/vault.repository';
import { VaultModel } from '../../../domain/models/vault.model';
import { PaginatedApiResponse } from '../../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FindVaultByUserIdUseCase {
  constructor(private readonly repository: VaultRepository) {}

  execute(filters?: FindByUserId): Promise<PaginatedApiResponse<VaultModel>> {
    return this.repository.findByUserId(filters);
  }
}
