export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type CategoryId = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'desserts';

export interface Recipe {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  gallery?: string[];
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  popular?: boolean;
  featured?: boolean;
  relatedTipIds?: string[];
  createdAt?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface Tip {
  id: string;
  title: string;
  category: CategoryId | 'general';
  type: 'text' | 'video';
  image: string;
  videoUrl?: string;
  content: string;
  featured?: boolean;
}

export interface UserPreference {
  firstName: string;
  preferredCategory: CategoryId | '';
}

export type PlannerMeal = 'Breakfast' | 'Lunch' | 'Dinner';
export type PlannerDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type PlannerGrid = Record<PlannerDay, Record<PlannerMeal, string | null>>;

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'blocked';
  createdAt: string;
  preference?: UserPreference;
  mealPlan?: PlannerGrid;
  favouriteRecipeIds?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  rating: number;
  createdAt: string;
  read: boolean;
}
