import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environments';
import { PageLoader } from '../shared/page-loader';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  imports: [ToastModule, RouterLink, PageLoader],
  providers: [MessageService],
})
export class ResetPassword implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  token: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Link inválido',
        detail: 'Token de recuperação não encontrado. Solicite um novo link.'
      });
    }
  }

  resetPassword(newPassword: string, confirmPassword: string): void {
    if (!newPassword || !confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha a nova senha e a confirmação.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Senhas diferentes',
        detail: 'A nova senha e a confirmação devem ser iguais.'
      });
      return;
    }

    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Token inválido',
        detail: 'Solicite um novo link de recuperação.'
      });
      return;
    }

    this.isLoading = true;
    this.http.post(`${environment.urlLocal}/auth/reset-password`, {
      token: this.token,
      newPassword
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: response.message
        });
        setTimeout(() => this.router.navigate(['/auth/login']), 2500);
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
