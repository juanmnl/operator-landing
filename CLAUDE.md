# Operator — landing page

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates Claude Code:
a live orchestration timeline, isolated git worktrees, in-app diff review, usage/cost.
**Plain HTML/CSS/JS — no framework, no build step, no dependencies.** The app itself lives at
`../operator`.

## Files
- `index.html` — markup (hero, footer, ⌘K palette)
- `styles.css` — themes as `data-theme` custom-property blocks + layout
- `main.js` — theme switching, ⌘K command palette, the animated dot-disc mark, OS-aware shortcut
- `public/` — static assets (hero image, logo marks, icons, favicon), referenced as `public/…`

## Run
Static files — serve with any static server (`python3 -m http.server 5173`, `npx serve .`).
No build, no `npm`.

## Theming
- The landing stays within **Operator's own themes**, ported from the app
  (`../operator/src/renderer/themes/`): Mission Control, 1984, Mr Pink, Light. Each is a
  `html[data-theme="…"]` block of CSS variables in `styles.css`; `main.js` swaps the attribute.

## Design conventions
- **Do NOT use the pulsating / glowing "live" status dot** (a small accent dot with a pulse or
  box-shadow glow). The user dislikes it as a generic AI tell. Don't add it unless asked.
- Avoid other generic "AI-designed" tells: decorative flanked eyebrow labels, `·`-separated
  metadata salad, stack-bragging footers. Favor intentional, editorial typesetting.
- The animated brand mark (the dot-disc that twinkles) is wanted — separate from the banned dot.
- The hero image (`public/hero.jpg`) is **AI-generated (flora.ai)**, not a real photograph;
  never caption it as archival/historical (no "c. 1953" framing).
