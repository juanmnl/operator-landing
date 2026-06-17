import { AppleGlyph, PHOTO, DOWNLOAD_URL, GITHUB_URL } from './_shared.jsx'

// OPTION 02 — MISSION CONTROL
// The original near-black ops console: signal-green accent, full-bleed cool-graded photo,
// geometric grotesk headline, monospace instrumentation labels.
const disp = { fontFamily: "'Sora', system-ui, sans-serif" }
const body = { fontFamily: "'Archivo', system-ui, sans-serif" }
const mono = { fontFamily: "'JetBrains Mono', monospace" }

export default function StyleMissionControl() {
  return (
    <div className="bg-[#0b0d10] text-[#eef1f3]" style={body}>
      <section className="relative isolate flex min-h-[92vh] flex-col justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <img
          {...PHOTO}
          className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover object-[60%_26%]"
          style={{ filter: 'grayscale(.5) brightness(.7) contrast(1.05) saturate(.7)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(90deg,rgba(7,9,11,.94) 0%,rgba(7,9,11,.8) 38%,rgba(7,9,11,.5) 70%,rgba(7,9,11,.7) 100%),linear-gradient(0deg,#0b0d10 2%,transparent 30%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(circle,rgba(238,241,243,.11) 1.4px,transparent 2px)',
            backgroundSize: '26px 26px',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 30% 50%,#000 25%,transparent 80%)',
            maskImage: 'radial-gradient(ellipse 80% 70% at 30% 50%,#000 25%,transparent 80%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 -z-20 h-[460px] w-[460px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(47,227,154,.12),transparent 65%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 mx-auto w-full max-w-[1180px]">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#2fe39a]" style={mono}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2fe39a]" style={{ boxShadow: '0 0 8px #2fe39a' }} />
            Operator — live
          </div>
          <h2 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,6.6vw,4.4rem)] font-600 leading-[1.02] tracking-[-0.03em]" style={disp}>
            Mission control for working agents.
          </h2>
          <p className="mt-6 max-w-xl text-[1.06rem] leading-relaxed text-[#eef1f3]/70">
            A macOS desktop app that observes Claude Code. It tails session transcripts to rebuild a
            live orchestration timeline — every tool call and subagent, nested by who-spawned-whom —
            and runs work in isolated git worktrees.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 text-[13px]" style={mono}>
            <a
              href={DOWNLOAD_URL}
              className="inline-flex items-center gap-2 bg-[#2fe39a] px-5 py-3 font-500 text-[#04130d] transition-transform hover:-translate-y-0.5"
              style={{ boxShadow: '0 10px 30px rgba(47,227,154,.25)' }}
            >
              <AppleGlyph /> Download for macOS
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#2a313a] px-5 py-3 uppercase tracking-wider text-[#8a94a0] transition-colors hover:border-[#2fe39a]/50 hover:text-[#eef1f3]"
            >
              View on GitHub
            </a>
            <span className="text-[10.5px] uppercase tracking-[0.14em] text-[#5a626c]">macOS · Tauri 2 · ~10 MB</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#21272f] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-[11px] text-[#5a626c] sm:flex-row sm:items-center sm:justify-between" style={mono}>
          <span className="flex items-center gap-2.5">
            <img src="/mark.svg" alt="" width="20" height="20" />
            <span className="text-[13px] tracking-tight text-[#eef1f3]" style={disp}>Operator</span>
            <span className="ml-2 text-[#5a626c]">mission control for working agents</span>
          </span>
          <span>© 2026 · built by juanmnl · <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-[#eef1f3]">GitHub ↗</a></span>
        </div>
      </footer>
    </div>
  )
}
