import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { environment } from '../environments/environments';
import { PageLoader } from '../shared/page-loader';
import { checkPassword, isStrongPassword, passwordLabel, passwordScore, PasswordChecks } from '../shared/password-strength';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  imports: [CommonModule, RouterLink, PageLoader],
})
export class ResetPassword implements OnInit {
  private readonly notif = inject(NotificationService);
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  token: string | null = null;
  isLoading = signal(false);

  passwordScore = signal(0);
  passwordLabel = signal('');
  passwordChecks = signal<PasswordChecks>({ length: false, upper: false, lower: false, number: false, special: false });

  onPasswordInput(password: string): void {
    const checks = checkPassword(password);
    this.passwordChecks.set(checks);
    const score = passwordScore(checks);
    this.passwordScore.set(score);
    this.passwordLabel.set(passwordLabel(score));
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.notif.add({ severity: 'error', summary: 'Link inválido', detail: 'Token de recuperação não encontrado. Solicite um novo link.' });
    }
  }

  resetPassword(newPassword: string, confirmPassword: string): void {
    if (!newPassword || !confirmPassword) {
      this.notif.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Preencha a nova senha e a confirmação.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.notif.add({ severity: 'warn', summary: 'Senhas diferentes', detail: 'A nova senha e a confirmação devem ser iguais.' });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      this.notif.add({ severity: 'warn', summary: 'Senha fraca', detail: 'A senha deve ter 8+ caracteres, maiúscula, minúscula, número e caractere especial.' });
      return;
    }
    
    if (!this.token) {
      this.notif.add({ severity: 'error', summary: 'Token inválido', detail: 'Solicite um novo link de recuperação.' });
      return;
    }

    this.isLoading.set(true);
    this.http.post(`${environment.urlApi}/auth/reset-password`, {
      token: this.token,
      newPassword
    }).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.notif.add({ severity: 'success', summary: 'Sucesso', detail: response.message });
        setTimeout(() => this.router.navigate(['/auth/login']), 2500);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notif.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Erro inesperado, tente novamente mais tarde.' });
      }
    });
  }
}
