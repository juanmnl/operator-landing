// THE HAND, v3: Juan's actual handwriting, from the notebooks.
// All capitals, written fast with a fine pen, letters standing apart and
// now and then touching, a slight forward lean, accents as quick ticks
// above the cap line, and digits (the notebooks have them: 1979, 90.000,
// 003), so nothing counted has to fall back to type any more.
//
// What is his, drawn from the pages:
// - E is rounded, a C with a bar through the middle (ES, DE, QUE);
// - N is an n at cap height: stem, arch, stem, no diagonal;
// - M is an m at cap height: stem and two arches;
// - A is two strokes meeting at the top with a low bar;
// - R has an open bowl and a leg that starts from the bowl;
// - the round letters (O C G Q D) are a hair narrower than tall;
// - words are spaced by about half a letter, letters by a fifth.
//
// Runtime layer, like v2: nothing here edits handwriting.html. Glyphs are
// polylines in the data's letter units (cap top 40, base 88), unslanted;
// the lean is applied at layout, as is the jitter that makes the same
// letter differ each time it is written. Text is uppercased on the way in.
(function () {
  'use strict';
  var T = 40, B = 88, MID = 64, RAD = Math.PI / 180;
  function arc(cx, cy, rx, ry, a0, a1, n) { var o = []; for (var i = 0; i <= n; i++) { var t = (a0 + (a1 - a0) * i / n) * RAD; o.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); } return o; }
  function ln() { var o = []; for (var i = 0; i < arguments.length; i += 2) o.push([arguments[i], arguments[i + 1]]); return o; }
  function cat() { var o = []; for (var i = 0; i < arguments.length; i++) o = o.concat(arguments[i]); return o; }
  var G = {};
  function g(c, w, strokes, alt, altP) { G[c] = { w: w, s: strokes, alt: alt || null, altP: altP || 0 }; }

  g('A', 42, [ln(4, B, 21, T, 38, B), ln(11, 72, 31, 72)], [cat(ln(5, B, 12, 52), arc(21, 50, 9, 10, 180, 360, 6), ln(30, 52, 37, B)), ln(11, 72, 31, 72)], .3);
  g('B', 38, [ln(8, B, 8, T), cat(ln(8, T, 19, T), arc(19, 52, 12, 12, -90, 90, 8), ln(19, 64, 8, 64)), cat(ln(8, 64, 21, 64), arc(21, 76, 13, 12, -90, 90, 8), ln(21, B, 8, B))]);
  g('C', 36, [arc(21, MID, 16, 24, -55, -305, 14)]);
  g('D', 40, [ln(8, B, 8, T), cat(ln(8, T, 19, T), arc(19, MID, 17, 24, -90, 90, 12), ln(19, B, 8, B))]);
  g('E', 34, [ln(31, T, 8, T, 8, B, 31, B), ln(8, MID, 26, MID)], [arc(21, MID, 16, 24, -60, -300, 14), ln(10, MID, 26, MID)], .45);
  g('F', 36, [ln(8, B, 8, T), ln(8, T, 34, T), ln(8, 63, 28, 63)]);
  g('G', 40, [cat(arc(21, MID, 16, 24, -55, -290, 14), ln(36, 72, 36, 62, 24, 62))]);
  g('H', 38, [ln(6, T, 6, B), ln(32, T, 32, B), ln(6, MID, 32, MID)]);
  g('I', 16, [ln(8, 56, 8, B), ln(7.5, 43, 8.5, 44.5)]);
  g('J', 32, [ln(18, T, 30, T), cat(ln(25, T, 25, 80), arc(16, 80, 9, 12, 0, 180, 8))]);
  g('K', 36, [ln(8, T, 8, B), ln(31, T, 9, 65), ln(12, 62, 33, B)]);
  g('L', 32, [ln(6, T, 6, B, 30, B)]);
  g('M', 48, [ln(5, B, 7, T, 23, 70, 39, T, 41, B)], [cat(ln(6, B, 6, 44), arc(13.5, 47, 7.5, 7, 180, 360, 6), ln(21, 47, 21, B)), cat(ln(21, 58, 21, 47), arc(29, 47, 8, 7, 180, 360, 6), ln(37, 47, 37, B))], .4);
  g('N', 40, [ln(7, B, 7, T, 33, B, 33, T)], [cat(ln(8, B, 8, 46), arc(20, 47, 12, 7, 180, 360, 8), ln(32, 47, 32, B))], .45);
  g('O', 40, [arc(20, MID, 15, 24, -80, 280, 16)]);
  g('P', 36, [ln(8, B, 8, T), cat(ln(8, T, 20, T), arc(20, 53, 13, 13, -90, 90, 8), ln(20, 66, 8, 66))]);
  g('Q', 42, [arc(20, MID, 15, 24, -80, 280, 16), ln(16, 74, 24, 84, 36, 96)]);
  g('R', 40, [ln(8, B, 8, T), cat(ln(8, T, 20, T), arc(20, 53, 13, 13, -90, 90, 8), ln(20, 66, 9, 66)), ln(17, 66, 36, B)]);
  g('S', 32, [cat(arc(18, 51, 10, 11, -20, -255, 10), arc(17, 75, 11, 13, -95, 140, 10))]);
  g('T', 38, [ln(4, T, 34, T), ln(19, T, 19, B)]);
  g('U', 40, [cat(ln(6, T, 6, 70), arc(20, 70, 14, 18, 180, 0, 10), ln(34, 70, 34, T))]);
  g('V', 40, [ln(4, T, 20, B, 36, T)]);
  g('W', 50, [ln(4, T, 14, B, 24, 48, 34, B, 44, T)]);
  g('X', 40, [ln(6, T, 34, B), ln(34, T, 6, B)]);
  g('Y', 40, [ln(4, T, 20, MID, 36, T), ln(20, MID, 20, B)]);
  g('Z', 40, [ln(6, T, 34, T, 6, B, 34, B)]);
  // digits
  g('0', 32, [arc(16, MID, 11, 24, -80, 280, 14)]);
  g('1', 22, [ln(7, 52, 15, T, 15, B)]);
  g('2', 32, [cat(arc(16, 51, 10, 11, -170, 30, 9), ln(24.7, 56.5, 7, 84), arc(11, 84, 4, 4, 180, 400, 5), ln(14, 88, 29, 87))]);
  g('3', 34, [cat(arc(16, 52, 10, 12, -150, 90, 10), arc(16, 76, 11, 12, -90, 150, 10))]);
  g('4', 34, [ln(20, T, 6, 70, 31, 70), ln(24, 56, 24, B)]);
  g('5', 34, [cat(ln(29, T, 9, T, 8, 60), arc(18, 73, 12, 15, -100, 160, 12))]);
  g('6', 34, [cat(ln(26, T, 12, 56, 7, 72), arc(17, 74, 11, 14, 180, 540, 14))]);
  g('7', 34, [ln(6, T, 30, T, 14, B)]);
  g('8', 34, [cat(arc(16, 52, 10, 12, -90, 270, 12), arc(16, 76, 12, 12, -90, -450, 12))]);
  g('9', 34, [cat(arc(17, 54, 11, 14, 0, -360, 14), ln(28, 54, 27, 74, 22, B))]);
  // punctuation
  g('.', 12, [ln(5, 86, 6, B)]);
  g(',', 12, [ln(8, 82, 3, 97)]);
  g(':', 12, [ln(5, 62, 6, 64), ln(5, 86, 6, B)]);
  g(';', 12, [ln(5, 62, 6, 64), ln(7, 84, 4, 95)]);
  g('!', 14, [ln(7, T, 7, 76), ln(7, 86, 7, B)]);
  g('¡', 14, [ln(7, 42, 7, 44), ln(7, 54, 7, 98)]);
  g('?', 30, [cat(arc(15, 51, 9, 11, -160, 60, 10), ln(19.5, 60.5, 15, 70, 15, 76)), ln(15, 86, 15, B)]);
  g('¿', 30, [ln(15, 42, 15, 44), cat(ln(15, 54, 15, 64), arc(15, 76, 9, 11, -90, -340, 10))]);
  g('-', 24, [ln(4, MID, 20, MID)]);
  g('–', 30, [ln(4, MID, 26, MID)]);
  g("'", 10, [ln(6, T, 4, 50)]);
  g('"', 18, [ln(6, T, 4, 50), ln(14, T, 12, 50)]);
  g('(', 20, [arc(24, MID, 14, 27, 110, 250, 10)]);
  g(')', 20, [arc(-4, MID, 14, 27, -70, 70, 10)]);
  g('/', 28, [ln(4, B, 24, T)]);
  g('&', 34, [cat(ln(14, B, 18, 60), arc(20, 49, 6, 9, 200, 470, 8), ln(22, 58, 24, B)), ln(8, 70, 30, 66)]);
  g('+', 30, [ln(4, MID, 26, MID), ln(15, 52, 15, 76)]);
  g('·', 12, [ln(5, 62, 6, 64)]);
  // accents: a quick tick above the cap line, the diaeresis two dots, the
  // tilde a short wave. The base letter is his, the mark rides on it.
  function acute(x) { return ln(x, 34, x + 9, 25); }
  function withMark(base, mark, c) { var b = G[base]; G[c] = { w: b.w, s: b.s.concat([mark]), alt: b.alt ? b.alt.concat([mark]) : null, altP: b.altP }; }
  withMark('A', acute(16), 'Á'); withMark('E', acute(17), 'É'); withMark('I', acute(4), 'Í'); withMark('O', acute(16), 'Ó'); withMark('U', acute(16), 'Ú');
  withMark('U', ln(12, 30, 13, 31), 'Ü'); G['Ü'].s.push(ln(26, 30, 27, 31));
  withMark('N', ln(9, 31, 15, 26, 24, 31, 31, 26), 'Ñ');

  // to the data's shape (M x y L x y ... per stroke) so a glyph can move
  // into hw-data as it is
  var LETTERS = {};
  Object.keys(G).forEach(function (c) {
    var toD = function (st) { return st.map(function (pl) { return 'M ' + pl.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L '); }); };
    LETTERS[c] = { w: G[c].w, d: toD(G[c].s), n: G[c].s.length };
    if (G[c].alt) { LETTERS[c].alt = { w: G[c].w, d: toD(G[c].alt), n: G[c].alt.length }; LETTERS[c].altP = G[c].altP; }
  });
  var HW = { grid: { asc: 22, xtop: T, base: B, desc: 100, stroke: 3, slant: 0.08 }, letters: LETTERS, joins: { high: [], lift: [] }, caps: true };

  // the layout: letters set apart at a fifth of a letter, a touch of
  // jitter in the gap, the baseline, the size and the tilt of every
  // letter, so the same word is never written twice the same; the lean is
  // a shear applied here. The seed keeps a line stable between redraws.
  function mul32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // value noise, the wall's kind, for the pen's wander
  function vn(x, y, sd) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; function h(a, b) { var n = Math.sin(a * 127.1 + b * 311.7 + sd * 74.7) * 43758.5453; return n - Math.floor(n); } var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return (h(xi, yi) * (1 - u) + h(xi + 1, yi) * u) * (1 - v) + (h(xi, yi + 1) * (1 - u) + h(xi + 1, yi + 1) * u) * v; }
  function fbm(x, y, sd) { return (vn(x, y, sd) * .6 + vn(x * 2.1, y * 2.1, sd + 3) * .4); }
  // a polyline resampled to a step, so the pen's wander has points to move
  function dense(pl, step) {
    var o = [pl[0]];
    for (var i = 1; i < pl.length; i++) {
      var a = pl[i - 1], b = pl[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(d / step));
      for (var j = 1; j <= n; j++) o.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]);
    }
    return o;
  }
  function layout(H, text, seed) {
    var R = mul32((seed || 7) * 2654435761 >>> 0), rd = function (a, b) { return a + R() * (b - a); };
    var up = String(text).toUpperCase(), strokes = [], px = 4, slant = H.grid.slant + rd(-.04, .04);
    // the line itself: a slow drift of the baseline and a lean of the
    // whole line, the way a line written without a rule goes
    var drift = rd(2, 4), driftF = rd(.006, .012), driftP = rd(0, 6), lineTilt = rd(-.012, .012), sd = (seed || 7) % 1000;
    for (var i = 0; i < up.length; i++) {
      var c = up[i];
      if (c === ' ') { px += 24 + rd(-3, 8); continue; }
      var L = H.letters[c]; if (!L) continue;
      if (L.alt && R() < L.altP) L = L.alt;
      var small = 'OCSEGQ0'.indexOf(c) >= 0 && R() < .6;
      var sy = small ? rd(.72, .92) : rd(.9, 1.08), sx = rd(.8, 1.02), tilt = rd(-4, 4) * RAD, dy = rd(-2, 2) + Math.sin(px * driftF + driftP) * drift + Math.max(-5, Math.min(5, px * lineTilt)), gap = rd(-1, 4);
      if (R() < .38) gap = rd(-5, -1);
      var w = L.w * sx, wf = rd(.6, 1.6), wp = rd(0, 9);
      L.d.forEach(function (d, si) {
        var pts = d.match(/-?[\d.]+/g).map(Number), raw = [];
        for (var k = 0; k < pts.length; k += 2) raw.push([pts[k], pts[k + 1]]);
        // overshoot: the pen runs a little past where the stroke ends,
        // and starts a hair before it (the apex of an A crosses)
        if (raw.length > 1) {
          var a0 = raw[0], a1 = raw[1], e0 = raw[raw.length - 2], e1 = raw[raw.length - 1];
          var ds = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) || 1, de = Math.hypot(e1[0] - e0[0], e1[1] - e0[1]) || 1;
          var os = rd(0, 2.5), oe = rd(0.5, 4);
          raw[0] = [a0[0] - (a1[0] - a0[0]) / ds * os, a0[1] - (a1[1] - a0[1]) / ds * os];
          raw[raw.length - 1] = [e1[0] + (e1[0] - e0[0]) / de * oe, e1[1] + (e1[1] - e0[1]) / de * oe];
        }
        var pl = dense(raw, 3), out = [], ph = rd(0, 40);
        for (var m = 0; m < pl.length; m++) {
          var x = pl[m][0] * sx, y = B + (pl[m][1] - B) * sy;
          // the hand's wander: a slow bow across the stroke, plus a fine tremor
          x += (fbm(x * .03 * wf + wp, y * .03 + ph, sd) - .5) * 5 + (fbm(x * .3, y * .3 + ph, sd + 9) - .5) * 1.8;
          y += (fbm(x * .03 + ph, y * .03 * wf + wp, sd + 5) - .5) * 4 + (fbm(x * .3 + ph, y * .3, sd + 13) - .5) * 1.8;
          var cx = w / 2, rx = cx + (x - cx) * Math.cos(tilt) - (y - B) * Math.sin(tilt), ry = B + (x - cx) * Math.sin(tilt) + (y - B) * Math.cos(tilt);
          out.push([px + rx + (B - ry) * slant, ry + dy]);
        }
        strokes.push(out);
      });
      px += w + gap;
    }
    return { width: px + 6, strokes: strokes };
  }
  // the pen: one fine line whose weight breathes along the stroke, a
  // touch heavier where the pen lands, lighter where it lifts, and the
  // ink slightly uneven. Shared by every page that writes in this hand.
  // strokes are in letter units; k scales to px; ox, oy offset in px.
  function ink(cx, strokes, k, ox, oy, weight, alpha, seed) {
    var sd = (seed || 3) % 1000;
    cx.lineCap = 'round'; cx.lineJoin = 'round';
    strokes.forEach(function (s, si) {
      var n = s.length; if (n < 2) return;
      for (var i = 1; i < n; i++) {
        var press = .9 + fbm(i * .2 + si, si * .7, sd) * .2;
        // pooling: the sharper the turn at this point, the more ink
        if (i < n - 1) {
          var ax = s[i][0] - s[i - 1][0], ay = s[i][1] - s[i - 1][1], bx = s[i + 1][0] - s[i][0], by = s[i + 1][1] - s[i][1];
          var la = Math.hypot(ax, ay) || 1, lb = Math.hypot(bx, by) || 1, cos = (ax * bx + ay * by) / (la * lb);
          if (cos < .6) press += (0.6 - cos) * .55;
        }
        // lands a hair heavy, lifts blunt
        if (i === 1) press += .12;
        cx.beginPath();
        cx.moveTo(s[i - 1][0] * k + ox, s[i - 1][1] * k + oy);
        cx.lineTo(s[i][0] * k + ox, s[i][1] * k + oy);
        cx.lineWidth = weight * press;
        cx.globalAlpha = alpha * (.94 + fbm(i * .11, si, sd + 7) * .12);
        cx.stroke();
      }
    });
  }
  window.recHand3 = { HW: HW, layout: layout, ink: ink, letters: LETTERS };
})();
