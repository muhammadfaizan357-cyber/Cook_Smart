import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { DbService } from '../../core/services/db.service';
import { AuthService } from '../../core/services/auth.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { HeroSliderComponent, HeroSlide } from '../../shared/components/hero-slider/hero-slider.component';

@Component({
  selector: 'cs-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollRevealDirective, HeroSliderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private db = inject(DbService);
  public auth = inject(AuthService);
  public authSvc = inject(AuthService);

  isSubmitting = false;

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({ name: user.name, email: user.email });
    }
  }

  heroSlides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
      eyebrow: 'We Value Your Voice',
      title: 'Contact & Feedback',
      subtitle: 'Share your ideas, suggest new features, or connect with our culinary team.',
      ctaLabel: 'Explore About Us',
      ctaLink: '/about'
    },
    {
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1600&q=80',
      eyebrow: 'Built for Food Lovers',
      title: 'CookSmart Experience',
      subtitle: 'Smart ingredient search, curated recipes and weekly meal planning at your fingertips.',
      ctaLabel: 'Browse Recipes',
      ctaLink: '/recipes'
    }
  ];

  submitted = false;
  showSuccess = false;
  selectedTopic = 'General Feedback';
  topics = ['General Feedback', 'Recipe Request', 'Feature Idea', 'Bug Report', 'Partnership'];

  ratingLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good & Useful',
    4: 'Great & Helpful',
    5: 'Outstanding Experience!'
  };

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    topic: ['General Feedback'],
    message: ['', [Validators.required, Validators.minLength(10)]],
    rating: [5]
  });

  get f() { return this.form.controls; }

  setTopic(t: string): void {
    this.selectedTopic = t;
    this.form.patchValue({ topic: t });
  }

  setRating(n: number): void {
    this.form.patchValue({ rating: n });
  }

  get currentRatingLabel(): string {
    const r = this.f.rating.value;
    return this.ratingLabels[r] || 'Tap a star to rate';
  }

  onSubmit(): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Please sign in to send your inquiry.');
      this.auth.openAuthModal('login', '/contact');
      return;
    }

    this.submitted = true;
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const val = this.form.getRawValue();

    setTimeout(() => {
      this.db.addMessage({
        name: val.name,
        email: val.email,
        topic: val.topic,
        message: val.message,
        rating: val.rating
      });

      this.isSubmitting = false;
      this.showSuccess = true;
      this.toast.show('Thank you! Your message has been sent to our culinary team.');
      this.form.reset({ rating: 5, topic: 'General Feedback' });
      this.selectedTopic = 'General Feedback';
      this.submitted = false;
      setTimeout(() => (this.showSuccess = false), 6000);
    }, 800);
  }
}
