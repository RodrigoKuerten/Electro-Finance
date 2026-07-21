import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-hiring',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Admissão e Demissão"
      icon="manage_accounts"
      description="Fluxo completo de admissão de novos colaboradores e desligamentos com cálculos rescisórios."
      [features]="features"
    />
  `
})
export class Hiring {
  features = [
    'Checklist de admissão e coleta de documentos',
    'Geração de contrato de trabalho',
    'Cálculo de rescisão: aviso prévio, FGTS, saldo de salário',
    'Rescisão com e sem justa causa',
    'Homologação e TRCT',
    'Registro automático no eSocial',
  ];
}
