import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserModel } from '../../features/users/domain/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly currentUserSignal = signal<UserModel | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  setUser(user: UserModel, token?: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('access_token', token);
      }
      localStorage.setItem('current_user', JSON.stringify(user));
    }
    this.currentUserSignal.set(user);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('current_user');
    }
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  private getStoredUser(): UserModel | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
}
