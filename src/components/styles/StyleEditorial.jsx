import { AppleGlyph, PHOTO, DOWNLOAD_URL, GITHUB_URL } from './_shared.jsx'

// OPTION 04 — EDITORIAL NOIR
// A moody fashion-magazine spread: warm near-black, cream type, a single brushed-gold
// accent, and a high-contrast Didone display set large in italic. Quiet, expensive.
const didone = { fontFamily: "'Playfair Display', Georgia, serif" }
const serif = { fontFamily: "'Spectral', Georgia, serif" }
const mono = { fontFamily: "'Courier Prime', monospace" }

export default function StyleEditorial() {
  return (
    <div className="bg-[#0e0d0c] text-[#f2ece1]" style={serif}>
      <section className="relative isolate flex min-h-[92vh] flex-col overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <img
          {...PHOTO}
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-[62%_24%]"
          style={{ filter: 'grayscale(.55) sepia(.25) brightness(.62) contrast(1.08)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20"
          style={{ background: 'linear-gradient(180deg,rgba(14,13,12,.72) 0%,rgba(14,13,12,.4) 40%,rgba(14,13,12,.66) 78%,#0e0d0c 100%)' }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-1 flex-col">
          {/* thin top line */}
          <div className="flex items-center justify-between border-b border-[#c8a24a]/40 pb-3 text-[10.5px] uppercase tracking-[0.34em] text-[#c8a24a]" style={mono}>
            <span>Operator</span>
            <span className="hidden sm:inline">For Claude Code · macOS</span>
            <span>Issue 1953</span>
          </div>

          <div className="mt-auto max-w-3xl pb-6 pt-24">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#c8a24a]" style={mono}>The Operator</span>
            <h1 className="mt-5 text-[clamp(2.8rem,8vw,5.6rem)] italic leading-[0.98] tracking-[-0.01em] text-balance" style={didone}>
              Mission control for working&nbsp;agents.
            </h1>
            <div className="mt-6 h-px w-24 bg-[#c8a24a]" />
            <p className="mt-6 max-w-[46ch] text-[1.12rem] leading-relaxed text-[#f2ece1]/80">
              A macOS desktop app that observes Claude Code — rebuilding a live orchestration
              timeline from session transcripts, running work in isolated git worktrees, and
              reviewing diffs without leaving the window.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href={DOWNLOAD_URL}
                className="group inline-flex items-center gap-2.5 border border-[#c8a24a] px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-[#c8a24a] transition-colors hover:bg-[#c8a24a] hover:text-[#0e0d0c]"
                style={mono}
              >
                <AppleGlyph /> Download for macOS
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] uppercase tracking-[0.18em] text-[#f2ece1]/70 underline-offset-4 hover:text-[#f2ece1] hover:underline"
                style={mono}
              >
                Source on GitHub
              </a>
            </div>
          </div>

          <p className="border-t border-[#f2ece1]/15 pt-3 text-[10px] uppercase tracking-[0.2em] text-[#f2ece1]/45" style={mono}>
            Plate — A switchboard operator at the cord board, circa 1953
          </p>
        </div>
      </section>

      <footer className="border-t border-[#c8a24a]/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[1.9rem] italic leading-none" style={didone}>Operator</div>
            <p className="mt-3 max-w-xs text-[0.98rem] leading-relaxed text-[#f2ece1]/60">
              Mission control for working agents — you run them, Operator makes the work visible.
            </p>
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-[#f2ece1]/45" style={mono}>
            <div>© 2026 — juanmnl</div>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[#c8a24a] hover:underline">GitHub ↗</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
