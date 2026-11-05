import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Rutas públicas
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/welcome/welcome.page.component').then((m) => m.WelcomePageComponent),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/presentation/pages/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/presentation/pages/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./features/auth/presentation/pages/verify-email/verify-email.component').then(
            (m) => m.VerifyEmailComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },

  // 2. Rutas del área privada (Bóveda con el Layout que contiene el Sidebar)
  {
    path: 'app',
    loadComponent: () =>
      import('./core/components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'vault',
        loadComponent: () =>
          import('./features/vault/presentation/pages/vault.component').then(
            (m) => m.VaultComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/presentation/pages/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'vault',
      },
    ],
  },

  // 3. Redirecciones globales al final
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
