# Deployment, PWA, Testing, Performance, Legal

## Animation & effects

Global: sparkle layer, page transitions (View Transitions API), card flip, spell
glow, potion bubbles, desktop parallax, reduced-motion fallback.

- **PixiJS**: starfield, card particles, spell impact, potion smoke, album animation.
- **Phaser**: arena, maze, runner, drag & drop.
- **Three.js** (sparingly): desktop hero scene, 3D card inspect, wand customizer; toggleable.

Performance rules: start canvas only when component is visible; destroy on
`ngOnDestroy`; reduce FPS on hidden tab; offer mobile low-power mode; never force
heavy 3D on the home page.

## PWA & offline

Installable app; static asset cache; IndexedDB API cache; offline notice; offline
dex search when synced; settings to clear cache / refresh data. Store no sensitive data.

## Performance budget

- Mobile-first. Aim for app-shell initial JS under ~250 KB.
- Lazy-load game engines. **Three.js never in the initial bundle.**
- Phaser only on game routes; PixiJS only when an effect component is visible.
- Lazy-load images; paginate API lists; non-blocking IndexedDB sync; skeleton UI.

```ts
const Phaser = await import('phaser'); // not a top-level import in shared/home files
```

## Testing

- **Unit:** query builder, JSON:API mapper, combat score, seed random, image
  fallback, stores.
- **Component:** resource card, filter drawer, detail header, compare table, game HUD.
- **E2E (Playwright):** home loads; dex search works; character/spell detail opens;
  random battle starts; GitHub Pages base href works.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` — deploy on push to `develope`.

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [develope]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --watch=false --browsers=ChromeHeadless
      - run: npm run build -- --base-href "/wizarddex-arena/"
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist/wizarddex-arena/browser }
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notes: confirm the real Angular output path for `upload-pages-artifact`; set the
repo name in `--base-href`; enable "GitHub Actions" as the Pages source in repo settings.

## Git workflow

Branch: `develope`. After each completed feature:

```bash
npm run lint && npm run test && npm run build
git add . && git commit -m "<conventional commit message>" && git push origin develope
```

Large features may use a `feat/<name>` branch merged with `--no-ff`.

## Legal / fan project

- Visible footer disclaimer: fan-made, not affiliated.
- Respect PotterDB and the data source; credit PotterDB.
- No copyright-problematic assets added manually; only use API-provided image URLs.
- Generated SVG placeholders for missing images. No monetization. Wiki links as external sources.
