import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-recruitment',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Recrutamento e Seleção"
      icon="group_add"
      description="Gestão completa do pipeline de recrutamento, desde a abertura da vaga até a contratação."
      [features]="features"
    />
  `
})
export class Recruitment {
  features = [
    'Abertura e gestão de vagas',
    'Triagem e ranking de currículos',
    'Pipeline kanban de candidatos',
    'Agendamento de entrevistas',
    'Avaliações e feedback de entrevistadores',
    'Proposta e onboarding automatizado',
  ];
}
