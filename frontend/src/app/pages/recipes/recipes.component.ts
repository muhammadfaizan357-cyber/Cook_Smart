import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { Recipe, CategoryId, Difficulty } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

type SortOption = 'name-asc' | 'name-desc' | 'time-asc' | 'time-desc';

@Component({
  selector: 'cs-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeCardComponent, LoadingSkeletonComponent, HeroSliderComponent, ScrollRevealDirective],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent implements OnInit {
  private data = inject(RecipeDataService);
  private route = inject(ActivatedRoute);

  loading = true;
  allRecipes: Recipe[] = [];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80',
      eyebrow: 'The Full Collection',
      title: 'Recipe Library',
      subtitle: 'Search, filter and sort through dozens of chef-crafted recipes tailored to your taste.',
      ctaLabel: 'AI Suggestion Tool',
      ctaLink: '/ai-suggestion'
    },
    {
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80',
      eyebrow: 'Evening Classics',
      title: 'Hearty Dinners Made Simple',
      subtitle: 'Satisfying, flavorful dinners made with common kitchen ingredients in under 40 minutes.',
      ctaLabel: 'Plan Your Meals',
      ctaLink: '/meal-planner'
    },
    {
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80',
      eyebrow: 'Quick & Healthy',
      title: 'Wholesome 20-Min Meals',
      subtitle: 'Fast cooking techniques that preserve maximum nutrition without compromising on taste.',
      ctaLabel: 'Watch Cooking Tips',
      ctaLink: '/tips'
    }
  ];

  searchTerm = '';
  ingredientSearch = '';
  categoryFilter: CategoryId | '' = '';
  difficultyFilter: Difficulty | '' = '';
  maxTime = 90;
  sortBy: SortOption = 'name-asc';

  pageSize = 9;
  visibleCount = this.pageSize;

  categories: CategoryId[] = ['breakfast', 'lunch', 'dinner', 'snacks', 'desserts'];
  difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('category') as CategoryId | null;
      if (cat) this.categoryFilter = cat;
    });

    this.data.getRecipes().subscribe((r) => {
      this.allRecipes = r;
      this.loading = false;
    });
  }

  get filteredRecipes(): Recipe[] {
    const term = this.searchTerm.trim().toLowerCase();
    const ingredientTokens = this.ingredientSearch
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    let list = this.allRecipes.filter((r) => {
      const matchesSearch = !term || r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term);
      const matchesCategory = !this.categoryFilter || r.category === this.categoryFilter;
      const matchesDifficulty = !this.difficultyFilter || r.difficulty === this.difficultyFilter;
      const matchesTime = r.cookingTimeMinutes <= this.maxTime;
      const matchesIngredients =
        ingredientTokens.length === 0 ||
        ingredientTokens.every((tok) => r.ingredients.some((ing) => ing.toLowerCase().includes(tok)));
      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesIngredients;
    });

    list = [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'time-asc':
          return a.cookingTimeMinutes - b.cookingTimeMinutes;
        case 'time-desc':
          return b.cookingTimeMinutes - a.cookingTimeMinutes;
        default:
          return 0;
      }
    });

    return list;
  }

  get pagedRecipes(): Recipe[] {
    return this.filteredRecipes.slice(0, this.visibleCount);
  }

  get hasMore(): boolean {
    return this.visibleCount < this.filteredRecipes.length;
  }

  loadMore(): void {
    this.visibleCount += this.pageSize;
  }

  hasActiveFilters(): boolean {
    return Boolean(
      this.searchTerm.trim() ||
      this.ingredientSearch.trim() ||
      this.categoryFilter ||
      this.difficultyFilter ||
      this.maxTime < 90 ||
      this.sortBy !== 'name-asc'
    );
  }

  setCategory(cat: CategoryId | ''): void {
    this.categoryFilter = cat;
    this.onFilterChange();
  }

  setDifficulty(diff: Difficulty | ''): void {
    this.difficultyFilter = diff;
    this.onFilterChange();
  }

  setTimePreset(mins: number): void {
    this.maxTime = mins;
    this.onFilterChange();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onFilterChange();
  }

  clearIngredientSearch(): void {
    this.ingredientSearch = '';
    this.onFilterChange();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.ingredientSearch = '';
    this.categoryFilter = '';
    this.difficultyFilter = '';
    this.maxTime = 90;
    this.sortBy = 'name-asc';
    this.visibleCount = this.pageSize;
  }

  onFilterChange(): void {
    this.visibleCount = this.pageSize;
  }
}
