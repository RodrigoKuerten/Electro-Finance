import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-training',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Treinamento e Desenvolvimento"
      icon="school"
      description="Gestão de capacitações, trilhas de aprendizagem e certificações dos colaboradores."
      [features]="features"
    />
  `
})
export class Training {
  features = [
    'Catálogo de treinamentos internos e externos',
    'Trilhas de aprendizagem por cargo',
    'Registro de certificações e horas de treinamento',
    'Agendamento e controle de presença',
    'Avaliação de reação e efetividade',
    'Relatório de investimento em capacitação',
  ];
}
