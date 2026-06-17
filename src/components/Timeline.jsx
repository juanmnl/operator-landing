import { useEffect, useRef, useState } from 'react'

// ── A live orchestration timeline mock ────────────────────────────────────
// Reconstructs the feel of Operator's core view: nested tool calls and subagent
// delegations, with a live-ticking duration on the in-flight row and elapsed time on
// finished ones. Pure React/CSS — no screenshots. The in-flight row ticks up in real
// time; everything else is static so the eye lands on the live one.

const SonnetBadge = () => (
  <span className="badge-sonnet rounded-[3px] border px-1 py-px font-mono text-[9px] uppercase leading-none tracking-wide">
    sonnet
  </span>
)
const HaikuBadge = () => (
  <span className="badge-haiku rounded-[3px] border px-1 py-px font-mono text-[9px] uppercase leading-none tracking-wide">
    haiku
  </span>
)
const OpusBadge = () => (
  <span className="badge-opus rounded-[3px] border px-1 py-px font-mono text-[9px] uppercase leading-none tracking-wide">
    opus
  </span>
)

// one tree node — depth controls the connector indent
function Row({ depth = 0, glyph, label, meta, badge, state = 'done', tick, dur }) {
  const color =
    state === 'live' ? 'text-accent' : state === 'queued' ? 'text-faint' : 'text-muted'
  return (
    <div className="relative flex items-center gap-2 py-[5px]" style={{ paddingLeft: depth * 18 }}>
      {/* tree connector */}
      {depth > 0 && (
        <span
          aria-hidden
          className="absolute top-0 bottom-1/2 border-l border-b border-line-soft"
          style={{ left: depth * 18 - 10, width: 8 }}
        />
      )}
      <span className={`shrink-0 font-mono text-[11px] ${color}`}>{glyph}</span>
      <span
        className={`shrink-0 truncate font-mono text-[11.5px] ${
          state === 'live' ? 'text-text' : 'text-muted'
        }`}
      >
        {label}
      </span>
      {meta && <span className="shrink-0 truncate font-mono text-[10.5px] text-faint">{meta}</span>}
      {badge}
      <span className="ml-auto shrink-0 pl-2 font-mono text-[10.5px] tabular-nums text-faint">
        {state === 'live' ? (
          <span className="text-accent">{tick}</span>
        ) : state === 'queued' ? (
          '—'
        ) : (
          dur
        )}
      </span>
    </div>
  )
}

export default function Timeline({ className = '' }) {
  // single ticking clock for the in-flight tool, in seconds.s
  const [t, setT] = useState(3.2)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce.current) return
    const id = setInterval(() => {
      setT((v) => (v > 12 ? 0.4 : +(v + 0.1).toFixed(1)))
    }, 100)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={`overflow-hidden rounded-sm border border-text/70 bg-surface shadow-[5px_5px_0_0_rgba(44,33,20,0.18)] ${className}`}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-bg-deep/60 px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
        <span className="ml-1.5 font-mono text-[11px] text-muted">orchestration · session 7c1f</span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          live
        </span>
      </div>

      {/* the tree */}
      <div className="relative px-3.5 py-3">
        <Row
          glyph="▸"
          label="refactor auth module"
          meta="orchestrator"
          badge={<OpusBadge />}
          state="done"
          dur="running"
        />
        <Row depth={1} glyph="◇" label="Read" meta="src/auth/session.ts" state="done" dur="0.4s" />
        <Row depth={1} glyph="◇" label="Grep" meta="'refreshToken'" state="done" dur="0.2s" />
        <Row
          depth={1}
          glyph="⤷"
          label="delegate › extract-types"
          badge={<HaikuBadge />}
          state="done"
          dur="2.1s"
        />
        <Row depth={2} glyph="◇" label="Read" meta="types/auth.d.ts" state="done" dur="0.3s" />
        <Row
          depth={1}
          glyph="⤷"
          label="delegate › write-tests"
          badge={<SonnetBadge />}
          state="live"
          tick={`${t.toFixed(1)}s`}
        />
        {/* in-flight row gets the scanning shimmer */}
        <div className="scanline relative -mx-3.5">
          <div className="px-3.5">
            <Row
              depth={2}
              glyph="◆"
              label="Edit"
              meta="auth/session.test.ts"
              state="live"
              tick={`${t.toFixed(1)}s`}
            />
          </div>
        </div>
        <Row depth={2} glyph="◇" label="Bash" meta="npm test — queued" state="queued" />
      </div>

      {/* status strip */}
      <div className="flex items-center gap-4 border-t border-line bg-bg-deep/60 px-3.5 py-2 font-mono text-[10.5px] text-faint">
        <span>
          <span className="text-accent">3</span> tools
        </span>
        <span>
          <span className="text-text">2</span> subagents
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-opus/70" />
          worktree&nbsp;<span className="text-muted">auth-refactor</span>
        </span>
      </div>
    </div>
  )
}
