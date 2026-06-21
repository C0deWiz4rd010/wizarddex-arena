# WizardDex Features

Each feature is "done" only when it satisfies the Definition of Done in
[07-roadmap.md](07-roadmap.md).

## Feature 1 — Home / Magical Dashboard

- Hero with animated starfield.
- Quick access to all resources.
- Random character / spell / potion (featured cards).
- Daily Challenge card.
- "Continue where you left off".
- API status / cache status.
- Local House Cup score.

Mobile: vertical cards + bottom nav. Desktop: hero left, featured cards right,
optional animated background scene.

## Feature 2 — WizardDex Global Search

- Tabs: All, Characters, Spells, Potions, Books, Movies.
- Search field; filter drawer (mobile) / sidebar (desktop); sort menu.
- URL sync of search/filter/sort.
- Resource cards with type icon; loading skeletons; empty states.
- Online mode → API search. Offline mode → fuzzy search over cache.

Filter ideas:
- Characters: house, species, blood_status, gender, patronus present, animagus present.
- Spells: category, light, creator present.
- Potions: difficulty, effect, ingredients present.
- Books: release_date, pages.
- Movies: rating, release_date, running_time.

## Feature 3 — Character Dex

List card: image/generated avatar sigil, name, house, species, blood status,
patronus, small icons for wand/jobs/family/romance.

Detail: portrait, bio facts, alias names, titles, jobs, wand(s), family members,
romances, boggart, animagus, born/died, nationality, physical attributes, wiki
link, API debug drawer (raw JSON).

Interactive: character compare, relationship graph (from `family_member` +
`romances`), house filter, "Battle Readiness Score", mystery card reveal,
favorite button.

## Feature 4 — Spell Dex

Fields: name, incantation, category, effect, light, hand, creator, image, wiki.

UI: spell cards with colored glow from `light`, category badges, prominent
incantation, hand movement as small SVG gesture, effect text, creator info,
filters by category + light, "Try Spell" → canvas particle effect.

Game-stat derivation:
- attack = categoryWeight + effectKeywordScore + lightRarity
- accuracy = handPresent + incantationPresent
- control = creatorPresent + categorySpecificBonus

## Feature 5 — Potion Dex

Fields: characteristics, difficulty, effect, image, inventors, ingredients,
manufacturers, side_effects, time, wiki. (ingredients/side_effects are strings —
parse into list items where possible.)

UI: potion bottle cards, difficulty badge, parsed ingredient list, side-effect
warnings, brew time as timeline, effect as main benefit, inventors/manufacturers
info, animated bubbles/smoke (CSS or PixiJS).

Interactive: ingredient highlighting, potion compare, risk/benefit rating,
"brew simulation" mini-game (later).

## Feature 6 — Books & Chapters

Books: title, author, cover, release_date, pages, dedication, summary, wiki.
Chapters: order, title, summary, slug.

UI: bookshelf view, cover cards, chapter accordion, chapter progress, book
timeline, reading mode for summaries, "story path" from chapters, chapter quiz
(guess the book from a chapter summary).

## Feature 7 — Movies

Fields: title, summary, release_date, running_time, rating, directors,
screenwriters, producers, cinematographers, editors, distributors,
music_composers, budget, box_office, trailer, poster, wiki.

Mapper must defensively check `poster` / `image`-like fields.

UI: movie timeline, poster cards, trailer link, box office vs budget viz, crew
chips, rating badge, runtime badge, movie detail hero.

## Feature 8 — Compare Center

Character/Spell/Potion/Movie/Book vs same type. Mobile: swipeable compare cards.
Desktop: table compare with sticky attribute names. Highlight differences;
"best for battle", "most documented", "rarest metadata"; shareable URL with IDs.

## Feature 9 — Collections / Favorites

Local, no login. Favorites, custom lists, "Battle Team", "Spell Deck",
"Potion Kit", "Reading List". Export/import JSON. LocalStorage for small settings,
IndexedDB for larger collections.

## Commit messages

```txt
feat(home): build magical dashboard with featured resources
feat(dex): add global searchable wizarddex
feat(characters): implement interactive character dex
feat(spells): add animated spell dex and spell effects
feat(potions): implement potion dex with brewing metadata
feat(books): add book shelf and chapter explorer
feat(movies): build cinematic movie explorer
feat(compare): add resource comparison center
feat(collections): add local favorites and custom collections
```
