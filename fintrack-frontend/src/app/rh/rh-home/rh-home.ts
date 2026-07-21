import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../employee.service';

interface KpiCard {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  color: 'green' | 'amber' | 'blue' | 'purple';
}

interface DeptStat {
  name: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-rh-home',
  templateUrl: './rh-home.html',
  styleUrl: './rh-home.scss',
  imports: [CommonModule, RouterLink],
})
export class RhHome implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  employees: Employee[] = [];
  loading = true;

  readonly deptLabels: Record<string, string> = {
    HR: 'RH', FINANCE: 'Financeiro', TECHNOLOGY: 'Tecnologia',
    OPERATIONS: 'Operações', MARKETING: 'Marketing', LEGAL: 'Jurídico',
    ADMINISTRATION: 'Administração', SALES: 'Comercial', LOGISTICS: 'Logística',
  };

  readonly statusClasses: Record<string, string> = {
    ACTIVE: 'dot-green', INACTIVE: 'dot-red', VACATION: 'dot-blue',
    ON_LEAVE: 'dot-amber', TERMINATED: 'dot-gray',
  };

  ngOnInit() {
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get currentDate(): string {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  get totalEmployees() { return this.employees.length; }

  get activeEmployees() { return this.employees.filter(e => e.status === 'ACTIVE').length; }

  get totalPayroll() { return this.employees.reduce((s, e) => s + (Number(e.salary) || 0), 0); }

  get newAdmissions() {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return this.employees.filter(e => e.admissionDate && new Date(e.admissionDate) >= start).length;
  }

  get kpiCards(): KpiCard[] {
    return [
      { label: 'Total de Funcionários', value: this.totalEmployees, sub: 'colaboradores cadastrados', icon: 'people', color: 'purple' },
      { label: 'Funcionários Ativos',   value: this.activeEmployees, sub: this.totalEmployees > 0 ? `${((this.activeEmployees / this.totalEmployees) * 100).toFixed(0)}% do total` : '0% do total', icon: 'check_circle', color: 'green' },
      { label: 'Folha Mensal',          value: this.formatBRL(this.totalPayroll), sub: 'valor bruto estimado', icon: 'payments', color: 'amber' },
      { label: 'Admissões do Mês',      value: this.newAdmissions, sub: 'novos colaboradores', icon: 'person_add', color: 'blue' },
    ];
  }

  get recentEmployees(): Employee[] {
    return [...this.employees]
      .sort((a, b) => new Date(b.admissionDate || 0).getTime() - new Date(a.admissionDate || 0).getTime())
      .slice(0, 6);
  }

  get deptDistribution(): DeptStat[] {
    const counts: Record<string, number> = {};
    this.employees.forEach(e => { counts[e.department] = (counts[e.department] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, label: this.deptLabels[name] || name }));
  }

  get maxDeptCount(): number {
    return Math.max(...this.deptDistribution.map(d => d.count), 1);
  }

  formatBRL(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  getDeptLabel(dept: string): string {
    return this.deptLabels[dept] || dept;
  }

  getStatusDot(status: string): string {
    return this.statusClasses[status] || 'dot-gray';
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}
