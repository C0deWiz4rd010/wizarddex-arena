# Browser Games

Games reuse the same domain models, cache services, score utilities and design
tokens as the WizardDex. No game-specific API hacks.

## Score formulas (deterministic, from API fields)

```txt
Character
  power   = titles.length + jobs.length + wand.length + hasPatronus + hasAnimagus
  defense = familyMembers.length + houseBonus + speciesBonus
  mystery = aliasNames.length + boggartPresent + romancePresent
  wisdom  = bornPresent + nationalityPresent + wikiPresent

Spell
  attack   = categoryWeight + effectKeywordScore + lightRarity
  accuracy = handPresent + incantationPresent
  control  = creatorPresent + categorySpecificBonus

Potion
  effectPower = effect.length + difficultyWeight
  risk        = sideEffectsPresent + dangerousKeywords
  craft       = ingredientsCount + timePresent
```

These live in `core/utils/combat-score.ts` and are unit tested.

## Game 1 — Random Battle

Quick battle from random API data. Variants: character vs character, spell vs
spell, potion vs potion, mixed chaos. 3 rounds, one action per round (action set
depends on resource type), animated attack, result breakdown, rematch, save to
battle log.

## Game 2 — Spell Arena

Engine: Phaser (Pixi optional for particles). Pick 3 spells as a deck; opponent
gets 3 random spells; round-based. Spell `light` → effect color, `category` →
attack type, effect keywords → bonus. Mobile touch buttons, desktop keyboard
shortcuts.

## Game 3 — Potion Lab

Engine: Angular UI + PixiJS cauldron (Phaser optional for drag & drop). Player
gets a target effect, must find the matching potion / solve ingredient logic.
Difficulty drives the timer; side effects are risk; ingredients shown as chips.
Points for correct order, speed, low side effects.

## Game 4 — Triwizard Tournament

Meta-game of mini-games:
1. Knowledge Trial — questions about books/movies/characters.
2. Spell Duel — Spell Arena.
3. Potion Trial — Potion Lab.
4. Timeline Trial — sort events.
5. Final Maze — small Phaser maze with collectibles.

## Game 5 — House Cup

Local season mode. Choose a house; earn points via dex exploration, quizzes,
battles, daily challenges; streaks; badges; progress saved locally. No backend.

## Game 6 — Guess Who / Mystery Card

Guess character/spell/potion/movie/book from progressive hints. Fewer hints used
→ more points. Mobile swipe for next question.

## Game 7 — Daily Challenge

No backend. Daily character/spell/potion/battle/quiz/house points.

```ts
const seed = `${new Date().toISOString().slice(0, 10)}:${challengeType}`;
```

## Commit messages

```txt
feat(games): implement random battle mode
feat(games): add spell arena duel mode
feat(games): create potion lab brewing challenge
feat(games): add triwizard tournament campaign
feat(games): implement local house cup progression
feat(games): add mystery card quiz challenges
feat(games): add deterministic daily challenges
```
