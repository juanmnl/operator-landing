import Plate from './Plate.jsx'

// The problem: parallel Claude Code sessions scattered across terminals. We show four
// little terminal cards tilted at angles — one with a permission prompt you'd miss, one
// that collided on the same repo — then resolve it into Operator's single pane.

// Each session is a lit line on a switchboard nobody is tending — a glowing jack lamp
// (green = running, amber = waiting on you, red = collided), a line number, and the
// session name on the card's top rail.
const terms = [
  {
    tilt: '-rotate-2',
    title: 'refactor',
    lamp: 'live',
    lines: ['⏺ Editing session.ts…', '⏺ Running tests…'],
    foot: 'no idea who delegated what',
  },
  {
    tilt: 'rotate-1',
    title: 'write-tests',
    lamp: 'warn',
    lines: ['⚠ Allow Edit auth.ts? (y/n)', '   …waiting for you'],
    foot: 'a prompt you didn’t see',
    warn: true,
  },
  {
    tilt: '-rotate-1',
    title: 'deploy-fix',
    lamp: 'bad',
    lines: ['⏺ git: merge conflict', '   both touched config.ts'],
    foot: 'tripping over each other',
    bad: true,
  },
  {
    tilt: 'rotate-2',
    title: 'docs',
    lamp: 'live',
    lines: ['⏺ Read README…', '⏺ 4m 12s elapsed?'],
    foot: 'how long? what’s it cost?',
  },
]

// jack-lamp colors keyed off each line's state
const LAMP = {
  live: 'bg-accent shadow-[0_0_7px_1px_var(--color-accent)]',
  warn: 'bg-warn shadow-[0_0_7px_1px_var(--color-warn)]',
  bad: 'bg-[#b23a2a] shadow-[0_0_7px_1px_#b23a2a]',
}

export default function Problem() {
  return (
    <section id="problem" className="relative border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* left-aligned, two-column header — copy left, the consequence list right */}
        <div className="reveal grid gap-8 border-b border-line pb-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <Plate no="01" label="The Problem" />
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.55rem,3.3vw,2.25rem)] font-600 leading-[1.1] tracking-tight">
              Five lines lit up, and no one at the board.
            </h2>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-text/65">
              You want several Claude Code sessions running at once — one refactoring, one writing
              tests, one debugging a deploy. But each lives in its own terminal, ringing on its own,
              with no operator watching the whole switchboard.
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-px self-center font-mono text-[12px]">
            {[
              'permission prompts you never see',
              'no idea who delegated to whom',
              'parallel runs collide on the same repo',
              "no sense of how long — or what it cost",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 border-l-2 border-line py-2 pl-3 text-muted"
              >
                <span className="text-[#b23a2a]">×</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {terms.map((t, i) => (
            <div
              key={t.title}
              className={`group ${t.tilt} rounded-lg border border-line bg-surface/70 transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-2 border-b border-line px-3 py-2">
                <span className={`h-2 w-2 rounded-full ${LAMP[t.lamp]}`} />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
                  line {String(i + 1).padStart(2, '0')}
                </span>
                <span className="ml-auto font-mono text-[10px] text-faint">{t.title}</span>
              </div>
              <div className="px-3 py-3 font-mono text-[10.5px] leading-relaxed">
                {t.lines.map((l, i) => (
                  <div
                    key={i}
                    className={
                      t.warn && i === 0
                        ? 'text-warn'
                        : t.bad && i === 0
                          ? 'text-[#b23a2a]'
                          : 'text-muted'
                    }
                  >
                    {l}
                  </div>
                ))}
                <div className="mt-2.5 border-t border-line-soft pt-2 text-[9.5px] uppercase tracking-wide text-faint">
                  {t.foot}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* the resolution line — left-aligned, like a log entry */}
        <div className="reveal mt-10 flex items-center gap-3 border-t border-line pt-6 font-mono text-[12px] text-muted">
          <span className="text-faint">loose lines</span>
          <span className="text-accent">→</span>
          <span className="text-text">one board, one operator</span>
          <span className="h-px flex-1 bg-line" />
          <a
            href="#features"
            className="uppercase tracking-wider text-accent transition-colors hover:text-text"
          >
            take the board →
          </a>
        </div>
      </div>
    </section>
  )
}
