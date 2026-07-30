# Handoff: Operator landing

**As of 2026-07-30.** Branch `landing/artifact-register-v0.11.0`, one commit `da1c14d` on top of
`eb79eac`. **Not merged, not pushed.** `CLAUDE.md` was rewritten in the same commit and is
accurate; trust it over anything older.

---

## What this repo is now

An **editorial document with true-scale app specimens**, not a marketing page. It replaced a
full-viewport hero plus seven spotlight rows. The shape came from two Claude artifacts the user
pointed at and asked to build the site around:

- `Operator — project channel`
- `Operator — sidenav & gallery layout options`

Structure: topbar → masthead (hero plate, eyebrow, `h1`, standfirst, CTAs) → four sections →
scope table → closing CTA → footer. Ten feature cards, grouped as an argument:

| § | Cards |
|---|---|
| Finding your way | 01 project gallery · 02 project rail + scoped sidebar |
| Watching | 03 orchestration · 04 structured transcript + plan · 05 terminal + sessions |
| Directing | 06 roster + task queue · 07 project channel · 08 agent library |
| Landing the work | 09 worktrees + fan-out · 10 diff review + usage |

Solo specimens use the two-column `stage | notes` body; paired specimens use `.opt-body.wide`
(full-width stage holding a `.stage-pair`, notes below).

---

## The one idea to not break

**Colour is two tiers.** `--page-*` is a cooler slate document ground; `--op-*` is the app's own
Mission Control chrome. A specimen has to read as *an object on the page, not as the page*.

The whole panel kit is **aliased** onto the `--op-*` tier:

```css
--bg: var(--op-bg);  --surface: var(--op-surface);  --fg: var(--op-fg);  …
```

That alias is why ~470 lines of component CSS survived the rewrite untouched. **Do not un-alias
it.** If you need a new specimen colour, add it to the `--op-*` tier, not to a component.

Colour follows `prefers-color-scheme`. `:root[data-theme="light"|"dark"]` exists only so a page
can pin one; `design-system.html` does, via its System/Dark/Light switcher. There is no theme
switcher on the landing; **⌘K jumps to a section** instead (targets are built from the DOM in
`main.js`).

---

## Two traps that already bit

**1. Bare tag selectors leak across pages.** `styles.css` is shared with `design-system.html`,
which brings its own `ds-*` chrome. Unscoped `h1/h2/section/table` rules bled in and rendered its
"Tokens & type" heading as mono uppercase. They are now scoped under `.wrap`. All the `ds-*`
classes are prefixed, so classes were never the problem. Only tag selectors.

**2. That scoping is a specificity trap.** `.wrap h2` is (0,1,1) and silently beat
`.closing-title` (0,1,0), so the closing headline lost its styling. It is now
`.closing .closing-title`. **Caught only by looking at the rendered page, not by reading the
diff.** Always render after a specificity change.

And a third, from the v0.11.0 pass: **`node --check` validates syntax, not scope.** Trimming a
destructure left `base()` referencing removed bindings; `--check` passed and it would have thrown
at runtime. Only the browser console caught it. Load the page after touching a conductor.

---

## Accuracy rules for the specimens

Every panel mirrors a real component/type in `../operator`. Pulled from
`src/shared/types.ts` and `src/renderer/components/`. Keep them true if the app moves.

- **Channel.** The composer is **deliberately inert in the app** (`ProjectChannel.tsx`). It is a
  read-only feed plus an approval gate. **Never imply you can message a lane.** Chips are the real
  vocabulary: `posted` · `delivered` · `queued · behind current task` · `held · needs your
  approval` · `declined` · `no matching lane`.
- **Interrupt.** You *can* stop a run (`lib/interrupt.ts` sends a bare ESC, Claude Code's own
  interrupt, not a kill; the session survives). What waits its turn is a *message* into a busy
  lane, because `submitQueue` is one FIFO per terminal. The scope table draws that distinction in
  two separate rows; it was one wrong row before.
- **Gallery.** `archivedAt` is a *decision*, never derived from `lastActiveAt` (which tracks when
  a project last did work, not when you opened it). The orb strip shows only when something runs.
- **Rail.** Projects are rounded squares, sessions stay circles. The canvas renders **the
  channel**, because `# channel` is the selected row in that specimen. If you change which row is
  selected, change the canvas to match.
- **Roster.** Only working lanes get a full row; the rest collapse under `Ready · N`. The
  conductor only wanders lanes **above** that divider, or the label contradicts itself.
- **Task queue.** `abandoned` is its own state. The run ended without anyone seeing the work
  finish; `done` was the lie every downstream count repeated.
- **Transcript.** Tool runs coalesce ("Read 7 files"), a run carries its `caller`, and the status
  line uses `lib/chat-signal`'s verbs ("Editing", "Running a command"), never the raw tool name.
- **No dollar figures anywhere.** Usage is token-framed; the user finds cost estimates unrealistic.

---

## Standing bans (do not relitigate)

- **No pulsating / glowing "live" status dot.** The sidenav artifact this page was ported from
  *does* pulse its orbs; that was deliberately not carried over.
- **No accent left-border callout boxes.** The channel artifact's `.note` used one; it was
  rewritten as a plain uniform border.
- **No em dashes in visible copy.** Both pages, plus meta/OG descriptions.
- No decorative flanked eyebrows, no `·`-separated metadata salad, no stack-bragging footers.

The live-row accent left-border (`.is-live`, `.wt-active`, `.sess.running`, `.lane.running`)
predates the callout ban and still exists. The user was asked once whether the ban extends to it
and never answered. **Do not add new accent left-border devices without asking.**

---

## Files

- `index.html`: the document
- `styles.css`: two palette tiers, editorial primitives, then the specimen kit. v0.11.0
  specimens are namespaced (`.pcard/.prow/.band`, `.prail/.ptile/.sbar/.slane`,
  `.cmsg/.cchip/.av`, `.tx*`) because the artifacts' own `.lane`/`.chip` collide with the roster
- `main.js`: ⌘K section jump, the dot-disc mark, and the **live-panel conductor** (one small
  state machine per specimen, IntersectionObserver-gated, desynced periods, fully static under
  `prefers-reduced-motion`; the HTML is the frozen fallback)
- `design-system.html`: styleguide. Shares `styles.css` verbatim, brings its own `ds-*` chrome

---

## Verifying

Static files, no build. Serve with anything: `python3 -m http.server 5173`.

Gotchas, learned the hard way:

- **Cache-bust `styles.css`.** A query string on the HTML does not bust the stylesheet. Repoint
  the `<link>` href in the console.
- **The outer page ignores programmatic scroll.** Use real wheel events; `scrollIntoView` on the
  top-level document silently no-ops.
- **`resize_window` does not narrow the viewport.** For mobile, use a same-origin iframe harness
  served from the same port, then scroll inside it with real wheel events.
- **Screenshots can catch a stale paint.** A panel showed empty while the DOM reported
  `opacity: 1` with content present. Re-shoot before believing it.

---

## Open threads

- **Merge / push.** The branch is local only. `main` is still at `eb79eac`.
- **`AGENTS.md` is untracked** and predates this work. Left alone deliberately; not mine to commit.
- **Port 1433** (this project's reserved dev port) is held by an orphaned `python -m http.server`
  from an unrelated `web27` session. PID reparented to launchd, serving an empty scratchpad.
  `kill` was blocked by the permission classifier. Everything was verified on **1440** instead.
- The stale-projects bar was built, then removed from both pages at the user's request, and its
  CSS deleted. If it comes back it needs a plain bordered strip, never a left-border flag.
