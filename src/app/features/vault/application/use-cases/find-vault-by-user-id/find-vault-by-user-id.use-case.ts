import { Injectable } from '@angular/core';
import { FindByUserId, VaultRepository } from '../../../domain/repositories/vault.repository';
import { PaginatedResult } from '../../../../../core/types/paginated-response';
import { VaultModel } from '../../../domain/models/vault.model';

@Injectable({
  providedIn: 'root',
})
export class FindVaultByUserIdUseCase {
  constructor(private readonly repository: VaultRepository) {}

  async execute(userId: number, filters?: FindByUserId): Promise<PaginatedResult<VaultModel>> {
    return await this.repository.findByUserId(userId, filters);
  }
}
