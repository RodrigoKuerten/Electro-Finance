import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { ForgotPassword } from './auth/forgot-password';
import { ResetPassword } from './auth/reset-password';
import { Landing } from './landing/landing';

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
  }
];
