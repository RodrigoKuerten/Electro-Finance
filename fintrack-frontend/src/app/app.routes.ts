import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { ForgotPassword } from './auth/forgot-password';
import { ResetPassword } from './auth/reset-password';
import { Landing } from './landing/landing';
import { DashboardLayout } from './dashboard/dashboard-layout/dashboard-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Landing
  },
  {
    path: 'auth/login',
    component: Auth
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPassword
  },
  {
    path: 'auth/reset-password',
    component: ResetPassword
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: 'hr', loadChildren: () => import('./rh/rh.routes').then(m => m.rhRoutes) },
    ]
  }
];
