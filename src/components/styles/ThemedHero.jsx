import { OperatorMark, AppleGlyph, PHOTO, DOWNLOAD_URL, GITHUB_URL } from './_shared.jsx'

// One editorial hero + colophon, worn in any Operator theme. Composition and type
// stay constant; the palette (and the photo grade) come from the theme so every
// option reads as the same product in a different skin. The animated dot-mark
// twinkles in the theme's foreground with an accent glow.
const disp = { fontFamily: "'Sora', system-ui, sans-serif" }
const body = { fontFamily: "'Archivo', system-ui, sans-serif" }
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" }

export default function ThemedHero({ t, onCommand }) {
  const scrim = t.dark
    ? `linear-gradient(180deg, ${t.bg}e6 0%, ${t.bg}8c 24%, ${t.bg}73 52%, ${t.bg}d9 86%, ${t.bg} 100%), linear-gradient(90deg, ${t.bgDeep}c2 0%, transparent 58%)`
    : // light theme: a firm wash on the left so the dark copy stays readable; the
      // (brightened) photo still reads clearly toward the right
      `linear-gradient(90deg, ${t.bg}f2 0%, ${t.bg}e0 32%, ${t.bg}73 62%, ${t.bg}1a 100%), linear-gradient(180deg, transparent 44%, ${t.bg}cc 86%, ${t.bg} 100%)`

  // a soft halo so copy separates from the photo: light glow on the light theme, dark on dark
  const halo = t.dark
    ? '0 1px 20px rgba(0,0,0,0.5)'
    : '0 1px 12px rgba(247,247,245,0.92), 0 0 2px rgba(247,247,245,0.65)'

  return (
    <div className="flex min-h-[100svh] flex-col" style={{ background: t.bg, color: t.fg, ...body }}>
      <section className="relative isolate flex flex-1 flex-col overflow-hidden px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <img
          {...PHOTO}
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-[58%_28%]"
          style={{ filter: t.grade }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20" style={{ background: scrim }} />
        {/* faint dot-matrix signature, the brand lattice */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            opacity: t.dark ? 0.4 : 0.5,
            backgroundImage: `radial-gradient(circle, ${t.fg}${t.dark ? '1f' : '14'} 1.3px, transparent 1.8px)`,
            backgroundSize: '26px 26px',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 28% 60%, #000 20%, transparent 78%)',
            maskImage: 'radial-gradient(ellipse 85% 75% at 28% 60%, #000 20%, transparent 78%)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col">
          {/* masthead */}
          <header className="flex items-center justify-between gap-4 border-b py-2.5" style={{ borderColor: `${t.fg}40` }}>
            <span className="flex items-center gap-2">
              <OperatorMark size={18} dim={t.muted} bright={t.fg} glow={`${t.accent}2e`} />
              <span className="text-[13px] font-700 tracking-tight" style={disp}>Operator</span>
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden text-[10px] uppercase tracking-[0.18em] md:inline" style={{ ...mono, color: t.muted }}>
                For Claude&nbsp;Code
              </span>
              <button
                type="button"
                onClick={onCommand}
                aria-label="Open theme switcher"
                className="flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-[0.16em] transition-opacity hover:opacity-100"
                style={{ ...mono, color: `${t.fg}b3`, border: `1px solid ${t.fg}33`, opacity: 0.8 }}
              >
                <span style={{ color: t.accent }}>⌘K</span>
                <span className="hidden sm:inline">Theme</span>
              </button>
            </div>
          </header>

          {/* cover — copy on the left, the animated brand mark on the right */}
          <div className="my-auto grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.22em]" style={{ ...mono, color: t.accent }}>
                Mission control for working agents
              </div>

              <h1 className="mt-4 text-[clamp(2.5rem,6.6vw,4.4rem)] font-700 leading-[1.0] tracking-[-0.025em] text-balance" style={{ ...disp, textShadow: halo }}>
                You run the agents.<br />Operator runs the board.
              </h1>

              <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed" style={{ color: `${t.fg}eb`, textShadow: halo }}>
                A macOS desktop app that observes Claude Code — rebuilding a live orchestration
                timeline from session transcripts, running work in isolated git worktrees, and
                reviewing diffs without ever leaving the window.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-[13px]" style={mono}>
                <a
                  href={DOWNLOAD_URL}
                  className="inline-flex items-center gap-2 px-5 py-3 font-700 uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                  style={{ background: t.accent, color: t.accentFg, boxShadow: `0 10px 30px ${t.accent}3d` }}
                >
                  <AppleGlyph /> Download for macOS
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 uppercase tracking-wider transition-colors"
                  style={{ border: `1px solid ${t.fg}40`, color: `${t.fg}c0` }}
                >
                  View on GitHub
                </a>
                <span className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: t.muted }}>
                  Free · ~10 MB
                </span>
              </div>
            </div>

            {/* the animated Operator mark, anchored right, lifted toward the top */}
            <div className="hidden justify-self-end lg:block lg:-translate-y-[150px]">
              <OperatorMark size={300} cells={11} dim={t.muted} bright={t.fg} glow={`${t.accent}40`} />
            </div>
          </div>

        </div>
      </section>

      {/* colophon */}
      <footer className="px-4 py-10 sm:px-6 lg:px-8" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ ...mono, color: t.muted }}>
          <span className="flex items-center gap-2.5">
            <OperatorMark size={22} dim={t.muted} bright={t.fg} glow={`${t.accent}2e`} />
            <span>mission control for working agents</span>
          </span>
          <span>
            © 2026 · built by juanmnl ·{' '}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline" style={{ color: t.fg }}>
              GitHub ↗
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}

