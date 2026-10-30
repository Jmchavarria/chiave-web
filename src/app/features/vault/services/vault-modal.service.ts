import { Injectable, signal, computed } from '@angular/core';
import { ModalMode } from '../../../core/types/modal-mode.type';
import { VaultItemTypeEnum } from '../domain/enums/vault-item-type.enum';
import { VaultModel } from '../domain/models/vault.model';

@Injectable()
export class VaultModalService {
  // Estado privado interno usando Signals
  private readonly _mode = signal<ModalMode>(null);
  private readonly _selectedVault = signal<VaultModel | null>(null);
  private readonly _activeType = signal<VaultItemTypeEnum>(VaultItemTypeEnum.LOGIN);

  // Exposición pública de solo lectura para los componentes
  readonly mode = this._mode.asReadonly();
  readonly selectedVault = this._selectedVault.asReadonly();
  readonly activeType = this._activeType.asReadonly();

  readonly header = computed(() => {
    const currentMode = this._mode();
    if (!currentMode) return { title: '', description: '' };

    const typeStr = this._activeType().toLowerCase().replace('_', ' ');
    const formattedType = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);

    if (currentMode === 'create') {
      return {
        title: `New ${formattedType}`,
        description: `Fill in the information to create a new ${formattedType.toLowerCase()}.`,
      };
    }

    return {
      title: `Edit ${formattedType}`,
      description: `Update the ${formattedType.toLowerCase()}'s information.`,
    };
  });

  // Acciones de control de estado
  openCreate(initialType: VaultItemTypeEnum = VaultItemTypeEnum.LOGIN): void {
    this._selectedVault.set(null);
    this._activeType.set(initialType);
    this._mode.set('create');
  }

  openEdit(vault: VaultModel): void {
    this._selectedVault.set(vault);
    this._activeType.set(vault.type);
    this._mode.set('edit');
  }

  close(): void {
    this._mode.set(null);
    this._selectedVault.set(null);
  }

  setActiveType(type: VaultItemTypeEnum): void {
    this._activeType.set(type);
  }
}
