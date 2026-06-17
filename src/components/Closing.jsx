import StatusWave from './StatusWave.jsx'
import Plate from './Plate.jsx'
import { DOWNLOAD_URL, GITHUB_URL } from '../site.js'

// Closing CTA as a terminal session, not a centered marketing block. A prompt line invites
// the download; the big StatusWave dot-circle mark glows behind it. Asymmetric, left-anchored.
export default function Closing() {
  return (
    <section id="download" className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-dotmatrix opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.07]">
        <StatusWave size={460} running={false} />
      </div>
      <div className="pointer-events-none absolute left-[20%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <Plate no="05" label="Take the Board" />
          <div className="mt-5 inline-flex items-center gap-2 border border-line bg-bg-deep/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            free · private project
          </div>

          {/* the prompt */}
          <div className="mt-7 corner-ticks relative border border-line bg-surface/40 p-5 sm:p-7">
            <div className="font-mono text-[12px] leading-relaxed text-muted">
              <span className="text-accent">operator</span>
              <span className="text-faint"> ~/dev $ </span>
              <span className="text-text">take the board</span>
              <span className="caret ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-accent" />
            </div>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(1.8rem,4vw,2.7rem)] font-600 leading-[1.04] tracking-tight">
              Give your agents a mission-control room.
            </h2>
            <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-text/65">
              For individual developers and small teams running Claude Code. One signed, notarized,
              self-updating macOS app.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-[14px] font-500 text-cream transition-transform hover:-translate-y-0.5"
              >
                Download for macOS
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-muted transition-colors hover:border-accent/40 hover:text-text"
              >
                View on GitHub
              </a>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
                Apple silicon & Intel · ~10 MB
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
