import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-time-control',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Controle de Ponto"
      icon="schedule"
      description="Registro e gerenciamento de jornada de trabalho, horas extras e banco de horas."
      [features]="features"
    />
  `
})
export class TimeControl {
  features = [
    'Registro de ponto (entrada, saída, intervalos)',
    'Banco de horas acumuladas',
    'Controle de horas extras e noturnas',
    'Relatório de frequência por período',
    'Alertas de ausências e atrasos',
    'Integração com folha de pagamento',
  ];
}
