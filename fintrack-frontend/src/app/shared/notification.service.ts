import { Injectable, signal } from '@angular/core';

export type NotifySeverity = 'success' | 'error' | 'warn' | 'info';

export interface NotifItem {
  id: number;
  severity: NotifySeverity;
  summary: string;
  detail?: string;
  life: number;
  removing: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _counter = 0;
  readonly items = signal<NotifItem[]>([]);

  add(opts: { severity: NotifySeverity; summary: string; detail?: string; life?: number }): void {
    const id = ++this._counter;
    const life = opts.life ?? 4500;
    setTimeout(() => {
      this.items.update(arr => [
        ...arr,
        { severity: opts.severity, summary: opts.summary, detail: opts.detail, id, life, removing: false },
      ]);
      setTimeout(() => this.dismiss(id), life);
    }, 0);
  }

  dismiss(id: number): void {
    setTimeout(() => {
      this.items.update(arr => arr.map(n => n.id === id ? { ...n, removing: true } : n));
      setTimeout(() => this.items.update(arr => arr.filter(n => n.id !== id)), 360);
    }, 0);
  }
}
