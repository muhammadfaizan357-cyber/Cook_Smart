import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { Tip } from '../../core/models/recipe.model';
import { TipCardComponent } from '../../shared/components/tip-card/tip-card.component';
import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

type TipFilter = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'desserts' | 'general';

@Component({
  selector: 'cs-tips',
  standalone: true,
  imports: [CommonModule, TipCardComponent, HeroSliderComponent, ScrollRevealDirective],
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.scss'
})
export class TipsComponent implements OnInit {
  private data = inject(RecipeDataService);

  tips: Tip[] = [];
  activeFilter: TipFilter = 'all';
  filters: TipFilter[] = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'desserts', 'general'];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80',
      eyebrow: 'Master The Kitchen',
      title: 'Cooking Tips & Video Guides',
      subtitle: 'Bite-sized culinary techniques, knife skills, and seasoning secrets from professional chefs.',
      ctaLabel: 'Explore Recipes',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1600&q=80',
      eyebrow: 'Flavor Chemistry',
      title: 'The Art of Layered Seasoning',
      subtitle: 'Learn how adjusting salt, acid, and cooking temperature elevates every home dish.',
      ctaLabel: 'Try AI Suggestions',
      ctaLink: '/ai-suggestion'
    },
    {
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
      eyebrow: 'Heat & Precision',
      title: 'Perfect Pan Control & Timing',
      subtitle: 'Crispier fries, fluffier pancakes, and juicy meats with proper pan management.',
      ctaLabel: 'Meal Planner',
      ctaLink: '/meal-planner'
    }
  ];

  ngOnInit(): void {
    this.data.getTips().subscribe((t) => (this.tips = t));
  }

  get featuredTips(): Tip[] {
    return this.tips.filter((t) => t.featured).slice(0, 3);
  }

  get filteredTips(): Tip[] {
    if (this.activeFilter === 'all') return this.tips;
    return this.tips.filter((t) => t.category === this.activeFilter);
  }

  setFilter(f: TipFilter): void {
    this.activeFilter = f;
  }
}
