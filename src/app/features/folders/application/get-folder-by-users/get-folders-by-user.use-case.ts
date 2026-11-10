import { Injectable } from '@angular/core';
import { FolderRepository } from '../../domain/repositories/folder.repository';
import { FolderModel } from '../../domain/models/folder.model';
import { PaginatedApiResponse } from '../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GetAllFoldersByUserUseCase {
  constructor(private readonly repository: FolderRepository) {}

  execute(): Promise<PaginatedApiResponse<FolderModel>> {
    return this.repository.getAllByUser();
  }
}
