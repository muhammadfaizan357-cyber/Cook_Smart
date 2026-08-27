import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'cs-favourites',
  standalone: true,
  imports: [CommonModule, RouterLink, RecipeCardComponent, LoadingSkeletonComponent, ScrollRevealDirective, HeroSliderComponent],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss'
})
export class FavouritesComponent implements OnInit {
  private data = inject(RecipeDataService);
  fav = inject(FavouritesService);

  loading = true;
  allRecipes: Recipe[] = [];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80',
      eyebrow: 'Saved by You',
      title: 'Your Favourite Recipes',
      subtitle: 'Your personal collection of loved dishes, saved safely on this device for quick access.',
      ctaLabel: 'Browse All Recipes',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=80',
      eyebrow: 'Cook with Confidence',
      title: 'Meals You Love',
      subtitle: 'Add your favourite dishes straight to your weekly meal planner with one click.',
      ctaLabel: 'Open Meal Planner',
      ctaLink: '/meal-planner'
    }
  ];

  ngOnInit(): void {
    this.data.getRecipes().subscribe((r) => {
      this.allRecipes = r;
      this.loading = false;
    });
  }

  get favouriteRecipes(): Recipe[] {
    const ids = this.fav.favouriteIds();
    return this.allRecipes.filter((r) => ids.includes(r.id));
  }
}
