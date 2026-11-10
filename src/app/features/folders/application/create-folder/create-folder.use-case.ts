import { Injectable } from '@angular/core';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';
import { FolderModel } from '../../domain/models/folder.model';
import { CreateFolderProps, FolderRepository } from '../../domain/repositories/folder.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateFolderUseCase {
  constructor(private readonly repository: FolderRepository) {}

  execute(input: CreateFolderProps): Promise<ApiResponse<FolderModel>> {
    return this.repository.create(input);
  }
}
