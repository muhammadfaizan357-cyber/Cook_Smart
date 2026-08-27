import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cs-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (auth.authModalOpen()) {
      <div class="auth-backdrop" (click)="onBackdropClick($event)">
        <div class="auth-modal cs-card">
          <!-- Close Button -->
          <button class="auth-modal__close" (click)="auth.closeAuthModal()" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Header -->
          <div class="auth-modal__head">
            <img src="assets/images/cooksmart-logo.png" alt="CookSmart" class="auth-logo" />
            <span class="eyebrow">{{ getEyebrowText() }}</span>
            <h2>{{ getHeadingText() }}</h2>
            <p class="auth-sub">
              {{ getSubtitleText() }}
            </p>
          </div>

          <!-- Tabs -->
          <div class="auth-tabs">
            <button
              type="button"
              class="auth-tab"
              [class.is-active]="auth.authModalTab() === 'login'"
              (click)="switchTab('login')"
            >
              Sign In
            </button>
            <button
              type="button"
              class="auth-tab"
              [class.is-active]="auth.authModalTab() === 'register'"
              (click)="switchTab('register')"
            >
              Create Account
            </button>
            <button
              type="button"
              class="auth-tab auth-tab--admin"
              [class.is-active]="auth.authModalTab() === 'admin'"
              (click)="switchTab('admin')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Admin Portal
            </button>
          </div>

          <!-- Error Alert -->
          @if (errorMessage) {
            <div class="auth-alert auth-alert--error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <!-- LOGIN FORM -->
          @if (auth.authModalTab() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="auth-form" novalidate>
              <div class="field-modal" [class.has-error]="loginSubmitted && lf.email.invalid">
                <label class="field-label">Email Address <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" formControlName="email" placeholder="you@example.com" autocomplete="email" />
                </div>
                @if (loginSubmitted && lf.email.errors?.['required']) {
                  <div class="field-error">Email is required.</div>
                }
                @if (loginSubmitted && lf.email.errors?.['email']) {
                  <div class="field-error">Please enter a valid email address.</div>
                }
              </div>

              <div class="field-modal" [class.has-error]="loginSubmitted && lf.password.invalid">
                <label class="field-label">Password <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password" />
                </div>
                @if (loginSubmitted && lf.password.errors?.['required']) {
                  <div class="field-error">Password is required.</div>
                }
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-enter">
                <span>Sign In to CookSmart</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

            </form>
          }

          <!-- REGISTER FORM -->
          @if (auth.authModalTab() === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="auth-form" novalidate>
              <div class="field-modal" [class.has-error]="registerSubmitted && rf.name.invalid">
                <label class="field-label">Full Name <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" formControlName="name" placeholder="e.g. Ayesha Malik" autocomplete="name" />
                </div>
                @if (registerSubmitted && rf.name.errors?.['required']) {
                  <div class="field-error">Name is required.</div>
                }
              </div>

              <div class="field-modal" [class.has-error]="registerSubmitted && rf.email.invalid">
                <label class="field-label">Email Address <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" formControlName="email" placeholder="you@example.com" autocomplete="email" />
                </div>
                @if (registerSubmitted && rf.email.errors?.['required']) {
                  <div class="field-error">Email is required.</div>
                }
                @if (registerSubmitted && rf.email.errors?.['email']) {
                  <div class="field-error">Please enter a valid email address.</div>
                }
              </div>

              <div class="field-modal" [class.has-error]="registerSubmitted && rf.password.invalid">
                <label class="field-label">Create Strong Password <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" formControlName="password" placeholder="e.g. User@2026!Pass" autocomplete="new-password" />
                </div>
                <span class="field-hint" style="font-size:11.5px;color:#a0a0b2;margin-top:4px;display:block;">
                  Must be at least 8 characters with uppercase, lowercase, number &amp; symbol.
                </span>
                @if (registerSubmitted && rf.password.errors?.['required']) {
                  <div class="field-error">Password is required.</div>
                }
                @if (registerSubmitted && (rf.password.errors?.['minlength'] || rf.password.errors?.['pattern'])) {
                  <div class="field-error">Strong password restriction: Must contain at least 8 characters, uppercase letter, lowercase letter, number (0-9) and special character.</div>
                }
              </div>

              <div class="field-modal">
                <label class="field-label">Profile Photo (Optional)</label>
                <div class="file-upload-wrap">
                  @if (selectedAvatarPreview) {
                    <div class="avatar-preview-box">
                      <img [src]="selectedAvatarPreview" alt="Profile Preview" class="avatar-preview-img" />
                      <button type="button" class="btn-remove-avatar" (click)="removeAvatar(avatarInput)">Remove Photo</button>
                    </div>
                  } @else {
                    <button type="button" class="btn-file-select" (click)="avatarInput.click()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>Choose Photo from Device</span>
                    </button>
                  }
                  <input
                    #avatarInput
                    type="file"
                    accept="image/*"
                    (change)="onAvatarFileSelected($event)"
                    style="display: none;"
                  />
                </div>
                <span class="field-hint" style="font-size:11px;color:#888;margin-top:3px;">Optional. Leave empty to use clean monogram initials.</span>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-enter">
                <span>Create Member Account</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
          }

          <!-- ADMIN PASSCODE FORM -->
          @if (auth.authModalTab() === 'admin') {
            <form [formGroup]="adminForm" (ngSubmit)="onAdminSubmit()" class="auth-form" novalidate>

              <div class="field-modal" [class.has-error]="adminSubmitted && af.adminEmail.invalid">
                <label class="field-label">Admin Email <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" formControlName="adminEmail" placeholder="Admin email address" autocomplete="email" />
                </div>
                @if (adminSubmitted && af.adminEmail.errors?.['required']) {
                  <div class="field-error">Email is required.</div>
                }
                @if (adminSubmitted && af.adminEmail.errors?.['email']) {
                  <div class="field-error">Please enter a valid email address.</div>
                }
              </div>

              <div class="field-modal" [class.has-error]="adminSubmitted && af.passcode.invalid">
                <label class="field-label">Admin Password <span class="required">*</span></label>
                <div class="input-wrap">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type="password" formControlName="passcode" placeholder="••••••••" autocomplete="current-password" />
                </div>
                @if (adminSubmitted && af.passcode.errors?.['required']) {
                  <div class="field-error">Password is required.</div>
                }
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-enter btn-admin-enter">
                <span>Verify &amp; Open Admin Dashboard</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </form>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .auth-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(4, 4, 6, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: backdrop-fade 0.3s ease-out;
    }
    @keyframes backdrop-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .auth-modal {
      width: 100%;
      max-width: 480px;
      background: #111116;
      border-radius: 26px;
      padding: 34px 34px 28px;
      border: 1.5px solid rgba(212, 175, 55, 0.4);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.18);
      animation: modal-pop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
      color: #ffffff;
    }
    @keyframes modal-pop {
      0% { transform: scale(0.92) translateY(16px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .auth-modal__close {
      position: absolute;
      top: 18px;
      right: 18px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #181822;
      border: 1px solid rgba(212, 175, 55, 0.35);
      color: var(--cs-gold-400, #e5c158);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .auth-modal__close:hover {
      background: var(--cs-gold-500, #d4af37);
      color: #000000;
      transform: rotate(90deg);
    }
    .auth-modal__close svg {
      width: 18px;
      height: 18px;
    }
    .auth-modal__head {
      text-align: center;
      margin-bottom: 20px;
    }
    .auth-logo {
      height: 52px;
      max-width: 190px;
      object-fit: contain;
      margin-bottom: 8px;
      filter: drop-shadow(0 0 14px rgba(212, 175, 55, 0.5));
    }
    .auth-modal__head h2 {
      font-size: 24px;
      color: #ffffff;
      margin: 2px 0 6px;
      background: linear-gradient(135deg, #ffffff 40%, var(--cs-gold-300, #f5d77f) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .auth-sub {
      font-size: 13px;
      color: #9e9eb4;
      line-height: 1.45;
      margin: 0 auto;
      max-width: 380px;
    }
    .auth-tabs {
      display: flex;
      gap: 6px;
      background: #0b0b0f;
      border: 1px solid rgba(212, 175, 55, 0.2);
      padding: 5px;
      border-radius: 14px;
      margin-bottom: 20px;
    }
    .auth-tab {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 8px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      color: #9e9eb4;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .auth-tab.is-active {
      background: var(--cs-gradient-gold);
      color: #000000;
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
    }
    .auth-tab--admin.is-active {
      background: var(--cs-gradient-gold);
      color: #000000;
    }
    .auth-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .auth-alert--error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .auth-alert svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .field-modal {
      display: flex;
      flex-direction: column;
    }
    .field-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--cs-gold-300, #f5d77f);
      margin-bottom: 6px;
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
      width: 17px;
      height: 17px;
      color: var(--cs-gold-400, #e5c158);
      pointer-events: none;
    }
    .input-wrap input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      border: 1.5px solid rgba(212, 175, 55, 0.3);
      border-radius: 12px;
      font-size: 14px;
      color: #ffffff;
      background: #181822;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .input-wrap input:focus {
      outline: none;
      border-color: var(--cs-gold-400, #e5c158);
      background: #1e1e2c;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
    }
    .field-modal.has-error input {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    .field-error {
      font-size: 11.5px;
      color: #f87171;
      font-weight: 600;
      margin-top: 4px;
    }
    .btn-enter {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      font-size: 14.5px;
      font-weight: 800;
      border-radius: 12px;
      margin-top: 4px;
      background: var(--cs-gradient-gold);
      color: #000000;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
    }
    .btn-enter:hover {
      filter: brightness(1.1);
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
    }
    .btn-enter svg {
      width: 17px;
      height: 17px;
    }
    .btn-admin-enter {
      background: var(--cs-gradient-gold);
      color: #000000;
      border: none;
    }
    .file-upload-wrap {
      margin-top: 4px;
    }
    .btn-file-select {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px 16px;
      background: #181822;
      border: 1.5px dashed rgba(212, 175, 55, 0.45);
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      color: var(--cs-gold-300, #f5d77f);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-file-select svg {
      width: 18px;
      height: 18px;
      color: var(--cs-gold-400, #e5c158);
    }
    .btn-file-select:hover {
      background: #20202e;
      border-color: var(--cs-gold-400, #e5c158);
    }
    .avatar-preview-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #181822;
      border-radius: 12px;
      border: 1px solid rgba(212, 175, 55, 0.35);
    }
    .avatar-preview-img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--cs-gold-400, #e2b94c);
    }
    .btn-remove-avatar {
      background: none;
      border: none;
      font-size: 12px;
      font-weight: 600;
      color: #ef4444;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .btn-remove-avatar:hover {
      background: rgba(239, 68, 68, 0.15);
    }

  `]
})
export class AuthModalComponent {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  errorMessage = '';
  loginSubmitted = false;
  registerSubmitted = false;
  adminSubmitted = false;
  selectedAvatarPreview: string | null = null;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/)
    ]],
    avatar: ['']
  });

  adminForm = this.fb.nonNullable.group({
    adminEmail: ['', [Validators.required, Validators.email]],
    passcode: ['', [Validators.required]]
  });

  get lf() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }
  get af() { return this.adminForm.controls; }

  switchTab(tab: 'login' | 'register' | 'admin'): void {
    this.errorMessage = '';
    this.auth.authModalTab.set(tab);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('auth-backdrop')) {
      this.auth.closeAuthModal();
    }
  }

  getEyebrowText(): string {
    if (this.auth.authModalTab() === 'admin') return 'Restricted Access';
    if (this.auth.authModalTab() === 'register') return 'Join The Culinary Club';
    return 'Welcome Back';
  }

  getHeadingText(): string {
    if (this.auth.authModalTab() === 'admin') return 'Admin Dashboard Access';
    if (this.auth.authModalTab() === 'register') return 'Create Your Account';
    return 'Sign In to CookSmart';
  }

  getSubtitleText(): string {
    if (this.auth.authModalTab() === 'admin') {
      return 'Enter the master admin passkey to configure recipes, categories, users, and feedback.';
    }
    if (this.auth.authModalTab() === 'register') {
      return 'Unlock unlimited recipe exploration, meal planner, ingredient matching & favorites.';
    }
    return 'Sign in to access your saved recipes, meal plans, and personalized cooking suggestions.';
  }

  fillDemoUser(): void {
    this.loginForm.patchValue({
      email: 'sarah@example.com',
      password: 'user123'
    });
    this.errorMessage = '';
  }

  fillDemoAdmin(): void {
    this.loginForm.patchValue({
      email: 'admin@cooksmart.com',
      password: 'ChefAdmin@2026!'
    });
    this.errorMessage = '';
  }

  onLoginSubmit(): void {
    this.loginSubmitted = true;
    this.errorMessage = '';
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();
    const res = this.auth.login(email, password);
    if (!res.success) {
      this.errorMessage = res.message;
    } else {
      this.toast.show(res.message);
    }
  }

  onRegisterSubmit(): void {
    this.registerSubmitted = true;
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      if (this.rf.password.errors?.['minlength'] || this.rf.password.errors?.['pattern']) {
        this.errorMessage = 'Strong password required: At least 8 characters with uppercase, lowercase, number, and symbol.';
      }
      return;
    }

    const { name, email, password, avatar } = this.registerForm.getRawValue();
    const res = this.auth.register(name, email, password, avatar);
    if (!res.success) {
      this.errorMessage = res.message;
    } else {
      this.toast.show(res.message);
    }
  }

  onAvatarFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 3 * 1024 * 1024) {
        this.errorMessage = 'Image size should be under 3MB.';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAvatarPreview = reader.result as string;
        this.registerForm.patchValue({ avatar: this.selectedAvatarPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(fileInput?: HTMLInputElement): void {
    this.selectedAvatarPreview = null;
    this.registerForm.patchValue({ avatar: '' });
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onAdminSubmit(): void {
    this.adminSubmitted = true;
    this.errorMessage = '';
    if (this.adminForm.invalid) return;

    const { adminEmail, passcode } = this.adminForm.getRawValue();
    // First try email+password login as admin
    const loginRes = this.auth.login(adminEmail, passcode);
    if (loginRes.success) {
      this.toast.show(loginRes.message);
      return;
    }
    // Fallback: try passcode only (master passkey)
    const res = this.auth.loginWithAdminPasscode(passcode);
    if (!res.success) {
      this.errorMessage = 'Invalid admin credentials. Please check email and password.';
    } else {
      this.toast.show(res.message);
    }
  }
}
