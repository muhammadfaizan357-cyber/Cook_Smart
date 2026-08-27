import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { PlannerService, DAYS, MEALS } from '../../core/services/planner.service';
import { ToastService } from '../../core/services/toast.service';
import { Recipe, PlannerDay, PlannerMeal } from '../../core/models/recipe.model';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'cs-meal-planner',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, HeroSliderComponent],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.scss'
})
export class MealPlannerComponent implements OnInit {
  private data = inject(RecipeDataService);
  private toast = inject(ToastService);
  planner = inject(PlannerService);

  recipes: Recipe[] = [];
  days = DAYS;
  meals = MEALS;

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&q=80',
      eyebrow: 'Organize Your Week',
      title: 'Weekly Meal Planner',
      subtitle: 'Schedule your breakfasts, lunches, and dinners to make cooking effortless every day.',
      ctaLabel: 'Find Recipes to Add',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80',
      eyebrow: 'Smart Preparation',
      title: 'Plan Ahead, Cook Fresh',
      subtitle: 'Save time, minimize grocery waste, and enjoy home-cooked meals tailored to your routine.',
      ctaLabel: 'Get AI Suggestions',
      ctaLink: '/ai-suggestion'
    }
  ];

  activeSlot: { day: PlannerDay; meal: PlannerMeal } | null = null;

  ngOnInit(): void {
    this.data.getRecipes().subscribe((r) => (this.recipes = r));
  }

  recipeById(id: string | null): Recipe | undefined {
    if (!id) return undefined;
    return this.recipes.find((r) => r.id === id);
  }

  openSlot(day: PlannerDay, meal: PlannerMeal): void {
    this.activeSlot = { day, meal };
  }

  closeSlot(): void {
    this.activeSlot = null;
  }

  assign(recipeId: string): void {
    if (!this.activeSlot) return;
    this.planner.assign(this.activeSlot.day, this.activeSlot.meal, recipeId);
    this.toast.show('Recipe added to planner');
    this.closeSlot();
  }

  removeSlot(day: PlannerDay, meal: PlannerMeal, event: Event): void {
    event.stopPropagation();
    this.planner.assign(day, meal, null);
  }

  clearAll(): void {
    if (confirm('Clear your entire weekly meal planner?')) {
      this.planner.clear();
      this.toast.show('Meal planner cleared');
    }
  }
}
