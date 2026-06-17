// ── AppMark ─────────────────────────────────────────────────────────────────
// The Operator product icon as a self-contained badge: a light rounded-square
// tile with the StatusWave dot-disc rendered in frozen grayscale (the same look
// as the macOS app icon / favicon). Use this where the brand should read as the
// *app identity* — e.g. the menu-bar wordmark — rather than the bare dot mark.

const CELLS = 7
const CENTER = 3.5
const RADIUS = 3.4
const R = 0.5 // dot radius (in the 7×7 grid space)

// Dot palette: near-black → mid gray, matching the app icon's frozen twinkle.
const DARK = [34, 34, 42]
const LIGHT = [110, 116, 123]
const lerp = (a, b, t) => Math.round(a + (b - a) * t)
const dotColor = (t) =>
  `rgb(${lerp(DARK[0], LIGHT[0], t)}, ${lerp(DARK[1], LIGHT[1], t)}, ${lerp(DARK[2], LIGHT[2], t)})`

// Deterministic pseudo-random in [0,1) — same hash StatusWave uses, so the dot
// shading is stable and consistent with the rest of the brand mark.
function rand(i) {
  const v = (Math.sin(i * 12.9898) * 43758.5453) % 1
  return v < 0 ? v + 1 : v
}

// Build the dot set once: keep a cell only if its centre is inside the circle.
const DOTS = (() => {
  const out = []
  let i = 0
  for (let row = 0; row < CELLS; row++) {
    for (let col = 0; col < CELLS; col++) {
      const cx = col + 0.5
      const cy = row + 0.5
      const dx = cx - CENTER
      const dy = cy - CENTER
      if (dx * dx + dy * dy <= RADIUS * RADIUS * 1.04) {
        out.push({ cx, cy, fill: dotColor(rand(i)) })
      }
      i++
    }
  }
  return out
})()

/**
 * @param {number} size      rendered px (square)
 * @param {string} className optional wrapper class
 */
export default function AppMark({ size = 20, className = '' }) {
  // viewBox padded to 8 so the dot disc (centred in a 7×7 field) sits inside the
  // rounded tile with a little breathing room, like the real app icon.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={className}
      role="img"
      aria-label="Operator"
    >
      <rect x="0.08" y="0.08" width="7.84" height="7.84" rx="1.75" fill="#f6efdc" stroke="#9a3324" strokeWidth="0.16" />
      <g transform="translate(0.5 0.5)">
        {DOTS.map(({ cx, cy, fill }, idx) => (
          <circle key={idx} cx={cx} cy={cy} r={R} fill={fill} />
        ))}
      </g>
    </svg>
  )
}
