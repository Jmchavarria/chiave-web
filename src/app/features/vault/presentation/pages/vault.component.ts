import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckSolid,
  heroChevronDownSolid,
  heroClipboardDocumentSolid,
  heroCreditCardSolid,
  heroDocumentTextSolid,
  heroFolderArrowDownSolid,
  heroFolderPlusSolid,
  heroFolderSolid,
  heroGlobeAltSolid,
  heroLockClosedSolid,
  heroMagnifyingGlassSolid,
  heroPlusSolid,
  heroShieldExclamationSolid,
  heroSquares2x2Solid,
  heroStarSolid,
  heroXMarkSolid,
} from '@ng-icons/heroicons/solid';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NewItemFormComponent } from '../components/new-item.form.component';
import { FindVaultByUserIdUseCase } from '../../application/use-cases/find-vault-by-user-id/find-vault-by-user-id.use-case';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserModel } from '../../../users/domain/models/user.model';
import { VaultModel } from '../../domain/models/vault.model';
import { UpdateVaultUseCase } from '../../application/use-cases/update-vault/update-vault.use-case';
import { CreateVaultUseCase } from '../../application/use-cases/create-vault/create-vault.use-case';
import { CreateVaultProps } from '../../domain/repositories/vault.repository';
import { VaultItemTypeEnum } from '../../domain/enums/vault-item-type.enum';
import { VaultModalService } from '../../services/vault-modal.service';
import { PaginatedApiResponse } from '../../../../core/interfaces/api-response.interface';
import { CreateFolderUseCase } from '../../../folders/application/create-folder/create-folder.use-case';
import { FolderModel } from '../../../folders/domain/models/folder.model';
import { GetAllFoldersByUserUseCase } from '../../../folders/application/get-folder-by-users/get-folders-by-user.use-case';
import { VAULT_TYPE_LABELS } from '../../constants/vault.constants';
import { VaultItem } from '../../../welcome/bento/vault-tile/vault-tile.component';
import { isNgTemplate } from '@angular/compiler';
import { of } from 'rxjs';

// Carpeta solo de interfaz (vive en memoria, se pierde al recargar)
interface UiFolder {
  id: number;
  name: string;
}

// Minúsculas y sin tildes, para que "finanzas" encuentre "Finanzás"
const normalize = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [NgIcon, DatePipe, ReactiveFormsModule, ModalComponent, NewItemFormComponent],
  providers: [
    VaultModalService,
    provideIcons({
      heroCheckSolid,
      heroChevronDownSolid,
      heroClipboardDocumentSolid,
      heroCreditCardSolid,
      heroDocumentTextSolid,
      heroFolderArrowDownSolid,
      heroFolderPlusSolid,
      heroFolderSolid,
      heroGlobeAltSolid,
      heroLockClosedSolid,
      heroMagnifyingGlassSolid,
      heroShieldExclamationSolid,
      heroSquares2x2Solid,
      heroStarSolid,
      heroPlusSolid,
      heroXMarkSolid,
    }),
  ],
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VaultComponent implements OnInit {
  readonly user: UserModel | null;
  serverError = signal<string | null>(null);
  private errorTimer: ReturnType<typeof setTimeout> | null = null;
  isLoading = signal<boolean>(false);
  foldersOpen = signal<boolean>(true);

  constructor(
    private readonly findVaultByUserIdUseCase: FindVaultByUserIdUseCase,
    private readonly updateVaultUseCase: UpdateVaultUseCase,
    private readonly authService: AuthService,
    private readonly createVaultUseCase: CreateVaultUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly getAllFoldersByUserUseCase: GetAllFoldersByUserUseCase,
    protected readonly modalState: VaultModalService,
  ) {
    this.user = this.authService.currentUser();
  }

  readonly vaultItems = signal<PaginatedApiResponse<VaultModel>>({
    data: [],
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
    success: false,
    message: '',
  });

  readonly folders = signal<PaginatedApiResponse<FolderModel>>({
    data: [],
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
    success: false,
    message: '',
  });

  readonly copiedId = signal<number | null>(null);
  private readonly pendingFavorites = new Set<number>();
  readonly typeLabels = VAULT_TYPE_LABELS;
  readonly pageTitle = computed(
    () => this.folders().data.find((f) => f.id === this.selectedFolderId())?.name ?? 'All items',
  );

  readonly selectedFolderId = signal<number | null>(null);

  readonly folderOf = computed(() => {
    const response = this.vaultItems();
    if (!response.data) return {};
    return response.data.reduce<Record<number, number>>((acc, item) => {
      if (item.id != null && item.folderId != null) {
        acc[item.id] = item.folderId;
      }
      return acc;
    }, {});
  });

  private nextFolderId = 1;

  // Filtro de la barra (solo se muestra con muchas carpetas)x
  readonly folderFilter = signal('');
  // readonly showFolderFilter = computed(() => this.folders().length >= FOLDER_FILTER_MIN);
  readonly movingItem = signal<VaultModel | null>(null);
  readonly moveTarget = signal<number | null>(null); // carpeta elegida en el modal "Move"
  readonly showFolderForm = signal(false);
  readonly folderError = signal<string | null>(null);
  readonly folderForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50), Validators.pattern(/\S/)],
    }),
  });

  readonly visibleItems = computed(() => {
    const all = this.vaultItems().data;
    const selected = this.selectedFolderId();
    if (!selected) return all;

    return all.filter((item) => this.folderOf()[item.id] === selected);
  });

  // Texto para la región aria-live: anuncia cada cambio de filtro
  readonly statusMessage = computed(() => {
    // const count = this.visibleItems().length;
    // return `${this.pageTitle()}: ${count} ${count === 1 ? 'item' : 'items'}`;
  });

  toggleFolders() {
    this.foldersOpen.update((currentValue) => !currentValue);
  }

  onFolderFilter(event: Event): void {
    this.folderFilter.set((event.target as HTMLInputElement).value);
  }

  // Devuelve el foco a un elemento lógico después de cerrar o crear algo.
  // Prueba los ids en orden y enfoca el primero que exista.
  private focusLater(...ids: string[]): void {
    setTimeout(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          el.focus();
          return;
        }
      }
    });
  }

  countIn(folderId: number): number {
    return this.vaultItems().data.filter((item: any) => this.folderOf()[item.id] === folderId)
      .length;
  }

  // folderName(item: VaultModel): string | null {
  //   const id = this.folderOf()[item.id];
  //   return this.folders().find((f) => f.id === id)?.name ?? null;
  // }

  selectFolder(id: number | null): void {
    this.selectedFolderId.set(id);
  }

  openFolderForm(): void {
    this.folderForm.reset();
    this.folderError.set(null);
    this.showFolderForm.set(true);
    this.focusLater('folder-name');
  }

  closeFolderForm(): void {
    this.showFolderForm.set(false);
    this.focusLater('new-folder-btn');
  }

  async createFolder(): Promise<void> {
    if (this.folderForm.invalid) {
      this.folderForm.markAllAsTouched();
      return;
    }

    const name = this.folderForm.getRawValue().name.trim();

    await this.createFolderUseCase
      .execute({ name })
      .then(() => {
        this.showFolderForm.set(false);
        this.loadFolders();
      })
      .catch((error) => {
        console.error('Error al crear folder:', error);

        const message = error?.message ?? error?.message ?? 'No fue posible crear el elemento.';

        this.serverError.set(message);

        this.showFolderForm.set(false);
        this.selectFolder(folder.id);
        this.focusLater('folder-' + folder.id); // el foco va a la carpeta recién creada
      });

    const folder: UiFolder = { id: this.nextFolderId++, name };
  }

  openMove(item: VaultModel): void {
    // this.moveTarget.set(this.folderOf()[item.id] ?? null); // preselecciona la carpeta actual
    this.movingItem.set(item);
  }

  closeMove(): void {
    const item = this.movingItem();
    this.movingItem.set(null);
    if (item) this.focusLater('move-' + item.id, 'folders-toggle');
  }

  confirmMove(): void {
    const item = this.movingItem();
    if (!item) return;

    this.closeMove();
  }

  private async loadFolders() {
    if (!this.user?.id) return;
    try {
      const response = await this.getAllFoldersByUserUseCase.execute();
      this.folders.set(response);
    } catch {}
  }

  private createVault(input: CreateVaultProps): void {
    if (this.selectedFolderId())
      this.createVaultUseCase
        .execute({
          ...input,
          folderId: this.selectedFolderId(),
        })
        .then(() => {
          this.modalState.close();
          this.loadVaultItems();
        })
        .catch((error) => {
          console.error('Error al crear vault item:', error);

          const message =
            error?.error?.error?.message ?? error?.message ?? 'No fue posible crear el elemento.';

          this.serverError.set(message);

          if (this.errorTimer) {
            clearTimeout(this.errorTimer);
          }

          this.errorTimer = setTimeout(() => {
            this.serverError.set(null);
          }, 5000);
        })
        .finally(() => {
          this.isLoading.set(false);
        });
  }

  private updateVault(input: CreateVaultProps): void {
    const vault = this.modalState.selectedVault();

    if (!vault) {
      return;
    }

    this.isLoading.set(true);

    this.updateVaultUseCase
      .execute({
        data: input,
        id: vault.id,
      })
      .then(() => {
        this.modalState.close();
        this.loadVaultItems();
      })
      .catch((error) => {
        console.error('Error al actualizar vault item:', error);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  openCreate(type: VaultItemTypeEnum = VaultItemTypeEnum.LOGIN) {
    this.modalState.openCreate(type);
  }

  openEdit(vault: VaultModel) {
    this.modalState.openEdit(vault);
  }

  saveVault(vault: CreateVaultProps) {
    switch (this.modalState.mode()) {
      case 'create':
        this.createVault(vault);
        break;
      case 'edit':
        this.updateVault(vault);
        break;
    }
  }

  readonly favoriteCount = computed(
    () => this.vaultItems().data.filter((item: any) => item.isFavorite).length,
  );

  readonly loginCount = computed(
    () => this.vaultItems().data.filter((item: any) => (item.type as string) === 'LOGIN').length,
  );

  ngOnInit(): void {
    this.loadVaultItems();
    this.loadFolders();
  }

  async loadVaultItems(): Promise<void> {
    if (!this.user?.id) return;
    try {
      const response = await this.findVaultByUserIdUseCase.execute();
      this.vaultItems.set(response);
    } catch {}
  }

  initial(item: VaultModel): string {
    return item.title.charAt(0).toUpperCase();
  }

  async toggleFavorite(item: VaultModel): Promise<void> {
    if (this.pendingFavorites.has(item.id)) return;
    this.pendingFavorites.add(item.id);

    const currentFavorite = item.isFavorite;

    this.setFavorite(item.id, !currentFavorite);

    try {
      await this.updateVaultUseCase.execute({
        data: {
          isFavorite: !currentFavorite,
        },
        id: item.id,
      });
    } catch {
      this.setFavorite(item.id, currentFavorite);
    } finally {
      this.pendingFavorites.delete(item.id);
    }
  }

  private setFavorite(id: number, isFavorite: boolean): void {
    this.vaultItems.update((page) => ({
      ...page, //data, success, message,total, totalpage, limit, take
      data: page.data.map((item: VaultModel) => (item.id === id ? { ...item, isFavorite } : item)),
    }));
  }

  async copy(item: VaultModel): Promise<void> {
    try {
      await navigator.clipboard.writeText(item.title);
      this.copiedId.set(item.id);
      setTimeout(() => this.copiedId.set(null), 1500);
    } catch {
      // portapapeles bloqueado
    }
  }
}
