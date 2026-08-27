import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Recipe, Category, Tip, User, ContactMessage } from '../models/recipe.model';

const API_BASE = 'http://localhost:5080/api';

const STORAGE_KEYS = {
  RECIPES: 'cs_db_recipes_v3',
  CATEGORIES: 'cs_db_categories_v3',
  TIPS: 'cs_db_tips_v3',
  USERS: 'cs_db_users_v3',
  MESSAGES: 'cs_db_messages_v3',
  INITIALIZED: 'cs_db_initialized_v3'
};

@Injectable({ providedIn: 'root' })
export class DbService {
  private http = inject(HttpClient);

  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private tipsSubject = new BehaviorSubject<Tip[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);
  private messagesSubject = new BehaviorSubject<ContactMessage[]>([]);

  recipes$ = this.recipesSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  tips$ = this.tipsSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.initDatabase();
  }

  public initDatabase(): void {
    // 1. Load initial cache from localStorage for instant UI rendering
    this.loadFromStorage();

    // 2. Fetch fresh authoritative data from MySQL ASP.NET Core API
    this.refreshAllFromApi();
  }

  public refreshAllFromApi(): void {
    // Categories
    this.http.get<Category[]>(`${API_BASE}/categories`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveCategories(data);
      }
    });

    // Recipes
    this.http.get<Recipe[]>(`${API_BASE}/recipes`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveRecipes(data);
      }
    });

    // Tips
    this.http.get<Tip[]>(`${API_BASE}/tips`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveTips(data);
      }
    });

    // Users
    this.http.get<User[]>(`${API_BASE}/users`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveUsers(data);
      }
    });

    // Messages
    this.http.get<ContactMessage[]>(`${API_BASE}/messages`).pipe(
      catchError(() => of(null))
    ).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveMessages(data);
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const recipesJson = localStorage.getItem(STORAGE_KEYS.RECIPES);
      const categoriesJson = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const tipsJson = localStorage.getItem(STORAGE_KEYS.TIPS);
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      const messagesJson = localStorage.getItem(STORAGE_KEYS.MESSAGES);

      if (recipesJson) this.recipesSubject.next(JSON.parse(recipesJson));
      if (categoriesJson) this.categoriesSubject.next(JSON.parse(categoriesJson));
      if (tipsJson) this.tipsSubject.next(JSON.parse(tipsJson));
      if (usersJson) this.usersSubject.next(JSON.parse(usersJson));
      if (messagesJson) this.messagesSubject.next(JSON.parse(messagesJson));

      if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
        this.seedFallback();
      }
    } catch {
      this.seedFallback();
    }
  }

  private seedFallback(): void {
    this.http.get<Recipe[]>('assets/data/recipes.json').pipe(catchError(() => of([]))).subscribe(r => { if (r.length) this.saveRecipes(r); });
    this.http.get<Category[]>('assets/data/categories.json').pipe(catchError(() => of([]))).subscribe(c => { if (c.length) this.saveCategories(c); });
    this.http.get<Tip[]>('assets/data/tips.json').pipe(catchError(() => of([]))).subscribe(t => { if (t.length) this.saveTips(t); });
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // ==========================================
  // RECIPES CRUD (MySQL via API)
  // ==========================================
  getRecipes(): Recipe[] {
    return this.recipesSubject.value;
  }

  getRecipeById(id: string): Recipe | undefined {
    return this.recipesSubject.value.find((r) => r.id === id);
  }

  addRecipe(recipe: Omit<Recipe, 'id'> & { id?: string }): Recipe {
    const newRecipe: Recipe = {
      ...recipe,
      id: recipe.id || 'recipe_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString()
    };
    const current = [newRecipe, ...this.recipesSubject.value];
    this.saveRecipes(current);

    // Persist to MySQL database via API
    this.http.post<Recipe>(`${API_BASE}/recipes`, newRecipe).pipe(
      catchError((err) => {
        console.warn('MySQL API add recipe fallback:', err);
        return of(newRecipe);
      })
    ).subscribe((saved) => {
      if (saved && saved.id) {
        const updated = this.recipesSubject.value.map(r => r.id === newRecipe.id ? saved : r);
        this.saveRecipes(updated);
      }
    });

    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): boolean {
    const current = this.recipesSubject.value;
    const index = current.findIndex((r) => r.id === id);
    if (index === -1) return false;

    const updatedItem = { ...current[index], ...updates };
    const updatedList = [...current];
    updatedList[index] = updatedItem;
    this.saveRecipes(updatedList);

    // Persist to MySQL database via API
    this.http.put<Recipe>(`${API_BASE}/recipes/${id}`, updatedItem).pipe(
      catchError((err) => {
        console.warn('MySQL API update recipe fallback:', err);
        return of(updatedItem);
      })
    ).subscribe();

    return true;
  }

  deleteRecipe(id: string): boolean {
    const current = this.recipesSubject.value;
    const filtered = current.filter((r) => r.id !== id);
    if (filtered.length === current.length) return false;
    this.saveRecipes(filtered);

    // Persist to MySQL database via API
    this.http.delete(`${API_BASE}/recipes/${id}`).pipe(
      catchError((err) => {
        console.warn('MySQL API delete recipe fallback:', err);
        return of(null);
      })
    ).subscribe();

    return true;
  }

  private saveRecipes(recipes: Recipe[]): void {
    this.recipesSubject.next(recipes);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  private saveCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // ==========================================
  // TIPS CRUD (MySQL via API)
  // ==========================================
  getTips(): Tip[] {
    return this.tipsSubject.value;
  }

  addTip(tip: Omit<Tip, 'id'> & { id?: string }): Tip {
    const newTip: Tip = {
      ...tip,
      id: tip.id || 'tip_' + Date.now().toString(36)
    };
    const updated = [newTip, ...this.tipsSubject.value];
    this.saveTips(updated);

    // Persist to MySQL database via API
    this.http.post<Tip>(`${API_BASE}/tips`, newTip).pipe(
      catchError((err) => {
        console.warn('MySQL API add tip fallback:', err);
        return of(newTip);
      })
    ).subscribe((saved) => {
      if (saved && saved.id) {
        const list = this.tipsSubject.value.map(t => t.id === newTip.id ? saved : t);
        this.saveTips(list);
      }
    });

    return newTip;
  }

  updateTip(id: string, updates: Partial<Tip>): boolean {
    const current = this.tipsSubject.value;
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) return false;
    const updatedItem = { ...current[index], ...updates };
    const updatedList = [...current];
    updatedList[index] = updatedItem;
    this.saveTips(updatedList);

    // Persist to MySQL database via API
    this.http.put<Tip>(`${API_BASE}/tips/${id}`, updatedItem).pipe(
      catchError((err) => {
        console.warn('MySQL API update tip fallback:', err);
        return of(updatedItem);
      })
    ).subscribe();

    return true;
  }

  deleteTip(id: string): boolean {
    const current = this.tipsSubject.value;
    const filtered = current.filter((t) => t.id !== id);
    if (filtered.length === current.length) return false;
    this.saveTips(filtered);

    // Persist to MySQL database via API
    this.http.delete(`${API_BASE}/tips/${id}`).pipe(
      catchError((err) => {
        console.warn('MySQL API delete tip fallback:', err);
        return of(null);
      })
    ).subscribe();

    return true;
  }

  private saveTips(tips: Tip[]): void {
    this.tipsSubject.next(tips);
    localStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));
  }

  // ==========================================
  // USERS CRUD (MySQL via API)
  // ==========================================
  getUsers(): User[] {
    return this.usersSubject.value;
  }

  getUserById(id: string): User | undefined {
    return this.usersSubject.value.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const norm = email.trim().toLowerCase();
    return this.usersSubject.value.find((u) => u.email.toLowerCase() === norm);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'> & { id?: string }): User {
    const newUser: User = {
      ...user,
      id: user.id || 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString()
    };
    const current = [newUser, ...this.usersSubject.value];
    this.saveUsers(current);

    // Persist to MySQL database via API
    this.http.post<any>(`${API_BASE}/auth/register`, {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password || 'User@1234',
      avatar: newUser.avatar
    }).pipe(
      catchError((err) => {
        console.warn('MySQL API add user fallback:', err);
        return of(null);
      })
    ).subscribe();

    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const current = this.usersSubject.value;
    const idx = current.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    const updatedItem = { ...current[idx], ...updates };
    const updatedList = [...current];
    updatedList[idx] = updatedItem;
    this.saveUsers(updatedList);

    // Persist to MySQL database via API
    this.http.put<User>(`${API_BASE}/users/${id}`, updatedItem).pipe(
      catchError((err) => {
        console.warn('MySQL API update user fallback:', err);
        return of(updatedItem);
      })
    ).subscribe();

    return true;
  }

  deleteUser(id: string): boolean {
    const current = this.usersSubject.value;
    const filtered = current.filter((u) => u.id !== id);
    if (filtered.length === current.length) return false;
    this.saveUsers(filtered);

    // Persist to MySQL database via API
    this.http.delete(`${API_BASE}/users/${id}`).pipe(
      catchError((err) => {
        console.warn('MySQL API delete user fallback:', err);
        return of(null);
      })
    ).subscribe();

    return true;
  }

  private saveUsers(users: User[]): void {
    this.usersSubject.next(users);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // ==========================================
  // CONTACT MESSAGES / INQUIRIES (MySQL via API)
  // ==========================================
  getMessages(): ContactMessage[] {
    return this.messagesSubject.value;
  }

  addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      read: false
    };
    const updated = [newMsg, ...this.messagesSubject.value];
    this.saveMessages(updated);

    // Persist to MySQL database via API
    this.http.post<ContactMessage>(`${API_BASE}/messages`, newMsg).pipe(
      catchError((err) => {
        console.warn('MySQL API add message fallback:', err);
        return of(newMsg);
      })
    ).subscribe((saved) => {
      if (saved && saved.id) {
        const list = this.messagesSubject.value.map(m => m.id === newMsg.id ? saved : m);
        this.saveMessages(list);
      }
    });

    return newMsg;
  }

  markMessageRead(id: string, read = true): boolean {
    const current = this.messagesSubject.value;
    const idx = current.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    const updated = [...current];
    updated[idx] = { ...updated[idx], read };
    this.saveMessages(updated);

    // Persist to MySQL database via API
    this.http.put(`${API_BASE}/messages/${id}/read`, {}).pipe(
      catchError((err) => {
        console.warn('MySQL API mark read fallback:', err);
        return of(null);
      })
    ).subscribe();

    return true;
  }

  deleteMessage(id: string): boolean {
    const current = this.messagesSubject.value;
    const filtered = current.filter((m) => m.id !== id);
    if (filtered.length === current.length) return false;
    this.saveMessages(filtered);

    // Persist to MySQL database via API
    this.http.delete(`${API_BASE}/messages/${id}`).pipe(
      catchError((err) => {
        console.warn('MySQL API delete message fallback:', err);
        return of(null);
      })
    ).subscribe();

    return true;
  }

  private saveMessages(messages: ContactMessage[]): void {
    this.messagesSubject.next(messages);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  // ==========================================
  // DATABASE RESET
  // ==========================================
  resetDatabase(): void {
    this.http.post(`${API_BASE}/database/reset`, {}).pipe(
      catchError((err) => {
        console.warn('MySQL API reset fallback:', err);
        return of(null);
      })
    ).subscribe(() => {
      this.refreshAllFromApi();
    });
  }
}
