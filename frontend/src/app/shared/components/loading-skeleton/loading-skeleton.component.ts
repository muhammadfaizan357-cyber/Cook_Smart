import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cs-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-grid">
      @for (i of counter(); track i) {
        <div class="skeleton-card">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-line" style="width: 70%"></div>
          <div class="skeleton skeleton-line" style="width: 45%"></div>
          <div class="skeleton skeleton-line" style="width: 90%"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-grid { display: grid; gap: 28px; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); }
    .skeleton-card { background: #fff; border-radius: var(--cs-radius-lg); padding: 16px; box-shadow: var(--cs-shadow-sm); }
    .skeleton-img { height: 170px; margin-bottom: 14px; }
    .skeleton-line { height: 12px; margin-bottom: 10px; }
  `]
})
export class LoadingSkeletonComponent {
  @Input() count = 6;
  counter(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
