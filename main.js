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
document.querySelectorAll('.palette-input .pk, [data-shortcut]').forEach((el) => (el.textContent = SHORTCUT))

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
  const panels = $$('.samples .panel')
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
  const [orc, code, res, des, rev, qa] = $$('.lane', panel)
  const flag = $('.panel-flag', panel)
  const set = (lane, mode, text) => {
    lane.classList.toggle('running', mode === 'running')
    lane.classList.toggle('busy', mode === 'busy')
    lane.classList.toggle('waiting', mode === 'waiting')
    $('.lane-phase', lane).textContent = text
  }
  const base = () => {
    set(orc, 'running', 'running')
    set(code, 'busy', 'running')
    set(res, '', 'idle')
    set(des, 'waiting', 'your turn')
    set(rev, '', 'idle')
    set(qa, '', 'idle')
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
      if (n % 3 === 0) {
        const on = !res.classList.contains('busy')
        set(res, on ? 'busy' : '', on ? 'running' : 'idle')
        flag.textContent = on ? '3 running' : '2 running'
      }
      if (n % 5 === 0) {
        const waiting = des.classList.contains('waiting')
        set(des, waiting ? 'busy' : 'waiting', waiting ? 'running' : 'your turn')
      }
      if (n % 7 === 0) {
        const on = !qa.classList.contains('busy')
        set(qa, on ? 'busy' : '', on ? 'running' : 'idle')
      }
    }, 3100)
  }, () => {
    clearInterval(t)
    base()
  })
})()

/* task queue — the queue drains: running lands as a diff, the next task picks up */
;(() => {
  const panel = $('.panel-queue')
  if (!panel) return
  const rows = $$('.task', panel)
  const shipped = $('.panel-foot b', panel)
  // per frame, per row: [state, glyph, stat, lane shown]
  const FRAMES = [
    [['done', '✓', 'diff ready', 1], ['active', '◆', 'running', 1], ['', '○', 'queued', 1], ['', '○', 'backlog', 0]],
    [['done', '✓', 'diff ready', 1], ['done', '✓', 'diff ready', 1], ['active', '◆', 'running', 1], ['', '○', 'backlog', 0]],
    [['done', '✓', 'diff ready', 1], ['done', '✓', 'diff ready', 1], ['active', '◆', 'running', 1], ['', '○', 'queued', 1]],
    [['done', '✓', 'diff ready', 1], ['done', '✓', 'diff ready', 1], ['done', '✓', 'diff ready', 1], ['active', '◆', 'running', 1]],
  ]
  const DONE = [1, 2, 2, 3]
  let f = 0, t = null
  const render = (frame) => {
    FRAMES[frame].forEach(([state, glyph, stat, laneOn], i) => {
      const row = rows[i]
      const changed = row.dataset.state !== state + stat
      row.dataset.state = state + stat
      row.className = 'task' + (state ? ' ' + state : '')
      $('.task-g', row).textContent = glyph
      $('.task-stat', row).textContent = stat
      $('.task-lane', row).hidden = !laneOn
      if (changed && frame !== 0) {
        row.classList.remove('pop')
        void row.offsetWidth
        row.classList.add('pop')
      }
    })
    shipped.textContent = DONE[frame]
  }
  onVisible(panel, () => {
    f = 0
    render(0)
    t = setInterval(() => {
      f = (f + 1) % FRAMES.length
      render(f)
    }, 4400)
  }, () => {
    clearInterval(t)
    render(0)
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

/* conversation — the streaming reply actually streams */
;(() => {
  const panel = $('.panel-convo')
  if (!panel) return
  const convo = $('.convo', panel)
  const bubble = $('.bubble.is-stream', panel)
  if (!bubble) return
  const SEGS = [{ t: 'Running ' }, { c: 'npm test' }, { t: ' to confirm the change' }]
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
