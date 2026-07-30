import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  section: 'core' | 'modules';
}

@Component({
  selector: 'app-rh-layout',
  templateUrl: './rh-layout.html',
  styleUrl: './rh-layout.scss',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class RhLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { path: '/dashboard/hr/home',        icon: 'dashboard',       label: 'Dashboard',           section: 'core' },
    { path: '/dashboard/hr/employees',   icon: 'people',          label: 'Funcionários',         section: 'core' },
    { path: '/dashboard/hr/payroll',     icon: 'payments',        label: 'Folha de Pagamento',   section: 'core' },
    { path: '/dashboard/hr/time',        icon: 'schedule',        label: 'Controle de Ponto',    section: 'core' },
    { path: '/dashboard/hr/vacations',   icon: 'beach_access',    label: 'Férias e Afastamentos',section: 'core' },
    { path: '/dashboard/hr/hiring',      icon: 'manage_accounts', label: 'Admissão / Demissão',  section: 'core' },
    { path: '/dashboard/hr/legal',       icon: 'gavel',           label: 'Obrigações Legais',    section: 'core' },
    { path: '/dashboard/hr/recruitment', icon: 'group_add',       label: 'Recrutamento',         section: 'modules' },
    { path: '/dashboard/hr/performance', icon: 'star_rate',       label: 'Avaliação',            section: 'modules' },
    { path: '/dashboard/hr/training',    icon: 'school',          label: 'Treinamento',          section: 'modules' },
    { path: '/dashboard/hr/orgchart',    icon: 'account_tree',    label: 'Organograma',          section: 'modules' },
    { path: '/dashboard/hr/benefits',    icon: 'card_giftcard',   label: 'Benefícios',           section: 'modules' },
  ];

  get coreItems() { return this.navItems.filter(i => i.section === 'core'); }
  get moduleItems() { return this.navItems.filter(i => i.section === 'modules'); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
