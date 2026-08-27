import { Injectable, signal } from '@angular/core';
import { PlannerDay, PlannerGrid, PlannerMeal } from '../models/recipe.model';

const STORAGE_KEY = 'cooksmart.planner';
export const DAYS: PlannerDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MEALS: PlannerMeal[] = ['Breakfast', 'Lunch', 'Dinner'];

function emptyGrid(): PlannerGrid {
  const grid = {} as PlannerGrid;
  for (const d of DAYS) {
    grid[d] = { Breakfast: null, Lunch: null, Dinner: null };
  }
  return grid;
}

@Injectable({ providedIn: 'root' })
export class PlannerService {
  readonly grid = signal<PlannerGrid>(this.load());

  private load(): PlannerGrid {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PlannerGrid) : emptyGrid();
    } catch {
      return emptyGrid();
    }
  }

  private persist(grid: PlannerGrid): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }

  assign(day: PlannerDay, meal: PlannerMeal, recipeId: string | null): void {
    const next: PlannerGrid = { ...this.grid(), [day]: { ...this.grid()[day], [meal]: recipeId } };
    this.grid.set(next);
    this.persist(next);
  }

  clear(): void {
    const fresh = emptyGrid();
    this.grid.set(fresh);
    this.persist(fresh);
  }
}
