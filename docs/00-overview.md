# WizardDex Arena — Overview

> Source of truth derived from the original `plan.md`, refined after verifying the
> live PotterDB API (2026-06-21).

## Vision

A mobile-first website with browser-game elements built on the **PotterDB API**.
It combines an interactive "WizardDex" (a magical Pokédex for books, chapters,
characters, movies, potions and spells) with a set of mini-games (random battles,
spell duels, potion lab, tournaments, house cup, daily challenges).

- **Project name:** `wizarddex-arena`
- **Frontend-only**, statically deployable to **GitHub Pages**.
- **Auto-deploy** via GitHub Actions on push to branch `develope`.
- **Mobile-first**, with richer desktop layouts (split views, tables, canvas effects).

## Documentation map

| Doc | Content |
| --- | --- |
| [00-overview.md](00-overview.md) | This file. Vision, scope, build order. |
| [01-architecture.md](01-architecture.md) | Tech stack, folder structure, routes, state. |
| [02-design-system.md](02-design-system.md) | Design tokens, components, accessibility. |
| [03-api.md](03-api.md) | PotterDB API usage, query builder, models, mappers. |
| [04-features.md](04-features.md) | WizardDex feature specs (home, dex, compare, collections). |
| [05-games.md](05-games.md) | Browser-game concepts and score formulas. |
| [06-deployment-pwa-testing.md](06-deployment-pwa-testing.md) | PWA, testing, CI/CD, performance budget, legal. |
| [07-roadmap.md](07-roadmap.md) | Build order, Definition of Done, extra ideas. |

## Key corrections vs. the original plan

Verified against the live API docs — these override the original `plan.md`:

- Character family field is **`family_member`** (array), not `family_members`.
- Books use **`cover`** (string URL); there is no `image` field on books.
- Movies use **`poster`** + **`trailer`**; there is no `image` field on movies (map defensively).
- Potion fields `ingredients`, `side_effects`, `inventors`, `manufacturers`,
  `characteristics` are **strings**, not arrays — parse them when a list UI is needed.
- `page[size]` maximum is **100**.
- Resource totals: 7 books, ~5246 characters, 11 movies, 168 potions, 333 spells.

## Build order (high level)

1. Angular project init + tooling (ESLint, Prettier, strict TS).
2. Design tokens + base layout (mobile bottom nav, desktop sidebar).
3. PotterDB API client + query builder.
4. Domain models + mappers.
5. Home dashboard.
6. WizardDex global search.
7. Character / Spell / Potion dex.
8. Books & chapters, Movies.
9. Compare center, Collections / favorites.
10. IndexedDB cache + offline sync.
11. Games (random battle first).
12. PWA, tests, GitHub Pages CI, performance pass.

See [07-roadmap.md](07-roadmap.md) for the detailed ordered checklist.

## Core architectural rule

Build the clean data + UI foundation first, then the games. Games must **not**
contain their own API hacks — they reuse the same domain models, cache services,
score utilities and design tokens as the WizardDex.
