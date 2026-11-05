import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserModel } from '../../features/users/domain/models/user.model';
import { ApiResponse } from '../../core/interfaces/api-response.interface';

interface RefreshTokenResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<UserModel | null>(null);
  private readonly isInitializingSignal = signal<boolean>(true);

  private initializationPromise: Promise<void> | null = null;

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isInitializing = this.isInitializingSignal.asReadonly();

  readonly isAuthenticated = computed(
    () => !!this.currentUserSignal() && !!this.accessTokenSignal(),
  );

  constructor() {
    console.log('🚀 [AuthService] Servicio instanciado.');
  }

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  setSession(accessToken: string, user: UserModel): void {
    console.log('[AuthService] Estableciendo sesión:', user);

    this.accessTokenSignal.set(accessToken);
    this.currentUserSignal.set(user);

    localStorage.setItem('current_user', JSON.stringify(user));

    console.log('[AuthService] Usuario guardado:', localStorage.getItem('current_user'));
  }

  clearSession(): void {
    console.warn('🧹 [AuthService] Limpiando sesión.');

    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('current_user');
      console.log('🗑️ [AuthService] Usuario eliminado de localStorage.');
    }
  }

  async initializeSession(): Promise<void> {
    console.log('[AuthService] Inicializando sesión...');

    try {
      const storedUser = this.getStoredUser();

      console.log('[AuthService] Usuario almacenado:', storedUser);

      if (!storedUser) {
        console.log('[AuthService] No existe usuario almacenado.');

        this.clearSession();
        return;
      }

      this.currentUserSignal.set(storedUser);

      console.log('[AuthService] Ejecutando refreshToken()...');

      const accessToken = await this.refreshToken();

      if (!accessToken) {
        throw new Error('No se recibió un accessToken válido.');
      }

      console.log('[AuthService] Refresh exitoso.');
      console.log('[AuthService] Access token establecido:', !!this.accessTokenSignal());
      console.log('[AuthService] Usuario establecido:', !!this.currentUserSignal());
      console.log('[AuthService] Sesión autenticada:', this.isAuthenticated());
    } catch (error) {
      console.error('[AuthService] Error restaurando sesión:', error);

      this.clearSession();
    } finally {
      this.isInitializingSignal.set(false);

      console.log('[AuthService] Inicialización finalizada.');
      console.log('[AuthService] Estado final de autenticación:', this.isAuthenticated());
    }
  }
  private async restoreSession(): Promise<void> {
    console.log('🔄 [AuthService] Iniciando restauración de sesión.');

    if (!isPlatformBrowser(this.platformId)) {
      console.log('ℹ️ [AuthService] Entorno servidor detectado. Se omite refresh.');

      this.isInitializingSignal.set(false);
      return;
    }

    try {
      const storedUser = this.getStoredUser();

      console.log('👤 [AuthService] Usuario encontrado en localStorage:', storedUser);

      if (!storedUser) {
        console.warn('⚠️ [AuthService] No existe usuario almacenado. No se ejecutará refresh.');
        return;
      }

      this.currentUserSignal.set(storedUser);

      console.log(
        '🌐 [AuthService] Solicitando nuevo access token:',
        `${environment.apiUrl}/auth/refresh`,
      );

      const newAccessToken = await this.refreshToken();

      console.log('✅ [AuthService] Access token recibido correctamente.');
      console.log('🔐 [AuthService] ¿Sesión autenticada?:', this.isAuthenticated());
      console.log('🎉 [AuthService] Sesión restaurada correctamente.');
    } catch (error) {
      console.error('❌ [AuthService] Error restaurando la sesión:', error);

      this.clearSession();
    } finally {
      this.isInitializingSignal.set(false);

      console.log('🏁 [AuthService] Inicialización finalizada.');
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

  async logout(): Promise<void> {
    console.log('🚪 [AuthService] Iniciando cierre de sesión.');

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/auth/logout`,
          {},
          {
            withCredentials: true,
          },
        ),
      );

      console.log('✅ [AuthService] Logout realizado en el servidor.');
    } catch (error) {
      console.error('❌ [AuthService] Error al cerrar sesión en el servidor:', error);
    } finally {
      this.clearSession();
      console.log('🏁 [AuthService] Cierre de sesión finalizado.');
    }
  }

  private getStoredUser(): UserModel | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const storedUser = localStorage.getItem('current_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as UserModel;
    } catch (error) {
      console.error('❌ [AuthService] Error leyendo current_user:', error);

      localStorage.removeItem('current_user');

      return null;
    }
  }
}
