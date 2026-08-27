import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { PreferenceService } from '../../core/services/preference.service';
import { Recipe, Category, Tip } from '../../core/models/recipe.model';
import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { TipCardComponent } from '../../shared/components/tip-card/tip-card.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeroSliderComponent,
    RecipeCardComponent,
    CategoryCardComponent,
    TipCardComponent,
    LoadingSkeletonComponent,
    ScrollRevealDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private data = inject(RecipeDataService);
  prefs = inject(PreferenceService);

  loading = true;
  recipes: Recipe[] = [];
  categories: Category[] = [];
  tips: Tip[] = [];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1600&q=80',
      eyebrow: 'Smart Cooking & Recipe Discovery',
      title: 'Cook Smarter with What You Already Have',
      subtitle: 'Discover recipes by ingredient, category, cooking time or difficulty — plus a built-in AI suggestion tool.',
      ctaLabel: 'Try AI Recipe Suggestion',
      ctaLink: '/ai-suggestion'
    },
    {
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
      eyebrow: 'Freshly Curated',
      title: 'A Recipe Library Worth Falling In Love With',
      subtitle: 'From quick breakfasts to showstopper desserts — browse a hand-picked collection of 19 recipes.',
      ctaLabel: 'Browse Recipes',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1600&q=80',
      eyebrow: 'Plan Ahead',
      title: 'Your Whole Week, Beautifully Planned',
      subtitle: 'Drop your favourite recipes straight into a weekly meal planner — saved right on your device.',
      ctaLabel: 'Open Meal Planner',
      ctaLink: '/meal-planner'
    }
  ];

  get featuredRecipes(): Recipe[] {
    return this.recipes.filter((r) => r.featured).slice(0, 6);
  }
  get popularRecipes(): Recipe[] {
    return this.recipes.filter((r) => r.popular).slice(0, 6);
  }
  get featuredTips(): Tip[] {
    return this.tips.filter((t) => t.featured).slice(0, 3);
  }

  ngOnInit(): void {
    this.data.getRecipes().subscribe((r) => {
      this.recipes = r;
      this.loading = false;
    });
    this.data.getCategories().subscribe((c) => (this.categories = c));
    this.data.getTips().subscribe((t) => (this.tips = t));
  }
}
