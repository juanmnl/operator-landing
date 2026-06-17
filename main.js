// Operator landing — vanilla JS. Theme switching (⌘K palette), the animated dot-disc
// brand mark, and OS-aware shortcut labels. No framework, no build.

const THEMES = [
  { key: 'mission-control', name: 'Mission Control', bg: '#0b0d10', accent: '#2fe39a' },
  { key: '1984', name: '1984', bg: '#0d0f31', accent: '#46BDFF' },
  { key: 'mr-pink', name: 'Mr Pink', bg: '#22222A', accent: '#D58FDB' },
  { key: 'light', name: 'Light', bg: '#F7F7F5', accent: '#8e44ad' },
]

const root = document.documentElement
const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '')
const SHORTCUT = isMac ? '⌘K' : 'Ctrl K'

/* ── theme ─────────────────────────────────────────────────────────────── */
function currentTheme() {
  return root.getAttribute('data-theme') || 'light'
}
function applyTheme(key) {
  if (!THEMES.some((t) => t.key === key)) return
  root.setAttribute('data-theme', key)
  try {
    localStorage.setItem('op-theme', key)
  } catch (e) {}
  const t = THEMES.find((x) => x.key === key)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', t.bg)
  renderPalette()
}

/* ── animated brand mark ───────────────────────────────────────────────── */
function rand(i) {
  const v = (Math.sin(i * 12.9898) * 43758.5453) % 1
  return v < 0 ? v + 1 : v
}
function buildDots(cells) {
  const center = cells / 2
  const radius = center - 0.1
  const out = []
  let i = 0
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const cx = col + 0.5
      const cy = row + 0.5
      const dx = cx - center
      const dy = cy - center
      if (dx * dx + dy * dy <= radius * radius * 1.04) out.push({ cx, cy, i })
      i++
    }
  }
  return out
}
function renderMark(el) {
  const cells = parseInt(el.dataset.cells || '7', 10)
  const size = parseInt(el.dataset.size || '120', 10)
  el.style.width = size + 'px'
  el.style.height = size + 'px'

  const glow = document.createElement('div')
  glow.className = 'mark-glow'
  el.appendChild(glow)

  const NS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('width', size)
  svg.setAttribute('height', size)
  svg.setAttribute('viewBox', `0 0 ${cells} ${cells}`)
  for (const { cx, cy, i } of buildDots(cells)) {
    const c = document.createElementNS(NS, 'circle')
    c.setAttribute('cx', cx)
    c.setAttribute('cy', cy)
    c.setAttribute('r', 0.5)
    const dur = (3.4 + rand(i) * 2.4).toFixed(2)
    const delay = (-(rand(i + 99) * dur)).toFixed(2)
    c.style.animation = `mark-twinkle ${dur}s ease-in-out ${delay}s infinite`
    svg.appendChild(c)
  }
  el.appendChild(svg)
}

/* ── ⌘K palette ────────────────────────────────────────────────────────── */
const palette = document.getElementById('palette')
const paletteList = document.getElementById('paletteList')
const paletteInput = document.getElementById('paletteInput')
let activeIdx = 0

function filtered() {
  const q = paletteInput.value.trim().toLowerCase()
  return THEMES.filter((t) => t.name.toLowerCase().includes(q))
}
function renderPalette() {
  if (!paletteList) return
  const list = filtered()
  const cur = currentTheme()
  if (activeIdx >= list.length) activeIdx = Math.max(0, list.length - 1)
  paletteList.innerHTML = ''
  list.forEach((t, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'palette-item' + (i === activeIdx ? ' active' : '')
    b.innerHTML =
      `<span class="sw" style="background:${t.bg};box-shadow:inset 0 0 0 2px ${t.accent}"></span>` +
      `<span>${t.name}</span>` +
      (t.key === cur ? '<span class="current">current</span>' : '')
    b.addEventListener('mouseenter', () => {
      activeIdx = i
      highlight()
    })
    b.addEventListener('click', () => {
      applyTheme(t.key)
      closePalette()
    })
    paletteList.appendChild(b)
  })
}
function highlight() {
  ;[...paletteList.children].forEach((el, i) => el.classList.toggle('active', i === activeIdx))
}
function openPalette() {
  palette.hidden = false
  paletteInput.value = ''
  activeIdx = Math.max(0, filtered().findIndex((t) => t.key === currentTheme()))
  renderPalette()
  setTimeout(() => paletteInput.focus(), 0)
}
function closePalette() {
  palette.hidden = true
}
function togglePalette() {
  palette.hidden ? openPalette() : closePalette()
}

/* ── wire-up ───────────────────────────────────────────────────────────── */
document.querySelectorAll('.mark').forEach(renderMark)

const chipKey = document.getElementById('chipKey')
if (chipKey) chipKey.textContent = SHORTCUT
document.querySelectorAll('.palette-input .pk').forEach((el) => (el.textContent = SHORTCUT))

document.getElementById('themeBtn')?.addEventListener('click', openPalette)
palette?.addEventListener('mousedown', (e) => {
  if (e.target.hasAttribute('data-close')) closePalette()
})
paletteInput?.addEventListener('input', () => {
  activeIdx = 0
  renderPalette()
})
paletteInput?.addEventListener('keydown', (e) => {
  const list = filtered()
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIdx = Math.min(list.length - 1, activeIdx + 1)
    highlight()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIdx = Math.max(0, activeIdx - 1)
    highlight()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const t = list[activeIdx]
    if (t) {
      applyTheme(t.key)
      closePalette()
    }
  }
})

window.addEventListener('keydown', (e) => {
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    togglePalette()
  } else if (e.key === 'Escape') {
    closePalette()
  }
})

renderPalette()
