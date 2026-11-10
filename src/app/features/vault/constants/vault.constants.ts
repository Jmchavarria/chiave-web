import { VaultItemTypeEnum } from '../domain/enums/vault-item-type.enum';

export const VAULT_TYPE_LABELS: Record<VaultItemTypeEnum, string> = {
  [VaultItemTypeEnum.LOGIN]: 'Login',
  [VaultItemTypeEnum.CARD]: 'Card',
  [VaultItemTypeEnum.IDENTITY]: 'Identity',
  [VaultItemTypeEnum.SECURE_NOTE]: 'Note',
  [VaultItemTypeEnum.SSH_KEY]: 'SSH key',
};
