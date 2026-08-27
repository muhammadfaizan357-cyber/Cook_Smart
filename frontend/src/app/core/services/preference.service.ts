import { Injectable, signal } from '@angular/core';
import { UserPreference } from '../models/recipe.model';

const STORAGE_KEY = 'cooksmart.preference';
const EMPTY: UserPreference = { firstName: '', preferredCategory: '' };

@Injectable({ providedIn: 'root' })
export class PreferenceService {
  readonly preference = signal<UserPreference>(this.load());

  private load(): UserPreference {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserPreference) : EMPTY;
    } catch {
      return EMPTY;
    }
  }

  save(pref: UserPreference): void {
    this.preference.set(pref);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  }

  hasPreference(): boolean {
    return !!this.preference().firstName;
  }
}
