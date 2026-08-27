import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { Category, Recipe } from '../../core/models/recipe.model';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'cs-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryCardComponent, HeroSliderComponent, ScrollRevealDirective],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  private data = inject(RecipeDataService);

  categories: Category[] = [];
  recipes: Recipe[] = [];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1600&q=80',
      eyebrow: 'Browse by Mood',
      title: 'Recipe Categories',
      subtitle: 'From sunrise breakfasts to late-night desserts — find your exact craving.',
      ctaLabel: 'Explore All Recipes',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80',
      eyebrow: 'Fresh & Vibrant',
      title: 'Wholesome Midday Lunches',
      subtitle: 'Nourishing bowls, wraps, and quick balanced meals for energized afternoons.',
      ctaLabel: 'Get AI Suggestions',
      ctaLink: '/ai-suggestion'
    },
    {
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1600&q=80',
      eyebrow: 'Sweet & Indulgent',
      title: 'Artisanal Desserts & Treats',
      subtitle: 'Decadent finishing touches to elevate family dinners and special occasions.',
      ctaLabel: 'Plan Your Week',
      ctaLink: '/meal-planner'
    }
  ];

  ngOnInit(): void {
    this.data.getCategories().subscribe((c) => (this.categories = c));
    this.data.getRecipes().subscribe((r) => (this.recipes = r));
  }

  countFor(categoryId: string): number {
    return this.recipes.filter((r) => r.category === categoryId).length;
  }

  showcaseFor(categoryId: string): Recipe[] {
    return this.recipes.filter((r) => r.category === categoryId).slice(0, 3);
  }
}
