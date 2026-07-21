import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PayrollStatus = 'PENDENTE' | 'CALCULADO' | 'APROVADO';

export interface PayrollEntry {
  id: number;
  name: string;
  initials: string;
  role: string;
  department: string;
  contractType: 'CLT' | 'PJ' | 'ESTAGIO';
  salaryBruto: number;
  inss: number;
  irrf: number;
  vt: number;
  fgts: number;
  salaryLiquido: number;
  status: PayrollStatus;
}

@Component({
  selector: 'app-payroll',
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.scss',
})
export class Payroll {
  readonly currentPeriod = 'Maio 2026';
  readonly currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  search = signal('');
  statusFilter = signal<PayrollStatus | 'TODOS'>('TODOS');
  generating = signal(false);

  entries = signal<PayrollEntry[]>([]);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const sf = this.statusFilter();
    return this.entries().filter(e =>
      (sf === 'TODOS' || e.status === sf) &&
      (e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
    );
  });

  get totalBruto()    { return this.entries().reduce((s, e) => s + e.salaryBruto, 0); }
  get totalLiquido()  { return this.entries().reduce((s, e) => s + e.salaryLiquido, 0); }
  get totalFgts()     { return this.entries().reduce((s, e) => s + e.fgts, 0); }
  get totalInss()     { return this.entries().reduce((s, e) => s + e.inss, 0); }
  get totalCount()    { return this.entries().length; }
  get aprovados()     { return this.entries().filter(e => e.status === 'APROVADO').length; }
  get pendentes()     { return this.entries().filter(e => e.status === 'PENDENTE').length; }

  formatBRL(v: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  statusLabel(s: PayrollStatus) {
    return { PENDENTE: 'Pendente', CALCULADO: 'Calculado', APROVADO: 'Aprovado' }[s];
  }

  contractLabel(c: string) {
    return { CLT: 'CLT', PJ: 'PJ', ESTAGIO: 'Estágio' }[c] ?? c;
  }

  generate() {
    this.generating.set(true);
    setTimeout(() => {
      this.entries.update(list =>
        list.map(e => e.status === 'PENDENTE' ? { ...e, status: 'CALCULADO' as PayrollStatus } : e)
      );
      this.generating.set(false);
    }, 1800);
  }

  approve(entry: PayrollEntry) {
    this.entries.update(list =>
      list.map(e => e.id === entry.id ? { ...e, status: 'APROVADO' as PayrollStatus } : e)
    );
  }

  approveAll() {
    this.entries.update(list =>
      list.map(e => e.status === 'CALCULADO' ? { ...e, status: 'APROVADO' as PayrollStatus } : e)
    );
  }

  setSearch(v: string) { this.search.set(v); }
  setFilter(v: PayrollStatus | 'TODOS') { this.statusFilter.set(v); }
}
