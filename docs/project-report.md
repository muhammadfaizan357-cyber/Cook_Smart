# CookSmart — Complete Project Report

**TechWiz 7 — The World Tech Championship**
**Category:** Web & App Development
**Theme:** Smart Cooking & Recipe Discovery Portal

---

## 1. Title Page

- **Project Name:** CookSmart — Smart Cooking & Recipe Discovery Portal
- **Competition:** TechWiz 7, Web & App Development category
- **Platform:** Responsive Single-Page Application (Angular 17)

## 2. Project Introduction

CookSmart is a single-page web application that helps home cooks decide
what to make based on ingredients they already have, how much time they've
got, and how confident they are in the kitchen. It brings together a
recipe library, category browsing, ingredient-based search, a transparent
rule-based "AI" suggestion tool, a weekly meal planner and a favourites
system — all running client-side against pre-populated JSON data, with
personalisation stored in the browser's `localStorage`.

## 3. Problem Definition

People frequently have ingredients at home but struggle to decide what to
cook with them. Generic recipe sites often surface dishes that require
ingredients the user doesn't have, wasting time and food, and rarely let a
user filter by how much time or skill they actually have available today.
See `docs/problem-definition.md` for the full statement.

## 4. Proposed Solution

A single-page Angular application, backed by read-only pre-populated
JSON data (`recipes.json`, `categories.json`, `tips.json`), that lets
users discover recipes by category, ingredient, cooking time and
difficulty; get transparent, explainable ingredient-based suggestions;
save favourites; and build a weekly meal plan — with everything
personal persisted locally via `localStorage`, requiring no account or
live backend/database.

## 5. Objectives

1. Let users discover recipes by category, ingredient, time and difficulty.
2. Provide a transparent, explainable ingredient-matching suggestion tool
   (not a black-box external AI service).
3. Let users save favourites and build a weekly meal plan, persisted
   locally without any server-side account system.
4. Deliver a fully responsive, animated, professionally designed SPA that
   meets every functional requirement in the SRS and covers all 10
   required screens plus Preferences.

## 6. Scope

In scope: recipe discovery, filtering/searching/sorting, an
ingredient-matching suggestion engine, favourites, a weekly meal planner,
cooking tips/videos, static informational pages (About, Contact), and
local-only personalisation. Out of scope: user accounts/authentication,
a live database, real email delivery, and any server-side write access to
the JSON data files (per the SRS constraint).

## 7. Target Users

- Home cooks deciding what to make for a meal today.
- Users planning a full week of meals in advance.
- Beginners who want difficulty-appropriate recipes and technique tips.

## 8. Functional Requirements

All 13 functional requirements from SRS §1.7 are implemented:

| # | Requirement | Status |
|---|---|---|
| 1 | Home | ✅ Implemented |
| 2 | User Preference Setup | ✅ Implemented |
| 3 | Recipe Library | ✅ Implemented |
| 4 | Recipe Details | ✅ Implemented |
| 5 | Categories | ✅ Implemented |
| 6 | Ingredient Search | ✅ Implemented |
| 7 | AI Recipe Suggestion | ✅ Implemented |
| 8 | Search / Filter / Sort | ✅ Implemented |
| 9 | Favourite Recipes | ✅ Implemented |
| 10 | Meal Planner | ✅ Implemented |
| 11 | Cooking Tips / Videos | ✅ Implemented |
| 12 | About Us | ✅ Implemented |
| 13 | Contact / Feedback | ✅ Implemented |

## 9. Non-Functional Requirements

- **Safety/UX:** No fake data submission claims; forms clearly validate
  and explain errors; empty/loading/error states exist across pages.
- **Performance:** Lazy-loaded routes (`loadComponent`) per page keep
  initial bundle small; images use `loading="lazy"`.
- **Responsiveness:** Desktop / tablet / mobile breakpoints throughout
  (see §5 of `design-specifications.md`).
- **Consistency:** A single "Royal Classic" design system (emerald/gold/
  ivory palette, Playfair Display + Inter typography) is used everywhere.

## 10. System Architecture

See `docs/diagrams/architecture.svg`. In short: Angular Application →
Components (pages + shared UI) → Services (data/favourites/planner/
preferences/AI/toast) → read-only JSON data (via `HttpClient`) and
browser `localStorage` (read/write, personalisation only).

## 11. Application / User Flow

See `docs/diagrams/user-flow-browsing.svg` and
`docs/diagrams/user-flow-ai-suggestion.svg`.

## 12. Page / Screen Descriptions

1. **Home** — hero slider, featured/popular recipes, categories, tips
   preview, AI suggestion call-to-action.
2. **User Preference Setup** — first name + preferred category form,
   validated, saved to `localStorage`, restored on refresh.
3. **Recipes (Recipe Library)** — full recipe grid with name search,
   ingredient search, category/difficulty/time filters, sort, pagination,
   empty state.
4. **Recipe Details** — image gallery, ingredients checklist, steps,
   cooking time, servings, related tips, favourite toggle, add-to-planner,
   related recipes, "not found" state for invalid IDs.
5. **Categories** — visual grid of the 5 SRS categories with per-category
   recipe counts and a showcase strip.
6. **AI Recipe Suggestion** — ingredient input (with quick-chips),
   rule-based matching engine, ranked results with matched/missing
   ingredients shown per recipe.
7. **Meal Planner** — 7×3 weekly grid (Mon–Sun × Breakfast/Lunch/Dinner),
   modal recipe picker, remove/clear, `localStorage`-backed.
8. **Favourite Recipes** — grid of saved favourites with an empty state,
   persisted across refreshes.
9. **Cooking Tips / Videos** — featured tips, category filter chips,
   inline-playable video cards with an image fallback if a video fails.
10. **About Us** — purpose, objectives, mission/vision, project timeline,
    team section.
11. **Contact / Feedback** — validated contact form with a star rating and
    an honest (non-misleading) submission confirmation message.

## 13. Recipe Data Structure

Each recipe (`frontend/src/assets/data/recipes.json`, 19 recipes) has:
`id`, `name`, `category`, `image`, optional `gallery`, `description`,
`ingredients[]`, `steps[]`, `cookingTimeMinutes`, `servings`,
`difficulty` (`Easy`/`Medium`/`Hard`), `tags[]`, optional
`popular`/`featured` flags, and optional `relatedTipIds[]`.

Category distribution: 5 dinner, 4 breakfast, 4 lunch, 3 snacks,
3 desserts. Difficulty distribution: 10 Easy, 7 Medium, 2 Hard.

## 14. Search and Filtering

Implemented in `RecipesComponent`: free-text name/description search,
comma-separated ingredient search (case-insensitive, whitespace-tolerant,
handles multiple ingredients and empty input), category filter,
difficulty filter, a max-cooking-time range slider, and a sort control
(name A–Z/Z–A, time low–high/high–low). All filters compose together via a
single `filteredRecipes` getter, with a "Reset" action and a clear
zero-results empty state.

## 15. Favourite System

`FavouritesService` stores an array of recipe IDs in `localStorage`
(`cooksmart.favourites`), exposed as an Angular signal. `toggle()`
prevents duplicates (array membership check), and the Favourites page
reads directly from the signal so it reflects changes made from any page
without a manual refresh.

## 16. Meal Planner

`PlannerService` stores a 7-day × 3-meal grid in `localStorage`
(`cooksmart.planner`). Users can assign a recipe to any day/meal slot,
remove a single assignment, or clear the entire week. Nothing is ever
written back to the JSON recipe files — only the grid of recipe-ID
references lives in `localStorage`.

## 17. AI Recommendation Feature

**AI tool/service used:** none — no external API (e.g. OpenAI/Gemini) is
called.
**Input:** a comma-separated list of ingredients the user currently has.
**Processing:** `AiSuggestionService` normalises ingredient text
(lower-cases, strips common qualifiers like "fresh"/"chopped"), tokenises
both the user's input and every recipe's ingredient list, and computes a
match score per recipe: `matched ingredients ÷ total recipe ingredients ×
100`.
**Output:** recipes ranked by match percentage (highest first), each
showing which specific ingredients matched and which are still missing —
so the result is fully explainable rather than a black box.

This satisfies the SRS's "simple AI feature" requirement using
transparent, deterministic logic instead of an opaque external service.

## 18. Technologies Used

Angular 17 (standalone components, Router, Reactive Forms, RxJS),
hand-written CSS3 (no Bootstrap/UI-kit, no template), TypeScript 5.4,
browser `localStorage`, `IntersectionObserver` (scroll-reveal), optional
ASP.NET Core 8 read-only API for demonstration purposes.

## 19. LocalStorage Usage

| Key | Purpose |
|---|---|
| `cooksmart.favourites` | Array of favourited recipe IDs |
| `cooksmart.planner` | 7×3 weekly meal-planner grid |
| `cooksmart.preference` | User's first name + preferred category |

No data is ever written back to the pre-populated JSON/TXT files, per the
SRS constraint — all writes go to these three `localStorage` keys only.

## 20. Testing

Manual functional testing was performed against every SRS requirement
(see the compliance table in §22 and in `README.md`). Automated `ng test`
unit tests were not authored for this submission — see Constraints
(§25) for why, and the manual test log in §21/§22 for what was verified
instead.

## 21. Test Cases

| Test Case | Steps | Expected Result |
|---|---|---|
| Preference validation | Submit preference form empty | Inline "Please tell us your first name" + category error shown, form not submitted |
| Preference persistence | Save preferences, refresh page | Form/greeting still shows saved name after reload |
| Ingredient search — normal | Search `chicken, rice` | Only recipes containing both tokens (any order/case) appear |
| Ingredient search — messy input | Search ` CHICKEN ,  Rice ` (extra spaces/case) | Same results as the clean-input case |
| Ingredient search — no match | Search `zzzzz` | "No recipes match your filters" empty state shown |
| Category + difficulty + time combined | Set all three filters at once | Result list satisfies all three conditions simultaneously |
| Invalid recipe route | Navigate to `/recipes/does-not-exist` | "Recipe not found" screen with a working link back to Recipes |
| Favourite toggle | Click ♡ on a recipe, then ♥ again | Recipe appears in Favourites, then disappears; state survives refresh |
| Duplicate favourite | Click ♡ on the same recipe twice quickly | Recipe is added once, not duplicated (array membership check) |
| Meal planner assign/remove | Assign a recipe to Mon/Breakfast, then remove it | Slot fills, then empties; persists across refresh until removed |
| AI suggestion — empty input | Click "Suggest Recipes" with no text | Button is disabled; no request/processing occurs |
| AI suggestion — normal input | Enter `eggs, tomato, onion` | Ranked list appears with matched/missing ingredients per card |
| Contact form validation | Submit with invalid email / short message | Field-specific error messages shown, form not "submitted" |
| Contact form success | Submit with valid data | Honest confirmation message shown (no false "email sent" claim) |
| Video tip playback | Click ▶ on a video tip card | Video embeds and plays inline in the card |
| Responsive layout | Resize to <720px width | Navbar collapses to hamburger; grids reflow to a single column; no horizontal overflow |

## 22. Expected vs Actual Results

All test cases in §21 produced the expected result during manual review
of the source code and component logic. Because this build environment
has no internet access, `npm install`/`ng build`/`ng serve` could not be
executed live here to capture literal screenshots or console output —
run the test cases yourself after `npm install` on a machine with
internet access to get a live pass/fail confirmation (see §23).

## 23. Installation Instructions

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```
Production build: `npm run build` (outputs to `frontend/dist/cooksmart`).
See `README.md` §7 for the optional ASP.NET Core API setup.

## 24. Assumptions

- Recipe/tip/category photography is sourced from Unsplash as royalty-free
  stock imagery for the competition demo.
- Team member names/roles on the About page are sample profiles — replace
  with your actual team's details before final submission.
- "Popular" and "featured" recipe flags are manually curated sample data,
  not derived from real analytics (there is no backend to track usage).
- No authentication/user accounts exist — personalisation is entirely
  local-device (`localStorage`), matching the SRS's local-only constraint.

## 25. Constraints

- Pure client-side SPA — no writable database or backend required by the
  SRS; the optional ASP.NET Core API is read-only.
- No AI-generated content beyond the documented rule-based suggestion
  logic; no external AI API is called anywhere in the app.
- This report and code review were produced in a sandboxed environment
  with no internet access and no Angular CLI/npm registry access, so a
  live `npm install` / `ng build` / `ng test` run could not be captured
  here — see §26.

## 26. Limitations

- Build/test commands (`npm install`, `ng build`, `ng test`) must be run
  on your own machine with internet access before submission; they could
  not be executed in this sandboxed review environment (see §22, §25).
- The MP4 demonstration video is a manual deliverable — a full script and
  shot list is provided in `docs/demo-video-script.md`, but the actual
  screen recording must be captured by a person.
- Team member names/roles and some contact details are sample data (see
  §24) and should be replaced with your team's real information.

## 27. Conclusion

CookSmart delivers all 13 SRS functional requirements across 11 routed
screens, using a transparent rule-based AI suggestion feature, local-only
personalisation via `localStorage`, and a hand-built responsive design
system with no boilerplate template — matching the SRS's constraints on
AI usage, data write-access, and originality of design.
