import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofillTileComponent } from './bento/autofill-tile/autofill-tile.component';
import { CheckupTileComponent } from './bento/checkup-tile/checkup-tile.component';
import { GeneratorTileComponent } from './bento/generator-tile/generator-tile.component';
import { HeroTileComponent } from './bento/hero-tile/hero-tile.component';
import { IllustrationTileComponent } from './bento/illustration-tile/illustration-tile.component';
import { LogoTileComponent } from './bento/logo-tile/logo-tile.component';
import { StatementTileComponent } from './bento/statement-tile/statement-tile.component';
import { TotpTileComponent } from './bento/totp-tile/totp-tile.component';
import { VaultTileComponent } from './bento/vault-tile/vault-tile.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { LoginComponent } from '../auth/presentation/pages/login/login.component';

export type AuthView = 'landing' | 'login' | 'register' | 'verify';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    CommonModule,
    AutofillTileComponent,
    CheckupTileComponent,
    GeneratorTileComponent,
    HeroTileComponent,
    IllustrationTileComponent,
    LogoTileComponent,
    StatementTileComponent,
    TotpTileComponent,
    VaultTileComponent,
    ModalComponent,
    LoginComponent,
  ],
  templateUrl: './welcome.page.component.html',
  styleUrl: './welcome.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  readonly view = signal<AuthView>('landing');

  open(view: AuthView): void {
    this.view.set(view);
  }

  close(): void {
    this.view.set('landing');
  }

  switchView(view: AuthView): void {
    this.view.set(view);
  }
}
