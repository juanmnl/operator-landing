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
  return (
    <svg width="13" height="15" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11.7 12.9c-.2.5-.5 1-.8 1.5-.5.7-.9 1.2-1.2 1.4-.5.4-1 .6-1.5.6-.4 0-.9-.1-1.4-.3-.5-.2-1-.3-1.4-.3-.4 0-.9.1-1.5.3-.5.2-1 .3-1.3.3-.5 0-1-.2-1.5-.6-.4-.3-.8-.8-1.3-1.5C.4 13.3 0 12 0 10.8c0-1.3.3-2.4.9-3.3.4-.7 1-1.3 1.7-1.7.7-.4 1.4-.6 2.2-.6.4 0 1 .1 1.6.4.6.2 1 .4 1.2.4.1 0 .6-.2 1.4-.5.7-.3 1.4-.4 1.9-.4 1.4.1 2.5.7 3.2 1.7-1.3.8-1.9 1.9-1.9 3.3 0 1.1.4 2 1.2 2.7.3.3.7.6 1.1.7-.1.3-.2.5-.3.8zM9.3 0c0 .9-.3 1.8-1 2.6-.8.9-1.7 1.5-2.7 1.4 0-.1 0-.2 0-.3 0-.9.4-1.9 1-2.6.3-.4.8-.7 1.3-1C8.7.1 9.1 0 9.3 0z" />
    </svg>
  )
}
