import Timeline from './Timeline.jsx'
import { DOWNLOAD_URL, GITHUB_URL } from '../site.js'

// ── HERO ───────────────────────────────────────────────────────────────────
// The cover page of a telephone-company manual. A ruled masthead names the
// publication; a serif headline and standfirst sit on the left; the switchboard
// operator is printed on the right as a captioned duotone figure plate. The
// reconstructed orchestration timeline follows as Fig. 2 — a sample readout.
// The conceptual anchor holds: the operator once connected the calls by hand;
// Operator connects and orchestrates the agents.

export default function Hero() {
  return (
    <>
      {/* ── the cover: full-bleed operator photograph, printed as a duotone ── */}
      <section
        id="top"
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:px-8"
      >
        <img
          src="/hero.jpg"
          srcSet="/hero-sm.jpg 1100w, /hero.jpg 1920w"
          sizes="100vw"
          alt="A 1950s telephone operator connecting calls at a switchboard"
          fetchpriority="high"
          decoding="async"
          className="plate-photo boot-in pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-[58%_28%]"
        />
        <div aria-hidden className="hero-archival-scrim pointer-events-none absolute inset-0 -z-20" />
        <div aria-hidden className="plate-halftone pointer-events-none absolute inset-0 -z-20" />
        {/* printed page frame — a cream double rule inset from the bleed edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 -z-10 border border-cream/30 sm:inset-5"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-1 flex-col">
          {/* ── ruled masthead, in paper ink over the photo ── */}
          <div className="boot-in flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y-2 border-cream/55 py-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-cream/80">
            <span className="font-700 text-cream">The Operator</span>
            <span className="hidden sm:inline">Mission-Control Division</span>
            <span>Bulletin No. 1953</span>
          </div>

          {/* ── cover copy, set on the lower-left like a printed plate caption ── */}
          <div className="boot-in mt-auto max-w-2xl pb-6 pt-16">
            <Eyebrow />
            <span className="mt-4 inline-flex items-center gap-2 border border-cream/55 px-2.5 py-1 font-mono text-[10px] font-700 uppercase tracking-[0.18em] text-cream/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Built for Claude Code
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.6rem)] font-700 leading-[0.96] tracking-tight text-cream text-balance">
              Mission control for working agents.
            </h1>

            <p className="mt-6 max-w-[40ch] border-l-2 border-accent pl-4 font-display text-[1.22rem] italic leading-snug text-cream/95">
              Every call once ran through an operator. Now every agent runs through yours.
            </p>

            <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-cream/85">
              A macOS desktop app that observes Claude Code — it rebuilds a live orchestration
              timeline from session transcripts, runs work in isolated git worktrees, and lets you
              review and commit diffs without leaving the window.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={DOWNLOAD_URL}
                className="letterpress group inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-[13px] font-700 uppercase tracking-wider text-cream transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <AppleGlyph />
                Download for macOS
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border-2 border-cream/70 px-5 py-[10px] font-mono text-[12px] font-700 uppercase tracking-wider text-cream transition-colors hover:bg-cream hover:text-text"
              >
                View on GitHub
              </a>
            </div>

            <span className="mt-6 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/55">
              macOS · Tauri 2 · ~10 MB · nothing else to install
            </span>
          </div>

          <figcaption className="boot-in flex items-baseline gap-2 border-t border-cream/25 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/60">
            <span className="font-700 text-cream/90">Fig. 1</span>
            <span className="h-px flex-1 bg-cream/20" />
            <span className="text-right">Operator at the cord board, c. 1953</span>
          </figcaption>
        </div>
      </section>

      {/* ── Fig. 2 — the reconstructed orchestration timeline, on the page stock ── */}
      <div className="px-4 pb-4 pt-16 sm:px-6 lg:px-8">
        <figure className="boot-in mx-auto w-full max-w-[860px]">
          <figcaption className="mb-3 flex items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
            <span className="font-700 text-accent">Fig. 2</span>
            <span className="h-px w-10 bg-line" />
            <span>Reconstructed from a live session</span>
          </figcaption>
          <Timeline />
        </figure>
      </div>
    </>
  )
}

// the publication eyebrow — small caps flanked by rules, like a section mark in the manual
function Eyebrow() {
  return (
    <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-cream/70">
      <span className="inline-block h-px w-8 bg-cream/35" />
      Operator
      <span className="inline-block h-px w-8 bg-cream/35" />
    </span>
  )
}

function AppleGlyph() {
  return (
    <svg width="13" height="15" viewBox="0 0 14 17" fill="currentColor" aria-hidden="true">
      <path d="M11.7 12.9c-.2.5-.5 1-.8 1.5-.5.7-.9 1.2-1.2 1.4-.5.4-1 .6-1.5.6-.4 0-.9-.1-1.4-.3-.5-.2-1-.3-1.4-.3-.4 0-.9.1-1.5.3-.5.2-1 .3-1.3.3-.5 0-1-.2-1.5-.6-.4-.3-.8-.8-1.3-1.5C.4 13.3 0 12 0 10.8c0-1.3.3-2.4.9-3.3.4-.7 1-1.3 1.7-1.7.7-.4 1.4-.6 2.2-.6.4 0 1 .1 1.6.4.6.2 1 .4 1.2.4.1 0 .6-.2 1.4-.5.7-.3 1.4-.4 1.9-.4 1.4.1 2.5.7 3.2 1.7-1.3.8-1.9 1.9-1.9 3.3 0 1.1.4 2 1.2 2.7.3.3.7.6 1.1.7-.1.3-.2.5-.3.8zM9.3 0c0 .9-.3 1.8-1 2.6-.8.9-1.7 1.5-2.7 1.4 0-.1 0-.2 0-.3 0-.9.4-1.9 1-2.6.3-.4.8-.7 1.3-1C8.7.1 9.1 0 9.3 0z" />
    </svg>
  )
}
