import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { environment } from '../environments/environments';
import { PageLoader } from '../shared/page-loader';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  imports: [RouterLink, PageLoader],
})
export class ForgotPassword {
  private readonly notif = inject(NotificationService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  isLoading = signal(false);

  sendRecovery(email: string): void {
    if (!email) {
      this.notif.add({ severity: 'warn', summary: 'Campo obrigatório', detail: 'Informe seu e-mail.' });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      this.notif.add({ severity: 'warn', summary: 'E-mail inválido', detail: 'Informe um e-mail válido.' });
      return;
    }

    this.isLoading.set(true);
    this.http.post(`${environment.urlLocal}/auth/forgot-password`, {
      email,
      frontendUrl: window.location.origin
    }).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.notif.add({ severity: 'success', summary: 'E-mail enviado!', detail: response.message });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notif.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro inesperado, tente novamente mais tarde.' });
      }
    });
  }
}
