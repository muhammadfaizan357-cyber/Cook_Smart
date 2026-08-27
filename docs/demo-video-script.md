# CookSmart — Demo Video Script & Shot List

> **Manual step required.** The SRS requires a **mandatory MP4 demonstration
> video**. This cannot be generated automatically in a code-only
> environment — screen recording requires a live browser session and a
> human narrator. Everything below is a ready-to-follow script so you can
> record it yourself in one take, roughly 4–6 minutes long.

## Before you record
- Run `npm start` in `frontend/` and open `http://localhost:4200`.
- Use a clean browser window (no bookmarks bar clutter), 1280×720 or larger.
- Clear `localStorage` first (DevTools → Application → Local Storage →
  clear) so Preferences/Favourites/Planner start empty and the demo shows
  the full save-and-restore behaviour.
- Use a screen recorder (OBS Studio, Windows Game Bar, macOS QuickTime, or
  any free screen recorder) and export as `.mp4`.

## Shot-by-shot sequence

| # | Screen / Action | What to say / show | Feature demonstrated |
|---|---|---|---|
| 1 | Home page, top of page | "This is CookSmart, a smart cooking and recipe discovery portal." Scroll slowly through hero, featured recipes, categories, popular recipes, cooking tips, AI CTA. | Home |
| 2 | Click "Set Preferences" | Fill in first name + pick a category, submit. Refresh the page (F5) afterward to show the greeting/preference persists. | User Preference Setup + localStorage persistence |
| 3 | Recipes page | Type a search term, then type ingredients (e.g. `chicken, rice`), then pick a category filter, a difficulty filter, drag the max-time slider, change the sort dropdown. Clear filters with Reset. | Recipe Library, Search/Filter/Sort, Ingredient Search |
| 4 | Type an ingredient combo with no matches (e.g. `zzzz`) | Show the "No recipes match your filters" empty state. | Zero-result handling |
| 5 | Click into a recipe card | Show ingredients, steps, cooking time, servings, cooking tips section, and the image gallery thumbnails if present. | Recipe Details |
| 6 | On Recipe Details | Click "Add to Favourites", then "Add to Meal Planner" and assign it to a day/meal. | Favourite Recipes, Meal Planner |
| 7 | Navigate to `/recipes/does-not-exist` manually in the URL bar | Show the "Recipe not found" screen with a working "Back to Recipes" button. | Invalid recipe route handling |
| 8 | Categories page | Click through 2–3 categories, show the recipe count and per-category showcase. | Categories |
| 9 | AI Recipe Suggestion page | Type `eggs, tomato, onion` (or click a quick-chip), submit, and narrate: "This uses a rule-based ingredient-matching algorithm written in plain TypeScript — not an external AI API — so every match percentage is fully explainable." Point out matched vs. missing ingredients on a result card. | AI Recipe Suggestion (with transparency explanation) |
| 10 | Favourites page | Show the recipe added earlier still there. Remove it, show the empty state. | Favourite Recipes (view/remove/persist) |
| 11 | Meal Planner page | Show the weekly grid, add another recipe to a different day, remove one, then click "Clear Planner". | Meal Planner (full CRUD) |
| 12 | Cooking Tips / Videos page | Filter by category, click the ▶ play button on a video tip card to show it actually plays inline. | Cooking Tips / Videos |
| 13 | About Us page | Scroll through purpose, mission/vision, timeline, team section. | About Us |
| 14 | Contact page | Submit the form with valid data, show the honest success message ("recorded for this demo — no message was actually sent"). Then submit with an empty field to show validation errors. | Contact / Feedback (with validation + honest messaging) |
| 15 | Resize the browser window down to mobile width (or open DevTools device toolbar) | Show the navbar collapsing to a hamburger menu, and 2–3 pages reflowing to a single column with no overflow. | Responsive design |
| 16 | Closing shot | Return to Home, brief closing line: "CookSmart — built for TechWiz 7, Web & App Development category." | Wrap-up |

## Recording tips
- Keep mouse movements slow and deliberate so viewers can follow along.
- Narrate what you're clicking before you click it.
- If a step doesn't fit your final build exactly, skip it rather than
  narrating something that isn't there — accuracy matters more than
  covering every row.
- Keep the final file under any file-size/duration limit specified by the
  competition's submission portal.
