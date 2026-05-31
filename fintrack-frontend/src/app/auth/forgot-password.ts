import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environments';
import { PageLoader } from '../shared/page-loader';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  imports: [ToastModule, RouterLink, PageLoader],
  providers: [MessageService],
})
export class ForgotPassword {
  private readonly messageService = inject(MessageService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  isLoading = false;

  sendRecovery(email: string): void {
    if (!email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Informe seu e-mail.'
      });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'E-mail inválido',
        detail: 'Informe um e-mail válido.'
      });
      return;
    }

    this.isLoading = true;
    this.http.post(`${environment.urlLocal}/auth/forgot-password`, {
      email,
      frontendUrl: window.location.origin
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'E-mail enviado',
          detail: response.message
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro inesperado, tente novamente mais tarde.'
        });
      }
    });
  }
}
