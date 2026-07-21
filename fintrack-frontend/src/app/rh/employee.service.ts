import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

export interface Employee {
  id?: number;
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  email: string;
  address?: string;
  role: string;
  department: string;
  admissionDate: string;
  contractType: string;
  salary: number;
  workHoursPerWeek?: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.urlLocal;

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee/get-all-employees`);
  }

  create(data: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employee/create-employee`, data);
  }

  update(id: number, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employee/update-employee-${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employee/delete-employee-${id}`);
  }
}
