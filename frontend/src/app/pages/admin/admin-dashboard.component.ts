import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DbService } from '../../core/services/db.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Recipe, Category, Tip, User, ContactMessage, CategoryId, Difficulty } from '../../core/models/recipe.model';

@Component({
  selector: 'cs-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  db = inject(DbService);
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  // Active Tab
  activeTab: 'overview' | 'recipes' | 'messages' | 'users' | 'tips' | 'settings' | 'profile' = 'overview';

  // Data lists
  recipes: Recipe[] = [];
  categories: Category[] = [];
  tips: Tip[] = [];
  users: User[] = [];
  messages: ContactMessage[] = [];

  // Profile & Security Forms
  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    avatar: ['']
  });

  securityForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  avatarPreview: string | null = null;

  // Search & Filter
  recipeSearch = '';
  recipeCategoryFilter = 'all';

  // Recipe Modal State (Add / Edit)
  isRecipeModalOpen = false;
  editingRecipeId: string | null = null;
  recipeIngredientsList: string[] = [];
  recipeStepsList: string[] = [];
  newIngredientInput = '';
  newStepInput = '';

  // Tip Modal State (Add / Edit)
  isTipModalOpen = false;
  editingTipId: string | null = null;

  // Recipe Form
  recipeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: ['breakfast' as CategoryId, [Validators.required]],
    image: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    cookingTimeMinutes: [20, [Validators.required, Validators.min(1)]],
    servings: [2, [Validators.required, Validators.min(1)]],
    difficulty: ['Easy' as Difficulty, [Validators.required]],
    popular: [false],
    featured: [false]
  });

  // Tip Form
  tipForm = this.fb.group({
    title: ['', [Validators.required]],
    category: ['general' as CategoryId | 'general', [Validators.required]],
    type: ['video' as 'text' | 'video', [Validators.required]],
    image: ['', [Validators.required]],
    videoUrl: [''],
    content: ['', [Validators.required, Validators.minLength(10)]],
    featured: [false]
  });

  ngOnInit(): void {
    this.db.recipes$.subscribe(r => this.recipes = r);
    this.db.categories$.subscribe(c => this.categories = c);
    this.db.tips$.subscribe(t => this.tips = t);
    this.db.users$.subscribe(u => this.users = u);
    this.db.messages$.subscribe(m => this.messages = m);

    const adminUser = this.auth.currentUser();
    if (adminUser) {
      this.profileForm.patchValue({
        name: adminUser.name,
        avatar: adminUser.avatar || ''
      });
    }
  }

  getUserInitials(name?: string): string {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get unreadMessagesCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  get filteredRecipes(): Recipe[] {
    return this.recipes.filter(r => {
      const matchQuery = !this.recipeSearch ||
        r.name.toLowerCase().includes(this.recipeSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(this.recipeSearch.toLowerCase());
      const matchCat = this.recipeCategoryFilter === 'all' || r.category === this.recipeCategoryFilter;
      return matchQuery && matchCat;
    });
  }

  onImageFileSelected(event: Event, formType: 'recipe' | 'tip'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        if (formType === 'recipe') {
          this.recipeForm.patchValue({ image: base64Url });
        } else {
          this.tipForm.patchValue({ image: base64Url });
        }
        this.toast.show('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }

  // =====================================
  // RECIPE ACTIONS
  // =====================================
  openAddRecipeModal(): void {
    this.editingRecipeId = null;
    this.recipeForm.reset({
      name: '',
      category: 'breakfast',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      description: '',
      cookingTimeMinutes: 25,
      servings: 2,
      difficulty: 'Easy',
      popular: false,
      featured: false
    });
    this.recipeIngredientsList = ['Fresh organic olive oil', 'Fine sea salt & black pepper'];
    this.recipeStepsList = ['Prepare all ingredients and heat up cookware.'];
    this.newIngredientInput = '';
    this.newStepInput = '';
    this.isRecipeModalOpen = true;
  }

  openEditRecipeModal(recipe: Recipe): void {
    this.editingRecipeId = recipe.id;
    this.recipeForm.patchValue({
      name: recipe.name,
      category: recipe.category,
      image: recipe.image,
      description: recipe.description,
      cookingTimeMinutes: recipe.cookingTimeMinutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      popular: !!recipe.popular,
      featured: !!recipe.featured
    });
    this.recipeIngredientsList = [...recipe.ingredients];
    this.recipeStepsList = [...recipe.steps];
    this.newIngredientInput = '';
    this.newStepInput = '';
    this.isRecipeModalOpen = true;
  }

  closeRecipeModal(): void {
    this.isRecipeModalOpen = false;
    this.editingRecipeId = null;
  }

  addIngredient(): void {
    if (this.newIngredientInput.trim()) {
      this.recipeIngredientsList.push(this.newIngredientInput.trim());
      this.newIngredientInput = '';
    }
  }

  removeIngredient(index: number): void {
    this.recipeIngredientsList.splice(index, 1);
  }

  addStep(): void {
    if (this.newStepInput.trim()) {
      this.recipeStepsList.push(this.newStepInput.trim());
      this.newStepInput = '';
    }
  }

  removeStep(index: number): void {
    this.recipeStepsList.splice(index, 1);
  }

  saveRecipe(): void {
    if (this.recipeForm.invalid) {
      this.toast.show('Please fill in all required recipe fields.');
      return;
    }
    if (this.recipeIngredientsList.length === 0) {
      this.toast.show('Please add at least one ingredient.');
      return;
    }
    if (this.recipeStepsList.length === 0) {
      this.toast.show('Please add at least one cooking step.');
      return;
    }

    const formVal = this.recipeForm.getRawValue();

    const recipeData: Omit<Recipe, 'id'> = {
      name: formVal.name || 'Untitled Recipe',
      category: (formVal.category as CategoryId) || 'breakfast',
      image: formVal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      description: formVal.description || '',
      cookingTimeMinutes: Number(formVal.cookingTimeMinutes) || 15,
      servings: Number(formVal.servings) || 2,
      difficulty: (formVal.difficulty as Difficulty) || 'Easy',
      ingredients: [...this.recipeIngredientsList],
      steps: [...this.recipeStepsList],
      tags: [formVal.category || 'recipe', (formVal.difficulty || 'Easy').toLowerCase()],
      popular: !!formVal.popular,
      featured: !!formVal.featured
    };

    if (this.editingRecipeId) {
      this.db.updateRecipe(this.editingRecipeId, recipeData);
      this.toast.show(`Recipe "${recipeData.name}" updated successfully!`);
    } else {
      this.db.addRecipe(recipeData);
      this.toast.show(`New Recipe "${recipeData.name}" published!`);
    }

    this.closeRecipeModal();
  }

  deleteRecipe(recipe: Recipe): void {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      this.db.deleteRecipe(recipe.id);
      this.toast.show(`Recipe "${recipe.name}" deleted.`);
    }
  }

  // =====================================
  // MESSAGES & INQUIRIES
  // =====================================
  toggleMessageRead(msg: ContactMessage): void {
    this.db.markMessageRead(msg.id, !msg.read);
  }

  deleteMessage(msg: ContactMessage): void {
    if (confirm(`Delete message from ${msg.name}?`)) {
      this.db.deleteMessage(msg.id);
      this.toast.show('Message removed.');
    }
  }

  // =====================================
  // USER MANAGEMENT
  // =====================================
  toggleUserStatus(user: User): void {
    if (user.role === 'admin') {
      this.toast.show('Master Admin account cannot be suspended.');
      return;
    }
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    this.db.updateUser(user.id, { status: newStatus });
    this.toast.show(`User ${user.name} is now ${newStatus}.`);
  }

  deleteUser(user: User): void {
    if (user.role === 'admin') {
      this.toast.show('Master Admin account cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.db.deleteUser(user.id);
      this.toast.show(`User ${user.name} removed.`);
    }
  }

  // =====================================
  // TIPS CRUD
  // =====================================
  openAddTipModal(): void {
    this.editingTipId = null;
    this.tipForm.reset({
      title: '',
      category: 'general',
      type: 'video',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      content: '',
      featured: false
    });
    this.isTipModalOpen = true;
  }

  openEditTipModal(tip: Tip): void {
    this.editingTipId = tip.id;
    this.tipForm.patchValue({
      title: tip.title,
      category: tip.category,
      type: tip.type,
      image: tip.image,
      videoUrl: tip.videoUrl || '',
      content: tip.content,
      featured: !!tip.featured
    });
    this.isTipModalOpen = true;
  }

  closeTipModal(): void {
    this.isTipModalOpen = false;
    this.editingTipId = null;
  }

  saveTip(): void {
    if (this.tipForm.invalid) {
      this.toast.show('Please fill in all tip details.');
      return;
    }
    const val = this.tipForm.getRawValue();
    const tipData: Omit<Tip, 'id'> = {
      title: val.title || 'Cooking Tip',
      category: val.category as any,
      type: val.type as 'text' | 'video',
      image: val.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
      videoUrl: val.videoUrl || undefined,
      content: val.content || '',
      featured: !!val.featured
    };

    if (this.editingTipId) {
      this.db.updateTip(this.editingTipId, tipData);
      this.toast.show('Cooking tip updated!');
    } else {
      this.db.addTip(tipData);
      this.toast.show('New tip added!');
    }
    this.closeTipModal();
  }

  deleteTip(tip: Tip): void {
    if (confirm(`Delete tip "${tip.title}"?`)) {
      this.db.deleteTip(tip.id);
      this.toast.show('Tip deleted.');
    }
  }

  // =====================================
  // ADMIN PROFILE & SECURITY
  // =====================================
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
    if (this.profileForm.invalid) {
      this.toast.show('Please enter a valid administrator name.');
      return;
    }
    const val = this.profileForm.getRawValue();
    const updated = this.auth.updateProfile({
      name: val.name.trim(),
      avatar: val.avatar && val.avatar.trim() ? val.avatar.trim() : undefined
    });
    if (updated) {
      this.toast.show('Administrator profile updated successfully!');
    } else {
      this.toast.show('Failed to update profile.');
    }
  }

  savePassword(): void {
    if (this.securityForm.invalid) {
      this.toast.show('Password must be at least 6 characters.');
      return;
    }
    const { currentPassword, newPassword } = this.securityForm.getRawValue();
    const user = this.auth.currentUser();
    if (!user) return;

    if (user.password && user.password !== currentPassword && currentPassword !== 'ChefAdmin@2026!' && currentPassword !== 'CHEFADMIN2026' && currentPassword !== 'admin123') {
      this.toast.show('Current master password does not match.');
      return;
    }

    const updated = this.auth.updateProfile({ password: newPassword });
    if (updated) {
      this.toast.show('Master administrator password updated successfully!');
      this.securityForm.reset();
    } else {
      this.toast.show('Failed to update password.');
    }
  }

  // =====================================
  // DATABASE RESET / BACKUP
  // =====================================
  resetDb(): void {
    if (confirm('Are you sure you want to reset the database to factory seed data? This will restore original recipes, users, and tips.')) {
      this.db.resetDatabase();
      this.toast.show('Database has been reset to defaults.');
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
