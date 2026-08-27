import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Recipe } from '../../../core/models/recipe.model';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'cs-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss'
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Input() matchPercent?: number;
  @Output() removed = new EventEmitter<string>();

  fav = inject(FavouritesService);
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  onCardClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Please sign in to view recipe ingredients, steps & timer.');
      this.auth.openAuthModal('login', `/recipes/${this.recipe.id}`);
      return;
    }
    this.router.navigate(['/recipes', this.recipe.id]);
  }

  toggleFavourite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.toast.show('Please sign in to save recipes to your favourites.');
      this.auth.openAuthModal('login', `/recipes/${this.recipe.id}`);
      return;
    }

    const isFav = this.fav.toggle(this.recipe.id);
    this.toast.show(isFav ? 'Added to Favourites' : 'Removed from Favourites');
    if (!isFav) this.removed.emit(this.recipe.id);
  }

  difficultyClass(): string {
    return `badge-${this.recipe.difficulty.toLowerCase()}`;
  }
}
