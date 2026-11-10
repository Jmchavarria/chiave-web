import { Injectable } from '@angular/core';
import { CreateFolderProps, FolderRepository } from '../../domain/repositories/folder.repository';
import { FolderModel } from '../../domain/models/folder.model';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateFolderUseCase {
  constructor(private readonly repository: FolderRepository) {}

  execute(input?: CreateFolderProps): Promise<ApiResponse<FolderModel>> {
    return this.repository.update(input);
  }
}
