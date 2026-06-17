import { GITHUB_URL } from '../site.js'

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-deep/40">
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <img src="/mark-light.svg" alt="" width="26" height="26" className="shrink-0" />
              <span className="font-display text-[1.1rem] font-700 tracking-tight text-text">Operator</span>
              <span className="ml-1 rounded-[3px] border border-cream/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-cream/55">
                est. ’53 · rebuilt
              </span>
            </a>
            <p className="mt-3 max-w-xs text-[0.92rem] leading-relaxed text-text/55">
              Mission control for working agents. The switchboard operator connected the calls by
              hand; Operator connects your agents — and makes the work visible and steerable.
            </p>
          </div>

          <nav className="flex gap-12 font-mono text-[12px]">
            <div>
              <div className="mb-3 text-[10px] uppercase tracking-wider text-faint">Product</div>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-muted transition-colors hover:text-text">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how" className="text-muted transition-colors hover:text-text">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#cost" className="text-muted transition-colors hover:text-text">
                    Usage & cost
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-[10px] uppercase tracking-wider text-faint">More</div>
              <ul className="space-y-2">
                <li>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted transition-colors hover:text-text"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#download" className="text-muted transition-colors hover:text-text">
                    Download
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            Built by{' '}
            <a
              href="https://juanmnl.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted transition-colors hover:text-text"
            >
              juanmnl
            </a>
          </span>
          <span className="text-faint/80">
            React 19 + Vite + Tailwind 4 on Tauri 2 (Rust) · embedded PTY + transcript tailer
          </span>
        </div>
      </div>
    </footer>
  )
}
