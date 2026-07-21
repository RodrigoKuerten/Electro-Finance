import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-performance',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Avaliação de Desempenho"
      icon="star_rate"
      description="Ciclos de avaliação de performance com metas, feedback contínuo e planos de desenvolvimento."
      [features]="features"
    />
  `
})
export class Performance {
  features = [
    'Definição de metas individuais e por equipe',
    'Avaliação 360° (líder, pares, auto-avaliação)',
    'Ciclos de avaliação configuráveis',
    'Feedback contínuo e one-on-ones',
    'PDI — Plano de Desenvolvimento Individual',
    'Histórico e evolução de performance',
  ];
}
