import Plate from './Plate.jsx'

// Cost dashboard showcase — a per-model breakdown (input/output/cache, cost, API vs wall
// time) plus token-driven insight chips. Bars grow once on reveal. All mocked in-browser.
// Framed as the operator's call-log: every line metered, every charge attributed.

const MODELS = [
  { name: 'Opus', cls: 'bar-opus', badge: 'badge-opus', pct: 92, in: '1.2M', out: '340K', cache: '4.1M', cost: '$18.40' },
  { name: 'Sonnet', cls: 'bar-sonnet', badge: 'badge-sonnet', pct: 58, in: '2.8M', out: '610K', cache: '9.3M', cost: '$6.10' },
  { name: 'Haiku', cls: 'bar-haiku', badge: 'badge-haiku', pct: 24, in: '5.1M', out: '120K', cache: '2.0M', cost: '$0.84' },
]

const INSIGHTS = [
  { tag: 'High context', body: '3 sessions over 120K tokens of context', accent: true },
  { tag: 'Subagent-heavy', body: 'refactor-auth fanned out to 4 agents' },
  { tag: 'Long-running', body: 'deploy-fix · 41m wall · 6m API' },
]

export default function CostDashboard() {
  return (
    <section id="cost" className="relative border-t border-line py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-dotmatrix opacity-30" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <Plate no="04" label="The Call Log" />
            <h2 className="mt-3 font-display text-[clamp(1.55rem,3.3vw,2.25rem)] font-600 leading-[1.1] tracking-tight">
              Every token, attributed.
            </h2>
          </div>
          <p className="max-w-sm text-[0.98rem] leading-relaxed text-text/65">
            A <code className="font-mono text-[0.86em] text-accent">/usage</code>-style per-model
            breakdown, plus token-driven insights into exactly what’s driving your bill.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-5">
          {/* the breakdown panel */}
          <div className="rounded-xl border border-line bg-surface/50 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                per-model · last 7 days
              </span>
              <span className="font-mono text-[13px] text-text">
                total <span className="text-accent">$25.34</span>
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {MODELS.map((m) => (
                <div key={m.name}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`${m.badge} rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide`}
                    >
                      {m.name}
                    </span>
                    <span className="ml-auto font-mono text-[13px] tabular-nums text-text">{m.cost}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-bg-deep">
                    <div
                      className={`bar-grow h-full rounded-full ${m.cls}`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex gap-4 font-mono text-[10px] text-faint">
                    <span>in {m.in}</span>
                    <span>out {m.out}</span>
                    <span>cache {m.cache}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* api vs wall time */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-4">
              <div className="rounded-lg border border-line bg-bg-deep/50 px-3 py-2.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-faint">API time</div>
                <div className="mt-0.5 font-display text-[1.4rem] tracking-tight text-text">14m 02s</div>
              </div>
              <div className="rounded-lg border border-line bg-bg-deep/50 px-3 py-2.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-faint">Wall time</div>
                <div className="mt-0.5 font-display text-[1.4rem] tracking-tight text-text">
                  1h 38m
                </div>
              </div>
            </div>
          </div>

          {/* insight chips */}
          <div className="flex flex-col gap-3">
            {INSIGHTS.map((c) => (
              <div
                key={c.tag}
                className={`rounded-xl border bg-surface/50 p-4 ${
                  c.accent ? 'border-accent/30' : 'border-line'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      c.accent ? 'bg-accent live-dot' : 'bg-faint'
                    }`}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text">
                    {c.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-[0.92rem] leading-snug text-text/65">{c.body}</p>
              </div>
            ))}
            <div className="mt-auto rounded-xl border border-line bg-bg-deep/40 p-4">
              <p className="font-mono text-[10.5px] leading-relaxed text-faint">
                Built from the same transcripts the timeline reads — no extra instrumentation, no
                telemetry sent anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
