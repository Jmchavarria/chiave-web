import { Routes } from '@angular/router';

export const routes: Routes = [
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
          import('./features/auth/presentation/pages/register/register').then(
            (m) => m.RegisterPage,
          ),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./features/auth/presentation/pages/verify-email/verify-email').then(
            (m) => m.VerifyEmailPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome', // <--- Redirige directamente a 'welcome'
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
