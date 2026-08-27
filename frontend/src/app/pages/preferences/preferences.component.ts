import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PreferenceService } from '../../core/services/preference.service';
import { ToastService } from '../../core/services/toast.service';
import { RecipeDataService } from '../../core/services/recipe-data.service';
import { Category, CategoryId } from '../../core/models/recipe.model';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'cs-preferences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prefService = inject(PreferenceService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private data = inject(RecipeDataService);

  categories: Category[] = [];
  submitted = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    preferredCategory: ['' as CategoryId | '', [Validators.required]]
  });

  ngOnInit(): void {
    this.data.getCategories().subscribe((c) => (this.categories = c));
    const existing = this.prefService.preference();
    if (existing.firstName) {
      this.form.patchValue(existing);
    }
  }

  selectCategory(id: CategoryId): void {
    this.form.patchValue({ preferredCategory: id });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.prefService.save({ firstName: value.firstName.trim(), preferredCategory: value.preferredCategory });
    this.toast.show(`Welcome, ${value.firstName}! Preferences saved.`);
    this.router.navigate(['/']);
  }
}
