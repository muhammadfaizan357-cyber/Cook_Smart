import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { SplashLoaderComponent } from './shared/components/splash-loader/splash-loader.component';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import { OnboardingModalComponent } from './shared/components/onboarding-modal/onboarding-modal.component';
import { MediaModalComponent } from './shared/components/media-modal/media-modal.component';
import { AuthService } from './core/services/auth.service';
import { PreferenceService } from './core/services/preference.service';
import { ToastService } from './core/services/toast.service';
import { UserPreference } from './core/models/recipe.model';

@Component({
  selector: 'cs-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    SplashLoaderComponent,
    AuthModalComponent,
    OnboardingModalComponent,
    MediaModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  private prefService = inject(PreferenceService);
  private toast = inject(ToastService);
  private router = inject(Router);

  isAdminRoute = signal(false);
  showSplash = signal(true);
  splashMessage = signal('Welcome to CookSmart');
  splashSubMessage = signal('Preparing your personalized luxury culinary experience…');

  ngOnInit(): void {
    // Check initial route
    this.isAdminRoute.set(window.location.pathname.startsWith('/admin'));

    // Subscribe to router events to toggle admin navbar/footer
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin') || event.url.startsWith('/admin'));
      });
  }

  onTastePreferenceCompleted(pref: UserPreference): void {
    this.auth.setPreferences(pref);
    this.toast.show(`Taste profile saved! Welcome, ${pref.firstName}.`);
  }

  onSplashComplete(): void {
    this.showSplash.set(false);
    const user = this.auth.currentUser();
    if (user) {
      this.toast.show(`Welcome to CookSmart, ${user.name.split(' ')[0]}!`);
    }
  }

  /**
   * Global button-ripple micro-interaction
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement)?.closest('.btn') as HTMLElement | null;
    if (!target || target.hasAttribute('disabled')) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
}
