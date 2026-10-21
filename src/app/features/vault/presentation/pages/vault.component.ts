import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [NgIcon, DatePipe, ModalComponent, NewItemFormComponent],
  providers: [
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

  constructor(
    private readonly findVaultByUserIdUseCase: FindVaultByUserIdUseCase,
    private readonly authService: AuthService,
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

  readonly typeLabels: Record<string, string> = {
    LOGIN: 'Login',
    CARD: 'Card',
    NOTE: 'Note',
  };

  // Items de la página cargada, filtrados por el buscador
  readonly filteredItems = computed(() => {
    const q = this.query().trim().toLowerCase();
    const items = this.vaultItems().data;
    return q ? items.filter((item) => item.title.toLowerCase().includes(q)) : items;
  });

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
      const response = await this.findVaultByUserIdUseCase.execute(this.user.id);
      this.vaultItems.set(response);
    } catch {
      // TODO: mostrar un estado de error en la lista
    }
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  showerForm(): void {
    this.showForm.set(true);
  }

  initial(item: VaultModel): string {
    return item.title.charAt(0).toUpperCase();
  }

  async copy(item: VaultModel): Promise<void> {
    try {
      await navigator.clipboard.writeText(item.title);
      this.copiedId.set(item.id);
      setTimeout(() => this.copiedId.set(null), 1500);
    } catch {
      // el portapapeles puede estar bloqueado; no hacemos nada
    }
  }
}