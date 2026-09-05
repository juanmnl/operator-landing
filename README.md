# Operator, the landing

The site for **Operator**, a macOS app for [Claude Code](https://www.anthropic.com/claude-code):
you work a project by deciding what its agents do, then tune each lane's model and effort so the
plan runs close to its limit and never past it. Live at
[juanmnl.com/operator-app](https://juanmnl.com/operator-app/). The app itself is
[juanmnl/operator](https://github.com/juanmnl/operator), MIT.

Plain HTML, CSS and JS. No framework, no build step, no dependencies.

## What is on the page

One framed sheet of cells, with true-scale specimens of the app's own panels doing the arguing:

- **Orchestrating (01 to 05).** The board and the team, the dispatch log, the call tree, one
  worktree per task with fan-out, and the left list.
- **Tuning (06 to 09).** Model and effort per agent, what each model actually spends, the plan
  meter (session, week, model cap, and a row that reads "no data" because absent is not zero), and
  the diff you review before it lands.
- **Scope.** What Operator does and what it leaves alone.
- **Why it exists.** A living tool, not a product.

Each specimen mirrors a real component in the app, and each one runs its own small state machine
while on screen (durations tick, the reply streams, the board's card counts). All of it is static
under `prefers-reduced-motion`.

## The wall

Behind the sheet, on canvases, the page is written on: phrases in Juan's own handwriting and quick
monoline sketches (the switchboard and its cords, a headset, a rotary dial, the board, a call
tree, a worktree graph, the effort ladder, coins for tokens). It is the visual signature shared
with [juanmnl.com](https://juanmnl.com) and Mantel Red.

- `hand.js` is the hand, copied verbatim from juanmnl.com. Caps only.
- `wall.js` is this site's phrases and sketches. Seeded per path, so a reload gives the same wall;
  `?s=N` gives another. It never paints on content, draws itself in ahead of the reader, is
  complete and still under reduced motion, and is off under 700px.

## Appearance

The page follows the system's light or dark scheme. <kbd>⌘K</kbd> (<kbd>Ctrl K</kbd> elsewhere)
opens a palette that jumps to a section or pins a scheme.

## Run

Static files. Serve the folder with any static server and open it in a browser:

```bash
npx serve .
```

## Structure

```
index.html          the document
styles.css          two colour tiers (page ground, app chrome), the sheet, the specimen kit
main.js             ⌘K palette, the animated dot-disc mark, the live-panel conductor
hand.js             the handwriting, verbatim from juanmnl.com
wall.js             the wall: Operator's phrases and sketches
design-system.html  the styleguide: colour, type, spacing, the panel kit
public/             hero image, marks, icons, favicon
```

## Notes

- The hero image is AI-generated (flora.ai), not an archival photograph, and is captioned as
  generated.
- No dollar figures anywhere. Tokens are measurable; what they cost depends on the plan.
