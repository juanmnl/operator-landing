import { useEffect, useRef, useState } from 'react'

// ⌘K theme switcher. Opens over the page, styled in the active theme. Type to filter,
// ↑/↓ to move, ↵ to apply, esc to close. Each row previews the theme's paper + accent.
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" }
const disp = { fontFamily: "'Sora', system-ui, sans-serif" }

export default function CommandPalette({ open, t, themes, currentKey, onSelect, onClose }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)
  const list = themes.filter((u) => u.name.toLowerCase().includes(q.trim().toLowerCase()))

  useEffect(() => {
    if (!open) return
    setQ('')
    setIdx(Math.max(0, themes.findIndex((u) => u.key === currentKey)))
    const id = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(id)
  }, [open, currentKey, themes])

  useEffect(() => setIdx(0), [q])

  if (!open) return null

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(list.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const u = list[idx]
      if (u) onSelect(u.key)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[16vh]" onMouseDown={onClose}>
      <div
        className="absolute inset-0"
        style={{ background: t.dark ? 'rgba(0,0,0,.55)' : 'rgba(30,28,26,.32)', backdropFilter: 'blur(3px)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Switch theme"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-lg overflow-hidden rounded-xl"
        style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.fg, boxShadow: '0 24px 70px rgba(0,0,0,.45)' }}
      >
        <div className="flex items-center gap-2.5 border-b px-4 py-3" style={{ borderColor: t.border }}>
          <span style={{ ...mono, color: t.accent, fontSize: 11 }}>⌘K</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Switch theme…"
            className="w-full bg-transparent text-[14px] outline-none"
            style={{ ...disp, color: t.fg }}
          />
        </div>

        <div className="p-2">
          <div className="px-2 pb-1 pt-1 text-[10px] uppercase tracking-[0.2em]" style={{ ...mono, color: t.muted }}>
            Theme
          </div>
          {list.map((u, i) => {
            const active = i === idx
            const current = u.key === currentKey
            return (
              <button
                key={u.key}
                type="button"
                onMouseEnter={() => setIdx(i)}
                onClick={() => onSelect(u.key)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left"
                style={{ background: active ? `${t.fg}14` : 'transparent' }}
              >
                <span className="h-4 w-6 shrink-0 rounded-[3px]" style={{ background: u.bg, boxShadow: `inset 0 0 0 2px ${u.accent}` }} />
                <span className="text-[13.5px]" style={{ ...disp, color: t.fg }}>{u.name}</span>
                {current && (
                  <span className="ml-auto text-[10px] uppercase tracking-[0.16em]" style={{ ...mono, color: t.accent }}>
                    current
                  </span>
                )}
              </button>
            )
          })}
          {list.length === 0 && (
            <div className="px-2 py-3 text-[13px]" style={{ color: t.muted }}>
              No matching theme
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-4 py-2 text-[10px]" style={{ borderColor: t.border, ...mono, color: t.muted }}>
          <span>↑↓ navigate · ↵ select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  )
}
