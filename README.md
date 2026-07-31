# 🧙 WizardDex Arena

A mobile-first **Harry Potter WizardDex** and browser game built on the [PotterDB API](https://docs.potterdb.com/).
Browse characters, spells, potions, books and movies — then step into the **Arena** for stat-driven mini-games.

> **Live demo:** https://c0dewiz4rd010.github.io/wizarddex-arena/

> ⚠️ Unofficial fan project. Not affiliated with or endorsed by Warner Bros. or J.K. Rowling.
> All data is provided by the community-run PotterDB API.

---

## ✨ Features

- **WizardDex** — unified search across every resource type with debounced queries and skeleton loaders.
- **Command palette** — press <kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>K</kbd> anywhere to jump to a section or
  live-search characters, spells and potions with full keyboard navigation.
- **Dexes** — rich list + detail pages for Characters, Spells, Potions, Books (with chapters) and Movies,
  with sort selectors, result counts (“24 of 5,246”), an inline search spinner and clear-filter actions.
- **Deep API filters** — filter characters by house, blood status and living/deceased; spells by category;
  potions by difficulty. Detail pages surface previously hidden data: physical traits, cross-linked
  family/romances, full movie crew credits, potion inventors and more.
- **Themes** — dark, light (parchment) and system themes, colour-blind-friendly house emblems, page
  transitions, and reduced-motion / low-power modes.
- **Compare** — stack two wizards side by side and let their derived stats decide the winner.
- **Collections** — star any resource; filter by type with per-type counts; export/import as JSON.
- **Wizarding ID Card** — craft a personalised, shareable ID card and download it as a PNG.
- **Arena games**
  - ⚡ **Wizard Duel** — turn-based battle engine with animated HP bars and a live spell log.
  - ✨ **Daily Challenge** — a deterministic daily mystery wizard; guess from progressive clues and build a streak.
  - 📜 **Spell Trivia** — match each incantation to its effect and beat your best score.
  - ⚗️ **Potion Lab** — pick only the ingredients that belong in a brew before the cauldron boils over.
- **Sharing & feedback** — Web Share / copy-link buttons on every detail page and toast notifications.
- **Offline-first PWA** — installable, with an IndexedDB response cache (Dexie) plus a service worker that
  caches the API and images. An offline banner appears when the network drops, and an update toast when a
  new version rolls out.
- **Accessibility & performance** — house theming, reduced-motion support, low-power mode, 44px touch targets.

## 🏗️ Tech stack

- **Angular 22** — standalone components, signals, **zoneless** change detection, lazy-loaded routes.
- **TypeScript** (strict) · **RxJS** · **Dexie** (IndexedDB) · **Angular Service Worker**.
- **Vitest** for unit tests · **ESLint + Prettier** for quality.

## 📂 Project structure

```
src/app/
  core/           API client, models, mappers, services, stores, cache, utils, config
  design-system/  Shared presentational components (cards, states, headers…)
  features/       Lazy feature areas (home, wizarddex, dexes, compare, collections, games, settings)
docs/             Architecture, design system, API notes, roadmap (split from the original plan)
```

See [docs/](docs/) for architecture, design system, API and roadmap details.
The full improvement roadmap for the latest overhaul lives in
[docs/08-improvement-plan.md](docs/08-improvement-plan.md).

## 🚀 Getting started

```bash
npm install
npm start            # dev server at http://localhost:4200
```

## 🧪 Quality scripts

```bash
npm run build        # production build (PWA + service worker)
npm run test:ci      # run unit tests once (Vitest)
npm run lint         # ESLint
npm run format       # Prettier --write
```

## 🌐 Deployment

Pushing to the `develope` branch triggers the
[GitHub Pages workflow](.github/workflows/deploy-pages.yml), which lints, tests, builds the production
PWA (with `--base-href "/wizarddex-arena/"`) and publishes it to GitHub Pages.

## 📜 License & attribution

Built for educational/fan purposes. Data © their respective owners, served via the PotterDB API.
