import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../../../core/interfaces/api-response.interface';
import { FolderModel } from '../models/folder.model';

export interface CreateFolderProps {
  name: string;
}

export abstract class FolderRepository {
  abstract getAllByUser(): Promise<PaginatedApiResponse<FolderModel>>;
  abstract create(input: CreateFolderProps): Promise<ApiResponse<FolderModel>>;
  abstract update(input?: CreateFolderProps): Promise<ApiResponse<FolderModel>>;
}
