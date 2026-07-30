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

const MOCK_ENTRIES: PayrollEntry[] = [
  { id: 1,  name: 'Ana Clara Silva',      initials: 'AC', role: 'Dev. Sênior',       department: 'Tecnologia',  contractType: 'CLT',    salaryBruto: 8000,  inss: 870.48,  irrf: 1048.35, vt: 220,  fgts: 640,  salaryLiquido: 5861.17, status: 'APROVADO'  },
  { id: 2,  name: 'Carlos Oliveira',      initials: 'CO', role: 'Analista Fin.',      department: 'Financeiro',  contractType: 'CLT',    salaryBruto: 5500,  inss: 605.00,  irrf: 412.50,  vt: 220,  fgts: 440,  salaryLiquido: 4262.50, status: 'APROVADO'  },
  { id: 3,  name: 'Maria Santos',         initials: 'MS', role: 'Gerente de RH',      department: 'RH',          contractType: 'CLT',    salaryBruto: 7200,  inss: 784.32,  irrf: 790.00,  vt: 220,  fgts: 576,  salaryLiquido: 5405.68, status: 'CALCULADO' },
  { id: 4,  name: 'João Lima',            initials: 'JL', role: 'Dev. Júnior',        department: 'Tecnologia',  contractType: 'CLT',    salaryBruto: 4000,  inss: 480.00,  irrf: 187.00,  vt: 220,  fgts: 320,  salaryLiquido: 3113.00, status: 'CALCULADO' },
  { id: 5,  name: 'Fernanda Costa',       initials: 'FC', role: 'Analista Mktg.',     department: 'Marketing',   contractType: 'CLT',    salaryBruto: 4800,  inss: 575.04,  irrf: 312.00,  vt: 220,  fgts: 384,  salaryLiquido: 3692.96, status: 'CALCULADO' },
  { id: 6,  name: 'Rafael Pereira',       initials: 'RP', role: 'Consultor Vendas',   department: 'Comercial',   contractType: 'CLT',    salaryBruto: 3500,  inss: 420.00,  irrf: 126.00,  vt: 220,  fgts: 280,  salaryLiquido: 2734.00, status: 'PENDENTE'  },
  { id: 7,  name: 'Beatriz Almeida',      initials: 'BA', role: 'Estagiária RH',      department: 'RH',          contractType: 'ESTAGIO', salaryBruto: 1800, inss: 135.00,  irrf: 0,       vt: 108,  fgts: 0,    salaryLiquido: 1557.00, status: 'PENDENTE'  },
  { id: 8,  name: 'Lucas Martins',        initials: 'LM', role: 'Analista Ops.',      department: 'Operações',   contractType: 'CLT',    salaryBruto: 5000,  inss: 600.00,  irrf: 375.00,  vt: 220,  fgts: 400,  salaryLiquido: 3805.00, status: 'PENDENTE'  },
  { id: 9,  name: 'Isabela Rocha',        initials: 'IR', role: 'Designer',           department: 'Marketing',   contractType: 'PJ',     salaryBruto: 6500,  inss: 0,       irrf: 650.00,  vt: 0,    fgts: 0,    salaryLiquido: 5850.00, status: 'PENDENTE'  },
  { id: 10, name: 'Thiago Fernandes',     initials: 'TF', role: 'Suporte TI',         department: 'Tecnologia',  contractType: 'CLT',    salaryBruto: 3800,  inss: 456.00,  irrf: 156.00,  vt: 220,  fgts: 304,  salaryLiquido: 2968.00, status: 'PENDENTE'  },
];

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

  entries = signal<PayrollEntry[]>(MOCK_ENTRIES);

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
