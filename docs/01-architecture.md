# Architecture

## Tech stack

### Required

- **Angular** (latest) with **TypeScript strict mode**
- **Standalone components** (no NgModules)
- **Angular Router** with lazy routes
- **Signals** for local UI state
- **HttpClient** with functional interceptors
- **CSS Custom Properties** for design tokens
- **GitHub Actions** for CI/CD → **GitHub Pages**
- **IndexedDB** cache via **Dexie**
- **Playwright** for E2E smoke tests
- **ESLint + Prettier**

### Optional (lazy-loaded on demand only)

- **Phaser** — arena, maze, runner, drag & drop mini-games
- **PixiJS v8** — animated cards, spell particles, potion smoke, starfield
- **Three.js** — desktop hero scene, 3D card inspect, wand customizer (toggleable)
- **GSAP / Motion One** — UI micro-animations
- **Howler.js** — sound effects
- **D3 / vis-network** — relationship graphs
- **Fuse.js** — client-side fuzzy search over the offline cache
- **Zod / Valibot** — runtime validation of API responses

> Game engines and Three.js must **never** be in the initial bundle. Import them
> dynamically: `const Phaser = await import('phaser');`

## Folder structure

```txt
src/
  app/
    core/
      api/
        potter-db-client.ts
        json-api.types.ts
        query-builder.ts
        api-error.interceptor.ts
        cache.interceptor.ts
      models/
        book.model.ts
        chapter.model.ts
        character.model.ts
        movie.model.ts
        potion.model.ts
        spell.model.ts
      mappers/
        *.mapper.ts
      services/
        books.service.ts
        characters.service.ts
        movies.service.ts
        potions.service.ts
        spells.service.ts
      stores/
        app-settings.store.ts
        favorites.store.ts
        cache-progress.store.ts
      utils/
        seed-random.ts
        slug.ts
        combat-score.ts
        image-fallback.ts
    design-system/
      components/
      tokens/
      directives/
      pipes/
    features/
      home/
      wizarddex/
      characters/
      spells/
      potions/
      books/
      movies/
      timeline/
      compare/
      collections/
      games/
        game-shell/
        random-battle/
        spell-arena/
        potion-lab/
        triwizard-tournament/
        house-cup/
        daily-challenge/
      settings/
    game-engine/
      phaser/
      pixi/
      three/
      shared/
    data-cache/
      indexed-db.service.ts
      sync.service.ts
    app.routes.ts
    app.config.ts
  assets/
    icons/
    placeholders/
    sounds/
    textures/
```

## Routes

```ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.page') },
  { path: 'dex', loadChildren: () => import('./features/wizarddex/wizarddex.routes') },
  { path: 'characters', loadChildren: () => import('./features/characters/characters.routes') },
  { path: 'spells', loadChildren: () => import('./features/spells/spells.routes') },
  { path: 'potions', loadChildren: () => import('./features/potions/potions.routes') },
  { path: 'books', loadChildren: () => import('./features/books/books.routes') },
  { path: 'movies', loadChildren: () => import('./features/movies/movies.routes') },
  { path: 'timeline', loadComponent: () => import('./features/timeline/timeline.page') },
  { path: 'compare', loadComponent: () => import('./features/compare/compare.page') },
  { path: 'collections', loadComponent: () => import('./features/collections/collections.page') },
  { path: 'games', loadChildren: () => import('./features/games/games.routes') },
  { path: 'settings', loadComponent: () => import('./features/settings/settings.page') },
  { path: '**', redirectTo: '' },
];
```

## State strategy

- **Signals** for component/local UI state.
- **Signal-based stores** (`@Injectable({ providedIn: 'root' })` with signals) for
  app settings, favorites, and cache progress.
- **URL query params** as the source of truth for dex filters/sort/search so views
  are shareable and back/forward works.
- **IndexedDB (Dexie)** for the offline codex and large collections.
- **LocalStorage** only for small settings (theme, reduced motion, chosen house).

## Data flow

```txt
HttpClient → JSON:API response
  → JsonApiResource<TAttributes>   (json-api.types.ts)
  → PotterResource<TAttributes>    (normalized envelope)
  → Domain Model                   (mappers/*.mapper.ts)
  → Component (signals)            (never touches raw API objects)
```

Components must never consume raw API objects directly — always go through a mapper.
