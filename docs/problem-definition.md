# CookSmart — Problem Definition

## Background
People frequently have ingredients at home but struggle to decide what to
cook with them. Searching generic recipe sites often surfaces dishes that
require ingredients the user doesn't have, wasting time and food.

## Problem Statement
There is no simple, single-screen tool that lets a home cook say "here's
what I have" (ingredients), "here's how much time/skill I have" (cooking
time, difficulty), and instantly receive relevant, explainable recipe
suggestions — while also letting them plan meals and save favourites
without creating an account or relying on a live backend/database.

## Target Users
- Home cooks deciding what to make for a meal today.
- Users planning a full week of meals in advance.
- Beginners who want difficulty-appropriate recipes and technique tips.

## Objectives
1. Let users discover recipes by category, ingredient, time and difficulty.
2. Provide a transparent, explainable AI-assisted ingredient-matching
   suggestion tool (not a black-box external service).
3. Let users save favourites and build a weekly meal plan, persisted
   locally without any server-side account system.
4. Deliver a fully responsive, animated, professionally designed SPA that
   meets every functional requirement in the SRS (13/13) and covers all
   10 required screens.

## Proposed Solution
CookSmart — a single-page Angular application backed by pre-populated,
read-only JSON data (recipes, categories, cooking tips), with an optional
read-only ASP.NET Core API layer for demonstration purposes. All
personalisation (favourites, meal planner, preferences) lives in the
browser's `localStorage`, so no database or write-backend is required —
matching the SRS's core constraint.

## Success Criteria
- All 13 functional requirements (SRS §1.7) implemented and demonstrable.
- All 10 required screens (SRS §1.4) fully built and navigable via
  client-side routing with no full-page reloads.
- Fully responsive across mobile, tablet and desktop breakpoints.
- AI Recipe Suggestion feature clearly documents its own input, logic and
  output, per the SRS's AI Usage Note.
