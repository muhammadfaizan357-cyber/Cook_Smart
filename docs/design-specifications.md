# CookSmart — Design Specifications

## Theme: "Royal Classic"
A premium, classic-meets-modern palette built around deep emerald green,
antique gold and warm ivory — evoking a refined cookbook rather than a
generic food-delivery app.

## 1. Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--cs-emerald-900` | `#0c2b23` | Primary dark surfaces, navbar, hero overlays |
| `--cs-emerald-700` | `#184f40` | Gradients, secondary dark surfaces |
| `--cs-gold-500` | `#d4a13c` | Primary accent, CTAs, dividers |
| `--cs-gold-400` | `#e6bf63` | Highlights, active states |
| `--cs-ivory-50` | `#fffdf7` | Page background |
| `--cs-ivory-100` | `#fbf6ea` | Section band background |
| `--cs-terracotta` | `#c1602f` | Favourite / warm accent |
| `--cs-ink` | `#1c1a17` | Body text |

Gradients: `--cs-gradient-royal` (emerald, used for hero/footer/CTA
bands), `--cs-gradient-gold` (primary buttons), `--cs-gradient-warm`
(secondary warm accents).

## 2. Typography
- **Display / Headings:** "Playfair Display" (serif) — classic, editorial,
  cookbook-like authority.
- **Body / UI:** "Inter" (sans-serif) — clean and highly legible at small
  sizes for cards, forms and navigation.
- Type scale: section titles `clamp(28px, 3.4vw, 42px)`, hero titles up to
  `56px`, body `16px`/`1.6` line-height for readability.

## 3. Component List
- Sticky/animated Navbar (scroll-aware background, active-link underline,
  mobile hamburger with slide-in panel)
- Hero Slider/Carousel (autoplay, dot + arrow navigation, ken-burns style
  fade/scale transition)
- Recipe Card (image zoom on hover, favourite heart toggle, difficulty
  badge, category tag, match-percentage ribbon for AI results)
- Category Card (full-bleed image, gradient overlay, hover lift)
- Tip Card (image/video thumbnail with play icon, category badge)
- Loading Skeleton (shimmer animation, used while JSON loads)
- Toast notification stack (slide-in, auto-dismiss, gold left border)
- Weekly Planner Grid (7×3 grid, modal recipe picker)
- Scroll-reveal directive (`IntersectionObserver`-based fade/slide/scale-in)
- Footer (four-column royal band with brand, nav, contact, social)

## 4. Animation & Interaction Principles
- Page sections fade + slide up on scroll (`.reveal` classes via
  `ScrollRevealDirective`), staggered per card using a small per-item delay.
- Route transitions use a soft fade/slide (`.route-fade` + Angular Router
  `withViewTransitions()`).
- Buttons: hover lift + shadow bloom; ripple effect on click.
- Cards: `translateY(-8px)` lift + shadow growth on hover; image
  `scale(1.08–1.1)` zoom inside a clipped container.
- Hero slider: cross-fade with a slow background `scale` (Ken Burns
  effect), auto-advances every ~5.5s, pauses/resets on manual navigation.
- Toasts confirm micro-interactions ("Added to Favourites", "Recipe added
  to planner", "Message sent").

## 5. Responsive Breakpoints
- Desktop: > 980px — full multi-column grids, side-by-side layouts.
- Tablet: 720–980px — 2-column grids, condensed nav.
- Mobile: < 720px — single column, hamburger nav, stacked forms, smaller
  hero height.

## 6. User Flow — Visual Diagrams

Rendered SVG flowcharts (open directly in any browser) are provided in
`docs/diagrams/`:

- `user-flow-browsing.svg` — Home → Browse/Search → Recipe Details →
  Favourites / Meal Planner
- `user-flow-ai-suggestion.svg` — Home → AI Suggestion → Enter Ingredients
  (input) → Matching engine (process) → Ranked results (output) → Recipe
  Details
- `architecture.svg` — Angular App → Components → Services → JSON Data /
  localStorage

Text-based reference (for quick reading without opening the SVGs):

```
                     ┌───────────────┐
                     │     Home      │
                     └───────┬───────┘
        ┌───────────┬────────┼────────┬─────────────┐
        ▼           ▼        ▼        ▼             ▼
  Preferences   Categories Recipes  AI Suggestion  Tips / About / Contact
        │           │        │        │
        │           └───► Recipes (filtered by category)
        │                    │
        │                    ▼
        │           Recipe Details
        │             ├─► Add to Favourites ─► Favourites page
        │             ├─► Add to Meal Planner ─► Meal Planner page
        │             └─► Related Recipes ─► Recipe Details (loop)
        ▼
   Personalised greeting shown on Home
```

## 7. Accessibility Notes
- All images include descriptive `alt` text.
- Forms use associated `<label>` elements and inline, specific error
  messages (not just red borders).
- Colour contrast between gold/emerald text and their backgrounds meets
  WCAG AA for body text sizes.
- All interactive elements (buttons, cards-as-links) are keyboard
  reachable via native `<a>`/`<button>` elements rather than click-only
  `<div>`s.
