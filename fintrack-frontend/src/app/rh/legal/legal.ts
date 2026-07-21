import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-legal',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Obrigações Legais"
      icon="gavel"
      description="Conformidade com as obrigações trabalhistas e previdenciárias brasileiras: eSocial, FGTS, INSS e IRRF."
      [features]="features"
    />
  `
})
export class Legal {
  features = [
    'Geração e envio de eventos eSocial (S-2200, S-2300...)',
    'Guia de recolhimento do FGTS (GRF/GFIP)',
    'Cálculo e geração de GPS (INSS)',
    'DARF para recolhimento de IRRF',
    'Informe de rendimentos anual',
    'Dashboard de compliance e alertas de prazo',
  ];
}
