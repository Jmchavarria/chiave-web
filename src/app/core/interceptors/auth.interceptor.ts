import { Injectable, computed, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserModel } from '../../features/users/domain/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    // Al arrancar la app, si había un usuario guardado, intentamos recuperar el token en segundo plano
    this.tryRestoreSession();
  }

  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<UserModel | null>(this.getStoredUser());

  // NUEVO: Bandera para saber si la app está intentando recuperar la sesión tras un F5
  private readonly isRestoringSessionSignal = signal<boolean>(true);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isRestoringSession = this.isRestoringSessionSignal.asReadonly();

  readonly isAuthenticated = computed(
    () => !!this.currentUserSignal() && !!this.accessTokenSignal(),
  );

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  setSession(accessToken: string, user: UserModel): void {
    this.accessTokenSignal.set(accessToken);
    this.currentUserSignal.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  clearSession(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('current_user');
    }
  }

  // Método privado para revivir la sesión con la cookie al recargar
  private async tryRestoreSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.isRestoringSessionSignal.set(false);
      return;
    }

    const storedUser = this.getStoredUser();
    if (storedUser) {
      try {
        // Pedimos un nuevo access token usando la cookie HttpOnly
        await this.refreshToken();
      } catch (error) {
        // Si la cookie expiró o falló, limpiamos la sesión local
        this.clearSession();
      }
    }

    // Terminó el intento de restauración
    this.isRestoringSessionSignal.set(false);
  }

  async refreshToken(): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<{ accessToken: string }>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      ),
    );

    this.accessTokenSignal.set(res.accessToken);
    return res.accessToken;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }),
      );
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    } finally {
      this.clearSession();
    }
  }

  private getStoredUser(): UserModel | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
}
