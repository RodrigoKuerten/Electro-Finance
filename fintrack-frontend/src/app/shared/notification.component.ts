import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { NotificationService, NotifItem } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  standalone: true,
  imports: [NgClass],
})
export class NotificationComponent {
  readonly svc = inject(NotificationService);

  dismiss(id: number): void {
    this.svc.dismiss(id);
  }
}
