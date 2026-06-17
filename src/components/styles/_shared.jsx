// Shared atoms for the style-exploration gallery. Each style component is fully
// self-contained on color + font (it does NOT depend on the global @theme tokens),
// so the variants can sit on one page without fighting each other.
export { DOWNLOAD_URL, GITHUB_URL } from '../../site.js'

export const PHOTO = {
  src: '/hero.jpg',
  srcSet: '/hero-sm.jpg 1100w, /hero.jpg 1920w',
  sizes: '100vw',
  alt: 'A 1950s telephone operator connecting calls at a switchboard',
}

// ── the Operator brand mark, animated ──────────────────────────────────────
// The dot-disc that twinkles dim→bright for a soft "thinking" shimmer, with a
// breathing glow behind it. Colors are configurable so it reads on any palette.
const DR = 0.5
function rand(i) {
  const v = (Math.sin(i * 12.9898) * 43758.5453) % 1
  return v < 0 ? v + 1 : v
}
// Build the dot disc for an N×N lattice (default 7 = the true brand grid). Larger N gives
// a finer, denser disc for big renders. Cached per resolution.
function buildDots(cells) {
  const center = cells / 2
  const radius = center - 0.1
  const out = []
  let i = 0
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const cx = col + 0.5
      const cy = row + 0.5
      const dx = cx - center
      const dy = cy - center
      if (dx * dx + dy * dy <= radius * radius * 1.04) out.push({ cx, cy, i })
      i++
    }
  }
  return out
}
const DOTS_CACHE = {}
const dotsFor = (cells) => (DOTS_CACHE[cells] ||= buildDots(cells))

export function OperatorMark({ size = 120, cells = 7, dim = '#5b6168', bright = '#f6f8f7', glow = 'rgba(246,248,247,0.14)', className = '' }) {
  const dots = dotsFor(cells)
  return (
    <div className={`relative grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <div
        aria-hidden
        className="mark-glow pointer-events-none absolute inset-[-32%] rounded-full"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 62%)` }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${cells} ${cells}`}
        role="img"
        aria-label="Operator"
        style={{ overflow: 'visible', '--dot-dim': dim, '--dot-bright': bright }}
      >
        {dots.map(({ cx, cy, i }) => {
          const dur = 3.4 + rand(i) * 2.4
          const delay = -(rand(i + 99) * dur)
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={DR}
              fill={dim}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: `mark-twinkle ${dur.toFixed(2)}s ease-in-out ${delay.toFixed(2)}s infinite`,
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}

export function AppleGlyph({ className = '' }) {
  // Apple's own logo proportions (viewBox 814×1000), crisp at any size.
  return (
    <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8-67.7 0-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  )
}
