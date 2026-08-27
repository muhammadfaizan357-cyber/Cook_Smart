import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { AiSuggestionService, SuggestionResult } from '../../core/services/ai-suggestion.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'cs-ai-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeCardComponent, ScrollRevealDirective, HeroSliderComponent],
  templateUrl: './ai-suggestion.component.html',
  styleUrl: './ai-suggestion.component.scss'
})
export class AiSuggestionComponent implements OnInit {
  private data = inject(RecipeDataService);
  private ai = inject(AiSuggestionService);

  allRecipes: Recipe[] = [];
  ingredientsInput = '';
  isProcessing = false;
  hasSearched = false;
  results: SuggestionResult[] = [];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&q=80',
      eyebrow: 'AI-Powered Assistant',
      title: 'Smart Ingredient Matching',
      subtitle: 'Type what is in your fridge and let our intelligent engine suggest the best matching dishes instantly.'
    },
    {
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=80',
      eyebrow: 'Zero Food Waste',
      title: 'Cook with What You Have',
      subtitle: 'Discover creative recipes without having to make extra grocery trips.'
    },
    {
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80',
      eyebrow: 'Fast & Transparent',
      title: 'Instant Recipe Scoring',
      subtitle: 'See matched vs missing ingredients clearly ranked by highest compatibility.'
    }
  ];

  quickChips = ['eggs, tomato, onion', 'chicken breast, garlic, rice', 'banana, oats, honey', 'potato, cheese, butter'];

  ngOnInit(): void {
    this.data.getRecipes().subscribe((r) => (this.allRecipes = r));
  }

  useChip(text: string): void {
    this.ingredientsInput = text;
  }

  suggest(): void {
    if (!this.ingredientsInput.trim()) return;
    this.isProcessing = true;
    this.hasSearched = true;
    this.results = [];

    // Simulated processing delay for the loading animation — the matching
    // itself is instant, deterministic, rule-based JS (see AiSuggestionService).
    setTimeout(() => {
      this.results = this.ai.suggest(this.ingredientsInput, this.allRecipes);
      this.isProcessing = false;
    }, 900);
  }

  clear(): void {
    this.ingredientsInput = '';
    this.results = [];
    this.hasSearched = false;
  }
}
