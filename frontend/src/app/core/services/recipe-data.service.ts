import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Recipe, Category, Tip } from '../models/recipe.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class RecipeDataService {
  private db = inject(DbService);

  getRecipes(): Observable<Recipe[]> {
    return this.db.recipes$;
  }

  getCategories(): Observable<Category[]> {
    return this.db.categories$;
  }

  getTips(): Observable<Tip[]> {
    return this.db.tips$;
  }

  getRecipeById(id: string): Observable<Recipe | undefined> {
    return this.getRecipes().pipe(map((list) => list.find((r) => r.id === id)));
  }

  // Synchronous convenience lookups
  getRecipesSync(): Recipe[] {
    return this.db.getRecipes();
  }

  getCategoriesSync(): Category[] {
    return this.db.getCategories();
  }

  getTipsSync(): Tip[] {
    return this.db.getTips();
  }
}
