# Operator — landing page

Marketing site for **Operator**, a macOS desktop app that observes and orchestrates Claude Code:
a live orchestration timeline, isolated git worktrees, in-app diff review, usage/cost.
**Plain HTML/CSS/JS — no framework, no build step, no dependencies.** The app itself lives at
`../operator`.

## Shape (rebuilt 2026-07-29)

The page is an **editorial document with true-scale app specimens**, ported from two Claude
artifacts the user loved (`Operator — project channel`, `Operator — sidenav & gallery layout
options`). It replaced the old spotlight-row marketing layout. The register: a masthead, mono
uppercase section heads, and feature cards that pair a specimen with prose plus a
`gives / costs` list.

**Structure:** topbar (brand, "For Claude Code", ⌘K chip) → masthead (hero plate, eyebrow,
`h1`, standfirst, CTAs) → four grouped sections → a scope table → closing CTA → footer.

The four sections group ten features as an argument, find → watch → direct → land:
- **Finding your way** — 01 project gallery (solo), 02 project rail + scoped sidebar (solo)
- **Watching** — 03 orchestration timeline (solo), 04 structured transcript + plan,
  05 terminal + sessions
- **Directing** — 06 roster + task queue, 07 project channel (solo), 08 agent library (solo)
- **Landing the work** — 09 worktrees + fan-out, 10 diff review + usage

Each feature is an `.opt` card: `.opt-head` (numbered `.tag`, `.opt-name`, a factual `.verdict`
chip) over `.opt-body`. Solo-panel features use the two-column `stage | notes` body; paired-panel
features use `.opt-body.wide` (full-width stage holding a `.stage-pair`, notes below). This split
is deliberate and mirrors the artifacts: two columns for one specimen, full width for two.

The **scope table** ("What it does, and what it leaves alone") is load-bearing, not filler. It
states plainly that Operator does not host the model, send anything anywhere, estimate dollars,
post to the channel yet, or push a message into a busy lane. Keep it honest if the app changes.
Note the distinction it now draws, which was wrong before v0.11.0: you **can** stop a running
agent (`lib/interrupt.ts` sends a bare ESC — Claude Code's own interrupt, not a kill, so the
session survives); what still waits its turn is a *message* to a busy lane, because
`submitQueue` is one FIFO per terminal.

Each panel mirrors a real component/type in `../operator` — labels and states are pulled from
`../operator/src/shared/types.ts` and the `components/` there, so keep them accurate.
`fable` gets the only filled model badge (`.b-fable`). No dollar figures anywhere: the usage panel
is token-framed (the user finds cost estimates unrealistic).

**Synced to app v0.11.0 (2026-07-30).** What each new specimen mirrors:
- **Gallery** (`ProjectGallery.tsx`, `lib/project-shelf.ts`) — active cards vs shelved one-line
  rows. `archivedAt` is a *decision*, never derived from `lastActiveAt` (which tracks when a
  project last did work, not when you opened it). The orb strip shows only when something runs.
  Stale bar at `STALE_DAYS = 14`.
- **Rail + scoped sidebar** (`ProjectRail.tsx`, `Sidebar.tsx`) — projects are rounded squares
  with a corner pip, sessions stay circles. Version lives in the sidebar footer. The canvas
  (`.canv`) renders **the channel**, because `# channel` is the selected row in that specimen;
  it used to be a "session" placeholder, which contradicted the highlight (fixed 2026-07-30).
  If you ever change which sidebar row is selected, change the canvas to match.
- **Channel** (`ProjectChannel.tsx`, `lib/project-channel.ts`) — chips are the real vocabulary:
  `posted` · `delivered` · `queued · behind current task` · `held · needs your approval` ·
  `declined` · `no matching lane`. **The composer is deliberately inert in the app**, so the
  landing must say read-only. Do not imply you can message a lane.
- **Structured transcript** (`lib/tool-blocks.ts`, `lib/chat-signal.ts`) — tool runs coalesce
  ("Read 7 files"), a run carries its `caller`, and the status line uses chat-signal's verbs
  ("Editing", "Running a command", "Delegating"), never the raw tool name. Send becomes Stop.
- **Roster** — only working lanes get a full row; the rest collapse under `Ready · N`. The
  conductor only wanders lanes ABOVE that divider, or the label would contradict itself.
- **Task queue** — `ProjectTask.status` is `queued | running | done | abandoned`. `abandoned`
  means the run ended without anyone seeing the work finish; calling it `done` was the lie.

## Colour — two tiers, no theme switcher

The **four Operator themes and the random-per-load boot script are gone** (removed 2026-07-29
with the rebuild). In their place, the artifacts' two-tier palette:

- `--page-*` — the document ground, a cooler slate
- `--op-*` — the app's own chrome, Mission Control, ported from `../operator`

The point is that a specimen must read as **an object on the page, not as the page**. The whole
panel kit is *aliased* onto the `--op-*` tier (`--bg: var(--op-bg)` and friends), so all the
component CSS kept working untouched through the rebuild. Do not un-alias it.

Light comes from `prefers-color-scheme`; `:root[data-theme="light"|"dark"]` blocks exist only so a
page can pin one (the design system does). ⌘K no longer switches themes — it **jumps to a
section**, built from the DOM in `main.js`.

**Tag selectors in `styles.css` are scoped under `.wrap`** (`.wrap h1`, `.wrap h2`, `.wrap
section`, `.wrap table/th/td`) because `design-system.html` shares this stylesheet for the panel
kit but brings its own `ds-*` chrome. Unscoped tag rules leak into it. Note the specificity trap
this creates: `.wrap h2` is (0,1,1), so a single class like `.closing-title` loses to it — that
one is written `.closing .closing-title`.

## Files
- `index.html` — the document (topbar, masthead, 3 sections / 7 feature cards, scope table,
  closing, footer, ⌘K palette)
- `design-system.html` — standalone styleguide: Elements (both colour tiers + type), Components
  (the panel kit), Motion (liveness rules + live demos), Views (composed panels). Reuses
  `styles.css` verbatim plus a self-contained inline `<style>` (`ds-*`). Its switcher is
  **System / Dark / Light**, session-only. Linked from the footer.
- `styles.css` — the two palette tiers, the editorial layout primitives, then the specimen kit.
  The v0.11.0 specimens are namespaced on purpose: `.pcard/.prow/.band/.stale` (gallery),
  `.prail/.ptile/.sbar/.slane` (rail + sidebar), `.cmsg/.cchip/.av` (channel), `.tx*`
  (transcript). The artifacts' own `.lane`/`.chip` names would have collided with the roster
  panel. Lane accents (`--l-operator`, `--l-code`, …) are ported from
  `../operator/src/renderer/lib/lane-accents.ts`; `.laneink` mixes them toward `--fg` by
  `--ink-blend` so they stay legible in light mode
- `main.js` — ⌘K section jump, the animated dot-disc mark, OS-aware shortcut, and the
  **live-panel conductor**: each specimen loops its own small state machine while on screen
  (durations tick and the live row hands off, the reply streams, the terminal typewrites, plan
  todos tick, usage/worktree numbers drift, session phases wander, roster lanes trade the
  in-flight border, the task queue drains). All IntersectionObserver-gated (paused off-screen),
  desynced periods per panel, fully static under `prefers-reduced-motion` (the HTML markup is the
  frozen fallback). Panels also scroll-reveal, gated behind an `html.js` class so no-JS stays
  visible.
- `public/` — static assets (hero image, logo marks, icons, favicon), referenced as `public/…`

## Type
**Two faces, no display face** (Sora was dropped in the rebuild). Archivo (`--sans`) carries the
headline and prose, leaning on weight 600 and tight tracking rather than a third typeface;
JetBrains Mono (`--mono`) handles everything data: code, labels, metrics, timings, and the small
tracked section heads. `--font-body`/`--font-mono`/`--font-disp` survive as aliases.

## Run
Static files — serve with any static server (`python3 -m http.server 5173`, `npx serve .`).
No build, no `npm`.

## Copy & links
- Hero headline is **"You run the agents."** with the lede "Operator makes the work visible and
  steerable: …" (user-chosen 2026-07-01). No eyebrow above it; the eyebrow sits under the hero
  plate as "Operator · a macOS app for Claude Code".
- The closing CTA is **"Operator, standing by."** (user-requested 2026-07-01).
- All CTAs (Download for macOS, Release notes, footer "Releases ↗") point to
  **`https://github.com/juanmnl/operator/releases`** — the app repo is **private**, so the links
  are framed as *releases*, never "View on GitHub" / "source" (the user removed that framing).
- The macOS app icon (`public/icon-source.svg`) is the **favicon only**. It was tried in the hero
  and removed — keep it out unless asked.

## Design conventions
- **Do NOT use the pulsating / glowing "live" status dot** (a small accent dot with a pulse or
  box-shadow glow). The user dislikes it as a generic AI tell. The sidenav artifact this page was
  ported from *does* pulse its orbs; that was deliberately **not** carried over (user confirmed
  2026-07-29). Don't add it unless asked.
- **Never style callouts/notes as accent left-border "flag" boxes** (the markdown-blockquote /
  admonition look). Banned by the user in every project. The channel artifact's `.note` used one;
  it was rewritten here as a plain uniform border (user confirmed 2026-07-29).
- Avoid other generic "AI-designed" tells: decorative flanked eyebrow labels, `·`-separated
  metadata salad, stack-bragging footers. Favor intentional, editorial typesetting.
- **No em dashes in copy.** Rewrite with periods, colons, commas, or semicolons. Applies to all
  visible text on both pages and to meta/OG descriptions.
- The animated brand mark (the dot-disc that twinkles) is wanted — separate from the banned dot.
- The specimens convey "live" state without the banned dot: a `LIVE` text flag, an accent
  left-border on the in-flight row, and the conductor's ticking/streaming. Keep it that way. All
  conductor motion is text/state changes, never glows.
- The diff-review + worktree panels use theme-agnostic add/remove colours via `--add-fg` /
  `--del-fg`, one pair per colour scheme — the one intentional exception to "stay within the
  accent", since red/green reads as diff.
- The conversation panel's streaming reply ends in a blinking `.caret` (a text cursor, accent-
  coloured) — a text caret, NOT the banned status dot; it respects `prefers-reduced-motion`. The
  plan panel shows status by colour/glyph only (✓ ▸ ○), no fills.
- `.panel` is a flex column so `.panel-foot` pins to the bottom when a grid row stretches it,
  matching real app chrome. Panel body containers carry `flex: 1`.
- The hero image (`public/hero.jpg`) is **AI-generated (flora.ai)**, not a real photograph; never
  caption it as archival/historical (no "c. 1953" framing). It sits as a full-width plate at the
  top of the masthead, captioned "Generated image".

## Obsidian project hub

This project has a knowledge-hub note in the Obsidian vault, at:
`~/Work Vault/Operator/Operator.md`

Read it for background and prior decisions before starting work here. When you learn something
worth remembering across sessions (a decision, a status change, a gotcha), add a short note there
too — that vault is the shared memory across every project, not just this repo.
