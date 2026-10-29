import { Injectable } from '@angular/core';
import { UpdateVaultProps, VaultRepository } from '../../../domain/repositories/vault.repository';
import { VaultModel } from '../../../domain/models/vault.model';
import { ApiResponse } from '../../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateVaultUseCase {
  constructor(private readonly repository: VaultRepository) {}

  execute(input: { data: UpdateVaultProps; id: number }): Promise<ApiResponse<VaultModel>> {
    return this.repository.update(input.id, input.data);
  }
}
