import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PreferenceService } from '../../../core/services/preference.service';
import { RecipeDataService } from '../../../core/services/recipe-data.service';
import { Category, CategoryId, UserPreference } from '../../../core/models/recipe.model';

@Component({
  selector: 'cs-onboarding-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="onboarding-backdrop">
      <div class="onboarding-modal cs-card">
        
        <!-- Header with Logo -->
        <div class="onboarding-modal__head">
          <img src="assets/images/cooksmart-logo.png" alt="CookSmart" class="onboarding-logo" />
          <span class="eyebrow">Welcome to CookSmart</span>
          <h2>Tell Us About You</h2>
          <p class="onboarding-sub">
            Just two quick details to personalise your culinary suggestions and recipe discovery experience.
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="onboarding-form">
          <!-- First Name -->
          <div class="field-modal" [class.has-error]="submitted && f.firstName.invalid">
            <label for="ob-firstName" class="field-label">What should we call you? <span class="required">*</span></label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="ob-firstName"
                type="text"
                formControlName="firstName"
                placeholder="Enter your first name (e.g. Ayesha)"
                autocomplete="given-name"
              />
            </div>
            @if (submitted && f.firstName.errors?.['required']) {
              <div class="field-error">Please enter your first name to continue.</div>
            }
            @if (submitted && f.firstName.errors?.['minlength']) {
              <div class="field-error">Name must be at least 2 characters.</div>
            }
          </div>

          <!-- Preferred Recipe Category -->
          <div class="field-modal" [class.has-error]="submitted && f.preferredCategory.invalid">
            <label class="field-label">Choose your favorite recipe category <span class="required">*</span></label>
            <div class="category-pills">
              @for (c of categories; track c.id) {
                <button
                  type="button"
                  class="cat-pill"
                  [class.active]="f.preferredCategory.value === c.id"
                  (click)="selectCategory(c.id)"
                >
                  <span class="cat-pill__check" *ngIf="f.preferredCategory.value === c.id">✓</span>
                  {{ c.name }}
                </button>
              }
            </div>
            @if (submitted && f.preferredCategory.errors?.['required']) {
              <div class="field-error">Please select at least one favorite category.</div>
            }
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary btn-block btn-enter">
            <span>Save &amp; Enter CookSmart</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>

        <div class="onboarding-footer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Saved locally on your device — 100% private &amp; secure.</span>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .onboarding-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(4, 4, 6, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: backdrop-fade 0.4s ease-out;
    }
    @keyframes backdrop-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .onboarding-modal {
      width: 100%;
      max-width: 540px;
      background: #111116;
      border-radius: 26px;
      padding: 36px 36px 28px;
      border: 1.5px solid rgba(212, 175, 55, 0.4);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.18);
      animation: modal-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      color: #ffffff;
    }
    @keyframes modal-pop {
      0% { transform: scale(0.9) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .onboarding-modal__head {
      text-align: center;
      margin-bottom: 24px;
    }
    .onboarding-logo {
      height: 60px;
      max-width: 220px;
      object-fit: contain;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.5));
    }
    .onboarding-modal__head h2 {
      font-size: 26px;
      color: #ffffff;
      margin: 4px 0 8px;
      background: linear-gradient(135deg, #ffffff 40%, var(--cs-gold-300) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .onboarding-sub {
      font-size: 13.5px;
      color: #9e9eb4;
      line-height: 1.5;
      margin: 0 auto;
      max-width: 440px;
    }
    .onboarding-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .field-modal {
      display: flex;
      flex-direction: column;
    }
    .field-label {
      font-size: 12.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--cs-gold-300);
      margin-bottom: 7px;
    }
    .field-label .required {
      color: #ef4444;
    }
    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      width: 18px;
      height: 18px;
      color: var(--cs-gold-400);
      pointer-events: none;
    }
    .input-wrap input {
      width: 100%;
      padding: 13px 16px 13px 44px;
      border: 1.5px solid rgba(212, 175, 55, 0.3);
      border-radius: 12px;
      font-size: 15px;
      color: #ffffff;
      background: #181822;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .input-wrap input:focus {
      outline: none;
      border-color: var(--cs-gold-400);
      background: #1e1e2c;
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.25);
    }
    .field-modal.has-error input {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    .field-error {
      font-size: 12px;
      color: #f87171;
      font-weight: 600;
      margin-top: 5px;
    }
    .category-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cat-pill {
      background: #181822;
      border: 1.5px solid rgba(212, 175, 55, 0.3);
      color: #d8d8e6;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }
    .cat-pill:hover {
      background: #222232;
      border-color: var(--cs-gold-400);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .cat-pill.active {
      background: var(--cs-gradient-gold);
      color: #000000;
      font-weight: 800;
      border-color: var(--cs-gold-400);
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
    }
    .cat-pill__check {
      font-weight: 900;
      font-size: 12px;
    }
    .btn-enter {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 15px 28px;
      font-size: 15.5px;
      font-weight: 800;
      border-radius: 12px;
      margin-top: 6px;
      background: var(--cs-gradient-gold);
      color: #000000;
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
    }
    .btn-enter:hover {
      filter: brightness(1.1);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
    }
    .btn-enter svg {
      width: 18px;
      height: 18px;
      transition: transform 0.25s ease;
    }
    .btn-enter:hover svg {
      transform: translateX(4px);
    }
    .onboarding-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      color: #7a7a8e;
      margin-top: 18px;
      text-align: center;
    }
    .onboarding-footer svg {
      width: 14px;
      height: 14px;
      color: var(--cs-gold-400);
    }
  `]
})
export class OnboardingModalComponent {
  @Output() completed = new EventEmitter<UserPreference>();

  private fb = inject(FormBuilder);
  private prefService = inject(PreferenceService);
  private data = inject(RecipeDataService);

  categories: Category[] = [];
  submitted = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    preferredCategory: ['breakfast' as CategoryId, [Validators.required]]
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    this.data.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  selectCategory(catId: CategoryId): void {
    this.form.patchValue({ preferredCategory: catId });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const val: UserPreference = this.form.getRawValue();
    this.prefService.save(val);
    this.completed.emit(val);
  }
}
