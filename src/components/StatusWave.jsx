// ── StatusWave ──────────────────────────────────────────────────────────────
// The real Operator brand mark, ported faithfully from the app. A circle of grid
// dots that twinkle (scale up + shift gray→white) for a subtle "thinking" shimmer.
// This is THE logo — not a fabricated app window. Geometry + animation are taken
// straight from the app's source so the marketing mark and the product mark match.

const CELLS = 7
const CENTER = 3.5
const RADIUS = 3.4
const R = 0.5 // dot radius

// Grayscale palette. Stays gray → white; the green accent is intentionally absent
// from the mark itself (the accent belongs to CTAs/affordances elsewhere).
const GRAY = '#7d6a47'
const WHITE = '#3a2c1a'

// Deterministic pseudo-random in [0,1) so per-dot timings are stable across renders.
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
        out.push({ cx, cy, i })
      }
      i++
    }
  }
  return out
})()

/**
 * @param {number}  size      rendered px (square)
 * @param {boolean} running   when true, dots twinkle; when false, hold static
 * @param {string}  className optional wrapper class
 */
export default function StatusWave({ size = 260, running = true, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      className={className}
      role="img"
      aria-label="Operator"
      style={{ overflow: 'visible' }}
    >
      {DOTS.map(({ cx, cy, i }) => {
        if (!running) {
          // static: flat gray, no scale (also the prefers-reduced-motion fallback)
          return <circle key={i} cx={cx} cy={cy} r={R} fill={GRAY} opacity={0.55} />
        }
        const dur = 3.4 + rand(i) * 2.4 // ~[3.4s, 5.8s] — slow, calm shimmer
        const delay = -(rand(i + 99) * dur) // negative → start mid-cycle, desynced
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R}
            fill={GRAY}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `sw-twinkle ${dur.toFixed(3)}s ease-in-out ${delay.toFixed(3)}s infinite`,
            }}
          />
        )
      })}
    </svg>
  )
}
