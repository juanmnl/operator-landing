import { AppleGlyph, PHOTO, DOWNLOAD_URL, GITHUB_URL } from './_shared.jsx'

// OPTION 03 — BRUTALIST SWISS
// Stark paper-white, hard black hairlines on a strict grid, one hot-red signal. Oversized
// tightly-tracked grotesque. The photo sits in a bordered, desaturated plate. Raw, loud.
const grot = { fontFamily: "'Archivo', system-ui, sans-serif" }
const mono = { fontFamily: "'JetBrains Mono', monospace" }

export default function StyleBrutalist() {
  return (
    <div className="bg-[#f3f1ea] text-[#111110]" style={grot}>
      <section className="mx-auto min-h-[92vh] max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* top rule / nameplate */}
        <div className="flex items-end justify-between border-b-2 border-[#111110] pb-2 text-[11px] font-700 uppercase tracking-[0.12em]" style={mono}>
          <span>Operator™</span>
          <span className="hidden sm:inline">Mission control / for working agents</span>
          <span className="text-[#e8472b]">No. 01</span>
        </div>

        <div className="grid grid-cols-1 gap-px lg:grid-cols-12">
          {/* headline block */}
          <div className="lg:col-span-7 lg:border-r-2 lg:border-[#111110] lg:pr-8">
            <h1 className="mt-8 text-[clamp(3.2rem,11vw,8rem)] font-900 uppercase leading-[0.82] tracking-[-0.04em]">
              Mission<br />control.
            </h1>
            <div className="mt-6 h-2 w-full bg-[#e8472b]" />
            <p className="mt-6 max-w-[36ch] text-[1.15rem] font-500 leading-snug">
              A macOS desktop app that observes Claude Code — a live orchestration timeline,
              isolated git worktrees, in-window diff review.
            </p>

            <div className="mt-8 flex flex-wrap items-stretch gap-3 text-[12px] font-700 uppercase tracking-wide" style={mono}>
              <a href={DOWNLOAD_URL} className="inline-flex items-center gap-2 bg-[#111110] px-5 py-3 text-[#f3f1ea] transition-colors hover:bg-[#e8472b]">
                <AppleGlyph /> Download
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center border-2 border-[#111110] px-5 py-[10px] transition-colors hover:bg-[#111110] hover:text-[#f3f1ea]">
                GitHub
              </a>
            </div>
          </div>

          {/* photo plate */}
          <div className="lg:col-span-5 lg:pl-8">
            <div className="mt-8 border-2 border-[#111110]">
              <div className="flex items-center justify-between border-b-2 border-[#111110] px-2 py-1 text-[10px] font-700 uppercase tracking-[0.14em]" style={mono}>
                <span>Fig. 1 — Operator, 1953</span>
                <span className="text-[#e8472b]">●</span>
              </div>
              <img
                {...PHOTO}
                className="block aspect-[4/5] w-full object-cover object-[58%_30%]"
                style={{ filter: 'grayscale(1) contrast(1.12) brightness(1.02)' }}
              />
            </div>
            <p className="mt-3 text-[11px] font-600 uppercase tracking-[0.1em] text-[#111110]/60" style={mono}>
              Built for Claude Code — macOS — Tauri 2 — ~10 MB
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[#111110]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-6 text-[11px] font-700 uppercase tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8" style={mono}>
          <span>Operator™ — © 2026 juanmnl</span>
          <span className="text-[#e8472b]">You run the agents. Operator makes the work visible.</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-[#e8472b]">GitHub →</a>
        </div>
      </footer>
    </div>
  )
}
