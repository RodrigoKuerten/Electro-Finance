import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss',
})
export class PageLoader {
  @Input() visible = false;
  @Input() label = 'Processando...';
}
