import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PreferenceService } from '../../../core/services/preference.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'cs-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  prefs = inject(PreferenceService);
  auth = inject(AuthService);
  private router = inject(Router);

  scrolled = signal(false);
  menuOpen = signal(false);
  userMenuOpen = signal(false);

  links = [
    { path: '/', label: 'Home' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/categories', label: 'Categories' },
    { path: '/ai-suggestion', label: 'AI Suggest' },
    { path: '/meal-planner', label: 'Planner' },
    { path: '/favourites', label: 'Favourites' },
    { path: '/tips', label: 'Tips' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-wrap')) {
      this.userMenuOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(e: Event): void {
    e.stopPropagation();
    this.userMenuOpen.update((v) => !v);
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  openLogin(): void {
    this.closeMenu();
    this.auth.openAuthModal('login');
  }

  openRegister(): void {
    this.closeMenu();
    this.auth.openAuthModal('register');
  }

  openAdminLogin(): void {
    this.closeMenu();
    this.auth.openAuthModal('admin');
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
  }
}
