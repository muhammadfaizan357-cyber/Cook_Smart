import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { PlannerService, DAYS, MEALS } from '../../core/services/planner.service';
import { ToastService } from '../../core/services/toast.service';
import { Recipe, Tip, PlannerDay, PlannerMeal } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { TipCardComponent } from '../../shared/components/tip-card/tip-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'cs-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RecipeCardComponent, TipCardComponent, ScrollRevealDirective],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private data = inject(RecipeDataService);
  private toast = inject(ToastService);
  fav = inject(FavouritesService);
  planner = inject(PlannerService);

  recipe?: Recipe;
  relatedRecipes: Recipe[] = [];
  relatedTips: Tip[] = [];
  checkedIngredients = new Set<string>();
  activeImage = 0;
  notFound = false;

  showPlannerModal = false;
  days = DAYS;
  meals = MEALS;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.loadRecipe(id);
    });
  }

  private loadRecipe(id: string): void {
    this.checkedIngredients.clear();
    this.activeImage = 0;
    this.data.getRecipeById(id).subscribe((r) => {
      this.recipe = r;
      this.notFound = !r;
      if (r) {
        this.data.getRecipes().subscribe((all) => {
          this.relatedRecipes = all.filter((x) => x.category === r.category && x.id !== r.id).slice(0, 3);
        });
        if (r.relatedTipIds?.length) {
          this.data.getTips().subscribe((tips) => {
            this.relatedTips = tips.filter((t) => r.relatedTipIds!.includes(t.id));
          });
        }
      }
    });
  }

  get images(): string[] {
    if (!this.recipe) return [];
    return this.recipe.gallery?.length ? this.recipe.gallery : [this.recipe.image];
  }

  toggleIngredient(ingredient: string): void {
    if (this.checkedIngredients.has(ingredient)) this.checkedIngredients.delete(ingredient);
    else this.checkedIngredients.add(ingredient);
  }

  isChecked(ingredient: string): boolean {
    return this.checkedIngredients.has(ingredient);
  }

  toggleFavourite(): void {
    if (!this.recipe) return;
    const isFav = this.fav.toggle(this.recipe.id);
    this.toast.show(isFav ? 'Added to Favourites' : 'Removed from Favourites');
  }

  assignToPlanner(day: PlannerDay, meal: PlannerMeal): void {
    if (!this.recipe) return;
    this.planner.assign(day, meal, this.recipe.id);
    this.toast.show(`Added to ${day} ${meal} in your Meal Planner`);
    this.showPlannerModal = false;
  }
}
