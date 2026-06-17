import { AppleGlyph, PHOTO, DOWNLOAD_URL, GITHUB_URL } from './_shared.jsx'

// OPTION 01 — THE BULLETIN
// A 1950s telephone-company manual: cream stock, sepia ink, oxblood accent. Full-bleed
// duotone operator photo under a real ruled masthead; headline set low-left like a cover.
const slab = { fontFamily: "'Zilla Slab', Georgia, serif" }
const serif = { fontFamily: "'Spectral', Georgia, serif" }
const mono = { fontFamily: "'Courier Prime', monospace" }

export default function StyleBulletin() {
  return (
    <div className="bg-[#ece1c9] text-[#2c2114]" style={serif}>
      {/* ── cover ── */}
      <section className="relative isolate flex min-h-[92vh] flex-col overflow-hidden px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <img
          {...PHOTO}
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-[58%_28%]"
          style={{ filter: 'grayscale(.38) sepia(.5) contrast(1.06) brightness(.99) saturate(.82)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(180deg,rgba(26,18,10,.78) 0%,rgba(26,18,10,.42) 26%,rgba(26,18,10,.5) 58%,rgba(36,26,14,.84) 90%,#ece1c9 100%),radial-gradient(120% 92% at 60% 40%,transparent 20%,rgba(18,12,6,.7) 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.22] mix-blend-multiply"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(20,14,6,.6) .5px,transparent 1px)', backgroundSize: '4px 4px' }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-3 -z-10 border border-[#f6efdc]/30 sm:inset-5" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col text-[#f6efdc]">
          {/* masthead */}
          <header className="pt-5">
            <div className="flex items-end justify-between gap-4 border-b-[3px] border-[#f6efdc]/70 pb-2">
              <h1 className="text-[clamp(1.5rem,4.4vw,2.7rem)] font-700 uppercase leading-none tracking-[-0.01em]" style={slab}>
                The&nbsp;Operator
              </h1>
              <div className="hidden text-right text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#f6efdc]/75 sm:block" style={mono}>
                <div>For users of Claude&nbsp;Code</div>
                <div>Bulletin No.&nbsp;1953 — macOS</div>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-4 border-b border-[#f6efdc]/30 pb-2 text-[11px] text-[#f6efdc]/75" style={mono}>
              <span className="italic" style={serif}>A field manual for running Claude Code agents.</span>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hidden uppercase tracking-[0.14em] hover:text-[#f6efdc] sm:inline">
                Source ↗
              </a>
            </div>
          </header>

          {/* headline, lower-left */}
          <div className="mt-auto max-w-3xl pb-4 pt-20">
            <h2 className="text-[clamp(2.6rem,7.4vw,4.9rem)] font-700 leading-[0.94] tracking-[-0.015em] text-balance" style={slab}>
              Mission control for working agents.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.3rem] italic leading-snug" style={slab}>
              <span className="text-[#d6694f]">Every call once ran through an operator.</span>{' '}
              Now every agent runs through yours.
            </p>
            <p className="mt-5 max-w-xl text-[1.08rem] leading-relaxed text-[#f6efdc]/85">
              A macOS desktop app that observes Claude Code — rebuilding a live orchestration
              timeline from session transcripts, running work in isolated git worktrees, and
              reviewing diffs without ever leaving the window.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-[12px]" style={mono}>
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center gap-2 bg-[#9a3324] px-5 py-3 font-700 uppercase tracking-wider text-[#f6efdc] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{ boxShadow: '4px 4px 0 0 rgba(20,14,6,.45)' }}
              >
                <AppleGlyph /> Download for macOS
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#f6efdc]/70 px-5 py-[10px] font-700 uppercase tracking-wider text-[#f6efdc] transition-colors hover:bg-[#f6efdc] hover:text-[#2c2114]"
              >
                Source on GitHub
              </a>
            </div>
          </div>

          {/* fig. caption rail */}
          <div className="flex items-baseline gap-3 border-t border-[#f6efdc]/25 pt-3 text-[10px] uppercase tracking-[0.14em] text-[#f6efdc]/55" style={mono}>
            <span className="text-[#f6efdc]/80">Fig. 1</span>
            <span>Operator at the cord board, c. 1953</span>
            <span className="ml-auto hidden sm:inline">Free — ~10 MB — Tauri 2</span>
          </div>
        </div>
      </section>

      {/* ── colophon ── */}
      <footer className="border-t-[3px] border-[#2c2114]/80 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <img src="/mark-light.svg" alt="" width="24" height="24" />
              <span className="text-[1.2rem] font-700 uppercase tracking-tight" style={slab}>The Operator</span>
            </div>
            <p className="mt-3 text-[1.05rem] italic leading-snug text-[#2c2114]/70" style={slab}>
              Mission control for working agents.
            </p>
          </div>
          <div className="text-[11px] uppercase leading-loose tracking-[0.12em] text-[#6c5b3f]" style={mono}>
            <div>Published for users of Claude Code</div>
            <div>macOS — Apple silicon &amp; Intel — ~10 MB</div>
            <div>Set in Zilla Slab, Spectral &amp; Courier Prime</div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1180px] items-center justify-between border-t border-[#c3ad84] pt-5 text-[11px] text-[#9b865f]" style={mono}>
          <span>© 2026 — built by juanmnl</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-[#2c2114]">GitHub ↗</a>
        </div>
      </footer>
    </div>
  )
}
