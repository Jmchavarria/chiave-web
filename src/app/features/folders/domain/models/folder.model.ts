export interface FolderModel {
  id?: number;
  name: string;
  userId: number;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
