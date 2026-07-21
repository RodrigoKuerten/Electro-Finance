import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmployeeService, Employee } from '../employee.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
  imports: [CommonModule, FormsModule],
})
export class Employees implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly notif = inject(NotificationService);

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = false;
  saving = false;
  searchQuery = '';

  showModal = false;
  editingEmployee: Employee | null = null;
  form: Partial<Employee> = {};

  showDeleteModal = false;
  deletingId: number | null = null;

  readonly departments = ['HR', 'FINANCE', 'TECHNOLOGY', 'OPERATIONS', 'MARKETING', 'LEGAL', 'ADMINISTRATION', 'SALES', 'LOGISTICS'];
  readonly contractTypes = ['CLT', 'PJ', 'INTERNSHIP', 'TEMPORARY', 'FREELANCER'];
  readonly statuses = ['ACTIVE', 'INACTIVE', 'VACATION', 'ON_LEAVE', 'TERMINATED'];

  private readonly deptLabels: Record<string, string> = {
    HR: 'RH', FINANCE: 'Financeiro', TECHNOLOGY: 'Tecnologia',
    OPERATIONS: 'Operações', MARKETING: 'Marketing', LEGAL: 'Jurídico',
    ADMINISTRATION: 'Administração', SALES: 'Comercial', LOGISTICS: 'Logística',
  };

  private readonly statusMeta: Record<string, { label: string; cls: string }> = {
    ACTIVE:     { label: 'Ativo',     cls: 'status-active'     },
    INACTIVE:   { label: 'Inativo',   cls: 'status-inactive'   },
    VACATION:   { label: 'Férias',    cls: 'status-vacation'   },
    ON_LEAVE:   { label: 'Afastado',  cls: 'status-away'       },
    TERMINATED: { label: 'Demitido',  cls: 'status-terminated' },
  };

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAll()
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.applyFilter();
        },
        error: () => {
          this.notif.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os funcionários.' });
        }
      });
  }

  applyFilter() {
    if (!this.employees?.length) { this.filteredEmployees = []; return; }
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) { this.filteredEmployees = [...this.employees]; return; }
    this.filteredEmployees = this.employees.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.cpf || '').includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.department || '').toLowerCase().includes(q) ||
      (e.role || '').toLowerCase().includes(q)
    );
  }

  openCreate() {
    this.editingEmployee = null;
    this.form = {
      status: 'ACTIVE',
      contractType: 'CLT',
      department: 'HR',
      admissionDate: new Date().toISOString().split('T')[0],
      workHoursPerWeek: 44,
    };
    this.showModal = true;
  }

  openEdit(emp: Employee) {
    this.editingEmployee = emp;
    this.form = { ...emp };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingEmployee = null;
    this.form = {};
    this.saving = false;
  }

  save() {
    if (!this.form.name || !this.form.cpf || !this.form.email ||
        !this.form.role || !this.form.department || !this.form.admissionDate ||
        !this.form.contractType || this.form.salary === undefined) return;

    this.saving = true;

    const op$ = this.editingEmployee?.id
      ? this.employeeService.update(this.editingEmployee.id, this.form as Employee)
      : this.employeeService.create(this.form as Employee);

    op$.pipe(finalize(() => { this.saving = false; }))
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadEmployees();
        },
        error: (error) => {
          this.notif.add({ severity: 'error', summary: 'Erro', detail: error.error?.message || 'Não foi possível salvar o funcionário.' });
        }
      });
  }

  confirmDelete(id: number) {
    this.deletingId = id;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.deletingId = null;
    this.showDeleteModal = false;
  }

  doDelete() {
    if (!this.deletingId) return;
    this.employeeService.delete(this.deletingId)
      .pipe(finalize(() => { this.cancelDelete(); }))
      .subscribe({
        next: () => { this.loadEmployees(); },
        error: () => {
          this.notif.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o funcionário.' });
        }
      });
  }

  formatBRL(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  getDeptLabel(dept: string): string { return this.deptLabels[dept] || dept; }
  getStatusLabel(s: string): string { return this.statusMeta[s]?.label || s; }
  getStatusClass(s: string): string { return this.statusMeta[s]?.cls || ''; }

  initials(name: string): string {
    return (name || '?').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  get isFormValid(): boolean {
    return !!(this.form.name && this.form.cpf && this.form.email &&
              this.form.role && this.form.department && this.form.admissionDate &&
              this.form.contractType && this.form.salary !== undefined);
  }
}
