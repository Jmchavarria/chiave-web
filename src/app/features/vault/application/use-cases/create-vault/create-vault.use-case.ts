import { Injectable } from '@angular/core';
import { CreateVaultProps, VaultRepository } from '../../../domain/repositories/vault.repository';
import { VaultModel } from '../../../domain/models/vault.model';
import { ApiResponse } from '../../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateVaultUseCase {
  constructor(private readonly repository: VaultRepository) {}

  public async execute(input: CreateVaultProps): Promise<ApiResponse<VaultModel>> {
    return this.repository.save(input);
  }
}
