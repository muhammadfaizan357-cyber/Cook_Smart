import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface TeamMember { name: string; role: string; avatar: string; }
interface TimelineItem { icon: string; title: string; text: string; }

import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'cs-about',
  standalone: true,
  imports: [ScrollRevealDirective, HeroSliderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80',
      eyebrow: 'About CookSmart',
      title: 'Cooking Made Simple, Smart & Personal',
      subtitle: 'Built for the TechWiz 7 World Tech Championship to solve everyday cooking decisions with what you have.',
      ctaLabel: 'Browse Recipes',
      ctaLink: '/recipes'
    },
    {
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1600&q=80',
      eyebrow: 'Our Vision',
      title: 'Zero Waste, Maximum Flavour',
      subtitle: 'Turning simple kitchen ingredients into restaurant-grade meals with intelligent matching.',
      ctaLabel: 'Try AI Suggestions',
      ctaLink: '/ai-suggestion'
    },
    {
      image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1600&q=80',
      eyebrow: 'Design & Craftsmanship',
      title: 'A Modern Culinary Platform',
      subtitle: 'A single-page experience designed for food lovers, home cooks, and meal planning enthusiasts.',
      ctaLabel: 'Weekly Meal Planner',
      ctaLink: '/meal-planner'
    }
  ];
  team: TeamMember[] = [
    { name: 'Sufyan Khan', role: 'Team Leader · Full-Stack Developer', avatar: 'assets/images/team/sufyan.jpg' },
    { name: 'Arham Khan', role: 'Full-Stack Developer', avatar: 'assets/images/team/arham.jpg' },
    { name: 'Faizan', role: 'Backend Developer & UI/UX Designer', avatar: 'assets/images/team/faizan.jpg' },
    { name: 'Ghazali', role: 'QA & Documentation', avatar: 'assets/images/team/ghazali.jpg' }
  ];

  timeline: TimelineItem[] = [
    { icon: '01', title: 'Problem', text: 'People often have ingredients at home but struggle to decide what to cook.' },
    { icon: '02', title: 'Idea', text: 'A single-page portal that discovers recipes by ingredient, category, time and difficulty.' },
    { icon: '03', title: 'AI Layer', text: 'A transparent, rule-based ingredient-matching engine suggests the best-fitting recipes.' },
    { icon: '04', title: 'Outcome', text: 'A polished, fully responsive SPA built for the TechWiz 7 Web & App Development category.' }
  ];
}
