# Operator — landing

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates
[Claude Code](https://www.anthropic.com/claude-code): a live orchestration timeline, isolated
git worktrees, in-app diff review, and usage/cost — all from one mission-control window.

A single full-viewport **hero + footer** that wears the app's own themes, switched with a ⌘K
command palette.

## Highlights

- **Operator's real themes.** Mission Control, 1984, Mr Pink, and Light — ported verbatim from
  the app (`../operator/src/renderer/themes/`) into `src/components/styles/operatorThemes.js`.
- **⌘K theme switcher.** Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> (or click the chip in the
  masthead) to switch themes. Type to filter, <kbd>↑</kbd>/<kbd>↓</kbd> to move, <kbd>↵</kbd>
  to apply. The choice persists in `localStorage`.
- **Animated brand mark.** The Operator dot-disc (`OperatorMark`) twinkles in the active theme's
  accent — a true 7×7 grid at small sizes, a denser 11×11 lattice for the hero.
- **Full-viewport layout.** Hero and footer fill exactly one screen across every theme.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/)
- Type: Sora (display), Archivo (body), JetBrains Mono (labels)

## Develop

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Structure

```
src/
  App.jsx                       # theme state + ⌘K wiring
  components/styles/
    ThemedHero.jsx              # the hero + footer, themeable
    CommandPalette.jsx          # the ⌘K theme switcher
    operatorThemes.js           # Operator's palettes, ported from the app
    _shared.jsx                 # OperatorMark (animated dot-disc), photo + glyph
  components/                   # parked marketing sections (problem / features / …),
                                # ready to reintroduce in the chosen theme
public/                         # static assets — hero image, logo marks, icons, favicon
```

## Notes

- **Assets live in `public/`, never `dist/`** — `vite build` wipes `dist/` on every run.
- The hero switchboard-operator image (`public/hero.jpg`) is an **AI-generated illustration**
  (flora.ai), not an archival photograph; it is not captioned as one.

See [`CLAUDE.md`](./CLAUDE.md) for working conventions.
