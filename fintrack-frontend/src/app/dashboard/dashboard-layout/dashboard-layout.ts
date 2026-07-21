import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

interface AppModule {
  id: string;
  label: string;
  icon: string;
  expanded: boolean;
  soon: boolean;
  items: NavItem[];
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  modules: AppModule[] = [
    {
      id: 'hr',
      label: 'Recursos Humanos',
      icon: 'groups',
      expanded: true,
      soon: false,
      items: [
        { label: 'Visão Geral',   icon: 'dashboard',             path: '/dashboard/hr/home' },
        { label: 'Funcionários',  icon: 'badge',                 path: '/dashboard/hr/employees' },
        { label: 'Folha de Pag.', icon: 'payments',              path: '/dashboard/hr/payroll' },
        { label: 'Ponto',         icon: 'schedule',              path: '/dashboard/hr/time' },
        { label: 'Férias',        icon: 'beach_access',          path: '/dashboard/hr/vacations' },
        { label: 'Contratações',  icon: 'person_add',            path: '/dashboard/hr/hiring' },
        { label: 'Jurídico',      icon: 'gavel',                 path: '/dashboard/hr/legal' },
        { label: 'Recrutamento',  icon: 'manage_search',         path: '/dashboard/hr/recruitment' },
        { label: 'Performance',   icon: 'trending_up',           path: '/dashboard/hr/performance' },
        { label: 'Treinamentos',  icon: 'school',                path: '/dashboard/hr/training' },
        { label: 'Organograma',   icon: 'account_tree',          path: '/dashboard/hr/orgchart' },
        { label: 'Benefícios',    icon: 'card_giftcard',         path: '/dashboard/hr/benefits' },
      ],
    },
    {
      id: 'finance',
      label: 'Financeiro',
      icon: 'account_balance',
      expanded: false,
      soon: true,
      items: [],
    },
    {
      id: 'sales',
      label: 'Comercial',
      icon: 'storefront',
      expanded: false,
      soon: true,
      items: [],
    },
    {
      id: 'ops',
      label: 'Operações',
      icon: 'precision_manufacturing',
      expanded: false,
      soon: true,
      items: [],
    },
  ];

  sidebarOpen = false;

  toggle(mod: AppModule): void {
    if (mod.soon) return;
    mod.expanded = !mod.expanded;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
    this.closeSidebar();
  }
}
