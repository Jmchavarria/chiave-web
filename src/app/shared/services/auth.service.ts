import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserModel } from '../../features/users/domain/models/user.model';
import { ApiResponse } from '../../core/interfaces/api-response.interface';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<UserModel | null>(null);
  private readonly isInitializingSignal = signal<boolean>(true);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isInitializing = this.isInitializingSignal.asReadonly();
  readonly isAuthenticated = computed(
    () => !!this.currentUserSignal() && !!this.accessTokenSignal(),
  );

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  setSession(accessToken: string, user: UserModel): void {
    this.accessTokenSignal.set(accessToken);
    this.currentUserSignal.set(user);
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  async initializeSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.isInitializingSignal.set(false);
      return;
    }

    try {
      const accessToken = await this.refreshToken();

      if (!accessToken) {
        throw new Error('A valid access token could not be obtained.');
      }

      await this.fetchCurrentUser();
    } catch (error) {
      console.warn('[AuthService] No active session or restoration failed:', error);
      this.clearSession();
    } finally {
      this.isInitializingSignal.set(false);
    }
  }

  async refreshToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<{ accessToken: string }>>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      ),
    );

    const accessToken = response.data.accessToken;
    this.accessTokenSignal.set(accessToken);
    return accessToken;
  }

  async fetchCurrentUser(): Promise<void> {
    const user = await firstValueFrom(
      this.http.get<ApiResponse<UserModel>>(`${environment.apiUrl}/auth/me`),
    );

    this.currentUserSignal.set(user.data);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }),
      );
    } catch (error) {
      console.error('❌ [AuthService] Error logging out of the server:', error);
    } finally {
      this.clearSession();
    }
  }
}
