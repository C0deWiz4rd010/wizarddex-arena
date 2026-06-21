# Design System — "Arcane Library"

No feature implementation without tokens. This is the visual + interaction
contract for the whole app.

## Mood

Dark magical library, parchment cards, golden accents, glowing spell effects,
house colors as secondary accents. Mobile: clear and legible. Desktop: immersive.

## Fonts

```css
--font-display: 'Cinzel', 'Georgia', serif;     /* headlines, logos, chapter titles */
--font-body: 'Inter', 'Atkinson Hyperlegible', system-ui, sans-serif; /* body */
--font-mono: 'Fira Code', 'SFMono-Regular', monospace; /* API debug drawer, chips */
```

## Color tokens

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

## Spacing / radius

```css
--space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
--space-5: 1.5rem;  --space-6: 2rem;   --space-7: 3rem;    --space-8: 4rem;

--radius-sm: 0.5rem; --radius-md: 0.875rem; --radius-lg: 1.25rem;
--radius-xl: 1.75rem; --radius-full: 999px;
```

## Motion tokens

```css
--motion-fast: 120ms;
--motion-base: 220ms;
--motion-slow: 420ms;
--ease-magic: cubic-bezier(.2,.8,.2,1);
--ease-bounce-soft: cubic-bezier(.34,1.56,.64,1);
```

Fluid typography uses `clamp()`; layouts use container queries where helpful.

## Component inventory

Build before feature work begins:

`AppShell`, `BottomNav`, `DesktopSidebar`, `TopCommandBar`, `MagicButton`,
`MagicCard`, `ResourceCard`, `ResourceAvatar`, `FilterChip`, `SearchInput`,
`StatPill`, `HouseBadge`, `SpellBadge`, `PotionDifficultyBadge`, `SkeletonCard`,
`EmptyState`, `ErrorState`, `MagicModal`, `SwipeTabs`, `SegmentedControl`,
`FloatingActionButton`, `Toast`, `ProgressRing`, `SparkleLayer`.

## Accessibility (non-negotiable)

- All interactive elements keyboard operable; visible focus ring.
- Respect `prefers-reduced-motion`.
- Canvas games provide alternative buttons / text status.
- Color is never the sole carrier of information.
- Minimum touch targets 44×44 px.
