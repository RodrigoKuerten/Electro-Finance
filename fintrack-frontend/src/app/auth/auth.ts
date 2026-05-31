import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environments';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  imports: [ToastModule, CommonModule, RouterLink],
  providers: [MessageService],
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
  private readonly messageService = inject(MessageService);
  private readonly http = inject(HttpClient);

  isRegisterMode = false;

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  submitAuth(email: string, password: string, isRegister: boolean, fullName?: string, address?: string, phoneNumber?: string): void {
    if (!email || !password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Email e senha são obrigatórios.'
      });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Email inválido',
        detail: 'O email deve ser valido.'
      });
      return;
    }

    let body: any = {email, password};

    if (isRegister) {
      if (!fullName || !address || !phoneNumber) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Campos obrigatórios',
          detail: 'Preencha todos os dados para cadastro.'
        });
        return;
      }

      body = {email, password, fullName, address, phoneNumber};
    }

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    this.http.post(`${environment.urlLocal}${endpoint}`, body).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: response.message
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro inesperado'
        });
      }
    });
  }

}
