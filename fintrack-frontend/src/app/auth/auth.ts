import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { PageLoader } from '../shared/page-loader';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  imports: [CommonModule, RouterLink, PageLoader],
  animations: [
    trigger('modeSwitch', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('0.32s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
  ]
})
export class Auth {
  private readonly notif = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isRegisterMode = false;
  isLoading = signal(false);

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  submitAuth(email: string, password: string, isRegister: boolean, fullName?: string, address?: string, phoneNumber?: string): void {
    if (!email || !password) {
      this.notif.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Email e senha são obrigatórios.' });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      this.notif.add({ severity: 'warn', summary: 'Email inválido', detail: 'O email deve ser valido.' });
      return;
    }

    if (isRegister) {
      if (!fullName || !address || !phoneNumber) {
        this.notif.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Preencha todos os dados para cadastro.' });
        return;
      }
      this.isLoading.set(true);
      this.authService.register({ email, password, fullName, address, phoneNumber }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.notif.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
        },
        error: (error) => {
          this.isLoading.set(false);
          this.notif.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro inesperado, tente novamente mais tarde.' });
        }
      });
      return;
    }

    this.isLoading.set(true);
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        localStorage.setItem('auth_token', response.token ?? 'logged_in');
        this.router.navigate(['/dashboard/hr/employees']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notif.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro inesperado, tente novamente mais tarde.' });
      }
    });
  }
}
