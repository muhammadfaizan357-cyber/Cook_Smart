import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

export interface SuggestionResult {
  recipe: Recipe;
  matchPercent: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

/**
 * AI Recipe Suggestion — Transparency note (for documentation, per SRS 1.6 & Section 2):
 *
 *  INPUT   : a comma-separated list of ingredients the user currently has.
 *  PROCESS : a rule-based ingredient-matching algorithm implemented in plain
 *            TypeScript (no external AI API is called). Each recipe's ingredient
 *            list is normalised (lower-cased, singular-ish trimmed tokens) and
 *            compared against the user's normalised ingredients using token
 *            overlap. A match score = (matched ingredients / total recipe
 *            ingredients) * 100 is computed per recipe.
 *  OUTPUT  : recipes ranked by match score (highest first), each annotated with
 *            which ingredients matched and which are still missing, so the
 *            "suggestion" is fully explainable to the user.
 *
 *  This satisfies the "simple AI feature" requirement using transparent,
 *  deterministic logic instead of an opaque external service — exactly as
 *  the SRS allows when no external API is used.
 */
@Injectable({ providedIn: 'root' })
export class AiSuggestionService {
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\b(fresh|chopped|sliced|diced|large|small|medium|ground|whole)\b/g, '')
      .trim();
  }

  private tokenize(list: string): string[] {
    return list
      .split(',')
      .map((t) => this.normalize(t))
      .filter((t) => t.length > 0);
  }

  suggest(userIngredientsRaw: string, recipes: Recipe[], topN = 6): SuggestionResult[] {
    const userTokens = this.tokenize(userIngredientsRaw);
    if (userTokens.length === 0) return [];

    const results: SuggestionResult[] = recipes.map((recipe) => {
      const recipeTokens = recipe.ingredients.map((i) => this.normalize(i));
      const matched: string[] = [];
      const missing: string[] = [];

      recipeTokens.forEach((rIngredient, idx) => {
        const isMatch = userTokens.some(
          (u) => rIngredient.includes(u) || u.includes(rIngredient) || this.wordOverlap(rIngredient, u)
        );
        if (isMatch) matched.push(recipe.ingredients[idx]);
        else missing.push(recipe.ingredients[idx]);
      });

      const matchPercent = recipeTokens.length ? Math.round((matched.length / recipeTokens.length) * 100) : 0;
      return { recipe, matchPercent, matchedIngredients: matched, missingIngredients: missing };
    });

    return results
      .filter((r) => r.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, topN);
  }

  private wordOverlap(a: string, b: string): boolean {
    const aWords = a.split(' ').filter(Boolean);
    const bWords = b.split(' ').filter(Boolean);
    return aWords.some((w) => bWords.includes(w) && w.length > 2);
  }
}
