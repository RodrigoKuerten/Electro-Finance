import { Routes } from '@angular/router';

export const rhRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',        loadComponent: () => import('./rh-home/rh-home').then(m => m.RhHome) },
  { path: 'employees',   loadComponent: () => import('./employees/employees').then(m => m.Employees) },
  { path: 'payroll',     loadComponent: () => import('./payroll/payroll').then(m => m.Payroll) },
  { path: 'time',        loadComponent: () => import('./time-control/time-control').then(m => m.TimeControl) },
  { path: 'vacations',   loadComponent: () => import('./vacations/vacations').then(m => m.Vacations) },
  { path: 'hiring',      loadComponent: () => import('./hiring/hiring').then(m => m.Hiring) },
  { path: 'legal',       loadComponent: () => import('./legal/legal').then(m => m.Legal) },
  { path: 'recruitment', loadComponent: () => import('./recruitment/recruitment').then(m => m.Recruitment) },
  { path: 'performance', loadComponent: () => import('./performance/performance').then(m => m.Performance) },
  { path: 'training',    loadComponent: () => import('./training/training').then(m => m.Training) },
  { path: 'orgchart',    loadComponent: () => import('./orgchart/orgchart').then(m => m.Orgchart) },
  { path: 'benefits',    loadComponent: () => import('./benefits/benefits').then(m => m.Benefits) },
];
