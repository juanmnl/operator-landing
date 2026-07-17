# Operator — landing page

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates Claude Code:
a live orchestration timeline, isolated git worktrees, in-app diff review, usage/cost.
**Plain HTML/CSS/JS — no framework, no build step, no dependencies.** The app itself lives at
`../operator`.

**Scope:** hero + a single "app samples" section + a closing CTA ("Operator, standing by.",
user-requested 2026-07-01) + footer (brand row with nav, base row with brand line + OS-aware
⌘K hint + copyright). The samples section shows coded
mockups of Operator's real views as `.panel` figures laid out as **spotlight rows** (`.spot`,
user-requested 2026-07-16 over the old dense 2-col grid): one feature per row, a copy column
(kicker + title + 2 sentences) beside its panel(s), sides alternating via `:nth-child(even)`,
generous gaps. 7 spots / 12 panels: orchestration (solo), roster + task queue, worktrees +
fan-out, conversation + plan, terminal + sessions, agent library (solo), diff review + usage.
Related panels stack inside one `.spot-panels` column; on mobile each spot is copy-then-panels.
The permissions panel was removed 2026-07-02 (Claude now runs mostly in auto mode); fan-out
replaced it (same prompt to N agents, each in its own worktree, per-agent `fanIndex/fanTotal`
chips). The roster + task queue panels were added 2026-07-16, mirroring the app's `Role` (agent
lanes that pin a model, e.g. orchestrator=fable) and `ProjectTask` (backlog → running → done,
finished tasks land as a diff) types; `fable` gets the only filled model badge (`.b-fable`).
The usage panel was **demoted to the last spot and token-framed the same day** (the user finds
cost estimates unrealistic): token counts per model, API/wall time, **no dollar figures
anywhere**, and the hero lede says "every tool call, diff, and delegation" (was "dollar"). Each panel
mirrors a real component/type in `../operator` — labels and states (session phases `running`/
`waiting`/`idle`/`compacting`, per-agent model + scope, terminal cwd/pid/`OPERATOR_DEV_PORT`)
are pulled from `../operator/src/shared/types.ts` and the `components/` there, so keep them
accurate if the app changes. No other marketing sections.

## Files
- `index.html` — markup (hero, app samples, footer, ⌘K palette)
- `design-system.html` — standalone styleguide page: Elements (tokens + type), Components (the
  panel kit incl. buttons), Motion (liveness rules + small live demos: tick, caret, phase wander,
  reveal), Views (composed panels). Reuses `styles.css` verbatim + a self-contained inline
  `<style>` (`ds-*` chrome) and its own 4-theme switcher (shares the `op-theme` localStorage key
  with the landing). The diff `--add-fg`/`--del-fg` tokens are true per-theme tokens declared in
  each theme block of `styles.css` (promoted 2026-07-01; nothing re-declared on this page).
  Linked from the landing footer ("Design system").
- `styles.css` — themes as `data-theme` custom-property blocks + layout (incl. the app-samples panels)
- `main.js` — theme switching, ⌘K command palette, the animated dot-disc mark, OS-aware shortcut,
  and the **live-panel conductor**: each app-sample panel loops its own small state machine while
  on screen (orchestration durations tick and the live row hands off, the reply streams, the
  terminal typewrites, plan todos tick, usage/worktree numbers drift, session phases wander,
  roster lanes trade the in-flight border, the task queue drains task by task). All IntersectionObserver-gated (paused off-screen),
  desynced periods per panel, and fully static under `prefers-reduced-motion` (the HTML markup
  is the frozen fallback). Panels also scroll-reveal (gated behind an `html.js` class so no-JS
  stays visible).
- `public/` — static assets (hero image, logo marks, icons, favicon), referenced as `public/…`

## Run
Static files — serve with any static server (`python3 -m http.server 5173`, `npx serve .`).
No build, no `npm`.

## Theming
- The landing stays within **Operator's own themes**, ported from the app
  (`../operator/src/renderer/themes/`): Mission Control, 1984, Mr Pink, Light. Each is a
  `html[data-theme="…"]` block of CSS variables in `styles.css`; `main.js` swaps the attribute.
- **Every load/reload lands on a random theme** (user-requested 2026-07-16): an inline head
  script on both pages picks one of the four pre-paint. ⌘K / switcher picks apply for the page
  session only; nothing persists (the old `op-theme` localStorage key is gone).

## Copy & links
- Hero headline is **"You run the agents."** with the lede "Operator makes the work visible and
  steerable — …" (user-chosen 2026-07-01, promoted from their own OG line; replaced "Mission
  control for working agents.", which lives on as the footer brand line). Leads directly — no
  eyebrow above it.
- All three CTAs (Download for macOS, Release notes, footer "Releases ↗") point to
  **`https://github.com/juanmnl/operator/releases`** — the app repo is **private**, so the links
  are framed as *releases*, never "View on GitHub" / "source" (the user removed that framing).
- The macOS app icon (`public/icon-source.svg`) is used as the **favicon only**. It was tried in
  the hero (next to the CTA, then above the headline) and removed — keep it out of the hero unless
  asked.

## Design conventions
- **Do NOT use the pulsating / glowing "live" status dot** (a small accent dot with a pulse or
  box-shadow glow). The user dislikes it as a generic AI tell. Don't add it unless asked.
- Avoid other generic "AI-designed" tells: decorative flanked eyebrow labels, `·`-separated
  metadata salad, stack-bragging footers. Favor intentional, editorial typesetting.
- **Never style callouts/notes as accent left-border "flag" boxes** (the markdown-blockquote /
  admonition look). Banned by the user in every project. Notes get a plain uniform border or
  just quiet text.
- **No em dashes in copy.** Rewrite with periods, colons, commas, or semicolons. Applies to all
  visible text on both pages and to meta/OG descriptions.
- The animated brand mark (the dot-disc that twinkles) is wanted — separate from the banned dot.
- The app-samples panels convey "live" state without the banned dot: a `LIVE` text flag, an
  accent left-border on the in-flight row, and the live-panel conductor's ticking/streaming
  (see `main.js`). Keep it that way — no pulsing/glowing status dot here either. All conductor
  motion is text/state changes, never glows.
- The diff-review + worktree panels use theme-agnostic add/remove colours (green/red) via
  `--add-fg` / `--del-fg` on `.samples`, with a `data-theme='light'` override — they are the one
  intentional exception to "stay within the theme's accent," since red/green reads as diff.
- The conversation panel's streaming reply ends in a blinking `.caret` (a text cursor, accent-
  coloured) — this is a text caret, NOT the banned status dot; it's fine, and it respects
  `prefers-reduced-motion`. The plan panel shows status by colour/glyph only (✓ ▸ ○), no fills.
- The hero image (`public/hero.jpg`) is **AI-generated (flora.ai)**, not a real photograph;
  never caption it as archival/historical (no "c. 1953" framing).
