import Plate from './Plate.jsx'

// How it works — the pure-observer diagram. Operator spawns an embedded terminal running
// `claude --session-id <uuid>`, then tails the transcript jsonl to rebuild the timeline
// live. Nothing installed, no global hooks. Rendered as a labeled flow on a ruled board —
// framed like a switchboard operator patching a line: pin it, listen in, never cut in.

function Node({ title, sub, accent }) {
  return (
    <div
      className={`rounded-lg border bg-surface/70 px-4 py-3 text-center backdrop-blur-sm ${
        accent ? 'border-accent/40 shadow-[0_0_30px_-10px_var(--color-accent)]' : 'border-line'
      }`}
    >
      <div className={`font-display text-[0.98rem] tracking-tight ${accent ? 'text-accent' : 'text-text'}`}>
        {title}
      </div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-faint">{sub}</div>}
    </div>
  )
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 py-2 lg:py-0">
      <span className="font-mono text-[9px] uppercase tracking-wider text-faint">{label}</span>
      <span className="text-accent/70">
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none" className="hidden lg:block">
          <path d="M0 5h19M15 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <svg width="10" height="20" viewBox="0 0 10 20" fill="none" className="lg:hidden">
          <path d="M5 0v16M1 12l4 5 4-5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-line py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_80%)]" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="reveal grid gap-6 border-b border-line pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <Plate no="03" label="The Observer" />
            <h2 className="mt-3 font-display text-[clamp(1.55rem,3.3vw,2.25rem)] font-600 leading-[1.1] tracking-tight">
              A pure observer. Nothing installed.
            </h2>
          </div>
          <p className="text-[1.0rem] leading-relaxed text-text/65">
            Operator never intercepts your agents. It pins each session’s id at launch and tails that
            session’s transcript to rebuild the timeline live. No global config, no machine-wide hooks —
            a <code className="font-mono text-[0.86em] text-accent">claude</code> you run elsewhere is
            completely unaffected.
          </p>
        </div>

        {/* the flow */}
        <div className="reveal mt-12 flex flex-col items-stretch justify-center gap-1 lg:flex-row lg:items-center">
          <Node title="Operator" sub="mission control" accent />
          <Arrow label="spawns" />
          <Node title="embedded terminal" sub="portable-pty" />
          <Arrow label="runs" />
          <Node title="claude --session-id" sub="<uuid> pinned" />
        </div>

        {/* the tail loop */}
        <div className="reveal mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <div className="rounded-lg border border-line bg-bg-deep/60 p-4 font-mono text-[11px]">
            <div className="mb-2 text-[10px] uppercase tracking-wider text-faint">writes</div>
            <div className="text-muted">~/.claude/projects/</div>
            <div className="text-text">
              &lt;slug&gt;/<span className="text-accent">&lt;id&gt;.jsonl</span>
            </div>
            <div className="mt-2 h-px w-full bg-line-soft" />
            <div className="mt-2 space-y-0.5 text-[10px] text-faint">
              <div>{'{ "type": "tool_use", … }'}</div>
              <div>{'{ "type": "tool_result", … }'}</div>
              <div className="text-accent/70">{'{ "type": "delegate", … }'}</div>
            </div>
          </div>

          <div className="flex items-center justify-center px-2">
            <div className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              ↻ tails
            </div>
          </div>

          <div className="rounded-lg border border-accent/30 bg-surface/60 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-faint">
              rebuilds → live timeline
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-accent">▸</span>
                <span className="text-text">tools</span>
                <span className="text-faint">·</span>
                <span className="text-muted">subagents</span>
                <span className="text-faint">·</span>
                <span className="text-muted">phase</span>
                <span className="text-faint">·</span>
                <span className="text-muted">cost</span>
              </div>
              <div className="flex items-center gap-2 pl-4 text-faint">
                <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-accent">live-ticking</span>
              </div>
            </div>
          </div>
        </div>

        <p className="reveal mt-8 text-center font-mono text-[11px] uppercase tracking-wider text-faint">
          Like an operator patching a line — it pins the connection and listens in, never cuts in.
          <br className="hidden sm:block" />
          Permissions stay with Claude Code in the terminal · Operator doesn’t intercept them
        </p>
      </div>
    </section>
  )
}
