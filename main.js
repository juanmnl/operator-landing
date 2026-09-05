// Operator landing — vanilla JS. The ⌘K palette (jump + appearance), the animated
// dot-disc brand mark, OS-aware shortcut labels, and the live-panel conductor. No
// framework, no build.
//
// APPEARANCE, not themes. The four skins (Mission Control / 1984 / Mr Pink /
// Light) were deleted in the 2026-07-30 rebuild and are not coming back: the
// two-tier palette needs --op-* to stay the real app's chrome. What ⌘K offers is
// only the choice the CSS already supports — follow the system, or pin one of the
// two schemes. See the pre-paint script in index.html for why it is set there.

const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '')
const SHORTCUT = isMac ? '⌘K' : 'Ctrl K'

/* ── appearance ────────────────────────────────────────────────────────────
   The swatches duplicate --page-bg by hand because a page can only resolve one
   scheme at a time and this control has to show both. If --page-bg moves in
   styles.css, move these too. */
const APPEARANCE_KEY = 'operator.appearance'
const SWATCH = {
  system: 'linear-gradient(90deg, #1f2329 50%, #dbe0de 50%)',
  dark: '#1f2329',
  light: '#dbe0de',
}
const root = document.documentElement

function currentAppearance() {
  const a = root.getAttribute('data-theme')
  return a === 'dark' || a === 'light' ? a : 'system'
}
function applyAppearance(key) {
  if (key === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', key)
  try {
    key === 'system' ? localStorage.removeItem(APPEARANCE_KEY) : localStorage.setItem(APPEARANCE_KEY, key)
  } catch (e) {}
  // the two theme-color metas are media-scoped, so a PINNED scheme has to
  // overwrite both or the browser chrome keeps following the system
  const metas = document.querySelectorAll('meta[name="theme-color"]')
  metas.forEach((m) => {
    if (key === 'system') m.setAttribute('content', m.dataset.base || m.getAttribute('content'))
    else m.setAttribute('content', key === 'dark' ? '#1f2329' : '#dbe0de')
  })
}

/* ── the jump targets, read off the document itself ────────────────────── */
function buildTargets() {
  const out = []
  document.querySelectorAll('section[id]').forEach((sec) => {
    // the closing CTA is listed once, explicitly, at the end
    if (sec.classList.contains('closing')) return
    const h = sec.querySelector('h2')
    // the band's range chip (`.sec-n`, e.g. "01 – 02") lives inside the h2 but is
    // not part of the section's name, so read the head's TEXT NODES only
    if (h) {
      const name = Array.from(h.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join('')
        .trim()
      // no index glyph: a section renders as a BAND in the palette, so the index
      // cell stays empty and only its rule carries through, the way the board's
      // column rule does. A number here would also collide with the feature
      // numbers, which run 01-10 in the same list.
      out.push({ id: sec.id, ix: '', name, hint: 'section' })
    }
    // each feature card inside it, numbered by its own tag
    sec.querySelectorAll('.opt').forEach((card) => {
      const tag = card.querySelector('.tag')
      const name = card.querySelector('.opt-name')
      if (!tag || !name) return
      const id = 'feature-' + tag.textContent.trim()
      card.id = id
      card.style.scrollMarginTop = '20px'
      out.push({ id, ix: tag.textContent.trim(), name: name.textContent.trim(), hint: '' })
    })
  })
  out.push({ id: 'download', ix: '↓', name: 'Download for macOS', hint: 'releases' })
  return out
}
const TARGETS = buildTargets()

function jumpTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: REDUCED_Q.matches ? 'auto' : 'smooth', block: 'start' })
}
const REDUCED_Q = window.matchMedia('(prefers-reduced-motion: reduce)')

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

const APPEARANCE_TARGETS = [
  { id: 'appearance:system', kind: 'theme', tkey: 'system', ix: '', name: 'System', keys: 'appearance theme auto' },
  { id: 'appearance:dark', kind: 'theme', tkey: 'dark', ix: '', name: 'Dark', keys: 'appearance theme' },
  { id: 'appearance:light', kind: 'theme', tkey: 'light', ix: '', name: 'Light', keys: 'appearance theme' },
]
function allTargets() {
  return TARGETS.concat(APPEARANCE_TARGETS)
}
function filtered() {
  const q = paletteInput.value.trim().toLowerCase()
  if (!q) return allTargets()
  return allTargets().filter((t) => (t.name + ' ' + (t.keys || '')).toLowerCase().includes(q))
}
/* the matched run is marked in place, so you can see WHY a row survived the
   filter. Built from text nodes rather than innerHTML: the names come off the
   document, and this never needs to parse markup to render a name. */
function nameNode(name, q) {
  const span = document.createElement('span')
  span.className = 'nm'
  const i = q ? name.toLowerCase().indexOf(q) : -1
  if (i < 0) {
    span.textContent = name
    return span
  }
  const mark = document.createElement('mark')
  mark.textContent = name.slice(i, i + q.length)
  span.append(document.createTextNode(name.slice(0, i)), mark, document.createTextNode(name.slice(i + q.length)))
  return span
}
function renderPalette() {
  if (!paletteList) return
  const list = filtered()
  if (activeIdx >= list.length) activeIdx = Math.max(0, list.length - 1)
  paletteList.innerHTML = ''
  list.forEach((t, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    // sections read as bands and features as rows, so the palette is a miniature
    // of the document rather than an undifferentiated list
    const kind = t.kind === 'theme' ? 'is-theme' : t.hint === 'section' ? 'is-sec' : 'is-feat'
    // the first appearance row carries the divider, so the group needs no header
    const firstTheme = t.kind === 'theme' && (i === 0 || list[i - 1].kind !== 'theme')
    b.className =
      'palette-item ' + kind + (firstTheme ? ' is-theme-first' : '') +
      (t.kind === 'theme' && currentAppearance() === t.tkey ? ' is-on' : '') +
      (i === activeIdx ? ' active' : '')
    const ix = document.createElement('span')
    ix.className = 'ix'
    if (t.kind === 'theme') {
      const sw = document.createElement('i')
      sw.className = 'sw'
      sw.style.background = SWATCH[t.tkey]
      ix.appendChild(sw)
    } else {
      ix.textContent = t.ix
    }
    b.append(ix, nameNode(t.name, paletteInput.value.trim().toLowerCase()))
    const hintText = t.kind === 'theme' ? (currentAppearance() === t.tkey ? 'active' : 'appearance') : t.hint
    if (hintText) {
      const h = document.createElement('span')
      h.className = 'hint'
      h.textContent = hintText
      b.appendChild(h)
    }
    b.addEventListener('mouseenter', () => {
      activeIdx = i
      highlight()
    })
    b.addEventListener('click', () => choose(t))
    paletteList.appendChild(b)
  })
  const count = document.getElementById('paletteCount')
  if (count) count.textContent = list.length ? String(list.length).padStart(2, '0') : 'none'
}
/* an appearance row applies and STAYS OPEN, so the two schemes can be compared
   without reopening the palette; a jump target closes it. */
function choose(t) {
  if (t.kind === 'theme') {
    applyAppearance(t.tkey)
    renderPalette()
    paletteInput.focus()
    return
  }
  jumpTo(t.id)
  closePalette()
}
function highlight() {
  const items = [...paletteList.children]
  items.forEach((el, i) => el.classList.toggle('active', i === activeIdx))
  // without this the selection walks off the bottom of a scrolling list and the
  // palette looks like it stopped responding
  items[activeIdx]?.scrollIntoView({ block: 'nearest' })
}
function openPalette() {
  palette.hidden = false
  paletteInput.value = ''
  activeIdx = 0
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
document.querySelectorAll('.palette-input .pk, [data-shortcut]').forEach((el) => (el.textContent = SHORTCUT))

document.getElementById('navBtn')?.addEventListener('click', openPalette)
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
    if (t) choose(t)
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

/* ── live panels — a small conductor per view ──────────────────────────────
   Like the mark's dots, each sample panel loops its own tiny state machine on
   its own period while it's on screen — no two tick alike. Timers pause when a
   panel scrolls away; reduced motion leaves the static markup untouched. */

document.documentElement.classList.add('js')
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

/* reveal panels as they enter, staggered per batch */
{
  const panels = $$('.stage .panel')
  const ro = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          const el = e.target
          el.style.transitionDelay = REDUCED ? '0s' : i * 110 + 'ms'
          el.classList.add('in')
          setTimeout(() => (el.style.transitionDelay = ''), i * 110 + 800)
          ro.unobserve(el)
        })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' }
  )
  panels.forEach((p) => ro.observe(p))
}

function onVisible(el, start, stop, threshold = 0.35) {
  if (!el || REDUCED) return
  let on = false
  new IntersectionObserver(
    (ents) =>
      ents.forEach((en) => {
        if (en.isIntersecting && !on) (on = true), start()
        else if (!en.isIntersecting && on) (on = false), stop()
      }),
    { threshold }
  ).observe(el)
}

/* orchestration — the in-flight tool lands, the queued one picks up */
;(() => {
  const panel = $('.panel-tree')
  if (!panel) return
  const rows = $$('.row', panel)
  const rDelegate = rows[5], rEdit = rows[6], rBash = rows[7]
  const dur = (r) => $('.dur', r)
  const glyph = (r) => $('.g', r)
  const tools = $('.panel-foot b', panel)
  const live = new Map()
  let tick = null, phaseT = null, phase = 0

  const base = () => {
    phase = 0
    live.clear()
    live.set(dur(rDelegate), 3.2)
    live.set(dur(rEdit), 3.2)
    rEdit.classList.add('is-live')
    glyph(rEdit).textContent = '◆'
    dur(rEdit).classList.add('dur-live')
    dur(rDelegate).classList.add('dur-live')
    rBash.classList.add('is-queued')
    rBash.classList.remove('is-live')
    glyph(rBash).textContent = '◇'
    dur(rBash).textContent = 'queued'
    dur(rBash).classList.remove('dur-live')
    tools.textContent = '3'
  }
  const advance = () => {
    phase = 1
    live.delete(dur(rEdit))
    rEdit.classList.remove('is-live')
    glyph(rEdit).textContent = '◇'
    dur(rEdit).classList.remove('dur-live')
    rBash.classList.remove('is-queued')
    rBash.classList.add('is-live')
    glyph(rBash).textContent = '◆'
    dur(rBash).classList.add('dur-live')
    live.set(dur(rBash), 0.1)
    tools.textContent = '4'
  }
  onVisible(panel, () => {
    base()
    tick = setInterval(() => {
      live.forEach((t, el) => {
        t = t > 14 ? 0.4 : +(t + 0.1).toFixed(1)
        live.set(el, t)
        el.textContent = t.toFixed(1) + 's'
      })
    }, 100)
    phaseT = setInterval(() => (phase === 0 ? advance() : base()), 5200)
  }, () => {
    clearInterval(tick)
    clearInterval(phaseT)
    base()
  })
})()

/* usage — the meter keeps metering (tokens, never dollars) */
;(() => {
  const panel = $('.panel-cost')
  if (!panel) return
  const total = $('.panel-total b', panel)
  const top = $$('.model', panel)[0]
  const count = $('.model-cost', top)
  const fill = $('.bar-fill', top)
  const out = $$('.model-toks span', top)[1]
  let drift = 0, t = null
  onVisible(panel, () => {
    t = setInterval(() => {
      drift = drift > 1.4 ? 0 : drift + 0.08 + Math.random() * 0.08
      total.textContent = (25.6 + drift).toFixed(1) + 'M'
      count.textContent = (12.7 + drift * 0.8).toFixed(1) + 'M'
      fill.style.setProperty('--w', Math.min(92 + drift * 3, 97).toFixed(1) + '%')
      out.textContent = 'out ' + Math.round(610 + drift * 90) + 'K'
    }, 4600)
  }, () => clearInterval(t))
})()

/* roster — lanes trade who's in flight, on their own periods */
;(() => {
  const panel = $('.panel-roster')
  if (!panel) return
  // markup order: the working lanes, then the "Ready · N" divider, then the idle ones —
  // so `design` (which wanders to "your turn") sits ABOVE the divider, never under it
  const [orc, code, des] = $$('.lane', panel)
  const flag = $('.panel-flag', panel)
  const set = (lane, mode, text) => {
    lane.classList.toggle('running', mode === 'running')
    lane.classList.toggle('busy', mode === 'busy')
    lane.classList.toggle('waiting', mode === 'waiting')
    $('.lane-phase', lane).textContent = text
  }
  // the ready pool below the divider is static in the markup and never touched here
  const base = () => {
    set(orc, 'running', 'running')
    set(code, 'busy', 'running')
    set(des, 'waiting', 'your turn')
    flag.textContent = '2 running'
  }
  let n = 0, t = null
  onVisible(panel, () => {
    base()
    t = setInterval(() => {
      n++
      // the accent border wanders between the two in-flight lanes
      if (n % 2) {
        const lead = orc.classList.contains('running')
        set(orc, lead ? 'busy' : 'running', 'running')
        set(code, lead ? 'running' : 'busy', 'running')
      }
      // only the lanes ABOVE the "Ready" divider wander. The three below it are the ready
      // pool by definition — showing one of them "running" there would contradict the label.
      if (n % 3 === 0) {
        const waiting = des.classList.contains('waiting')
        set(des, waiting ? 'busy' : 'waiting', waiting ? 'running' : 'your turn')
        flag.textContent = waiting ? '3 running' : '2 running'
      }
      readyCount()
    }, 3100)
  }, () => {
    clearInterval(t)
    base()
    readyCount()
  })
  // only working lanes get a full row in the app; the "Ready · N" label counts the rest
  function readyCount() {
    const el = $('[data-ready]', panel)
    if (!el) return
    el.textContent = $$('.lane', panel).filter(
      (l) => !l.classList.contains('running') && !l.classList.contains('busy') && !l.classList.contains('waiting')
    ).length
  }
})()

/* project gallery — the live card keeps moving, and "last ran" ages */
;(() => {
  const panel = $('.panel-gallery')
  if (!panel) return
  const cards = $$('.pcard', panel)
  const act = $('.act', cards[0])
  const age = $('.pmeta .t', cards[0])
  const rollup = $('.gal-rollup', panel)
  // deliberately never "1 needs you" — the el-encanto card holds that state statically
  const STATES = [
    ['2 running', '4m', '3 agents at work'],
    ['3 running', '1m', '4 agents at work'],
    ['1 running', '2m', '2 agents at work'],
  ]
  let i = 0, t = null
  const render = () => {
    const [a, g, r] = STATES[i]
    act.textContent = a
    act.classList.toggle('acc', true)
    age.textContent = g
    rollup.textContent = r
  }
  onVisible(panel, () => {
    i = 0
    render()
    t = setInterval(() => {
      i = (i + 1) % STATES.length
      render()
    }, 4100)
  }, () => {
    clearInterval(t)
    i = 0
    render()
  })
})()

/* the left surface — the open project's agents wander phases; selection stays put */
;(() => {
  const panel = $('.panel-nav')
  if (!panel) return
  const lanes = $$('.slane', panel)
  const pcount = $('[data-pcount]', panel)
  // per frame: one entry per agent row, then the open project's running count
  const PHASES = [
    [['running', 1], ['your turn', 0], ['idle', 0], '1 running'],
    [['running', 1], ['running', 1], ['idle', 0], '2 running'],
    [['idle', 0], ['running', 1], ['running', 1], '2 running'],
    [['running', 1], ['idle', 0], ['your turn', 0], '1 running'],
  ]
  let f = 0, t = null
  const render = () => {
    const frame = PHASES[f]
    lanes.forEach((lane, i) => {
      const [text, live] = frame[i]
      const ph = $('.ph', lane)
      ph.textContent = text
      ph.classList.toggle('acc', text !== 'idle')
      $('.sdot', lane).style.opacity = live ? '1' : text === 'your turn' ? '.5' : '.35'
    })
    // the count on the open project's row is derived, exactly as the app derives it
    pcount.textContent = frame[3]
  }
  onVisible(panel, () => {
    f = 0
    render()
    t = setInterval(() => {
      f = (f + 1) % PHASES.length
      render()
    }, 3600)
  }, () => {
    clearInterval(t)
    f = 0
    render()
  })
})()

/* dispatch log — the held dispatch gets approved, delivers, and the loop resets */
;(() => {
  const panel = $('.panel-dispatch')
  if (!panel) return
  const held = $('[data-held]', panel)
  if (!held) return
  const chip = $('[data-dchip]', held)
  const acts = $('[data-dacts]', held)
  const flag = $('[data-dflag]', panel)
  // held twice (the gate is a pause, not a beat), then approval delivers it
  const FRAMES = [
    ['held · needs your approval', 'wait', '1 needs approval', 1],
    ['held · needs your approval', 'wait', '1 needs approval', 1],
    ['delivered', 'ok', 'approved · delivered', 0],
  ]
  let f = 0, t = null
  const render = () => {
    const [label, tone, count, showActs] = FRAMES[f]
    chip.textContent = label
    chip.className = 'cchip ' + tone
    flag.textContent = count
    acts.style.visibility = showActs ? 'visible' : 'hidden'
    if (f === 2) {
      held.classList.remove('pop')
      void held.offsetWidth
      held.classList.add('pop')
    }
  }
  onVisible(panel, () => {
    f = 0
    render()
    t = setInterval(() => {
      f = (f + 1) % FRAMES.length
      render()
    }, 3900)
  }, () => {
    clearInterval(t)
    f = 0
    render()
  })
})()

/* the board — the running card's duration ticks; states never lie their way across columns */
;(() => {
  const panel = $('.panel-board')
  if (!panel) return
  const stat = $('[data-bstat]', panel)
  if (!stat) return
  let s = 0, t = null
  onVisible(panel, () => {
    s = 254 // pick up mid-run, like every other duration on the page
    stat.textContent = 'running'
    t = setInterval(() => {
      s += 1
      const m = Math.floor(s / 60), r = s % 60
      stat.textContent = 'running · ' + m + 'm ' + (r < 10 ? '0' : '') + r + 's'
    }, 1000)
  }, () => {
    clearInterval(t)
    stat.textContent = 'running'
  })
})()

/* diff — lines draw in each time the panel enters */
;(() => {
  const panel = $('.panel-diff')
  if (!panel) return
  const diff = $('.diff', panel)
  $$('.dhunk, .dline', diff).forEach((el, i) => el.style.setProperty('--i', i))
  onVisible(panel, () => diff.classList.add('play'), () => diff.classList.remove('play'), 0.5)
})()

/* worktrees — the active branch keeps writing */
;(() => {
  const panel = $('.panel-trees')
  if (!panel) return
  const add = $('.wt-active .stat-add', panel)
  const del = $('.wt-active .stat-del', panel)
  let a = 142, d = 38, t = null
  onVisible(panel, () => {
    t = setInterval(() => {
      if (a > 196) (a = 142), (d = 38)
      a += 1 + Math.floor(Math.random() * 4)
      if (Math.random() < 0.35) d += 1
      add.textContent = '+' + a
      del.textContent = '−' + d
    }, 3400)
  }, () => clearInterval(t))
})()

/* transcript — the streaming line streams, and the status line says what it's doing */
;(() => {
  const panel = $('.panel-convo')
  if (!panel) return
  const convo = $('.tx', panel)
  const bubble = $('.tx-prose.is-stream', panel)
  if (!bubble) return
  // the verbs are lib/chat-signal's, which reports what the agent is DOING, not the tool name
  const signal = $('[data-signal]', panel)
  const VERBS = ['Editing', 'Running a command', 'Reading', 'Delegating · 2 subagents', 'Thinking']
  let vi = 0, vt = null
  onVisible(panel, () => {
    vt = setInterval(() => {
      vi = (vi + 1) % VERBS.length
      if (signal) signal.textContent = VERBS[vi]
    }, 2900)
  }, () => {
    clearInterval(vt)
    if (signal) signal.textContent = VERBS[0]
  })
  const SEGS = [{ t: 'Edited ' }, { c: 'auth/session.test.ts' }]
  let timers = []
  const later = (fn, ms) => timers.push(setTimeout(fn, ms))
  const run = () => {
    bubble.innerHTML = ''
    const caret = document.createElement('span')
    caret.className = 'caret'
    caret.setAttribute('aria-hidden', 'true')
    bubble.appendChild(caret)
    let si = 0, ci = 0, target = null
    const step = () => {
      if (si >= SEGS.length) return later(run, 3800)
      const seg = SEGS[si]
      const text = seg.t || seg.c
      if (ci === 0) {
        target = seg.c ? document.createElement('code') : document.createTextNode('')
        bubble.insertBefore(target, caret)
      }
      target.textContent = text.slice(0, ++ci)
      if (ci >= text.length) (si++), (ci = 0)
      later(step, 24 + Math.random() * 40)
    }
    step()
  }
  onVisible(panel, () => {
    convo.style.minHeight = convo.offsetHeight + 'px'
    run()
  }, () => {
    timers.forEach(clearTimeout)
    timers = []
  })
})()

/* plan — todos tick off, then the plan starts over */
;(() => {
  const panel = $('.panel-plan')
  if (!panel) return
  const todos = $$('.todo', panel)
  const prog = $('.plan-prog b', panel)
  const bar = $('.ppbar i', panel)
  let phase = 0, t = null
  const render = (done) => {
    todos.forEach((el, i) => {
      el.classList.toggle('done', i < done)
      el.classList.toggle('active', i === done && done < todos.length)
      $('.tg', el).textContent = i < done ? '✓' : i === done && done < todos.length ? '▸' : '○'
    })
    prog.textContent = done
    bar.style.setProperty('--w', (done / todos.length) * 100 + '%')
  }
  onVisible(panel, () => {
    phase = 0
    render(3)
    t = setInterval(() => {
      phase = (phase + 1) % 4
      render(phase === 3 ? 3 : 3 + phase)
    }, 3400)
  }, () => {
    clearInterval(t)
    render(3)
  })
})()

/* terminal — a typewriter loop over the real session beats */
;(() => {
  const panel = $('.panel-term')
  if (!panel) return
  const term = $('.term', panel)
  const LINES = [
    { cls: 'term-line term-prompt', html: '~/operator <b>❯</b> ', type: 'claude', speed: 95, pause: 620 },
    { cls: 'term-line', html: '<span class="term-accent">◆</span> ', type: 'Refactoring the auth module…', speed: 26, pause: 540 },
    { cls: 'term-line term-dim', print: "  Read src/auth/session.ts · Grep 'refreshToken'", pause: 620 },
    { cls: 'term-line term-dim', print: '  Dev server is running: http://localhost:5273/', pause: 980 },
    { cls: 'term-line term-ok', print: '  ✓ 24 passed', pause: 700 },
    { cls: 'term-line term-prompt', html: '~/operator <b>❯</b> ', caret: true, pause: 4600 },
  ]
  let timers = []
  const later = (fn, ms) => timers.push(setTimeout(fn, ms))
  const run = () => {
    term.innerHTML = ''
    let li = 0
    const nextLine = () => {
      if (li >= LINES.length) return later(run, 200)
      const spec = LINES[li++]
      const line = document.createElement('div')
      line.className = spec.cls
      term.appendChild(line)
      if (spec.print) {
        line.textContent = spec.print
        return later(nextLine, spec.pause)
      }
      line.innerHTML = spec.html || ''
      if (spec.caret) {
        line.insertAdjacentHTML('beforeend', '<span class="caret" aria-hidden="true"></span>')
        return later(nextLine, spec.pause)
      }
      const caret = document.createElement('span')
      caret.className = 'caret'
      line.appendChild(caret)
      const tn = document.createTextNode('')
      line.insertBefore(tn, caret)
      let ci = 0
      const typeChar = () => {
        tn.textContent = spec.type.slice(0, ++ci)
        if (ci < spec.type.length) later(typeChar, spec.speed * (0.6 + Math.random() * 0.8))
        else (caret.remove(), later(nextLine, spec.pause))
      }
      typeChar()
    }
    nextLine()
  }
  onVisible(panel, () => {
    term.style.minHeight = term.offsetHeight + 'px'
    run()
  }, () => {
    timers.forEach(clearTimeout)
    timers = []
  }, 0.45)
})()

/* fan-out — four attempts at the same task, racing */
;(() => {
  const panel = $('.panel-fan')
  if (!panel) return
  const rows = $$('.wt', panel)
  const BASE = [[21, 9], [14, 3], [47, 18], [0, 0]]
  let vals, n, t = null
  const renderDiff = (i) => {
    const d = $('.wt-diff', rows[i])
    d.classList.remove('wt-muted')
    d.innerHTML = ''
    const a = document.createElement('span')
    a.className = 'stat-add'
    a.textContent = '+' + vals[i][0]
    const s = document.createElement('span')
    s.className = 'stat-del'
    s.textContent = '−' + vals[i][1]
    d.append(a, ' ', s)
  }
  const reset = () => {
    n = 0
    vals = BASE.map((v) => [...v])
    rows.forEach((r, i) => renderDiff(i))
    $('.wt-stat', rows[3]).textContent = 'queued'
    $('.wt-g', rows[3]).textContent = '◇'
    $('.wt-diff', rows[3]).classList.add('wt-muted')
  }
  onVisible(panel, () => {
    reset()
    t = setInterval(() => {
      if (++n === 3) {
        $('.wt-stat', rows[3]).textContent = 'running'
        $('.wt-g', rows[3]).textContent = '◆'
      }
      const running = n >= 3 ? [0, 2, 3] : [0, 2]
      running.forEach((i) => {
        if (Math.random() < 0.75) vals[i][0] += 1 + Math.floor(Math.random() * 3)
        if (Math.random() < 0.3) vals[i][1] += 1
        renderDiff(i)
      })
      if (vals[0][0] > 90) reset()
    }, 2400)
  }, () => {
    clearInterval(t)
    reset()
  })
})()

/* sessions — phases drift the way they do in the sidebar */
;(() => {
  const panel = $('.panel-sessions')
  if (!panel) return
  const rows = $$('.sess', panel)
  const compact = $('.sess-phase', rows[3])
  const sweep = rows[2]
  const sweepPhase = $('.sess-phase', sweep)
  const frames = ['compacting', 'compacting.', 'compacting..', 'compacting…']
  let f = 0, n = 0, t = null
  onVisible(panel, () => {
    t = setInterval(() => {
      compact.textContent = frames[(f = (f + 1) % frames.length)]
      if (++n % 11 === 0) {
        const on = sweep.classList.toggle('running')
        sweepPhase.textContent = on ? 'running' : 'idle'
      }
    }, 800)
  }, () => clearInterval(t))
})()

/* the plan meter — the session fill creeps, the way a reading does */
;(() => {
  const panel = $('.panel-meter')
  if (!panel) return
  const val = $('.mval[data-pct]', panel)
  const fill = $('.mrow .mbar i', panel)
  const base = +val.dataset.pct
  let n = 0, t = null
  onVisible(panel, () => {
    t = setInterval(() => {
      const pct = Math.min(74, base + (++n % 9))
      val.textContent = pct + '%'
      fill.style.setProperty('--w', pct + '%')
    }, 1900)
  }, () => { clearInterval(t); n = 0; val.textContent = base + '%'; fill.style.setProperty('--w', base + '%') })
})()
