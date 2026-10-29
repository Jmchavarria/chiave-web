import { IQueryParams } from '../../../../core/interfaces/query-params.interface';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../../../core/interfaces/api-response.interface';
import { VaultModel } from '../models/vault.model';
import { VaultItemTypeEnum } from '../enums/vault-item-type.enum';

export interface FindByUserId {
  filter?: IQueryParams[];
}

export interface CreateVaultProps {
  userId: number;
  folderId?: number;
  type: VaultItemTypeEnum;
  title: string;
  isFavorite?: boolean;
  notes?: string;

  // Campos para Login
  username?: string;
  password?: string;
  authenticatorKey?: string;
  website?: string;
  iv?: string; // Vector de inicialización del cifrado cliente
  authTag?: string; // Auth Tag de AES-GCM

  // Campos para Tarjetas (Card)
  cardholderName?: string;
  brand?: string;
  number?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;

  // Campos para Identidad (Identity)
  courtesyTitle?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  identityUsername?: string;
  company?: string;
  ssn?: string;
  passportNumber?: string;
  licenseNumber?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // Campos para Llaves SSH (SSH Key)
  publicKey?: string;
  privateKey?: string;
  fingerPrint?: string;
}

export type UpdateVaultProps = Partial<CreateVaultProps>;

export abstract class VaultRepository {
  abstract findByUserId(filter?: FindByUserId): Promise<PaginatedApiResponse<VaultModel>>;

  abstract save(input: Partial<VaultModel>): Promise<ApiResponse<VaultModel>>;

  abstract update(id: number, input: UpdateVaultProps): Promise<ApiResponse<VaultModel>>;

  abstract findById(id: number): Promise<ApiResponse<VaultModel>>;
}
