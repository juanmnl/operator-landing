# Operator — landing page

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates Claude Code:
a live orchestration timeline, isolated git worktrees, in-app diff review, usage/cost.
**Plain HTML/CSS/JS — no framework, no build step, no dependencies.** The app itself lives at
`../operator`.

**Scope:** hero + a single "app samples" section + footer. The samples section shows coded
mockups of Operator's real views as `.panel` figures in a 2-col grid (wide-left / narrow-right):
orchestration timeline, usage/cost, in-app diff review, worktrees, conversation, plan mode,
terminal, concurrent sessions, permission decisions, agent library. Each panel mirrors a real
component/type in `../operator` — labels and states (session phases `running`/`waiting`/`idle`/
`compacting`, permission statuses `approved`/`denied`/`pending`/`auto`, per-agent model + scope,
terminal cwd/pid/`OPERATOR_DEV_PORT`) are pulled from `../operator/src/shared/types.ts` and the
`components/` there, so keep them accurate if the app changes. No other marketing sections.

## Files
- `index.html` — markup (hero, app samples, footer, ⌘K palette)
- `design-system.html` — standalone styleguide page: Elements (tokens + type), Components (the
  panel kit), Views (composed panels). Reuses `styles.css` verbatim + a self-contained inline
  `<style>` (`ds-*` chrome) and its own 4-theme switcher (shares the `op-theme` localStorage key
  with the landing). It re-declares the diff `--add-fg`/`--del-fg` tokens at `html` scope so
  pills/diffs render outside a `.samples` ancestor. Linked from the landing footer ("Design system").
- `styles.css` — themes as `data-theme` custom-property blocks + layout (incl. the app-samples panels)
- `main.js` — theme switching, ⌘K command palette, the animated dot-disc mark, OS-aware shortcut,
  the live-tick counter on the sample orchestration row
- `public/` — static assets (hero image, logo marks, icons, favicon), referenced as `public/…`

## Run
Static files — serve with any static server (`python3 -m http.server 5173`, `npx serve .`).
No build, no `npm`.

## Theming
- The landing stays within **Operator's own themes**, ported from the app
  (`../operator/src/renderer/themes/`): Mission Control, 1984, Mr Pink, Light. Each is a
  `html[data-theme="…"]` block of CSS variables in `styles.css`; `main.js` swaps the attribute.

## Copy & links
- Hero headline is **"Mission control for working agents."** (leads directly — no eyebrow above it).
- All three CTAs (Download for macOS, View on GitHub, footer GitHub) point to
  **`https://github.com/juanmnl/operator/releases`** — the app repo is **private**, so link to
  releases, not source.
- The macOS app icon (`public/icon-source.svg`) is used as the **favicon only**. It was tried in
  the hero (next to the CTA, then above the headline) and removed — keep it out of the hero unless
  asked.

## Design conventions
- **Do NOT use the pulsating / glowing "live" status dot** (a small accent dot with a pulse or
  box-shadow glow). The user dislikes it as a generic AI tell. Don't add it unless asked.
- Avoid other generic "AI-designed" tells: decorative flanked eyebrow labels, `·`-separated
  metadata salad, stack-bragging footers. Favor intentional, editorial typesetting.
- The animated brand mark (the dot-disc that twinkles) is wanted — separate from the banned dot.
- The app-samples panels convey "live" state without the banned dot: a `LIVE` text flag, an
  accent left-border on the in-flight row, and a ticking duration counter (`data-tick` in
  `main.js`). Keep it that way — no pulsing/glowing status dot here either.
- The diff-review + worktree panels use theme-agnostic add/remove colours (green/red) via
  `--add-fg` / `--del-fg` on `.samples`, with a `data-theme='light'` override — they are the one
  intentional exception to "stay within the theme's accent," since red/green reads as diff.
- The conversation panel's streaming reply ends in a blinking `.caret` (a text cursor, accent-
  coloured) — this is a text caret, NOT the banned status dot; it's fine, and it respects
  `prefers-reduced-motion`. The plan panel shows status by colour/glyph only (✓ ▸ ○), no fills.
- The hero image (`public/hero.jpg`) is **AI-generated (flora.ai)**, not a real photograph;
  never caption it as archival/historical (no "c. 1953" framing).
