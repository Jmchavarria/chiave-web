import { Injectable, signal } from '@angular/core';
import type { AuthSession } from '../domain/models/auth-session.model';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly sessionState = signal<AuthSession | null>(null);

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = signal(false);

  setSession(session: AuthSession): void {
    this.sessionState.set(session);
    this.isAuthenticated.set(true);
  }

  clearSession(): void {
    this.sessionState.set(null);
    this.isAuthenticated.set(false);
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.sessionState()?.refreshToken ?? null;
  }
}
