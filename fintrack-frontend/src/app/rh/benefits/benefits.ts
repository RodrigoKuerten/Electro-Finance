import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-benefits',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Benefícios"
      icon="card_giftcard"
      description="Gestão de planos de saúde, vale-alimentação, vale-transporte e demais benefícios corporativos."
      [features]="features"
    />
  `
})
export class Benefits {
  features = [
    'Plano de saúde e odontológico',
    'Vale-alimentação e refeição (VA/VR)',
    'Vale-transporte com cálculo de descontos',
    'Seguro de vida',
    'Benefícios flexíveis (flex benefits)',
    'Integração automática com folha de pagamento',
  ];
}
