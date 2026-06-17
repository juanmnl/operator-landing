import Plate from './Plate.jsx'

// The six capabilities as a BENTO grid — deliberately varied cell spans and densities so it
// never marches in a uniform 2-col cadence. Each cell carries a small bespoke in-browser
// visual (no screenshots). Cells are bracketed with viewfinder corner-ticks and indexed
// like jacks on a patch panel.

function CellHead({ n, tag }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
      <span className="tabular-nums text-warn">{n}</span>
      <span className="h-px flex-1 bg-line" />
      <span className="text-muted">{tag}</span>
    </div>
  )
}

// ── 1. Agent library with per-task models ─────────────────────────────────
function AgentLibraryViz() {
  const rows = [
    { name: 'extract-types', model: 'haiku', cls: 'badge-haiku', hint: 'cheap · fast' },
    { name: 'general', model: 'sonnet', cls: 'badge-sonnet', hint: 'balanced', active: true },
    { name: 'architect', model: 'opus', cls: 'badge-opus', hint: 'hard reasoning' },
  ]
  return (
    <div className="rounded-lg border border-line bg-bg-deep/50 p-3">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-faint">
        .claude/agents/
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className={`flex items-center gap-2 rounded-md border px-2.5 py-2 ${
              r.active ? 'border-accent/30 bg-accent/[0.06]' : 'border-line bg-surface/50'
            }`}
          >
            <span className="font-mono text-[12px] text-text">{r.name}</span>
            <span className="ml-auto font-mono text-[9.5px] text-faint">{r.hint}</span>
            <span
              className={`${r.cls} rounded-[3px] border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide`}
            >
              {r.model}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[9.5px] text-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-haiku" />
        cheap
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-sonnet" />
        general
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-opus" />
        hard
        <span className="ml-auto text-muted">cost / speed at the point of choice</span>
      </div>
    </div>
  )
}

// ── 2. live-timeline recap (the hero viz is the real one) ──────────────────
function TimelineRecapViz() {
  return (
    <div className="rounded-lg border border-line bg-bg-deep/50 p-3 font-mono text-[10.5px]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-accent">▸</span>
          <span className="text-text">orchestrator</span>
          <span className="badge-opus ml-auto rounded-[3px] border px-1 text-[9px] uppercase">
            opus
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <span className="text-muted">⤷ delegate</span>
          <span className="badge-haiku ml-auto rounded-[3px] border px-1 text-[9px] uppercase">
            haiku
          </span>
          <span className="text-faint">2.1s</span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <span className="text-accent">◆ Edit</span>
          <span className="ml-auto inline-flex items-center gap-1 text-accent">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            3.4s
          </span>
        </div>
      </div>
      <div className="mt-2.5 border-t border-line-soft pt-2 text-[9.5px] text-faint">
        nested by who-spawned-whom · live-ticking durations
      </div>
    </div>
  )
}

// ── 3. Isolated worktrees + fan-out ───────────────────────────────────────
function WorktreeViz() {
  const trees = ['agent-1', 'agent-2', 'agent-3']
  return (
    <div className="rounded-lg border border-line bg-bg-deep/50 p-3">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px]">
        <span className="rounded-[3px] border border-line bg-surface px-1.5 py-0.5 text-muted">
          main
        </span>
        <span className="text-faint">fan-out × 3</span>
      </div>
      <div className="relative grid grid-cols-3 gap-2">
        {trees.map((t, i) => (
          <div key={t} className="rounded-md border border-line bg-surface/60 p-2 text-center">
            <div className="mx-auto mb-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.07] font-mono text-[10px] text-accent">
              {i + 1}
            </div>
            <div className="font-mono text-[9.5px] text-muted">{t}</div>
            <div className="mt-1 h-1 rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent/60"
                style={{ width: ['70%', '40%', '90%'][i] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 font-mono text-[9.5px] text-faint">
        each in its own git worktree · changes never collide
      </div>
    </div>
  )
}

// ── 4. In-app diff review ─────────────────────────────────────────────────
function DiffViz() {
  return (
    <div className="rounded-lg border border-line bg-bg-deep/50 p-3">
      <div className="overflow-hidden rounded-md border border-line bg-bg-deep font-mono text-[10.5px] leading-relaxed">
        <div className="border-b border-line px-2.5 py-1.5 text-[9.5px] text-muted">
          auth/session.ts
        </div>
        <div className="px-2.5 py-2">
          <div className="text-faint"> const token = read()</div>
          <div className="-mx-2.5 bg-accent/[0.1] px-2.5 text-accent">
            <span className="select-none text-accent/70">- </span>return token
          </div>
          <div className="-mx-2.5 bg-sonnet/[0.14] px-2.5 text-sonnet">
            <span className="select-none text-sonnet/70">+ </span>return refresh(token)
          </div>
          <div className="text-faint">{'}'}</div>
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        <button className="rounded-md border border-accent/40 bg-accent/10 py-1.5 font-mono text-[10px] uppercase tracking-wide text-accent">
          Commit
        </button>
        <button className="rounded-md border border-line bg-surface py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted">
          Merge
        </button>
        <button className="rounded-md border border-line bg-surface py-1.5 font-mono text-[10px] uppercase tracking-wide text-faint">
          Discard
        </button>
      </div>
    </div>
  )
}

// ── 5. cost mini-readout ──────────────────────────────────────────────────
function CostMiniViz() {
  const rows = [
    { m: 'Opus', cls: 'bar-opus', pct: 92, cost: '$18.40' },
    { m: 'Sonnet', cls: 'bar-sonnet', pct: 58, cost: '$6.10' },
    { m: 'Haiku', cls: 'bar-haiku', pct: 24, cost: '$0.84' },
  ]
  return (
    <div className="rounded-lg border border-line bg-bg-deep/50 p-3">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.m} className="flex items-center gap-2.5">
            <span className="w-12 font-mono text-[10px] text-muted">{r.m}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-deep">
              <span
                className={`bar-grow block h-full rounded-full ${r.cls}`}
                style={{ width: `${r.pct}%` }}
              />
            </span>
            <span className="w-12 text-right font-mono text-[10px] tabular-nums text-text">
              {r.cost}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2 font-mono text-[9.5px] text-faint">
        <span>API 14m · wall 1h38m</span>
        <span className="text-accent">total $25.34</span>
      </div>
    </div>
  )
}

// ── 6. Quality-of-life ────────────────────────────────────────────────────
function QolViz() {
  const items = [
    ['⌘K', 'Command palette'],
    ['↻', 'Crash-safe resume'],
    ['⤓', 'Signed & notarized'],
    ['◧', 'Drop image → path'],
    ['↗', 'Clickable links'],
    ['▭', 'Menu-bar tray'],
  ]
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {items.map(([g, label]) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-md border border-line bg-bg-deep/50 px-2.5 py-2.5"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[5px] border border-line bg-surface font-mono text-[11px] text-accent">
            {g}
          </span>
          <span className="font-mono text-[10px] leading-tight text-muted">{label}</span>
        </div>
      ))}
    </div>
  )
}

// Bento cell wrapper — bracketed with corner ticks, varied col/row spans via className.
function Cell({ className = '', n, tag, title, body, children, delay = 0 }) {
  return (
    <article
      className={`corner-ticks reveal relative flex flex-col border border-line bg-surface/40 p-5 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <CellHead n={n} tag={tag} />
      <h3 className="mt-3 font-display text-[1.15rem] font-600 tracking-tight text-text">{title}</h3>
      {body && <p className="mt-2 text-[0.92rem] leading-relaxed text-text/60">{body}</p>}
      {children && <div className="mt-4">{children}</div>}
    </article>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative border-t border-line py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-dotmatrix opacity-30" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* header reads like a section ID, left-aligned, dense */}
        <div className="reveal flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <Plate no="02" label="The Console" />
            <h2 className="mt-3 max-w-xl font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-600 leading-[1.08] tracking-tight">
              Six instruments. One board.
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[11px] leading-relaxed text-faint">
            Define agents, launch them in parallel, and watch the work — define · launch · observe ·
            review · attribute.
          </p>
        </div>

        {/* the bento — deliberately uneven spans on 6 columns */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* 1 — agent library, wide */}
          <Cell
            className="lg:col-span-4"
            n="01"
            tag="agent library · per-task models"
            title="Pick the model at the point of choice."
            body="A visual editor over your .claude/agents/*.md — the headline being which model runs each agent. Haiku for extraction, Sonnet for general work, Opus for hard reasoning, with cost and speed hints right where you choose."
          >
            <AgentLibraryViz />
          </Cell>

          {/* 2 — timeline, narrow tall */}
          <Cell
            className="lg:col-span-2 lg:row-span-2"
            n="02"
            tag="live timeline"
            title="Watch the work as it happens."
            body="Every tool call and subagent, nested by who-spawned-whom, with a live-ticking duration on the in-flight tool. Reconstructed from Claude Code's own transcripts."
            delay={60}
          >
            <TimelineRecapViz />
          </Cell>

          {/* 3 — worktrees */}
          <Cell
            className="lg:col-span-2"
            n="03"
            tag="worktrees & fan-out"
            title="Parallel, never colliding."
            delay={40}
          >
            <WorktreeViz />
          </Cell>

          {/* 4 — diff */}
          <Cell
            className="lg:col-span-2"
            n="04"
            tag="in-app diff review"
            title="Commit, merge, or discard."
            delay={80}
          >
            <DiffViz />
          </Cell>

          {/* 5 — cost, wide */}
          <Cell
            className="lg:col-span-4"
            n="05"
            tag="usage & cost dashboard"
            title="Every token, attributed."
            body="A per-model breakdown — input / output / cache, cost, and API vs. wall time — plus token-driven insight into high-context, subagent-heavy, and long-running sessions."
          >
            <CostMiniViz />
          </Cell>

          {/* 6 — QoL, full width */}
          <Cell
            className="lg:col-span-6"
            n="06"
            tag="quality of life"
            title="The small things, handled."
            delay={40}
          >
            <QolViz />
          </Cell>
        </div>
      </div>
    </section>
  )
}
