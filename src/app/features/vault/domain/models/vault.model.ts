import { VaultItemTypeEnum } from '../enums/vault-item-type.enum'; // O la ruta donde tengas tu enum

export interface VaultModel {
  id: number;
  userId: number;
  folderId?: number | null;
  title: string;
  type: VaultItemTypeEnum;
  isFavorite: boolean;
  notes?: string;

  // Credenciales / Login
  username?: string;
  password?: string;
  authenticatorKey?: string;
  website?: string;
  iv?: string;
  authTag?: string;

  // Tarjetas (Card)
  cardholderName?: string;
  brand?: string;
  number?: string;
  expMonth?: string;
  expYear?: string;
  cvv?: string;

  // Identidad (Identity)
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

  // Llaves SSH (SSH Key)
  publicKey?: string;
  privateKey?: string;
  fingerPrint?: string;

  // Estados de control
  isArchived: boolean;
  isDeleted: boolean;

  // Fechas de auditoría
  createdAt: Date | string;
  updatedAt: Date | string;
}