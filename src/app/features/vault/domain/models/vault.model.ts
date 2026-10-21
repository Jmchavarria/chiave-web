import { VaultItemTypeEnum } from '../enums/vault-item-type.enum';

export interface VaultModel {
  id: number;
  userId: number;
  title: string;
  type: VaultItemTypeEnum;
  isFavorite: boolean;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt: Date;
  updatedAt: Date;
}
