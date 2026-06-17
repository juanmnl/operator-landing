// The recurring section label, stamped like a heading in a telephone-company manual:
// an oxblood-ink index number ("No.02"), a sepia uppercase label set in the typewriter
// face, and a hairline rule trailing off like a ruled form field.
export default function Plate({ no, label, className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] ${className}`}
    >
      {no && <span className="tabular-nums font-700 text-accent">No.{no}</span>}
      <span className="h-px w-5 bg-text/35" />
      <span className="text-text/80">{label}</span>
      <span className="h-px w-12 max-w-[22vw] flex-none bg-text/20 sm:w-20" />
    </div>
  )
}
