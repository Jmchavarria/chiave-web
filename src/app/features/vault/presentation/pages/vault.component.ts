import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckSolid,
  heroClipboardDocumentSolid,
  heroCreditCardSolid,
  heroDocumentTextSolid,
  heroGlobeAltSolid,
  heroLockClosedSolid,
  heroMagnifyingGlassSolid,
  heroPlusSolid,
  heroShieldExclamationSolid,
  heroSquares2x2Solid,
  heroStarSolid,
} from '@ng-icons/heroicons/solid';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NewItemFormComponent } from '../components/new-item.form.component';
import { FindVaultByUserIdUseCase } from '../../application/use-cases/find-vault-by-user-id/find-vault-by-user-id.use-case';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserModel } from '../../../users/domain/models/user.model';
import { VaultModel } from '../../domain/models/vault.model';
import { PaginatedResult } from '../../../../core/types/paginated-response';
import { UpdateVaultUseCase } from '../../application/use-cases/update-vault/update-vault.use-case';
import { CreateVaultUseCase } from '../../application/use-cases/create-vault/create-vault.use-case';
import { CreateVaultProps } from '../../domain/repositories/vault.repository';
import { VaultItemTypeEnum } from '../../domain/enums/vault-item-type.enum';
import { VaultModalService } from '../../services/vault-modal.service';

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [NgIcon, DatePipe, ModalComponent, NewItemFormComponent],
  providers: [
    VaultModalService, // <--- Proveedor local para el ciclo de vida del modal de esta vista
    provideIcons({
      heroCheckSolid,
      heroClipboardDocumentSolid,
      heroCreditCardSolid,
      heroDocumentTextSolid,
      heroGlobeAltSolid,
      heroLockClosedSolid,
      heroMagnifyingGlassSolid,
      heroShieldExclamationSolid,
      heroSquares2x2Solid,
      heroStarSolid,
      heroPlusSolid,
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

  // Inyección del servicio de estado local del modal
  readonly modalState = inject(VaultModalService);

  constructor(
    private readonly findVaultByUserIdUseCase: FindVaultByUserIdUseCase,
    private readonly updateVaultUseCase: UpdateVaultUseCase,
    private readonly authService: AuthService,
    private readonly createVaultUseCase: CreateVaultUseCase,
  ) {
    this.user = this.authService.currentUser();
  }

  readonly vaultItems = signal<PaginatedResult<VaultModel>>({
    data: [],
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  readonly query = signal('');
  readonly copiedId = signal<number | null>(null);
  readonly showForm = signal<boolean>(false);
  private readonly pendingFavorites = new Set<number>();

  readonly typeLabels: Record<string, string> = {
    LOGIN: 'Login',
    CARD: 'Card',
    NOTE: 'Note',
  };

  private createVault(input: CreateVaultProps): void {
    this.createVaultUseCase
      .execute(input)
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

  // Métodos expuestos para abrir el modal usando el servicio local
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
    () => this.vaultItems().data.filter((item) => item.isFavorite).length,
  );

  readonly loginCount = computed(
    () => this.vaultItems().data.filter((item) => (item.type as string) === 'LOGIN').length,
  );

  ngOnInit(): void {
    this.loadVaultItems();
  }

  async loadVaultItems(): Promise<void> {
    if (!this.user?.id) return;
    try {
      const response = await this.findVaultByUserIdUseCase.execute();
      this.vaultItems.set(response);
    } catch {}
  }

  showerForm(): void {
    this.showForm.set(true);
  }

  initial(item: VaultModel): string {
    return item.title.charAt(0).toUpperCase();
  }

  async toggleFavorite(item: VaultModel): Promise<void> {
    if (this.pendingFavorites.has(item.id)) return;
    this.pendingFavorites.add(item.id);

    const next = !item.isFavorite;

    this.setFavorite(item.id, next);

    try {
      await this.updateVaultUseCase.execute({
        data: {
          isFavorite: next,
        },
        id: item.id,
      });
    } catch {
      this.setFavorite(item.id, !next);
    } finally {
      this.pendingFavorites.delete(item.id);
    }
  }

  private setFavorite(id: number, isFavorite: boolean): void {
    this.vaultItems.update((page) => ({
      ...page,
      data: page.data.map((item) => (item.id === id ? { ...item, isFavorite } : item)),
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
