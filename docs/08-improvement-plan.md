# 08 — Improvement Plan (Rundum-Überarbeitung)

Ziel: WizardDex Arena intuitiver, schöner, handlicher und verständlicher machen, mehr aus der
PotterDB-API holen, neue Features & Spiele hinzufügen, Light-Mode ergänzen und PWA/Tests härten.
Nach **jedem Schritt** wird auf `develope` gepusht (Conventional Commit); die CI
(`.github/workflows/deploy-pages.yml`) deployed automatisch auf GitHub Pages.

Live: <https://c0dewiz4rd010.github.io/wizarddex-arena/>

## Leitplanken
- Angular 22, zoneless, standalone, signals. Tests: vitest. Selector-Prefix `wda`.
- Build `npm run build`, Lint `npm run lint`, Test `npm run test:ci`.
- Output `dist/wizarddex-arena/browser`, base-href `/wizarddex-arena/`.
- Filter-Prädikate: books/movies `title_cont`; characters/spells/potions `name_cont`; `house_eq`; `effect_present`.
- Neue Libs erlaubt, wo klarer Mehrwert (Icons: lucide-angular; Graph: vis-network; PNG-Export: html-to-image), lazy geladen.

## Phase 0 — Fundament: gemeinsame UI-Primitive & Infrastruktur
- Icon-System (lucide-angular) statt Emojis; `icon.component`.
- Toast-Service + `toast-host` in App-Shell.
- Theme-Infrastruktur: `theme: 'system' | 'dark' | 'light'` in `app-settings.store`; `data-theme` auf `<html>`; System-Preference via `matchMedia`.
- Shared Controls im Design-System: `sort-select`, `filter-chips`, `view-toggle`, `result-count`, `search-field` (Spinner + Clear), `entity-chip`, `share-button`.
- Animations-Utilities + View-Transitions für Routerübergänge.

## Phase 1 — Theming & Design-Politur
- Light-Mode Token-Set + System-Preference + Toggle in Settings.
- Kontrast-Audit (WCAG AA), colorblind-freundliche Zusatz-Cues.
- Emojis → Icons (empty-state, error-state, nav, games, home).
- Tablet-Breakpoint 768px reparieren.
- `reducedMotion`/`lowPower` an CSS koppeln.
- Detailseiten-Layouts aufwerten; Debug-Drawer nur in Dev.
- Router-Seitenübergänge (View Transitions API).

## Phase 2 — Listen- & Such-UX-Überholung
- Ergebniszähler ("24 von 5.246") aus `meta.pagination.records`.
- Sort-Selektoren pro Ressource.
- Erweiterte Filter: Characters (`blood_status_eq`, `species_eq`, `died_null`), Spells (`category_eq`, `light_eq`), Potions (`difficulty_eq`), Movies (`rating`).
- View-Toggle grid/list; Debounce 350→220ms; Such-Spinner; „Filter löschen".
- Command Palette (Cmd/Ctrl+K); Suchbegriff-Highlight; transparenter „All"-Tab.

## Phase 3 — Mehr aus der API holen
- Character-Detail: physische Merkmale, `romances`/`family_member` als verlinkte Chips, Aliase, Stats-Erklärung, Vergleichen-Button.
- Movie-Detail: Crew-Sektion + Box-Office/Budget.
- Potion-Detail: Erfinder/Hersteller/Eigenschaften + Zutaten-Chips.
- Book-Detail: Widmung als Easter-Egg; teilbare Chapter-Route.
- Spell-Detail: `light`/`hand` Badges + verwandte Zauber.
- Interaktiver Beziehungsgraph (vis-network, lazy).

## Phase 4 — Neue Nutzer-Features
- Benannte Sammlungen ("Kampfteam", "Zauberdeck", "Leseliste") + Export/Import.
- Achievements/Badges (IndexedDB).
- Lokale Leaderboards pro Spiel.
- Zaubererausweis-Generator (HTML→PNG + Web Share).

## Phase 5 — Neue Spiele
- Potion Lab (`/games/potion-lab`).
- Spell Arena (`/games/spell-arena`).
- House Cup (Progression).
- Games-Hub aktualisieren.

## Phase 6 — PWA/Offline, Performance, Tests
- Service Worker verifizieren + Update-Toast.
- Cache-TTL/Prefetch/„zuletzt aktualisiert".
- Optionale Offline-Suche (Fuse.js).
- Unit-Tests erweitern + Playwright-E2E-Smoke.
- Lighthouse-/Bundle-/A11y-Pass.

## Phase 7 — Abschluss
- README/docs aktualisieren.
- Finaler Build+Lint+Test grün; Deploy & Live-URL verifizieren.

## Git-Workflow pro Schritt
Build/Lint(/Test) grün → `git commit` (feat/fix/style/refactor/test/docs/chore) → `git push origin develope` → CI deployed.
