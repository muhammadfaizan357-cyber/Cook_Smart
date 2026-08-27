import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'cooksmart.favourites';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  readonly favouriteIds = signal<string[]>(this.load());
  readonly count = computed(() => this.favouriteIds().length);

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }

  private persist(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  isFavourite(id: string): boolean {
    return this.favouriteIds().includes(id);
  }

  toggle(id: string): boolean {
    const current = this.favouriteIds();
    const next = current.includes(id) ? current.filter((f) => f !== id) : [...current, id];
    this.favouriteIds.set(next);
    this.persist(next);
    return next.includes(id);
  }

  remove(id: string): void {
    const next = this.favouriteIds().filter((f) => f !== id);
    this.favouriteIds.set(next);
    this.persist(next);
  }
}
