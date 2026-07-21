import { Component } from '@angular/core';
import { RhPageStub } from '../shared/rh-page-stub';

@Component({
  selector: 'app-orgchart',
  imports: [RhPageStub],
  template: `
    <app-rh-page-stub
      title="Organograma"
      icon="account_tree"
      description="Visualização interativa da estrutura hierárquica e organograma da empresa."
      [features]="features"
    />
  `
})
export class Orgchart {
  features = [
    'Organograma visual hierárquico',
    'Estrutura por departamento e equipe',
    'Perfil completo de cada colaborador',
    'Linhas de reporte e subordinação',
    'Exportação em PDF e PNG',
    'Atualização automática com dados de RH',
  ];
}
