import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rh-page-stub',
  imports: [CommonModule],
  templateUrl: './rh-page-stub.html',
  styleUrl: './rh-page-stub.scss',
})
export class RhPageStub {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() features: string[] = [];
}
