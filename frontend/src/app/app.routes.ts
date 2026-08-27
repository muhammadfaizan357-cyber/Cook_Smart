import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'CookSmart — Discover What to Cook'
  },
  {
    path: 'preferences',
    loadComponent: () =>
      import('./pages/preferences/preferences.component').then((m) => m.PreferencesComponent),
    title: 'CookSmart — Your Preferences'
  },
  {
    path: 'recipes',
    loadComponent: () => import('./pages/recipes/recipes.component').then((m) => m.RecipesComponent),
    title: 'CookSmart — Recipe Library'
  },
  {
    path: 'recipes/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/recipe-details/recipe-details.component').then((m) => m.RecipeDetailsComponent),
    title: 'CookSmart — Recipe Details'
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.component').then((m) => m.CategoriesComponent),
    title: 'CookSmart — Categories'
  },
  {
    path: 'ai-suggestion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/ai-suggestion/ai-suggestion.component').then((m) => m.AiSuggestionComponent),
    title: 'CookSmart — AI Recipe Suggestion'
  },
  {
    path: 'meal-planner',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/meal-planner/meal-planner.component').then((m) => m.MealPlannerComponent),
    title: 'CookSmart — Meal Planner'
  },
  {
    path: 'favourites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/favourites/favourites.component').then((m) => m.FavouritesComponent),
    title: 'CookSmart — Favourite Recipes'
  },
  {
    path: 'tips',
    loadComponent: () => import('./pages/tips/tips.component').then((m) => m.TipsComponent),
    title: 'CookSmart — Cooking Tips & Videos'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'CookSmart — About Us'
  },
  {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'CookSmart — Contact & Feedback'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    title: 'CookSmart — Admin Portal'
  },
  {
    path: 'user/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.component').then((m) => m.UserDashboardComponent),
    title: 'CookSmart — My Dashboard'
  },
  { path: '**', redirectTo: '' }
];
