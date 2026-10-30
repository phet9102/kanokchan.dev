/* Exam generator core: seeded RNG, fractions, answer-choice builders and SVG drawing helpers.
   Every question bank registers generators with EXAM.add({...}); a generator receives a seeded
   RNG and returns { q, fig?, choices, answer, sol, solFig?, figChoices? }. All text is authored
   here (never user input), so it is inserted as HTML; maths is written between $…$ for KaTeX. */
(function (g) {
  "use strict";
  const X = (g.EXAM = g.EXAM || {});
  X.bank = X.bank || [];
  X.add = def => { X.bank.push(def); };

  /* ---------------- seeded random ---------------- */
  X.rng = function (seed) {
    let a = seed >>> 0;
    const f = () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const R = {
      seed,
      next: f,
      int: (lo, hi) => lo + Math.floor(f() * (hi - lo + 1)),
      pick: arr => arr[Math.floor(f() * arr.length)],
      shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
      chance: p => f() < p,
      sign: () => (f() < 0.5 ? -1 : 1),
    };
    R.sample = (arr, n) => R.shuffle(arr).slice(0, n);
    return R;
  };

  /* ---------------- numbers ---------------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  X.gcd = gcd;
  X.round = (x, dp = 2) => { const m = 10 ** dp; return Math.round((x + Number.EPSILON * Math.sign(x)) * m) / m; };
  // fixed decimals, Thai-style thousands separators, real minus sign when used outside TeX
  X.fmt = (x, dp = 2) => {
    const s = X.round(x, dp).toFixed(dp);
    const [i, d] = s.split(".");
    const ii = i.replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");
    return d ? ii + "." + d : ii;
  };
  // trims trailing zeros: 2.50 -> 2.5, 3.00 -> 3
  X.num = (x, dp = 3) => {
    let s = X.round(x, dp).toFixed(dp);
    if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
    if (s === "-0") s = "0";
    return s.replace(/^(-?\d+)/, m => m.replace(/\B(?=(\d{3})+(?!\d))/g, "{,}"));
  };
  // scientific notation in TeX: 3.2 \times 10^{-4}
  X.sci = (x, sig = 2) => {
    if (x === 0) return "0";
    let e = Math.floor(Math.log10(Math.abs(x)));
    let ms = (x / 10 ** e).toFixed(sig - 1);
    if (Math.abs(parseFloat(ms)) >= 10) { e += 1; ms = (x / 10 ** e).toFixed(sig - 1); }
    return e === 0 ? ms : `${ms} \\times 10^{${e}}`;
  };

  /* ---------------- fractions ---------------- */
  class Frac {
    constructor(n, d = 1) {
      if (d === 0) throw new Error("zero denominator");
      if (d < 0) { n = -n; d = -d; }
      const k = gcd(n, d);
      this.n = n / k; this.d = d / k;
    }
    static of(x) { return x instanceof Frac ? x : new Frac(x, 1); }
    add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    eq(o) { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
    get v() { return this.n / this.d; }
    valueOf() { return this.v; }
    tex() { // \frac{3}{4}, -\frac{1}{2}, 5
      if (this.d === 1) return String(this.n);
      return (this.n < 0 ? "-" : "") + `\\frac{${Math.abs(this.n)}}{${this.d}}`;
    }
    dtex() { return this.d === 1 ? String(this.n) : (this.n < 0 ? "-" : "") + `\\dfrac{${Math.abs(this.n)}}{${this.d}}`; }
    // coefficient in front of a symbol: 1 -> "", -1 -> "-", 3/2 -> \frac{3}{2}
    coef() { if (this.n === this.d) return ""; if (this.n === -this.d) return "-"; return this.tex(); }
  }
  X.Frac = Frac;
  X.F = (n, d) => new Frac(n, d);

  /* ---------------- answer choices ----------------
     Every builder returns { choices: [html], answer: index } with exactly five distinct choices. */
  const m = s => "$" + s + "$";
  X.m = m;

  // numeric answers: values are numbers, fmt turns a number into TeX; choices sorted ascending like the real paper
  X.numOpts = (ans, wrongs, fmt = v => X.num(v), o = {}) => {
    const seen = new Set();
    const items = [];
    const push = (v, ok) => {
      if (!Number.isFinite(v)) return;
      const t = fmt(v);
      if (seen.has(t) || (!ok && o.min != null && v < o.min)) return;
      seen.add(t); items.push({ v, t, ok });
    };
    push(ans, true);
    for (const w of wrongs) { if (items.length >= 5) break; push(w, false); }
    // pad with nearby values if distractors collided
    const step = o.step || (Math.abs(ans) >= 10 ? Math.max(1, Math.round(Math.abs(ans) * 0.1)) : Math.abs(ans) >= 1 ? 1 : 0.1);
    for (let k = 1; items.length < 5 && k < 80; k++) {
      const c = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step;
      if (o.posOnly && c <= 0) continue;
      if (o.min != null && c < o.min) continue;
      push(c, false);
    }
    if (o.sort !== false) items.sort((a, b) => a.v - b.v);
    return { choices: items.map(i => (o.raw ? i.t : m(i.t))), answer: items.findIndex(i => i.ok) };
  };

  // fraction answers (Frac objects)
  X.fracOpts = (ans, wrongs, o = {}) => {
    const seen = new Set();
    const items = [];
    const push = (f, ok) => { if (!f) return; const t = f.tex(); if (seen.has(t)) return; seen.add(t); items.push({ v: f.v, t, ok }); };
    push(ans, true);
    for (const w of wrongs) { if (items.length >= 5) break; push(w, false); }
    for (let k = 1; items.length < 5; k++) push(ans.add(new Frac(k % 2 ? k : -k, ans.d * (k + 1))), false);
    if (o.sort !== false) items.sort((a, b) => a.v - b.v);
    return { choices: items.map(i => m(i.t)), answer: items.findIndex(i => i.ok) };
  };

  // free-form answers (already formatted HTML/TeX); shuffled unless keepOrder
  X.opts = (R, ans, wrongs, o = {}) => {
    const seen = new Set([ans]);
    const w = [];
    for (const x of wrongs) if (!seen.has(x)) { seen.add(x); w.push(x); }
    if (w.length < 4) throw new Error("not enough distinct distractors");
    const list = [ans, ...(o.keepWrongOrder ? w.slice(0, 4) : R.shuffle(w).slice(0, 4))];
    const arr = o.fixed ? o.fixed(list) : R.shuffle(list);
    return { choices: arr, answer: arr.indexOf(ans) };
  };

  // fixed list of choices in a set order; answer given by value
  X.fixedOpts = (list, ans) => ({ choices: list.slice(), answer: list.indexOf(ans) });

  /* ---------------- SVG ----------------
     Figures use CSS classes so they follow the page theme (and print in black on white):
     .ln stroke=text  .mu stroke=muted  .ac stroke=cyan  .am stroke=amber  .rd stroke=red
     .fa fill=cyan-tint  .fb fill=amber-tint  .fg fill=muted-tint  .fs fill=text  .no fill=none */
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const r1 = v => Math.round(v * 10) / 10;
  const S = {};
  S.svg = (w, h, body, label = "รูปประกอบ") =>
    `<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  S.line = (x1, y1, x2, y2, c = "ln", extra = "") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${c}" ${extra}/>`;
  S.dash = (x1, y1, x2, y2, c = "mu") => S.line(x1, y1, x2, y2, c + " dsh");
  S.rect = (x, y, w, h, c = "ln nf", rx = 0) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" class="${c}"/>`;
  S.circle = (cx, cy, r, c = "ln nf") => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" class="${c}"/>`;
  S.path = (d, c = "ln nf") => `<path d="${d}" class="${c}"/>`;
  S.poly = (pts, c = "ln nf", closed = true) => `<${closed ? "polygon" : "polyline"} points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="${c}"/>`;
  S.text = (x, y, s, o = {}) => {
    const cls = ["tx", o.c || "", o.i ? "it" : "", o.b ? "bd" : ""].join(" ").trim();
    const anchor = o.a || "middle";
    return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}" dominant-baseline="${o.base || "middle"}"${o.size ? ` font-size="${o.size}"` : ""}>${o.html ? s : esc(s)}</text>`;
  };
  // arrow with filled head; c = stroke class (head uses the matching fill)
  S.arrow = (x1, y1, x2, y2, c = "ln", head = 9) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - head * Math.cos(a), by = y2 - head * Math.sin(a);
    const p1 = [bx + head * 0.45 * Math.sin(a), by - head * 0.45 * Math.cos(a)];
    const p2 = [bx - head * 0.45 * Math.sin(a), by + head * 0.45 * Math.cos(a)];
    return S.line(x1, y1, bx, by, c) + S.poly([[x2, y2], p1, p2], c + " hd");
  };
  // dimension line with end ticks and a centred label
  S.dim = (x1, y1, x2, y2, label, o = {}) => {
    const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * 5, ny = Math.cos(a) * 5;
    const off = o.off ?? -12;
    const mx = (x1 + x2) / 2 - Math.sin(a) * off, my = (y1 + y2) / 2 + Math.cos(a) * off;
    return S.arrow((x1 + x2) / 2, (y1 + y2) / 2, x1, y1, "mu", 7) + S.arrow((x1 + x2) / 2, (y1 + y2) / 2, x2, y2, "mu", 7) +
      S.line(x1 - nx, y1 - ny, x1 + nx, y1 + ny, "mu") + S.line(x2 - nx, y2 - ny, x2 + nx, y2 + ny, "mu") +
      S.text(mx, my, label, { c: "sm", i: o.i });
  };
  S.arc = (cx, cy, r, a0, a1, c = "ln nf") => { // angles in degrees, counter-clockwise on screen = negative y
    const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
    const [x0, y0] = p(a0), [xe, ye] = p(a1);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
    return `<path d="M${r1(x0)} ${r1(y0)} A${r} ${r} 0 ${large} ${sweep} ${r1(xe)} ${r1(ye)}" class="${c}"/>`;
  };
  S.ground = (x1, x2, y, c = "mu") => { // hatched ground line
    let s = S.line(x1, y, x2, y, "ln");
    for (let x = x1 + 4; x < x2; x += 10) s += S.line(x, y, x - 7, y + 7, c);
    return s;
  };
  S.wall = (x, y1, y2, side = -1) => { let s = S.line(x, y1, x, y2, "ln"); for (let y = y1 + 4; y < y2; y += 10) s += S.line(x, y, x + side * 7, y + 7, "mu"); return s; };
  S.spring = (x1, y, x2, coils = 8, amp = 7) => {
    const n = coils * 2, dx = (x2 - x1 - 12) / n; let d = `M${r1(x1)} ${y} H${r1(x1 + 6)}`;
    for (let i = 0; i < n; i++) d += ` L${r1(x1 + 6 + (i + 0.5) * dx)} ${y + (i % 2 ? amp : -amp)}`;
    d += ` L${r1(x2 - 6)} ${y} H${r1(x2)}`;
    return S.path(d, "ln nf");
  };
  // resistor zig-zag between two points (horizontal or vertical)
  S.resistor = (x1, y1, x2, y2, label, o = {}) => {
    const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1);
    const body = 34, lead = (L - body) / 2, zig = 6;
    let d = `M0 0 H${r1(lead)}`;
    for (let i = 0; i < 6; i++) d += ` L${r1(lead + (i + 0.5) * body / 6)} ${i % 2 ? zig : -zig}`;
    d += ` L${r1(lead + body)} 0 H${r1(L)}`;
    const g = `<g transform="translate(${r1(x1)} ${r1(y1)}) rotate(${r1(a * 180 / Math.PI)})">${S.path(d, "ln nf")}</g>`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const horiz = Math.abs(y2 - y1) < 1;
    return g + (label ? S.text(horiz ? mx : mx + (o.side || 1) * 26, horiz ? my + (o.side || -1) * 16 : my, label, { c: "sm", html: true }) : "");
  };
  S.battery = (x, y1, y2, label) => { // vertical cell between y1 (top) and y2
    const my = (y1 + y2) / 2;
    return S.line(x, y1, x, my - 5) + S.line(x, my + 5, x, y2) + S.line(x - 14, my - 5, x + 14, my - 5, "ln thk") + S.line(x - 7, my + 5, x + 7, my + 5, "ln thk2") +
      (label ? S.text(x - 22, my, label, { c: "sm", a: "end", html: true }) : "");
  };
  S.dot = (x, y, r = 3, c = "fs") => S.circle(x, y, r, c);
  X.S = S;

  /* Cartesian plot. new Plot({x:[min,max], y:[min,max], w, h, pad}) */
  class Plot {
    constructor(o) {
      this.o = Object.assign({ w: 300, h: 220, pad: [26, 14, 26, 30], grid: true, xs: 1, ys: 1, axisLabels: ["x", "y"], ticks: true, frame: false }, o);
      const [pt, pr, pb, pl] = this.o.pad;
      this.X0 = pl; this.X1 = this.o.w - pr; this.Y0 = this.o.h - pb; this.Y1 = pt;
      this.parts = [];
    }
    sx(x) { const [a, b] = this.o.x; return this.X0 + (x - a) / (b - a) * (this.X1 - this.X0); }
    sy(y) { const [a, b] = this.o.y; return this.Y0 - (y - a) / (b - a) * (this.Y0 - this.Y1); }
    add(s) { this.parts.push(s); return this; }
    axes() {
      const o = this.o, [xa, xb] = o.x, [ya, yb] = o.y; let s = "";
      if (o.grid) {
        for (let x = Math.ceil(xa / o.xs) * o.xs; x <= xb + 1e-9; x += o.xs) s += S.line(this.sx(x), this.Y1, this.sx(x), this.Y0, "gd");
        for (let y = Math.ceil(ya / o.ys) * o.ys; y <= yb + 1e-9; y += o.ys) s += S.line(this.X0, this.sy(y), this.X1, this.sy(y), "gd");
      }
      if (o.frame) {
        s += S.rect(this.X0, this.Y1, this.X1 - this.X0, this.Y0 - this.Y1, "ln nf");
      } else {
        const ox = this.sx(Math.min(Math.max(0, xa), xb)), oy = this.sy(Math.min(Math.max(0, ya), yb));
        s += S.arrow(this.X0 - 4, oy, this.X1 + 10, oy, "ln", 8) + S.arrow(ox, this.Y0 + 4, ox, this.Y1 - 10, "ln", 8);
        s += S.text(this.X1 + 12, oy - 10, o.axisLabels[0], { i: true, c: "sm", a: "end" }) + S.text(ox + 8, this.Y1 - 8, o.axisLabels[1], { i: true, c: "sm", a: "start" });
      }
      if (o.ticks) {
        const tx = o.tx || o.xs, ty = o.ty || o.ys;
        const oy = o.frame ? this.Y0 : this.sy(Math.min(Math.max(0, ya), yb)), ox = o.frame ? this.X0 : this.sx(Math.min(Math.max(0, xa), xb));
        for (let x = Math.ceil(xa / tx) * tx; x <= xb + 1e-9; x += tx) { if (!o.frame && Math.abs(x) < 1e-9) continue; s += S.line(this.sx(x), oy - 3, this.sx(x), oy + 3, "ln") + S.text(this.sx(x), oy + 12, X.num(x, 2).replace("{,}", ","), { c: "xs" }); }
        for (let y = Math.ceil(ya / ty) * ty; y <= yb + 1e-9; y += ty) { if (!o.frame && Math.abs(y) < 1e-9) continue; s += S.line(ox - 3, this.sy(y), ox + 3, this.sy(y), "ln") + S.text(ox - 6, this.sy(y), X.num(y, 2).replace("{,}", ","), { c: "xs", a: "end" }); }
        if (!o.frame) s += S.text(ox - 7, oy + 11, "0", { c: "xs", a: "end" });
      }
      if (o.frame && o.axisLabels) {
        s += S.text((this.X0 + this.X1) / 2, this.Y0 + 26, o.axisLabels[0], { c: "sm", html: true });
        s += `<g transform="translate(${this.X0 - 30} ${(this.Y0 + this.Y1) / 2}) rotate(-90)">${S.text(0, 0, o.axisLabels[1], { c: "sm", html: true })}</g>`;
      }
      this.parts.unshift(s);
      return this;
    }
    fn(f, c = "ac thk", from = this.o.x[0], to = this.o.x[1], n = 160) {
      let d = "", pen = false;
      for (let i = 0; i <= n; i++) {
        const x = from + (to - from) * i / n, y = f(x);
        if (!Number.isFinite(y) || y < this.o.y[0] - 0.5 * (this.o.y[1] - this.o.y[0]) || y > this.o.y[1] + 0.5 * (this.o.y[1] - this.o.y[0])) { pen = false; continue; }
        d += (pen ? " L" : " M") + r1(this.sx(x)) + " " + r1(this.sy(y)); pen = true;
      }
      return this.add(`<g clip-path="url(#${this.clipId()})">${S.path(d.trim(), c + " nf")}</g>`);
    }
    clipId() {
      if (!this._clip) {
        this._clip = "c" + Math.random().toString(36).slice(2, 8);
        this.parts.push(`<clipPath id="${this._clip}"><rect x="${this.X0}" y="${this.Y1}" width="${this.X1 - this.X0}" height="${this.Y0 - this.Y1}"/></clipPath>`);
      }
      return this._clip;
    }
    pl(pts, c = "ac thk", closed = false) { return this.add(S.poly(pts.map(([x, y]) => [this.sx(x), this.sy(y)]), c + (closed ? "" : " nf"), closed)); }
    pt(x, y, label, o = {}) { return this.add(S.dot(this.sx(x), this.sy(y), 3.2, o.c || "fs") + (label ? S.text(this.sx(x) + (o.dx ?? 8), this.sy(y) + (o.dy ?? -9), label, { c: "sm", a: o.a || "start", html: true }) : "")); }
    toString() { return S.svg(this.o.w, this.o.h, this.parts.join(""), this.o.label || "กราฟ"); }
  }
  X.Plot = Plot;

  /* generate one question safely (retry on generator assertion failures) */
  X.make = (def, seed) => {
    let s = seed >>> 0;
    for (let t = 0; t < 200; t++) {
      try {
        const R = X.rng(s);
        const out = def.gen(R);
        if (!out || !Array.isArray(out.choices) || out.choices.length !== 5) throw new Error("need 5 choices");
        if (!(out.answer >= 0 && out.answer < 5)) throw new Error("bad answer index");
        if (new Set(out.choices).size !== 5) throw new Error("duplicate choices");
        return Object.assign({ id: def.id, subj: def.subj, topic: def.topic, seed: s }, out);
      } catch (e) {
        if (t === 199) throw e;
        s = (Math.imul(s ^ 0x9e3779b9, 2654435761) + t + 1) >>> 0;
      }
    }
  };
  X.assert = (c, msg = "retry") => { if (!c) throw new Error(msg); };
})(typeof window !== "undefined" ? window : globalThis);
