// THE WALL. The ground behind the sheet, written on.
//
// The same signature as juanmnl.com (assets/js/record/wall.js) and Mantel Red
// (apps/red/src/pages/wall.ts): Juan's own caps hand (hand.js, verbatim from
// web27) and quick monoline sketches, laid down stroke by stroke in pen order,
// off a seed, on canvases behind the page. Only the subjects change per site.
// Here they are Operator's: what an operator writes on the wall beside the
// switchboard, about agents and tokens.
//
// Three kinds of mark:
//   phrases   lines in the hand. Short declaratives about orchestration and
//             token economy, a few struck through (the things Operator refuses
//             to do), a few big (the states on the board).
//   sketches  the switchboard and its cords, a headset, a rotary dial, a
//             terminal, the board, a call tree, a worktree graph, a diff, the
//             plan ring, the effort ladder, usage bars, coins for tokens. Each
//             is a few polylines in a 100-unit box, drawn with the pen's own
//             wander so they read as doodles, never as icons.
//   drills    the hand's warm-up rows (arches, ovals, zigzags) on the quieter
//             stretches of ground.
//
// Where they go: everywhere the page has no content. The figure (every panel,
// title, caption, table, button) is gathered from the DOM and nothing is laid
// on it; the rest is ground, inside the sheet as well as in the gutters beside
// it. Pieces in the gutters are loud; pieces inside the sheet are fainter,
// because they sit next to type.
//
// Seeded per path, so a reload is the same wall; ?s=N overrides. Marks are
// queued and drained a few per frame as the reader scrolls, so the wall
// writes itself in ahead of them. Under prefers-reduced-motion it is complete
// and still. Colours are read from the page tokens, so a theme flip redraws.
// Under 700px there is no wall: the specimens already fill the viewport.
(function () {
  'use strict';

  // ---- tune -------------------------------------------------------------
  var DENSITY = 3.4;                                // marks per 300×300 of free ground
  var SHARE = { sketch: .48, phrase: .4 };           // the rest are drills
  var PHRASE = { xh: [13, 21], big: [30, 50], w: [1.1, 1.5] };   // x-height px, pen width
  var SKETCH = { size: [60, 190], w: [1, 1.4], tilt: .18 };
  var DRILL = { len: [60, 150] };
  var ALPHA = { gutter: [.6, .9], sheet: [.3, .5] };
  var CONTRAST = { dark: 1, light: .9 };
  var DRAIN = 18, BUDGET = 5, LEAD = 1.2, TH = 1600, MIN_W = 700;
  // every piece takes one of five inks, read from the page's tokens
  var INKS = [
    { v: '--page-fg', p: .44 },
    { v: '--page-accent', p: .22 },
    { v: '--wall-blue', p: .14 },
    { v: '--warn', p: .11 },
    { v: '--stop', p: .09 }
  ];

  // a phrase is a string, or { t, struck, big, ink } — struck: written and
  // then crossed out; big: display size; ink: an index into INKS
  var PHRASES = [
    { t: 'You run the agents', big: true },
    { t: 'Standing by', big: true },
    { t: 'Running', big: true, ink: 1 },
    { t: 'Waiting', big: true, ink: 3 },
    { t: 'Done and green', big: true, ink: 1 },
    { t: 'Abandoned', big: true, ink: 4, struck: true },
    'One worktree per task',
    'Nothing leaves your machine',
    'Tokens are measurable',
    'Dollars depend on your plan',
    'Absent is not zero',
    'Haiku for extraction',
    'Sonnet for the everyday',
    'Opus where it earns its keep',
    'Send becomes Stop',
    'A bare ESC, not a kill',
    'Held: needs your approval',
    'No matching lane',
    'The card is the task',
    'The agent is a chip on it',
    'Cache reads are cheaper, not free',
    'Effort is a flag, not a global write',
    'Low, medium, high, xhigh, max',
    'Nobody saw the work finish',
    'Read the diff before it lands',
    'Fan out, keep one',
    'The chain brakes itself',
    'Nothing retries on its own',
    'Waiting is the column that needs you',
    'One queue per terminal',
    'Peripheral view',
    'Staff once, work the board',
    'Compacting',
    'Delegating',
    'Editing 3 files',
    'Read 7 files',
    'Input, output, cache',
    'Per model, per project, per day',
    'Todo lo que gasta un agente se cuenta',
    'Cada tarea en su propio worktree',
    'Una ventana para todas las sesiones',
    'Stale after 14 days',
    'Shelving is a decision',
    'The ring, never a number',
    'Parsed from your own transcripts',
    'Two agents, no human: stop',
    { t: 'Trust the estimate', struck: true },
    { t: 'Just one more lane', struck: true },
    { t: 'Cost in dollars', struck: true },
    { t: 'Telemetry', struck: true },
    { t: 'An account', struck: true },
    { t: 'Kill -9', struck: true },
    { t: 'A roadmap', struck: true }
  ];

  // ---- the sketches: polylines in a 100-unit box, x right, y down --------
  var TAU = Math.PI * 2;
  function arc(cx, cy, rx, ry, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var t = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); } return o; }
  function ln() { var o = []; for (var i = 0; i < arguments.length; i += 2) o.push([arguments[i], arguments[i + 1]]); return o; }
  function box(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]; }
  function rbox(x, y, w, h, r) { return [].concat(arc(x + w - r, y + r, r, r, -Math.PI / 2, 0, 4), arc(x + w - r, y + h - r, r, r, 0, Math.PI / 2, 4), arc(x + r, y + h - r, r, r, Math.PI / 2, Math.PI, 4), arc(x + r, y + r, r, r, Math.PI, Math.PI * 1.5, 4), [[x + w - r, y]]); }
  function cat() { var o = []; for (var i = 0; i < arguments.length; i++) o = o.concat(arguments[i]); return o; }
  function hole(x, y) { return arc(x, y, 2.6, 2.6, 0, TAU, 8); }
  var SK = {
    // the operator's own tools
    switchboard: { h: 1.15, s: (function () { var s = [box(10, 6, 80, 88), ln(10, 24, 90, 24)]; for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) s.push(hole(22 + c * 14, 36 + r * 14)); s.push(ln(36, 50, 34, 70, 40, 84, 62, 88, 78, 78, 78, 64)); s.push(ln(22, 64, 18, 80, 30, 94, 50, 96, 50, 78)); s.push(ln(14, 12, 30, 12)); s.push(ln(70, 12, 86, 12)); return s; })() },
    headset: { h: 1, s: [arc(50, 50, 36, 38, Math.PI, TAU, 16), box(8, 46, 14, 26), box(78, 46, 14, 26), ln(22, 52, 26, 52, 26, 66, 22, 66), ln(78, 52, 74, 52, 74, 66, 78, 66), cat(ln(85, 72, 86, 84), arc(74, 84, 12, 10, 0, Math.PI * .9, 8)), arc(62, 88, 4, 3, 0, TAU, 8)] },
    dial: { h: 1, s: (function () { var s = [arc(50, 50, 44, 44, 0, TAU, 28), arc(50, 50, 14, 14, 0, TAU, 12)]; for (var i = 0; i < 10; i++) { var a = -Math.PI * .1 + i * (TAU / 12) + Math.PI * .5; s.push(arc(50 + Math.cos(a) * 30, 50 + Math.sin(a) * 30, 5, 5, 0, TAU, 8)); } s.push(ln(76, 78, 88, 90)); return s; })() },
    cord: { h: .6, s: [box(4, 20, 14, 10), ln(18, 22, 24, 22, 24, 28, 18, 28), box(82, 20, 14, 10), ln(82, 22, 76, 22, 76, 28, 82, 28), ln(24, 25, 30, 40, 42, 52, 56, 52, 70, 40, 76, 25)] },
    receiver: { h: .6, s: [cat(arc(18, 30, 12, 14, Math.PI * .6, Math.PI * 1.9, 10), ln(26, 20, 74, 20), arc(82, 30, 12, 14, Math.PI * 1.1, Math.PI * 2.4, 10)), ln(14, 44, 30, 44, 30, 32), ln(70, 32, 70, 44, 86, 44)] },
    // the app's own surfaces
    terminal: { h: .72, s: [box(4, 6, 92, 62), ln(4, 18, 96, 18), hole(11, 12), hole(19, 12), hole(27, 12), ln(12, 30, 18, 34, 12, 38), ln(24, 34, 44, 34), ln(12, 46, 52, 46), ln(12, 56, 34, 56), box(38, 52, 6, 8)] },
    board: { h: .8, s: [box(4, 6, 27, 72), box(36, 6, 27, 72), box(68, 6, 27, 72), ln(8, 14, 26, 14), ln(40, 14, 58, 14), ln(72, 14, 90, 14), box(8, 22, 19, 12), box(8, 40, 19, 12), box(40, 22, 19, 12), box(72, 22, 19, 12), box(72, 40, 19, 12), box(72, 58, 19, 12), ln(11, 28, 22, 28), ln(43, 28, 54, 28)] },
    tree: { h: 1, s: [ln(14, 8, 14, 90), ln(14, 20, 40, 20), hole(46, 20), ln(14, 40, 40, 40), hole(46, 40), ln(46, 40, 46, 60, 66, 60), hole(72, 60), ln(46, 60, 46, 76, 66, 76), hole(72, 76), ln(14, 88, 40, 88), hole(46, 88), ln(56, 20, 84, 20)] },
    worktree: { h: 1.1, s: [ln(30, 6, 30, 96), hole(30, 16), hole(30, 52), hole(30, 84), cat(ln(30, 26), arc(48, 26, 18, 14, Math.PI, Math.PI * 1.5, 6), ln(48, 12, 70, 12)), hole(76, 12), cat(ln(30, 60), arc(48, 60, 18, 14, Math.PI, Math.PI * 1.5, 6), ln(48, 46, 70, 46)), hole(76, 46), ln(76, 52, 76, 70, 40, 78, 30, 84)] },
    diff: { h: 1.2, s: [box(12, 4, 76, 96), ln(20, 18, 76, 18), ln(20, 30, 60, 30), ln(22, 44, 30, 44), ln(34, 44, 74, 44), ln(22, 56, 30, 56), ln(26, 52, 26, 60), ln(34, 56, 70, 56), ln(22, 68, 30, 68), ln(26, 64, 26, 72), ln(34, 68, 78, 68), ln(20, 84, 64, 84)] },
    ring: { h: 1, s: [arc(50, 52, 38, 38, Math.PI * .75, Math.PI * 2.25, 22), arc(50, 52, 30, 30, Math.PI * .75, Math.PI * 1.6, 12), ln(50, 52, 50 + Math.cos(Math.PI * 1.6) * 34, 52 + Math.sin(Math.PI * 1.6) * 34), ln(46, 92, 54, 92)] },
    ladder: { h: 1.4, s: [ln(28, 4, 24, 98), ln(72, 4, 76, 98), ln(27, 20, 73, 20), ln(26, 38, 74, 38), ln(26, 56, 74, 56), ln(25, 74, 75, 74), ln(25, 92, 76, 92), ln(60, 30, 66, 36, 58, 40)] },
    bars: { h: .8, s: [ln(4, 76, 96, 76), box(12, 46, 14, 30), box(34, 18, 14, 58), box(56, 34, 14, 42), box(78, 60, 14, 16), ln(14, 52, 24, 52), ln(14, 58, 24, 58), ln(14, 64, 24, 64), ln(14, 70, 24, 70), ln(36, 26, 46, 26), ln(36, 34, 46, 34), ln(36, 42, 46, 42)] },
    coins: { h: .9, s: [arc(50, 76, 34, 10, 0, TAU, 18), ln(16, 76, 16, 62), ln(84, 76, 84, 62), arc(50, 62, 34, 10, 0, TAU, 18), ln(16, 62, 16, 48), ln(84, 62, 84, 48), arc(50, 48, 34, 10, 0, TAU, 18), ln(16, 48, 16, 34), ln(84, 48, 84, 34), arc(50, 34, 34, 10, 0, TAU, 18), arc(50, 34, 14, 4, 0, TAU, 10)] },
    cmdk: { h: 1, s: [rbox(10, 10, 80, 80, 12), cat(arc(32, 34, 7, 7, 0, TAU, 10)), cat(arc(32, 60, 7, 7, 0, TAU, 10)), ln(38, 34, 38, 60), ln(26, 40, 46, 40), ln(26, 54, 46, 54), ln(58, 30, 58, 66), ln(76, 30, 60, 48, 78, 66)] },
    orbs: { h: .4, s: [arc(18, 20, 11, 11, 0, TAU, 14), arc(50, 20, 11, 11, 0, TAU, 14), arc(82, 20, 11, 11, 0, TAU, 14), ln(42, 14, 56, 28), ln(46, 10, 60, 24), ln(40, 20, 50, 30), ln(52, 8, 61, 17)] },
    fanout: { h: .8, s: [arc(14, 40, 5, 5, 0, TAU, 8), ln(19, 40, 60, 12), ln(19, 40, 60, 40), ln(19, 40, 60, 68), ln(60, 12, 52, 10, 56, 18), ln(60, 40, 52, 36, 52, 44), ln(60, 68, 52, 62, 56, 70), box(66, 4, 28, 16), box(66, 32, 28, 16), box(66, 60, 28, 16)] },
    keycap: { h: .9, s: [rbox(10, 10, 80, 72, 10), ln(24, 26, 52, 26), ln(24, 26, 24, 60), ln(24, 44, 46, 44), ln(60, 34, 74, 34), ln(60, 44, 74, 44), ln(60, 54, 74, 54)] },
    sheets: { h: 1.1, s: [box(24, 4, 56, 70), box(16, 14, 56, 70), box(8, 24, 56, 70), ln(16, 36, 52, 36), ln(16, 46, 56, 46), ln(16, 56, 40, 56), ln(16, 66, 50, 66)] },
    chip: { h: .5, s: [rbox(6, 8, 88, 34, 16), arc(22, 25, 7, 7, 0, TAU, 10), ln(36, 25, 80, 25)] },
    clock: { h: 1, s: [arc(50, 50, 42, 42, 0, TAU, 26), ln(50, 50, 50, 22), ln(50, 50, 68, 58), ln(50, 8, 50, 14), ln(92, 50, 86, 50), ln(50, 92, 50, 86), ln(8, 50, 14, 50)] },
    envelope: { h: .65, s: [box(6, 10, 88, 54), ln(6, 10, 50, 44, 94, 10), ln(6, 64, 38, 36), ln(94, 64, 62, 36)] },
    caret: { h: .5, s: [ln(10, 30, 26, 30), ln(30, 30, 44, 30), ln(48, 30, 66, 30), box(72, 20, 10, 20)] },
    folder: { h: .8, s: [ln(6, 18, 6, 72, 94, 72, 94, 26, 48, 26, 40, 18, 6, 18), ln(6, 34, 94, 34)] },
    // the door: what people leave with a pen and a minute
    arrow: { h: .55, s: [ln(6, 34, 88, 18), ln(72, 6, 88, 18, 70, 32)], mark: true },
    tally: { h: .8, s: [ln(14, 12, 12, 70), ln(30, 10, 28, 72), ln(46, 14, 44, 68), ln(62, 10, 60, 72), ln(4, 62, 76, 18)], mark: true },
    circle: { h: 1, s: [arc(50, 50, 44, 34, -.3, TAU + .2, 22)], mark: true },
    x: { h: 1, s: [ln(10, 10, 90, 90), ln(90, 10, 10, 90)], mark: true },
    check: { h: .8, s: [ln(8, 44, 36, 72, 92, 8)], mark: true },
    under: { h: .3, s: [ln(4, 12, 30, 8, 60, 14, 96, 6), ln(10, 24, 50, 22, 90, 26)], mark: true },
    star: { h: 1, s: [ln(50, 8, 62, 40, 96, 40, 68, 60, 78, 94, 50, 72, 22, 94, 32, 60, 4, 40, 38, 40, 50, 8)], mark: true },
    bracket: { h: 1.6, s: [ln(40, 4, 20, 8, 22, 50, 8, 52, 22, 54, 20, 96, 40, 100)], mark: true }
  };
  var SKETCH_NAMES = Object.keys(SK).filter(function (k) { return !SK[k].mark; });
  var MARK_NAMES = Object.keys(SK).filter(function (k) { return SK[k].mark; });

  // ---- setup --------------------------------------------------------------
  if (!window.requestAnimationFrame || !window.matchMedia || !document.createElement('canvas').getContext) return;
  var H3 = window.recHand3; if (!H3) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  var narrow = matchMedia('(max-width: ' + (MIN_W - 1) + 'px)');

  function mul32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function stream(n) { var f = mul32((n * 2654435761) >>> 0); for (var i = 0; i < 9; i++) f(); return f; }
  function rd(R, a, b) { return a + R() * (b - a); }
  function pk(R, arr) { return arr[(R() * arr.length) | 0]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 100000; }
  var qs = new URLSearchParams(location.search);
  var SEED = qs.has('s') ? +qs.get('s') : hashStr(location.pathname) + 1422;

  function h2(x, y, s) { var n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); }
  function vn(x, y, s) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return h2(xi, yi, s) * (1 - u) * (1 - v) + h2(xi + 1, yi, s) * u * (1 - v) + h2(xi, yi + 1, s) * (1 - u) * v + h2(xi + 1, yi + 1, s) * u * v; }
  function fbm(x, y, s, o) { var a = .5, f = 1, t = 0, n = 0; for (var i = 0; i < o; i++) { t += vn(x * f, y * f, s + i * 17) * a; n += a; a *= .5; f *= 2.03; } return t / n; }

  // ---- ink, from the tokens -----------------------------------------------
  var INK = [], DARK = true;
  function readInk() {
    var cs = getComputedStyle(document.documentElement);
    INK = INKS.map(function (k) { return (cs.getPropertyValue(k.v) || '').trim() || '#888888'; });
    var t = document.documentElement.getAttribute('data-theme');
    DARK = t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function pickInk(R, forced) {
    if (forced != null) return forced;
    var r = R(), acc = 0;
    for (var i = 0; i < INKS.length; i++) { acc += INKS[i].p; if (r < acc) return i; }
    return 0;
  }

  // ---- tiles: one canvas per TH px of document height ---------------------
  var host = null, TILES = [], W = 0, H = 0, S = 1, DONE = false, INSTANT = false;
  function emit(y0, y1, fn) {
    var a = clamp(Math.floor((y0 - 40) / TH), 0, TILES.length - 1), b = clamp(Math.floor((y1 + 40) / TH), 0, TILES.length - 1);
    for (var i = a; i <= b; i++) TILES[i].q.push(fn);
  }
  // a set of strokes in px, laid down one act per stroke through the hand's pen
  function lay(strokes, weight, alpha, col, seed) {
    for (var i = 0; i < strokes.length; i++) (function (s, si) {
      var y0 = 1e9, y1 = -1e9;
      for (var j = 0; j < s.length; j++) { if (s[j][1] < y0) y0 = s[j][1]; if (s[j][1] > y1) y1 = s[j][1]; }
      emit(y0, y1, function (cx) { cx.strokeStyle = col; H3.ink(cx, [s], 1, 0, 0, weight, alpha, seed + si); cx.globalAlpha = 1; });
    })(strokes[i], i);
  }

  // ---- the figure: rects no mark may touch, in document coordinates -------
  var FIG = [], SHEET = null;
  var FIGURE_SEL = '.topbar, .mast-plate, .spec, .mast-note, .sec-n, .opt-head, .panel, .notes, .stage-pair, .sec-lede, .prose p, table, .closing > *, .foot-top, .foot-base, .rest-label, .skip';
  function rect(r, pad) { return [r.left + scrollX - pad, r.top + scrollY - pad, r.right + scrollX + pad, r.bottom + scrollY + pad]; }
  function figure() {
    FIG = [];
    var els = document.querySelectorAll(FIGURE_SEL);
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      FIG.push(rect(r, 14));
    }
    // a section head's text, not its band: the band's middle is ground
    var heads = document.querySelectorAll('.wrap h2');
    for (var h = 0; h < heads.length; h++) {
      for (var c = heads[h].firstChild; c; c = c.nextSibling) {
        if (c.nodeType !== 3 || !c.textContent.trim()) continue;
        var rg = document.createRange(); rg.selectNodeContents(c);
        var rr = rg.getBoundingClientRect(); if (rr.width) FIG.push(rect(rr, 18));
      }
    }
    var wrap = document.querySelector('.wrap');
    SHEET = wrap ? rect(wrap.getBoundingClientRect(), 0) : null;
  }
  function free(x0, y0, x1, y1) {
    if (x0 < 0 || x1 > W || y0 < 0 || y1 > H) return false;
    for (var i = 0; i < FIG.length; i++) { var f = FIG[i]; if (x0 < f[2] && x1 > f[0] && y0 < f[3] && y1 > f[1]) return false; }
    return true;
  }
  function inSheet(x0, x1) { return SHEET && x1 > SHEET[0] && x0 < SHEET[2]; }
  function place(R, w, h, tries, gutterOnly) {
    for (var i = 0; i < tries; i++) {
      var x = rd(R, 0, W - w), y = rd(R, 0, H - h);
      if (gutterOnly && inSheet(x, x + w)) continue;
      if (!free(x, y, x + w, y + h)) continue;
      // marks gather where the noise is high, so there are busy and empty passages
      if (R() > .5 + fbm(x / 800, y / 500, SEED, 3) * .6) continue;
      FIG.push([x - 16, y - 16, x + w + 16, y + h + 16]);
      return [x, y];
    }
    return null;
  }
  function alphaAt(R, x0, x1) { var a = inSheet(x0, x1) ? ALPHA.sheet : ALPHA.gutter; return rd(R, a[0], a[1]) * (DARK ? CONTRAST.dark : CONTRAST.light); }

  // ---- the marks ----------------------------------------------------------
  var UNIT = H3.HW.grid.base - H3.HW.grid.xtop;   // letter units per x-height (48)
  function phrase(R, item, gutterOnly) {
    var text = typeof item === 'string' ? item : item.t, big = item.big, xh = big ? rd(R, PHRASE.big[0], PHRASE.big[1]) : rd(R, PHRASE.xh[0], PHRASE.xh[1]);
    var k = xh / UNIT, seed = (SEED * 7 + hashStr(text)) % 100000, L = H3.layout(H3.HW, text, seed), w = L.width * k, h = xh * 1.9;
    if (w > W * .6) return false;
    var p = place(R, w, h, 140, gutterOnly); if (!p) return false;
    var lean = rd(R, -.03, .03), tilt = rd(R, -.05, .05), ct = Math.cos(tilt), st = Math.sin(tilt);
    var ox = p[0], oy = p[1] + xh * 1.5, base = H3.HW.grid.base;
    var strokes = L.strokes.map(function (s) {
      return s.map(function (q) {
        var x = q[0] * k + (base - q[1]) * k * lean, y = (q[1] - base) * k;
        return [ox + x * ct - y * st, oy + x * st + y * ct];
      });
    });
    var a = alphaAt(R, p[0], p[0] + w) * (big ? .85 : 1), col = INK[pickInk(R, item.ink)], wt = rd(R, PHRASE.w[0], PHRASE.w[1]) * (big ? 1.5 : 1);
    lay(strokes, wt, a, col, seed);
    if (item.struck) {
      var ov = xh * .4, ym = -xh * .48, t2 = rd(R, -.12, .12) * xh, pts = [[-ov, ym - t2], [w * .5, ym + rd(R, -.1, .1) * xh], [w + ov, ym + t2]];
      lay([pts.map(function (q) { return [ox + q[0] * ct - q[1] * st, oy + q[0] * st + q[1] * ct]; })], wt * 1.1, a, col, seed + 99);
    }
    return true;
  }
  function wobble(R, pts, amt, sd) {
    // the pen's wander over a sketch, the same as the letters get in hand.js
    var o = [];
    for (var i = 0; i < pts.length; i++) {
      var x = pts[i][0], y = pts[i][1];
      o.push([x + (H3vn(x * .04, y * .04, sd) - .5) * amt, y + (H3vn(x * .04 + 7, y * .04, sd + 5) - .5) * amt]);
    }
    return o;
  }
  function H3vn(x, y, s) { return fbm(x, y, s, 2); }
  function dense(pl, step) {
    var o = [pl[0]];
    for (var i = 1; i < pl.length; i++) {
      var a = pl[i - 1], b = pl[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(d / step));
      for (var j = 1; j <= n; j++) o.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]);
    }
    return o;
  }
  function sketch(R, name, gutterOnly) {
    var K = SK[name]; if (!K) return false;
    var sz = K.mark ? rd(R, 30, 70) : rd(R, SKETCH.size[0], SKETCH.size[1]);
    if (!gutterOnly) sz *= .8;
    var w = sz, h = sz * K.h, t = rd(R, -SKETCH.tilt, SKETCH.tilt), ct = Math.cos(t), st = Math.sin(t);
    var p = place(R, w * 1.1, h * 1.1, 120, gutterOnly); if (!p) return false;
    var cx = p[0] + w * .55, cy = p[1] + h * .55, seed = (SEED * 13 + hashStr(name) + (p[0] | 0)) % 100000;
    var strokes = K.s.map(function (s) {
      var d = dense(s, 4), wob = wobble(R, d, 3.2, seed);
      return wob.map(function (q) { var x = (q[0] - 50) / 100 * w, y = (q[1] / 100 - K.h / 2) * w; return [cx + x * ct - y * st, cy + x * st + y * ct]; });
    });
    var a = alphaAt(R, p[0], p[0] + w), col = INK[pickInk(R)], wt = rd(R, SKETCH.w[0], SKETCH.w[1]) * (K.mark ? 1.25 : 1);
    lay(strokes, wt, a, col, seed);
    return true;
  }
  function drill(R) {
    var xh = rd(R, 7, 11), len = rd(R, DRILL.len[0], DRILL.len[1]), kind = pk(R, ['over', 'under', 'oval', 'zig']);
    var p = place(R, len + xh, xh * 1.6, 30); if (!p) return false;
    var x = p[0] + xh * .3, y = p[1] + xh * 1.3, sl = .14, unit = xh * .55, px = x, pts = [], strokes = [];
    if (kind === 'over' || kind === 'under') {
      while (px < x + len) { for (var q = 0; q <= 8; q++) { var u = q / 8, yy = kind === 'over' ? y - xh * Math.sin(u * Math.PI) : y - xh + xh * Math.sin(u * Math.PI); pts.push([px + u * unit + (y - yy) * sl, yy]); } px += unit; }
      strokes.push(pts);
    } else if (kind === 'oval') {
      while (px < x + len) { var ov = []; for (var a2 = 0; a2 <= 14; a2++) { var th = 1.2 - TAU * a2 / 14, yy2 = y - xh / 2 + Math.sin(th) * xh / 2; ov.push([px + unit * .5 + Math.cos(th) * unit * .48 + (y - yy2) * sl, yy2]); } strokes.push(ov); px += unit * .92; }
    } else {
      var n = 0; while (px < x + len) { pts.push([px + (n % 2 ? 0 : xh * sl), n % 2 ? y : y - xh]); px += unit * .55; n++; } strokes.push(pts);
    }
    var seed = (SEED * 3 + (p[1] | 0)) % 100000;
    lay(strokes.map(function (s) { return wobble(R, dense(s, 3), 2, seed); }), rd(R, .8, 1.1), alphaAt(R, p[0], p[0] + len) * .7, INK[0], seed);
    return true;
  }

  function generate() {
    var R = stream(SEED * 101 + 1);
    // the free ground, sampled, sets how much goes on the wall
    var hits = 0, N = 1200, Rs = stream(SEED * 101 + 2);
    for (var i = 0; i < N; i++) { var x = Rs() * W, y = Rs() * H; if (free(x, y, x + 1, y + 1)) hits++; }
    var unit = W * H * hits / N / (300 * 300) * DENSITY;
    var n = Math.round(unit), nSk = Math.round(n * SHARE.sketch), nPh = Math.round(n * SHARE.phrase), nDr = Math.max(0, n - nSk - nPh);
    var gutter = SHEET && (SHEET[0] > 120 || W - SHEET[2] > 120);
    // the phrases first, big ones in the gutters where there is room for them
    var pool = PHRASES.slice(); for (var s = pool.length - 1; s > 0; s--) { var j = (R() * (s + 1)) | 0, t = pool[s]; pool[s] = pool[j]; pool[j] = t; }
    var bigs = pool.filter(function (p) { return p.big; }), rest = pool.filter(function (p) { return !p.big; });
    var placed = 0, k;
    for (k = 0; k < bigs.length && placed < Math.min(5, nPh); k++) if (phrase(R, bigs[k], gutter && SHEET[0] > 420)) placed++;
    for (k = 0; k < rest.length && placed < nPh; k++) if (phrase(R, rest[k], false)) placed++;
    var skPool = [], nsk = 0, nm = 0;
    for (k = 0; k < nSk; k++) {
      if (!skPool.length) skPool = SKETCH_NAMES.slice();
      var name = skPool.splice((R() * skPool.length) | 0, 1)[0];
      if (R() < .22) { if (sketch(R, pk(R, MARK_NAMES), false)) nm++; }
      else if (sketch(R, name, gutter && R() < .55)) nsk++;
    }
    var nd = 0; for (k = 0; k < nDr; k++) if (drill(R)) nd++;
    host.setAttribute('data-wall', 'phrases ' + placed + ' sketches ' + nsk + ' marks ' + nm + ' drills ' + nd + ' ' + W + 'x' + H);
    DONE = true;
  }

  // ---- layout: tiles the document, gathers the figure, generates, draws ---
  var raf = null;
  function clear() {
    if (host) host.textContent = '';
    TILES = []; DONE = false;
  }
  function layout(instant) {
    clear();
    if (narrow.matches) { host.style.display = 'none'; return; }
    host.style.display = '';
    try { build(instant); } catch (e) { clear(); if (window.console) console.error('wall: no wall,', e); }
  }
  function build(instant) {
    readInk();
    W = document.documentElement.clientWidth; H = document.documentElement.scrollHeight;
    host.style.height = H + 'px';
    S = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
    var n = Math.ceil(H / TH);
    for (var i = 0; i < n; i++) {
      var y0 = i * TH, h = Math.min(TH, H - y0);
      var cv = document.createElement('canvas');
      cv.width = Math.round(W * S); cv.height = Math.round(h * S);
      cv.style.top = y0 + 'px'; cv.style.width = W + 'px'; cv.style.height = h + 'px';
      var cx = cv.getContext('2d'); if (!cx) throw new Error('no 2d context');
      host.appendChild(cv);
      cx.setTransform(S, 0, 0, S, 0, -y0 * S);
      TILES.push({ cv: cv, cx: cx, y0: y0, q: [], qi: 0, active: false });
    }
    figure();
    generate();
    INSTANT = !!instant || still.matches;
    if (INSTANT) { for (var k = 0; k < TILES.length; k++) { TILES[k].active = true; drain(TILES[k], 1e9); } }
    else if (!raf) raf = requestAnimationFrame(tick);
  }
  function drain(T, budget) {
    while (T.qi < T.q.length && budget-- > 0) T.q[T.qi++](T.cx);
    if (T.qi >= T.q.length) { T.q = []; T.qi = 0; }
  }
  function tick() {
    raf = null;
    try { step(); } catch (e) { clear(); if (window.console) console.error('wall: no wall,', e); }
  }
  function step() {
    var sy = scrollY, vh = innerHeight, lead = sy + vh * LEAD, pending = false, t0 = performance.now();
    var order = TILES.slice().sort(function (a, b) {
      var da = Math.max(0, a.y0 - (sy + vh), sy - (a.y0 + TH)), db = Math.max(0, b.y0 - (sy + vh), sy - (b.y0 + TH));
      return da - db;
    });
    var left = DRAIN, live = [];
    for (var i = 0; i < order.length; i++) {
      var T = order[i];
      if (!T.active && T.y0 < lead) T.active = true;
      if (!T.active) { pending = true; continue; }
      if (T.qi < T.q.length) live.push(T);
    }
    while (live.length && left > 0 && performance.now() - t0 < BUDGET) {
      for (var j = 0; j < live.length && left > 0; j++) {
        var L = live[j];
        L.q[L.qi++](L.cx); left--;
        if (L.qi >= L.q.length) { L.q = []; L.qi = 0; live.splice(j--, 1); }
      }
    }
    if (live.length) pending = true;
    if (pending) raf = requestAnimationFrame(tick);
  }

  // ---- when to lay it out -------------------------------------------------
  host = document.createElement('div');
  host.className = 'wall'; host.setAttribute('aria-hidden', 'true');
  document.body.appendChild(host);
  var timer = null, laid = false, lastH = 0;
  function schedule(instant) {
    clearTimeout(timer);
    timer = setTimeout(function () { layout(instant); laid = true; lastH = document.documentElement.scrollHeight; }, laid ? 200 : 0);
  }
  var loaded = new Promise(function (res) { if (document.readyState === 'complete') res(); else window.addEventListener('load', res); });
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fonts]).then(function () { schedule(false); });
  window.addEventListener('resize', function () { if (laid) schedule(true); });
  narrow.addEventListener('change', function () { if (laid) schedule(true); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (laid) schedule(true); });
  new MutationObserver(function () { if (laid) schedule(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('scroll', function () {
    if (!raf && !INSTANT && DONE) raf = requestAnimationFrame(tick);
    // the document grew (a late image, a font): the wall is laid out again
    if (laid && Math.abs(document.documentElement.scrollHeight - lastH) > 40) schedule(true);
  }, { passive: true });
  window.opWall = { relayout: function () { schedule(true); }, sketches: SK, phrases: PHRASES };
})();
