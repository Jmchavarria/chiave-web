import { IQueryParams } from '../../../../core/interfaces/query-params.interface';
import { PaginatedResult } from '../../../../core/types/paginated-response';
import { UserModel } from '../../../users/domain/models/user.model';
import { VaultModel } from '../models/vault.model';

export interface FindByUserId {
  filter?: IQueryParams[];
}

export abstract class VaultRepository {
  abstract findByUserId(
    userId: number,
    filter?: FindByUserId,
  ): Promise<PaginatedResult<VaultModel>>;
}
