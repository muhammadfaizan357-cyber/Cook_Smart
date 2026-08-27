import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/recipe.model';
import { MediaModalService } from '../../../core/services/media-modal.service';

@Component({
  selector: 'cs-category-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-card-wrapper">
      <div class="category-card" (click)="openPreview($event)" title="Click to view {{ category.name }} showcase">
        <div class="category-card__img" [style.backgroundImage]="'url(' + category.image + ')'"></div>
        <div class="category-card__overlay"></div>

        <div class="category-card__content">
          <h4>{{ category.name }}</h4>
          <p>{{ category.description }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;

  private mediaModal = inject(MediaModalService);

  openPreview(event?: Event): void {
    if (event) event.stopPropagation();
    this.mediaModal.openCategory(this.category);
  }
}
