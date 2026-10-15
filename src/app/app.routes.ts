import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Rutas fijas primero
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
          import('./features/auth/presentation/pages/verify-email/verify-email').then(
            (m) => m.VerifyEmailPage,
          ),
      },
      // Si entran a '/auth' a secas, redirige a '/auth/login'
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },

  // 2. Redirecciones globales AL FINAL para evitar ambigüedades
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
