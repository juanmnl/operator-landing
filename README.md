# Operator — landing

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates
[Claude Code](https://www.anthropic.com/claude-code): a live orchestration timeline, isolated
git worktrees, in-app diff review, and usage/cost — all from one mission-control window.

A single full-viewport **hero + footer** that wears the app's own themes, switched with a ⌘K
command palette. Plain HTML/CSS/JS — **no framework, no build step, no dependencies.**

## Highlights

- **Operator's real themes.** Mission Control, 1984, Mr Pink, and Light — ported from the app
  (`../operator/src/renderer/themes/`) as `data-theme` blocks of CSS custom properties.
- **⌘K theme switcher.** Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> (or click the chip in the
  masthead) to open a command palette: type to filter, <kbd>↑</kbd>/<kbd>↓</kbd> to move,
  <kbd>↵</kbd> to apply. The shortcut label adapts to the OS; the choice persists in
  `localStorage`.
- **Animated brand mark.** The Operator dot-disc twinkles in the active theme's accent — a true
  7×7 grid at small sizes, a denser 11×11 lattice for the hero — generated in `main.js`.
- **Full-viewport layout.** Hero and footer fill exactly one screen across every theme.

## Run

No build needed — it's static files. Serve the folder with anything, e.g.:

```bash
python3 -m http.server 5173      # then open http://localhost:5173
# or: npx serve .
```

(Opening `index.html` directly works too, though a server is recommended so the fonts and
relative asset paths resolve cleanly.)

## Structure

```
index.html     # markup: hero, footer, ⌘K palette
styles.css     # themes (data-theme custom properties) + layout
main.js        # theme switching, ⌘K palette, animated dot-disc, OS-aware shortcut
public/        # static assets — hero image, logo marks, icons, favicon
```

## Notes

- The hero switchboard-operator image (`public/hero.jpg`) is an **AI-generated illustration**
  (flora.ai), not an archival photograph; it is not captioned as one.

See [`CLAUDE.md`](./CLAUDE.md) for working conventions.
