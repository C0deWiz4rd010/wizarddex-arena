# Roadmap & Definition of Done

## Ordered build checklist

1. Initialize Angular project (strict, standalone).
2. Prepare GitHub repo + `develope` branch.
3. Define design-system tokens.
4. Base layout: mobile bottom nav + desktop sidebar.
5. PotterDB API client + query builder.
6. Models and mappers.
7. Home dashboard.
8. WizardDex global search.
9. Character dex.
10. Spell dex.
11. Potion dex.
12. Books & chapters.
13. Movies.
14. Compare center.
15. Favorites / collections.
16. Random battle.
17. Spell arena.
18. Potion lab.
19. House cup.
20. Daily challenge.
21. PWA / offline cache.
22. Testing.
23. Performance pass.
24. GitHub Pages deployment.
25. README and roadmap.

## Definition of Done (per feature)

A feature is done only when:

- mobile view works
- desktop view works
- loading state present
- error state present
- empty state present
- keyboard navigation checked
- reduced motion respected
- API null values handled
- tests for core logic present
- build succeeds
- commit with exact conventional message created
- pushed to `develope`

## README must contain

Project name, description, live demo link, tech stack, PotterDB API credits,
setup (`npm install`, `npm start`), build (`npm run build`), test
(`npm run test`, `npm run e2e`), deployment note, feature roadmap, disclaimer.

## Conventional commit log (reference)

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

## Extra ideas (later)

Wand customizer (3D), patronus generator, magical identity card, lore timeline,
relationship galaxy, spell sandbox, potion risk calculator, character rarity
index, API coverage dashboard, "Complete the Codex" achievements, offline library
mode, desktop Marauder Map navigation, mobile AR card tilt (optional), exportable
collectible cards as PNG, shareable battle result image.
