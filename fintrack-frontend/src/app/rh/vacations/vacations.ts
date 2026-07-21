import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-vacations',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Férias e Afastamentos"
      icon="beach_access"
      description="Gestão de períodos de férias, licenças, afastamentos e retornos ao trabalho."
      [features]="features"
    />
  `
})
export class Vacations {
  features = [
    'Solicitação e aprovação de férias',
    'Controle de período aquisitivo',
    'Cálculo de remuneração de férias e 1/3',
    'Registro de licenças médicas e maternidade',
    'Calendário de afastamentos por equipe',
    'Alertas de vencimento de período aquisitivo',
  ];
}
