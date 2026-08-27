import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { PlannerService } from '../../core/services/planner.service';
import { PreferenceService } from '../../core/services/preference.service';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { ToastService } from '../../core/services/toast.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { Recipe, Category, CategoryId } from '../../core/models/recipe.model';

@Component({
  selector: 'cs-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RecipeCardComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  auth = inject(AuthService);
  fav = inject(FavouritesService);
  planner = inject(PlannerService);
  prefs = inject(PreferenceService);
  private data = inject(RecipeDataService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  activeTab: 'overview' | 'favourites' | 'mealplan' | 'preferences' | 'security' = 'overview';

  favouriteRecipes: Recipe[] = [];
  categories: Category[] = [];

  prefForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    preferredCategory: ['breakfast' as CategoryId, [Validators.required]]
  });

  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    avatar: ['']
  });

  securityForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      const p = this.prefs.preference();
      this.prefForm.patchValue({
        firstName: p.firstName || user.name,
        preferredCategory: p.preferredCategory || 'breakfast'
      });
      this.profileForm.patchValue({
        name: user.name,
        avatar: user.avatar || ''
      });
    }

    this.data.getCategories().subscribe(c => this.categories = c);
    this.loadFavourites();
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  loadFavourites(): void {
    this.data.getRecipes().subscribe(all => {
      this.favouriteRecipes = all.filter(r => this.fav.isFavourite(r.id));
    });
  }

  onRecipeRemoved(id: string): void {
    this.favouriteRecipes = this.favouriteRecipes.filter(r => r.id !== id);
  }

  savePreferences(): void {
    if (this.prefForm.invalid) return;
    const val = this.prefForm.getRawValue();
    this.prefs.save(val);
    this.auth.updateProfile({ preference: val });
    this.toast.show('Taste preferences updated successfully!');
  }

  avatarPreview: string | null = null;

  onProfileAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 3 * 1024 * 1024) {
        this.toast.show('Image size should be under 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.profileForm.patchValue({ avatar: this.avatarPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfileAvatar(fileInput?: HTMLInputElement): void {
    this.avatarPreview = null;
    this.profileForm.patchValue({ avatar: '' });
    if (fileInput) fileInput.value = '';
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const val = this.profileForm.getRawValue();
    this.auth.updateProfile({
      name: val.name,
      avatar: val.avatar && val.avatar.trim() ? val.avatar.trim() : undefined
    });
    this.toast.show('Profile updated successfully!');
  }

  savePassword(): void {
    if (this.securityForm.invalid) return;
    const { currentPassword, newPassword } = this.securityForm.getRawValue();
    const user = this.auth.currentUser();
    if (!user) return;

    if (user.password && user.password !== currentPassword) {
      this.toast.show('Current password does not match.');
      return;
    }

    this.auth.updateProfile({ password: newPassword });
    this.toast.show('Password updated successfully!');
    this.securityForm.reset();
  }

  logout(): void {
    this.auth.logout();
  }
}
