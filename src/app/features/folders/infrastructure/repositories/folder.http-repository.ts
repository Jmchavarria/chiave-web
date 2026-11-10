import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../../../core/interfaces/api-response.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { CreateFolderProps, FolderRepository } from '../../domain/repositories/folder.repository';
import { FolderModel } from '../../domain/models/folder.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolderHttpRepository implements FolderRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) {}

  async create(input: CreateFolderProps): Promise<ApiResponse<FolderModel>> {
    return await firstValueFrom(
      this.http.post<ApiResponse<FolderModel>>(`${environment.apiUrl}/folder/`, input),
    );
  }

  async getAllByUser(): Promise<PaginatedApiResponse<FolderModel>> {
    return await firstValueFrom(
      // queda pendiente pasarle los params para los filtros
      this.http.get<PaginatedApiResponse<FolderModel>>(`${environment.apiUrl}/folder/by-user`),
    );
  }

  async update(input?: CreateFolderProps): Promise<ApiResponse<FolderModel>> {
    return await firstValueFrom(
      this.http.patch<ApiResponse<FolderModel>>(`${environment}/folder/`, input),
    );
  }
}
