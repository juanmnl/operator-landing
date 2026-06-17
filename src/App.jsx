import { useCallback, useEffect, useState } from 'react'
import ThemedHero from './components/styles/ThemedHero.jsx'
import CommandPalette from './components/styles/CommandPalette.jsx'
import { OPERATOR_THEMES } from './components/styles/operatorThemes.js'

// The site wears one of Operator's themes; the picker is hidden behind ⌘K (a command
// palette), like the app itself. The choice persists locally.
const readSaved = () => {
  try {
    return localStorage.getItem('op-theme')
  } catch {
    return null
  }
}

export default function App() {
  const [key, setKey] = useState(() => readSaved() || 'light')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const t = OPERATOR_THEMES.find((x) => x.key === key) || OPERATOR_THEMES[0]

  useEffect(() => {
    try {
      localStorage.setItem('op-theme', t.key)
    } catch {
      /* ignore */
    }
    document.documentElement.style.background = t.bg
  }, [t.key, t.bg])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const select = useCallback((k) => {
    setKey(k)
    setPaletteOpen(false)
  }, [])

  return (
    <>
      <ThemedHero t={t} onCommand={() => setPaletteOpen(true)} />
      <CommandPalette
        open={paletteOpen}
        t={t}
        themes={OPERATOR_THEMES}
        currentKey={t.key}
        onSelect={select}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  )
}
