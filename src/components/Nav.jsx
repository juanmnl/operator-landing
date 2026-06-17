import { useEffect, useState } from 'react'
import { DOWNLOAD_URL, GITHUB_URL } from '../site.js'

// A utilitarian application menu-bar, NOT a marketing nav. Left-aligned mono wordmark with a
// live status indicator and a build string; section links sit as small tab-stops; actions are
// pushed hard to the right; a single thin ruled underline. Reads like the top chrome of the
// actual app, not centered-links-with-a-pill.

const LINKS = [
  { href: '#features', label: 'capabilities' },
  { href: '#how', label: 'observer' },
  { href: '#cost', label: 'cost' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (a) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg-deep/80 backdrop-blur-md">
      <nav className="flex h-12 items-stretch font-mono text-[12px]">
        {/* wordmark cell — boxed off like an app identity badge */}
        <a
          href="#top"
          aria-label="Operator"
          className="flex items-center gap-2.5 border-r border-line px-4 sm:px-5"
        >
          <img src="/mark-light.svg" alt="" width="20" height="20" className="shrink-0" />
          <span className="font-display text-[14px] font-700 tracking-tight text-text">Operator</span>
        </a>

        {/* live status cell */}
        <span className="hidden items-center gap-2 border-r border-line px-4 text-faint sm:flex">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="uppercase tracking-[0.14em] text-accent">live</span>
          <span className="text-line">/</span>
          <span className="tabular-nums">v0.9.2</span>
        </span>

        {/* section tab-stops */}
        <div className="hidden flex-1 items-stretch lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center border-r border-line px-4 lowercase tracking-wide text-muted transition-colors hover:bg-surface/60 hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* spacer for non-lg */}
        <div className="flex-1 lg:hidden" />

        {/* actions hard right */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="hidden items-center border-l border-line px-4 uppercase tracking-wider text-muted transition-colors hover:bg-surface/60 hover:text-text sm:flex"
        >
          github
        </a>
        <a
          href={DOWNLOAD_URL}
          className="hidden items-center gap-1.5 border-l border-line bg-accent/[0.08] px-4 uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-cream sm:flex"
        >
          download
        </a>

        {/* hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-12 items-center justify-center border-l border-line text-text lg:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] h-px w-full bg-current transition-opacity duration-200 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${
                open ? '-translate-y-[5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      {/* mobile menu panel */}
      <div
        className={`grid overflow-hidden border-t border-line bg-bg/95 backdrop-blur-md transition-[grid-template-rows] duration-300 lg:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-transparent'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="border-b border-line px-5 py-3.5 font-mono text-[12px] lowercase tracking-wider text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href={DOWNLOAD_URL}
            className="block w-full bg-accent/10 px-5 py-4 text-center font-mono text-[12px] uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-cream"
          >
            Download for macOS
          </a>
        </div>
      </div>
    </header>
  )
}
