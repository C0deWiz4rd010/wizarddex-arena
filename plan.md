# Masterplan für „WizardDex Arena“ – PotterDB Website & Browsergame

## 0. Zielbild

Baue eine Mobile-first Website mit Browsergame-Elementen auf Basis der PotterDB API. Die App soll alles nutzen, was die API liefert: Bücher, Kapitel, Charaktere, Filme, Tränke und Zauber. Das Projekt soll sich anfühlen wie ein interaktiver magischer Pokédex plus Mini-Game-Plattform.

Arbeitstitel: `wizarddex-arena`

Kernidee:

* Ein extrem interaktiver „WizardDex“ mit Suche, Filtern, Sortierung, Vergleichsansichten, Detailkarten, Animationen, Sammlungen und Statistiken.
* Ein Browsergame-Bereich mit Random Battles, Zauber-Duellen, Trank-Labor, Turnieren, House Cup, Daily Challenges und Mini-Games.
* Mobile-first, aber auf Desktop mit erweiterten Layouts, Split-Views, Tabellen, 3D/Canvas-Effekten und Keyboard-Steuerung.
* Frontend-only, statisch deploybar auf GitHub Pages.
* Automatisches Deployment über GitHub Actions bei jedem Push auf Branch `develope`.
* Nach jedem abgeschlossenen Feature: committen und auf `develope` pushen.

---

## 1. Online-Recherche / Skills, die GitHub Copilot vorher suchen soll

Copilot soll vor Implementierung gezielt online die aktuellen offiziellen Dokumentationen prüfen. Nicht blind nach alten Blogposts arbeiten.

### API & Daten

* PotterDB REST API Docs
* PotterDB OpenAPI JSON
* PotterDB JSON:API Response-Format
* PotterDB Pagination mit `page[size]` und `page[number]`
* PotterDB Filter mit `filter[field_predicate]`
* PotterDB Sortierung mit `sort=field` und `sort=-field`
* PotterDB Single Resource per UUID, Slug und optional `random`
* Ransack Search Matchers / Query Predicates
* JSON:API TypeScript Mapping Patterns

### Angular / Frontend

* Aktuelle Angular Version, Standalone Components, Signals
* Angular Router Lazy Loading
* Angular HttpClient, Functional Interceptors
* Angular `httpResource` oder alternative signalbasierte API-Layer
* Angular PWA / Service Worker / Offline Cache
* Angular Build für GitHub Pages
* Angular mit Canvas-Libraries sauber kapseln
* Angular accessibility, keyboard navigation, reduced motion

### Styling / UI

* CSS Custom Properties Design Tokens
* Fluid Typography mit `clamp()`
* Container Queries
* Mobile-first responsive layouts
* CSS View Transitions API
* Dark Fantasy UI Inspiration
* Accessible color contrast
* Reduced motion media query
* Glassmorphism sparsam und performant

### Animation / Games

* Phaser aktuelle Docs, besonders Scenes, Arcade Physics, Input, Mobile Touch Controls
* PixiJS v8 Docs, Sprites, Containers, Filters, Ticker, Asset Loading
* Offizielle PixiJS AI Skills / Agent Skills, falls verfügbar
* Three.js aktuelle Docs, Scene, Camera, Lights, Materials, OrbitControls, Performance
* GSAP oder Motion One für UI-Microanimations
* Rive oder Lottie für kleine UI-Animationen
* Web Audio API oder Howler.js für Soundeffekte
* Canvas Performance auf Mobile

### Datenpersistenz & Testing

* IndexedDB mit Dexie
* LocalStorage nur für kleine Settings
* Playwright E2E
* Angular Component Tests
* API Mocking mit MSW
* Lighthouse Performance Budget
* GitHub Actions mit Pages Deployment
* Git Commit Conventions / Conventional Commits

---

## 2. Technischer Stack

### Muss

* Angular mit TypeScript strict mode
* Standalone Components
* Angular Router mit Lazy Routes
* Signals für lokalen UI-State
* HttpClient für API Requests
* CSS Custom Properties für Design Tokens
* GitHub Actions für CI/CD
* GitHub Pages Deployment
* IndexedDB Cache über Dexie
* Playwright für E2E Smoke Tests
* ESLint + Prettier

### Optional nach Bedarf

* Phaser: für Arena, Runner, kleine Game Scenes
* PixiJS: für animierte Karten, Zaubereffekte, Partikel, Sternenhimmel, Sammelalbum
* Three.js: für 3D-Zauberstab, 3D-Karten, magische Räume, Desktop Hero Scene
* GSAP oder Motion One: UI-Animationen
* Howler.js: Soundeffekte
* D3 oder vis-network: Beziehungsgraphen, z. B. Familien, Häuser, Jobs, Romanzen
* Fuse.js: clientseitige fuzzy search im Cache
* Zod oder Valibot: Runtime Validation der API Responses

---

## 3. PotterDB API-Nutzung

### Base URL

```ts
const POTTER_DB_BASE_URL = 'https://api.potterdb.com/v1';
```

### Ressourcen

Implementiere einen generischen JSON:API Client und darauf spezialisierte Services.

Ressourcen:

* Books
* Chapters
* Characters
* Movies
* Potions
* Spells

### Endpunkte

```txt
GET /v1/books
GET /v1/books/{id}
GET /v1/books/{book_id}/chapters
GET /v1/books/{book_id}/chapters/{id}

GET /v1/characters
GET /v1/characters/{id}

GET /v1/movies
GET /v1/movies/{id}

GET /v1/potions
GET /v1/potions/{id}

GET /v1/spells
GET /v1/spells/{id}
```

### Query Builder

Baue einen zentralen Query Builder:

```ts
type SortDirection = 'asc' | 'desc';

interface PotterQuery {
  page?: number;
  size?: number;
  sort?: string;
  direction?: SortDirection;
  filters?: Record<string, string | number | boolean | null>;
}
```

Beispiele:

```txt
/v1/characters?page[size]=25&page[number]=2
/v1/characters?filter[name_cont]=Weasley
/v1/characters?filter[house_eq]=Gryffindor
/v1/spells?filter[category_cont]=Charm
/v1/potions?filter[difficulty_present]=true
/v1/books?sort=release_date
/v1/movies?sort=-release_date
```

### Daten-Mapping

Nie direkt API-Objekte in Components benutzen. Immer mappen:

```txt
JsonApiResource<TAttributes>
    -> PotterResource<TAttributes>
    -> Domain Model
```

Beispiel:

```ts
interface Character {
  id: string;
  slug: string;
  name: string;
  house?: string | null;
  species?: string | null;
  bloodStatus?: string | null;
  patronus?: string | null;
  wand?: string[];
  jobs?: string[];
  titles?: string[];
  familyMembers?: string[];
  romances?: string[];
  image?: string | null;
  wiki?: string | null;
  raw: CharacterAttributes;
}
```

### Null-Handling

Viele API-Felder können leer sein. Jede UI-Komponente muss robuste Fallbacks haben:

* `Unknown`
* `Not documented`
* generiertes Placeholder-Bild
* generiertes Symbol anhand von Typ, Haus, Kategorie oder Lichtfarbe
* Skeleton Loader statt Layout Shift

---

## 4. Datenstrategie

### Initial Load

Auf der Startseite nur laden:

* Hero Stats
* Featured Random Character
* Featured Random Spell
* Featured Random Potion
* Quick links

Keine 5.000+ Charaktere sofort laden.

### WizardDex-Modus

Bei Listenansichten serverseitig paginieren:

* default `page[size]=24` mobile
* desktop optional `page[size]=48`
* infinite scroll oder „Load more“
* Filter und Sortierung über URL Query Params synchronisieren

### Cache-Modus

Baue einen „Offline Codex“:

* User kann „Dex synchronisieren“ drücken.
* Dann werden alle Seiten pro Ressource in IndexedDB gecacht.
* Fortschrittsanzeige: Characters 1/53 pages usw.
* Danach fuzzy search lokal möglich.
* Cache-Version speichern.
* Button: „Refresh API Cache“.

### Daily Seed

Für Daily Challenges keinen Backend-Server benutzen. Nutze deterministischen Seed:

```txt
YYYY-MM-DD + challenge-type
```

Damit alle User am selben Tag dieselbe Challenge bekommen.

---

## 5. Designsystem

Vor dem ersten Feature muss ein Designsystem definiert werden. Keine Feature-Implementierung ohne Tokens.

### Designrichtung

Name: „Arcane Library“

Stimmung:

* dunkle magische Bibliothek
* Pergamentkarten
* goldene Akzente
* leuchtende Zaubereffekte
* Hausfarben als sekundäre Akzente
* mobile klar, desktop immersiv

### Fonts

Nutze websafe Fallbacks und optional Google Fonts:

```css
--font-display: 'Cinzel', 'Georgia', serif;
--font-body: 'Inter', 'Atkinson Hyperlegible', system-ui, sans-serif;
--font-mono: 'Fira Code', 'SFMono-Regular', monospace;
```

Regeln:

* Display Font nur für Headlines, Logos, Kapitelüberschriften
* Body Font für Lesbarkeit
* Mono Font für API Debug Drawer und Filterchips

### Farben

```css
:root {
  --color-bg: #07050f;
  --color-bg-elevated: #11101c;
  --color-surface: #181427;
  --color-surface-2: #211b34;

  --color-parchment: #f3e3bd;
  --color-parchment-dark: #c7a96a;

  --color-text: #f8f2df;
  --color-text-muted: #b8adc9;
  --color-text-soft: #857a98;

  --color-gold: #d9a441;
  --color-gold-light: #f6d782;
  --color-magic-blue: #66d9ff;
  --color-magic-purple: #a878ff;
  --color-danger: #ff5f6d;
  --color-success: #5dffb1;
  --color-warning: #ffd166;

  --house-gryffindor: #7f0909;
  --house-gryffindor-accent: #ffc500;
  --house-slytherin: #0d6217;
  --house-slytherin-accent: #aaaaaa;
  --house-ravenclaw: #000a90;
  --house-ravenclaw-accent: #946b2d;
  --house-hufflepuff: #ecb939;
  --house-hufflepuff-accent: #372e29;

  --border-soft: rgba(255, 255, 255, 0.12);
  --shadow-card: 0 18px 48px rgba(0, 0, 0, 0.42);
  --shadow-glow: 0 0 28px rgba(168, 120, 255, 0.32);
}
```

### Spacing

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-7: 3rem;
--space-8: 4rem;
```

### Radius

```css
--radius-sm: 0.5rem;
--radius-md: 0.875rem;
--radius-lg: 1.25rem;
--radius-xl: 1.75rem;
--radius-full: 999px;
```

### Motion Tokens

```css
--motion-fast: 120ms;
--motion-base: 220ms;
--motion-slow: 420ms;
--ease-magic: cubic-bezier(.2,.8,.2,1);
--ease-bounce-soft: cubic-bezier(.34,1.56,.64,1);
```

### Komponenten im Designsystem

Vor Feature-Bau erstellen:

* `AppShell`
* `BottomNav`
* `DesktopSidebar`
* `TopCommandBar`
* `MagicButton`
* `MagicCard`
* `ResourceCard`
* `ResourceAvatar`
* `FilterChip`
* `SearchInput`
* `StatPill`
* `HouseBadge`
* `SpellBadge`
* `PotionDifficultyBadge`
* `SkeletonCard`
* `EmptyState`
* `ErrorState`
* `MagicModal`
* `SwipeTabs`
* `SegmentedControl`
* `FloatingActionButton`
* `Toast`
* `ProgressRing`
* `SparkleLayer`

### Accessibility

* Alle interaktiven Elemente per Keyboard bedienbar
* Sichtbarer Focus Ring
* `prefers-reduced-motion` respektieren
* Canvas-Games mit alternativen Buttons / Text-Status
* Farben nicht allein als Information verwenden
* Mindest-Touch-Ziele: 44x44 px

---

## 6. App-Struktur

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

---

## 7. Routen

```ts
export const routes = [
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

---

## 8. Hauptfeatures

## Feature 1: Home / Magical Dashboard

Inhalte:

* Hero mit animiertem Sternenhimmel
* Schnellzugriff auf alle Ressourcen
* Random Character
* Random Spell
* Random Potion
* Daily Challenge Card
* „Continue where you left off“
* API Status / Cache Status
* House Cup Score lokal

Mobile:

* vertikale Karten
* Bottom Nav

Desktop:

* Hero links, Featured Cards rechts
* animierte 3D- oder Pixi-Hintergrundszene optional

Commit:

```bash
git add .
git commit -m "feat(home): build magical dashboard with featured resources"
git push origin develope
```

---

## Feature 2: WizardDex Global Search

Ziel:

Eine globale Suchoberfläche wie ein Pokédex.

Funktionen:

* Tabs: All, Characters, Spells, Potions, Books, Movies
* Suchfeld
* Filter Drawer mobile
* Filter Sidebar desktop
* Sortiermenü
* URL Sync
* Resource Cards mit Typ-Icon
* Fuzzy Search im Offline-Modus
* API Search im Online-Modus
* Loading Skeletons
* Empty States

Filterideen:

* Characters: house, species, blood_status, gender, patronus present, animagus present
* Spells: category, light, creator present
* Potions: difficulty, effect, ingredients present
* Books: release_date, pages
* Movies: rating, release_date, running_time

Commit:

```bash
git add .
git commit -m "feat(dex): add global searchable wizarddex"
git push origin develope
```

---

## Feature 3: Character Dex

Nutze möglichst alle Character-Felder.

Listenkarte:

* Bild oder generiertes Avatar-Siegel
* Name
* Haus
* Species
* Blood Status
* Patronus
* kleine Icons für Wand, Jobs, Family, Romance

Detailseite:

* großes Portrait
* Biografie-Facts
* Alias Names
* Titles
* Jobs
* Wand/Wands
* Family Members
* Romances
* Boggart
* Animagus
* Born / Died
* Nationality
* Physical Attributes
* Wiki Link
* API Debug Drawer mit Raw JSON

Interaktive Features:

* Character Compare
* Relationship Graph aus family_members und romances
* House Filter
* „Battle Readiness Score“ berechnet aus vorhandenen Daten
* „Mystery Card Reveal“ Animation
* Favorite Button

Commit:

```bash
git add .
git commit -m "feat(characters): implement interactive character dex"
git push origin develope
```

---

## Feature 4: Spell Dex

Nutze alle Spell-Felder:

* name
* incantation
* category
* effect
* light
* hand
* creator
* image
* wiki

UI:

* Zauberkarten mit farbigem Glow basierend auf `light`
* Kategorie-Badges
* Incantation prominent
* Hand Movement als kleine SVG-Geste
* Effektbeschreibung
* Creator Info
* Filter nach Kategorie und Licht
* „Try Spell“ Button löst Canvas-Partikeleffekt aus

Game-Stat-Ableitung:

* Angriffswert aus Kategorie + Effektlänge + Licht
* Kontrollwert aus `hand`
* Seltenheit aus Creator + Kategorie + vorhandener Image URL
* Risiko aus Keywords im Effekt

Commit:

```bash
git add .
git commit -m "feat(spells): add animated spell dex and spell effects"
git push origin develope
```

---

## Feature 5: Potion Dex

Nutze alle Potion-Felder:

* characteristics
* difficulty
* effect
* image
* inventors
* ingredients
* manufacturers
* side_effects
* time
* wiki

UI:

* Trankflaschenkarten
* Schwierigkeit als Badge
* Zutatenliste automatisch aus String parsen, wenn möglich
* Nebenwirkungen als Warnhinweise
* Brauzeit als Timeline
* Effekt als Hauptnutzen
* Inventors / Manufacturers Info
* animierte Blasen / Rauch per CSS oder PixiJS

Interaktiv:

* Ingredient Highlighting
* Potion Compare
* „Brew Simulation“ Minigame später
* Risiko-/Nutzenwertung

Commit:

```bash
git add .
git commit -m "feat(potions): implement potion dex with brewing metadata"
git push origin develope
```

---

## Feature 6: Books & Chapters

Nutze:

* Books: title, author, cover, release_date, pages, dedication, summary, wiki
* Chapters: order, title, summary, slug

UI:

* Buchregal-Ansicht
* Cover Cards
* Chapter Accordion
* Kapitel-Fortschritt
* Book Timeline
* Lesemodus für Summaries
* „Story Path“ aus Kapiteln
* Kapitel-Quiz: Errate Buch anhand Kapitelzusammenfassung

Commit:

```bash
git add .
git commit -m "feat(books): add book shelf and chapter explorer"
git push origin develope
```

---

## Feature 7: Movies

Nutze:

* title
* summary
* release_date
* running_time
* rating
* directors / director
* screenwriters
* producers
* cinematographers
* editors
* distributors
* music_composers
* budget
* box_office
* trailer
* poster oder image
* wiki

Wichtig:

Die API-Doku und OpenAPI können bei Movie-Bildfeldern abweichen. Mapper soll defensiv `poster`, `image` und ähnliche Felder prüfen.

UI:

* Film-Timeline
* Poster Cards
* Trailer Link Button
* Box Office vs Budget Visualisierung
* Crew Chips
* Rating Badge
* Runtime Badge
* Movie Detail Hero

Commit:

```bash
git add .
git commit -m "feat(movies): build cinematic movie explorer"
git push origin develope
```

---

## Feature 8: Compare Center

Vergleichsansichten:

* Character vs Character
* Spell vs Spell
* Potion vs Potion
* Movie vs Movie
* Book vs Book

Mobile:

* Swipeable compare cards

Desktop:

* Tabellenvergleich mit sticky Attributnamen

Features:

* Highlight differences
* „Best for battle“
* „Most documented“
* „Rarest metadata“
* Shareable URL mit IDs

Commit:

```bash
git add .
git commit -m "feat(compare): add resource comparison center"
git push origin develope
```

---

## Feature 9: Collections / Favorites

Lokale Sammlung ohne Login.

Funktionen:

* Favoriten
* Eigene Listen
* „Battle Team“
* „Spell Deck“
* „Potion Kit“
* „Reading List“
* Export/Import als JSON
* LocalStorage für kleine Settings
* IndexedDB für größere Sammlungen

Commit:

```bash
git add .
git commit -m "feat(collections): add local favorites and custom collections"
git push origin develope
```

---

# 9. Browsergame-Konzepte

## Game 1: Random Battle

Ziel:

Schnelles Battle aus zufälligen API-Daten.

Varianten:

* Character vs Character
* Spell vs Spell
* Potion vs Potion
* Mixed Chaos Battle

Regeln:

Charakterwerte werden deterministisch aus API-Feldern berechnet:

```txt
power = titles.length + jobs.length + wand.length + hasPatronus + hasAnimagus
defense = familyMembers.length + houseBonus + speciesBonus
mystery = aliasNames.length + boggartPresent + romancePresent
wisdom = bornPresent + nationalityPresent + wikiPresent
```

Spells:

```txt
attack = categoryWeight + effectKeywordScore + lightRarity
accuracy = handPresent + incantationPresent
control = creatorPresent + categorySpecificBonus
```

Potions:

```txt
effectPower = effect length + difficulty weight
risk = sideEffects present + dangerous keywords
craft = ingredients count + time present
```

Gameplay:

* 3 Runden
* Jede Runde eine Aktion
* Aktionen abhängig vom Resource-Typ
* animierte Attacke
* Ergebnis mit Breakdown erklären
* „Rematch“
* „Save to Battle Log“

Commit:

```bash
git add .
git commit -m "feat(games): implement random battle mode"
git push origin develope
```

---

## Game 2: Spell Arena

Engine:

* Phaser für Arena Scene
* PixiJS optional für Partikeleffekte, falls Phaser allein nicht reicht

Features:

* Wähle 3 Zauber als Deck
* Gegner bekommt 3 zufällige Zauber
* Rundenbasiert
* Spell Light bestimmt Effektfarbe
* Category bestimmt Angriffstyp
* Effect Keywords bestimmen Bonus
* Mobile Touch Buttons
* Desktop Keyboard Shortcuts

Commit:

```bash
git add .
git commit -m "feat(games): add spell arena duel mode"
git push origin develope
```

---

## Game 3: Potion Lab

Engine:

* Angular UI + PixiJS für Kesselanimation
* optional Phaser für Drag & Drop

Gameplay:

* Spieler bekommt Ziel-Effekt
* muss passenden Trank finden oder Zutatenlogik lösen
* Difficulty beeinflusst Timer
* Side Effects sind Risiko
* Ingredients werden als Chips/Items dargestellt
* Punkte für richtige Reihenfolge, Geschwindigkeit, geringe Nebenwirkungen

Commit:

```bash
git add .
git commit -m "feat(games): create potion lab brewing challenge"
git push origin develope
```

---

## Game 4: Triwizard Tournament

Meta-Spiel aus mehreren Mini-Games.

Runden:

1. Knowledge Trial: Fragen zu Büchern, Filmen, Charakteren
2. Spell Duel: Spell Arena
3. Potion Trial: Potion Lab
4. Timeline Trial: Ereignisse sortieren
5. Final Maze: kleines Phaser-Maze mit Collectibles

Datenquellen:

* Bücher
* Kapitel
* Filme
* Charaktere
* Zauber
* Tränke

Commit:

```bash
git add .
git commit -m "feat(games): add triwizard tournament campaign"
git push origin develope
```

---

## Game 5: House Cup

Lokaler Saisonmodus.

Features:

* User wählt Haus
* Punkte durch Dex-Erkundung, Quiz, Battles
* Daily Challenge gibt Punkte
* Streaks
* Badges
* Fortschritt lokal speichern
* Kein Backend nötig

Commit:

```bash
git add .
git commit -m "feat(games): implement local house cup progression"
git push origin develope
```

---

## Game 6: Guess Who / Mystery Card

Varianten:

* Charakter anhand Details erraten
* Zauber anhand Effekt erraten
* Trank anhand Nebenwirkung erraten
* Film anhand Crew/Budget/Runtime erraten
* Buch anhand Kapitel erraten

UI:

* Karte wird stufenweise enthüllt
* Je weniger Hinweise gebraucht werden, desto mehr Punkte
* Mobile Swipe für nächste Frage

Commit:

```bash
git add .
git commit -m "feat(games): add mystery card quiz challenges"
git push origin develope
```

---

## Game 7: Daily Challenge

Ohne Backend.

Täglich:

* Daily Character
* Daily Spell
* Daily Potion
* Daily Battle
* Daily Quiz
* Daily House Points

Seed:

```ts
const seed = `${new Date().toISOString().slice(0, 10)}:${challengeType}`;
```

Commit:

```bash
git add .
git commit -m "feat(games): add deterministic daily challenges"
git push origin develope
```

---

# 10. Animation & Effekte

## Global

* Sparkle Layer im Hintergrund
* Page Transitions
* Card Flip
* Glow bei Spells
* Potion Bubble Animation
* Parallax auf Desktop
* Reduced Motion Fallback

## PixiJS

Nutzen für:

* Sternenhimmel
* Kartenpartikel
* Zauber-Impact
* Potion Smoke
* Sammelalbum-Animation

## Phaser

Nutzen für:

* Arena
* Maze
* Runner
* Drag & Drop Mini-Games

## Three.js

Sparsam nutzen:

* Desktop Hero Scene mit schwebendem Buch / Zauberstab
* 3D Card Inspect Mode
* Wand Customizer
* Optional deaktivierbar auf schwachen Geräten

Performance-Regeln:

* Canvas nur starten, wenn Komponente sichtbar
* OnDestroy sauber zerstören
* FPS reduzieren bei Hidden Tab
* Mobile Low-Power Mode anbieten
* Keine schweren 3D-Szenen auf Startseite erzwingen

Commit:

```bash
git add .
git commit -m "feat(animation): add reusable magical motion system"
git push origin develope
```

---

# 11. PWA & Offline

Features:

* App installierbar
* Cache der statischen Assets
* IndexedDB API Cache
* Offline Hinweis
* Offline Dex Search, wenn Daten synchronisiert wurden
* Settings: Cache löschen, Daten refreshen
* Keine sensiblen Daten speichern

Commit:

```bash
git add .
git commit -m "feat(pwa): add offline cache and installable app shell"
git push origin develope
```

---

# 12. Testing

## Unit Tests

* Query Builder
* JSON:API Mapper
* Combat Score Berechnung
* Seed Random
* Image Fallback
* Stores

## Component Tests

* Resource Card
* Filter Drawer
* Detail Header
* Compare Table
* Game HUD

## E2E Smoke Tests

* Home lädt
* Dex Suche funktioniert
* Character Detail öffnet
* Spell Detail öffnet
* Random Battle startet
* GitHub Pages base href funktioniert

Commit:

```bash
git add .
git commit -m "test: add core unit and e2e coverage"
git push origin develope
```

---

# 13. Git Workflow

Branch:

```txt
develope
```

Regel:

Nach jedem abgeschlossenen Feature:

```bash
npm run lint
npm run test
npm run build

git status
git add .
git commit -m "<exact conventional commit message>"
git push origin develope
```

Wenn ein Feature groß ist:

```bash
git checkout develope
git pull origin develope
git checkout -b feat/<feature-name>

# implementieren

npm run lint
npm run test
npm run build

git add .
git commit -m "feat(scope): short description"
git checkout develope
git merge --no-ff feat/<feature-name>
git push origin develope
```

Wichtige Commit Messages:

```txt
chore: initialize angular wizarddex project
docs: define product vision and design system
chore: configure linting formatting and strict typescript
feat(api): add potterdb jsonapi client
feat(api): add typed resource models and mappers
feat(cache): add indexeddb api cache
feat(ui): implement design tokens and base components
feat(home): build magical dashboard with featured resources
feat(dex): add global searchable wizarddex
feat(characters): implement interactive character dex
feat(spells): add animated spell dex and spell effects
feat(potions): implement potion dex with brewing metadata
feat(books): add book shelf and chapter explorer
feat(movies): build cinematic movie explorer
feat(compare): add resource comparison center
feat(collections): add local favorites and custom collections
feat(games): implement random battle mode
feat(games): add spell arena duel mode
feat(games): create potion lab brewing challenge
feat(games): add triwizard tournament campaign
feat(games): implement local house cup progression
feat(games): add mystery card quiz challenges
feat(games): add deterministic daily challenges
feat(animation): add reusable magical motion system
feat(pwa): add offline cache and installable app shell
test: add core unit and e2e coverage
ci: deploy angular app to github pages on develope push
perf: optimize images canvas lifecycle and lazy loading
docs: add setup usage and feature roadmap
```

---

# 14. GitHub Actions Deployment

Erstelle:

```txt
.github/workflows/deploy-pages.yml
```

Workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - develope

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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test -- --watch=false --browsers=ChromeHeadless

      - name: Build
        run: npm run build -- --base-href "/wizarddex-arena/"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/wizarddex-arena/browser

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Wichtig:

* `path` in `upload-pages-artifact` muss an den echten Angular Output angepasst werden.
* Repository-Name in `--base-href` anpassen.
* In GitHub Settings > Pages muss GitHub Actions als Source aktiv sein.
* Wenn der Projektname anders ist, überall ersetzen.

Commit:

```bash
git add .
git commit -m "ci: deploy angular app to github pages on develope push"
git push origin develope
```

---

# 15. Performance-Budget

Ziele:

* Mobile-first
* Startseite initial unter 250 KB JavaScript für App Shell anstreben
* Game Engines lazy loaden
* Three.js niemals im Initial Bundle
* Phaser nur laden, wenn Game Route geöffnet wird
* PixiJS nur laden, wenn Effekt-Komponente sichtbar ist
* Bilder lazy loaden
* API Listen paginieren
* IndexedDB Cache nicht blockierend synchronisieren
* Skeleton UI statt Spinner-only

Implementierung:

```ts
const PhaserModule = await import('phaser');
```

Nicht:

```ts
import Phaser from 'phaser';
```

in globalen oder Home-Dateien.

Commit:

```bash
git add .
git commit -m "perf: lazy load game engines and optimize resource rendering"
git push origin develope
```

---

# 16. Rechtliches / Fan-Projekt

* Deutlich sichtbarer Disclaimer im Footer: Fan-made project, not affiliated.
* PotterDB und Datenquelle respektieren.
* Keine urheberrechtlich problematischen Assets manuell hinzufügen.
* API-Bilder nur über gelieferte URLs verwenden.
* Für fehlende Bilder eigene generative SVG-Placeholders verwenden.
* Keine Monetarisierung einbauen.
* Wiki-Links als externe Quelle anzeigen.

Commit:

```bash
git add .
git commit -m "docs: add attribution disclaimer and asset policy"
git push origin develope
```

---

# 17. Definition of Done pro Feature

Ein Feature ist erst fertig, wenn:

* mobile Ansicht funktioniert
* desktop Ansicht funktioniert
* loading state vorhanden
* error state vorhanden
* empty state vorhanden
* keyboard navigation geprüft
* reduced motion berücksichtigt
* API null values abgefangen
* Tests für Kernlogik vorhanden
* Build erfolgreich
* Commit mit exakter Message erstellt
* Push auf `develope` erfolgt

---

# 18. Erste sinnvolle Reihenfolge

1. Angular Projekt initialisieren
2. GitHub Repo + `develope` Branch vorbereiten
3. Designsystem Tokens definieren
4. Base Layout mit Mobile Bottom Nav und Desktop Sidebar
5. PotterDB API Client
6. Models und Mapper
7. Home Dashboard
8. WizardDex Global Search
9. Character Dex
10. Spell Dex
11. Potion Dex
12. Books & Chapters
13. Movies
14. Compare Center
15. Favorites / Collections
16. Random Battle
17. Spell Arena
18. Potion Lab
19. House Cup
20. Daily Challenge
21. PWA / Offline Cache
22. Testing
23. Performance Pass
24. GitHub Pages Deployment
25. README und Roadmap

---

# 19. README-Inhalt

README soll enthalten:

* Projektname
* Beschreibung
* Live Demo Link
* Tech Stack
* PotterDB API Credits
* Setup

```bash
npm install
npm start
```

* Build

```bash
npm run build
```

* Test

```bash
npm run test
npm run e2e
```

* Deployment Hinweis
* Feature Roadmap
* Disclaimer

Commit:

```bash
git add .
git commit -m "docs: add setup usage and feature roadmap"
git push origin develope
```

---

# 20. Kreative Extra-Ideen für spätere Versionen

* Wand Customizer: Zauberstab als 3D-Objekt
* Patronus Generator: aus Lieblingscharakteren und Antworten
* Magical Identity Card: lokales Profil
* Lore Timeline: Bücher + Filme + Kapitel
* Relationship Galaxy: Personen als Sternegraph
* Spell Sandbox: Partikeleffekt aus Spell-Light und Category
* Potion Risk Calculator
* Character Rarity Index
* API Coverage Dashboard: Welche Felder sind wie oft gefüllt?
* „Complete the Codex“ Achievement System
* Offline „Hogwarts Library Mode“
* Desktop „Marauder Map“-Ansicht für Navigation
* Mobile AR-artiger Card Tilt Effekt mit DeviceOrientation, nur optional und abschaltbar
* Exportierbare Sammelkarten als PNG
* Shareable Battle Result als Bild

---

# 21. Wichtigste Architekturregel

Erst saubere Daten- und UI-Grundlage bauen, dann Games.
Die Games dürfen keine eigenen API-Hacks enthalten. Sie müssen dieselben Domain Models, Cache Services, Score Utilities und Design Tokens verwenden wie der WizardDex.

So bleibt das Projekt erweiterbar, testbar und professionell.
