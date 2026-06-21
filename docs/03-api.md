# PotterDB API Integration

> Verified against https://docs.potterdb.com (2026-06-21). Where this doc and the
> original `plan.md` disagree, **this doc wins**.

## Base URL

```ts
export const POTTER_DB_BASE_URL = 'https://api.potterdb.com/v1';
```

Format: **JSON:API**. OpenAPI (OAS 3.0.3): `https://api.potterdb.com/v1/openapi.json`.

## Endpoints

```txt
GET /v1/books                              GET /v1/books/{id}
GET /v1/books/{book_id}/chapters           GET /v1/books/{book_id}/chapters/{id}
GET /v1/characters                         GET /v1/characters/{id}
GET /v1/movies                             GET /v1/movies/{id}
GET /v1/potions                            GET /v1/potions/{id}
GET /v1/spells                             GET /v1/spells/{id}
```

`{id}` accepts a **UUID or a slug**.

## Query parameters

- **Pagination:** `page[size]` (max **100**), `page[number]`.
  Response has a `links` object (`first`/`last`/`prev`/`next`) and `meta` pagination.
- **Filtering (Ransack):** `filter[field_predicate]=value`
  - `name_cont` (contains), `house_eq` (equals), `*_present`, `*_null`,
    `*_gteq` / `*_lteq` (dates/numbers), `*_start`, `*_end`.
- **Sorting:** `sort=field`, descending with `-` prefix: `sort=-release_date`.

Examples:

```txt
/v1/characters?page[size]=24&page[number]=2
/v1/characters?filter[name_cont]=Weasley
/v1/characters?filter[house_eq]=Gryffindor
/v1/spells?filter[category_cont]=Charm
/v1/potions?filter[difficulty_present]=true
/v1/books?sort=release_date
/v1/movies?sort=-release_date
```

## Query builder type

```ts
type SortDirection = 'asc' | 'desc';

interface PotterQuery {
  page?: number;
  size?: number;            // clamp to 1..100
  sort?: string;
  direction?: SortDirection;
  filters?: Record<string, string | number | boolean | null>;
}
```

## Resource attributes (authoritative)

### Character
`alias_names[]`, `animagus`, `blood_status`, `boggart`, `born`, `died`,
`eye_color`, **`family_member[]`**, `gender`, `hair_color`, `height`, `house`,
`image`, `jobs[]`, `name`, `nationality`, `patronus`, `romances[]`, `skin_color`,
`slug`, `species`, `titles[]`, `wand[]`, `weight`, `wiki`.

### Spell
`category`, `creator`, `effect`, `hand`, `image`, `incantation`, `light`, `name`,
`slug`, `wiki`.

### Potion (string fields, not arrays)
`characteristics`, `difficulty`, `effect`, `image`, `inventors`, `ingredients`,
`manufacturers`, `name`, `side_effects`, `slug`, `time`, `wiki`.

### Movie
`box_office`, `budget`, `cinematographers[]`, `directors[]`, `distributors[]`,
`editors[]`, `music_composers[]`, **`poster`**, `producers[]`, `rating`,
`release_date`, `running_time`, `screenwriters[]`, `slug`, `summary`, `title`,
**`trailer`**, `wiki`.

### Book
`author`, **`cover`**, `dedication`, `pages`, `release_date`, `summary`, `slug`,
`title`, `wiki`.

### Chapter (belongs to a book)
`order`, `title`, `summary`, `slug`.

## Domain model example

Map API → normalized envelope → domain model. Never use raw API objects in components.

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
  familyMembers?: string[];   // mapped from API `family_member`
  romances?: string[];
  image?: string | null;
  wiki?: string | null;
  raw: CharacterAttributes;
}
```

## Null handling

Many fields are nullable. Every UI component needs robust fallbacks:
`Unknown` / `Not documented`, generated placeholder image, generated symbol
(by type/house/category/light color), and **skeleton loaders** instead of layout shift.

## Data strategy

- **Initial load (home):** only hero stats + a few random featured resources.
  Never load all 5000+ characters up front.
- **Dex lists:** server-side pagination — `page[size]=24` mobile, `48` desktop;
  infinite scroll or "load more"; filters/sort synced to URL.
- **Offline codex:** optional "sync dex" caches all pages per resource into
  IndexedDB with a progress indicator, enabling local fuzzy search. Store a cache
  version; offer "Refresh API cache".
- **Daily seed:** no backend — deterministic seed `YYYY-MM-DD + challenge-type`
  so all users get the same daily challenge.
