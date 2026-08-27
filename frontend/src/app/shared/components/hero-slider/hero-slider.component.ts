import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface HeroSlide {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

@Component({
  selector: 'cs-hero-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.scss'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input() slides: HeroSlide[] = [];
  @Input() height = '560px';
  @Input() autoPlayMs = 5500;

  active = 0;
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goTo(i: number): void {
    this.active = i;
    this.restartAutoplay();
  }

  next(): void {
    this.active = (this.active + 1) % this.slides.length;
  }

  prev(): void {
    this.active = (this.active - 1 + this.slides.length) % this.slides.length;
    this.restartAutoplay();
  }

  private restartAutoplay(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.slides.length > 1) {
      this.timer = setInterval(() => this.next(), this.autoPlayMs);
    }
  }
}
