# Operator — landing page

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates
Claude Code: a live orchestration timeline, isolated git worktrees, in-app diff review, usage/cost.
Stack: Vite + React + Tailwind v4. The app itself lives at `../operator`.

## Assets
- Static assets (images, logos, icons) go in **`public/`**, never `dist/` — `vite build` wipes `dist/`.
- Prefer the dev server for verification; avoid `npm run build` while iterating.
- The hero switchboard-operator image (`public/hero.jpg`) is **AI-generated (flora.ai)**, NOT a real
  photograph. Never caption it as an archival/historical photo (no "Fig. 1 … c. 1953" framing, no
  real-date claims). Treat it as an evocative illustration only.

## Theming
- The landing stays within **Operator's own themes**, ported from the app
  (`../operator/src/renderer/themes/`): Mission Control, 1984, Mr Pink, Light.
  Palettes live in `src/components/styles/operatorThemes.js`.

## Design conventions
- **Do NOT use the pulsating / glowing "live" status dot** (a small accent dot with a pulse
  or box-shadow glow). The user dislikes it as a generic AI tell. Do not add it back unless
  the user explicitly asks for it.
- Avoid other generic "AI-designed" tells: decorative flanked eyebrow labels, `·`-separated
  metadata salad, and stack-bragging footers. Favor intentional, editorial typesetting.
- The animated brand mark (the Operator dot-disc that twinkles) is fine and wanted — that is
  separate from the banned status dot.
