/* คณิตศาสตร์ (แนว A-Level คณิตศาสตร์ประยุกต์ 1) — every generator invents its own numbers each time. */
(function (g) {
  "use strict";
  const X = g.EXAM, { S, Plot, F, Frac, m, num } = X;
  const add = (o) => X.add(Object.assign({ subj: "math" }, o));
  const A = X.assert;

  /* ---------- helpers ---------- */
  const polyTex = (cs, v = "x") => {
    const n = cs.length - 1; let s = "";
    cs.forEach((c, i) => {
      const p = n - i; const cf = Frac.of(c); if (cf.n === 0) return;
      const neg = cf.n < 0, ab = neg ? cf.neg() : cf;
      const body = p === 0 ? ab.tex() : (ab.eq(1) ? "" : ab.tex()) + v + (p > 1 ? "^{" + p + "}" : "");
      s += s ? (neg ? " - " : " + ") + body : (neg ? "-" : "") + body;
    });
    return s || "0";
  };
  const sqrtParts = N => { let k = 1, r = N; for (let d = 2; d * d <= r; d++) while (r % (d * d) === 0) { r /= d * d; k *= d; } return [k, r]; };
  const sqrtTex = N => { if (N === 0) return "0"; const [k, r] = sqrtParts(N); return r === 1 ? String(k) : (k === 1 ? "" : k) + "\\sqrt{" + r + "}"; };
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const piTex = (k, d) => { const f = F(k, d); if (f.n === 0) return "0"; const n = Math.abs(f.n) === 1 ? (f.n < 0 ? "-" : "") : f.n; return f.d === 1 ? n + "\\pi" : `\\frac{${n}\\pi}{${f.d}}`; };
  const shift = (v, sym = "x") => v === 0 ? sym : `(${sym} ${v > 0 ? "-" : "+"} ${Math.abs(v)})`;
  const bm = rows => "\\begin{bmatrix}" + rows.map(r => r.join(" & ")).join(" \\\\ ") + "\\end{bmatrix}";
  X.polyTex = polyTex; X.sqrtTex = sqrtTex; X.C = C;

  function venn(names, vals) {
    const cx = [110, 170, 140], cy = [92, 92, 142], r = 58;
    let s = S.rect(8, 8, 274, 212, "ln nf", 6) + S.text(22, 24, "U", { i: true, c: "sm" });
    s += S.circle(cx[0], cy[0], r, "ln fa") + S.circle(cx[1], cy[1], r, "ln fb") + S.circle(cx[2], cy[2], r, "ln fc");
    s += S.text(62, 34, names[0], { c: "sm b" }) + S.text(222, 34, names[1], { c: "sm b" }) + S.text(140, 214, names[2], { c: "sm b", base: "auto" });
    if (vals) {
      const pos = { a: [88, 80], b: [192, 80], c: [140, 172], ab: [140, 70], ac: [110, 130], bc: [170, 130], abc: [140, 108], none: [255, 196] };
      for (const k in pos) if (vals[k] != null) s += S.text(pos[k][0], pos[k][1], vals[k], { b: true, c: k === "abc" ? "hl" : "" });
    }
    return S.svg(290, 228, s, "แผนภาพเวนน์ออยเลอร์");
  }

  /* 1 ---------- เซต: แผนภาพเวนน์ 3 วง ---------- */
  add({
    id: "m-venn", topic: "เซต", gen(R) {
      const ctx = R.pick([
        { who: "นักเรียน", g: ["ชมรมคณิตศาสตร์", "ชมรมหมากกระดาน", "ชมรมกีฬา"], verb: "อยู่", short: ["คณิต", "หมากฯ", "กีฬา"] },
        { who: "นักเรียน", g: ["วิชาภาษาอังกฤษ", "วิชาภาษาจีน", "วิชาภาษาญี่ปุ่น"], verb: "ลงเรียน", short: ["อังกฤษ", "จีน", "ญี่ปุ่น"] },
        { who: "ลูกค้า", g: ["กาแฟ", "ชาเขียว", "โกโก้"], verb: "ชอบ", short: ["กาแฟ", "ชาเขียว", "โกโก้"] },
        { who: "พนักงาน", g: ["ภาษา Python", "ภาษา C", "ภาษา Java"], verb: "เขียน", short: ["Python", "C", "Java"] },
      ]);
      const v = { a: R.int(3, 14), b: R.int(3, 14), c: R.int(3, 14), ab: R.int(1, 8), ac: R.int(1, 8), bc: R.int(1, 8), abc: R.int(1, 6), none: R.int(0, 9) };
      const nA = v.a + v.ab + v.ac + v.abc, nB = v.b + v.ab + v.bc + v.abc, nC = v.c + v.ac + v.bc + v.abc;
      const AB = v.ab + v.abc, AC = v.ac + v.abc, BC = v.bc + v.abc, U = Object.values(v).reduce((s, x) => s + x, 0);
      const [p, q, r] = ctx.g, w = ctx.who, vb = ctx.verb;
      const askOne = R.chance(0.45);
      let q1 = `${w}กลุ่มหนึ่งมี $${U}$ คน ในจำนวนนี้${vb}${p} $${nA}$ คน ${vb}${q} $${nB}$ คน ${vb}${r} $${nC}$ คน ` +
        `${vb}ทั้ง${p}และ${q} $${AB}$ คน ${vb}ทั้ง${p}และ${r} $${AC}$ คน ${vb}ทั้ง${q}และ${r} $${BC}$ คน `;
      let ans, sol;
      const ie = `n(A\\cup B\\cup C) = n(A)+n(B)+n(C)-n(A\\cap B)-n(A\\cap C)-n(B\\cap C)+n(A\\cap B\\cap C)`;
      if (!askOne) {
        q1 += `และมี${w}ที่ไม่ได้${vb}อย่างใดเลย $${v.none}$ คน จงหาจำนวน${w}ที่${vb}ครบทั้ง 3 อย่าง`;
        ans = v.abc;
        sol = `ให้ $A$, $B$, $C$ แทน${p}, ${q}, ${r} ตามลำดับ จะได้ $n(A\\cup B\\cup C) = ${U} - ${v.none} = ${U - v.none}$<br>` +
          `จาก $${ie}$<br>$${U - v.none} = ${nA}+${nB}+${nC}-${AB}-${AC}-${BC}+n(A\\cap B\\cap C)$<br>` +
          `$${U - v.none} = ${nA + nB + nC - AB - AC - BC} + n(A\\cap B\\cap C)$ จึงได้ $n(A\\cap B\\cap C) = \\boldsymbol{${ans}}$`;
      } else {
        q1 += `และ${vb}ครบทั้งสามอย่าง $${v.abc}$ คน จงหาจำนวน${w}ที่${vb}<b>เพียงอย่างเดียว</b>เท่านั้น`;
        ans = v.a + v.b + v.c;
        sol = `เติมตัวเลขจากตรงกลางออกมา: ส่วนที่อยู่ทั้งสามวงคือ $${v.abc}$<br>` +
          `เฉพาะ $A\\cap B$ (ไม่อยู่ $C$) $= ${AB}-${v.abc} = ${v.ab}$, เฉพาะ $A\\cap C = ${AC}-${v.abc} = ${v.ac}$, เฉพาะ $B\\cap C = ${BC}-${v.abc} = ${v.bc}$<br>` +
          `เฉพาะ $A = ${nA}-${v.ab}-${v.ac}-${v.abc} = ${v.a}$, เฉพาะ $B = ${v.b}$, เฉพาะ $C = ${v.c}$<br>` +
          `รวมผู้ที่${vb}อย่างเดียว $= ${v.a}+${v.b}+${v.c} = \\boldsymbol{${ans}}$ คน (ข้อมูลจำนวนทั้งหมด $${U}$ คนไม่จำเป็นต้องใช้)`;
      }
      const o = X.numOpts(ans, askOne ? [ans + v.abc, ans - v.abc, ans + 2, U - v.none - (AB + AC + BC - 2 * v.abc)] : [ans + 1, ans - 1, ans + 2, ans + 3]);
      return Object.assign({ q: q1, sol, solFig: venn(ctx.short, { a: v.a, b: v.b, c: v.c, ab: v.ab, ac: v.ac, bc: v.bc, abc: v.abc, none: v.none }) }, o);
    },
  });

  /* 2 ---------- ตรรกศาสตร์: ค่าความจริง ---------- */
  const LOGIC_POOL = [
    ["p\\wedge q", (p, q, r) => p && q], ["p\\vee r", (p, q, r) => p || r], ["p\\rightarrow r", (p, q, r) => !p || r],
    ["q\\rightarrow p", (p, q, r) => !q || p], ["\\sim p\\vee r", (p, q, r) => !p || r], ["(p\\wedge r)\\rightarrow q", (p, q, r) => !(p && r) || q],
    ["p\\leftrightarrow q", (p, q) => p === q], ["q\\leftrightarrow r", (p, q, r) => q === r], ["(p\\vee q)\\rightarrow r", (p, q, r) => !(p || q) || r],
    ["\\sim(q\\wedge r)", (p, q, r) => !(q && r)], ["(p\\rightarrow q)\\wedge r", (p, q, r) => (!p || q) && r], ["(q\\vee r)\\leftrightarrow p", (p, q, r) => (q || r) === p],
    ["\\sim q\\rightarrow\\sim p", (p, q) => q || !p], ["(r\\rightarrow p)\\wedge\\sim q", (p, q, r) => (!r || p) && !q], ["p\\wedge(\\sim q\\vee r)", (p, q, r) => p && (!q || r)],
    ["(\\sim p\\rightarrow r)\\leftrightarrow q", (p, q, r) => (p || r) === q], ["(q\\rightarrow r)\\vee\\sim p", (p, q, r) => !q || r || !p], ["\\sim(p\\vee q)\\vee r", (p, q, r) => !(p || q) || r],
  ];
  const LOGIC_COND = [
    ["(p\\wedge q)\\rightarrow r", "เท็จ", [1, 1, 0], "ประพจน์ $\\rightarrow$ เป็นเท็จได้กรณีเดียวคือ จริง $\\rightarrow$ เท็จ จึงได้ $p\\wedge q$ จริง และ $r$ เท็จ"],
    ["p\\vee(q\\rightarrow r)", "เท็จ", [0, 1, 0], "ประพจน์ $\\vee$ เป็นเท็จเมื่อทั้งสองข้างเท็จ จึงได้ $p$ เท็จ และ $q\\rightarrow r$ เท็จ คือ $q$ จริง $r$ เท็จ"],
    ["\\sim(p\\rightarrow q)\\wedge r", "จริง", [1, 0, 1], "ประพจน์ $\\wedge$ เป็นจริงเมื่อทั้งสองข้างจริง ได้ $r$ จริง และ $p\\rightarrow q$ เท็จ คือ $p$ จริง $q$ เท็จ"],
    ["p\\rightarrow(q\\vee r)", "เท็จ", [1, 0, 0], "ได้ $p$ จริง และ $q\\vee r$ เท็จ คือ $q$ และ $r$ เท็จทั้งคู่"],
    ["\\sim(q\\rightarrow p)\\wedge\\sim r", "จริง", [0, 1, 0], "ได้ $\\sim r$ จริง ($r$ เท็จ) และ $q\\rightarrow p$ เท็จ คือ $q$ จริง $p$ เท็จ"],
    ["(p\\wedge r)\\rightarrow q", "เท็จ", [1, 0, 1], "ได้ $p\\wedge r$ จริง และ $q$ เท็จ"],
  ];
  add({
    id: "m-logic", topic: "ตรรกศาสตร์", gen(R) {
      const [ct, cv, val, why] = R.pick(LOGIC_COND);
      const [p, q, r] = val.map(Boolean);
      const want = R.chance(0.6);
      const pool = R.shuffle(LOGIC_POOL.filter(f => f[0] !== ct));
      const good = pool.filter(f => f[1](p, q, r) === want), bad = pool.filter(f => f[1](p, q, r) !== want);
      A(good.length >= 1 && bad.length >= 4);
      const pick = [good[0], ...bad.slice(0, 4)];
      const o = X.opts(R, m(good[0][0]), pick.slice(1).map(f => m(f[0])));
      const T = b => (b ? "T" : "F");
      const sol = `${why} จึงได้ $p \\equiv ${T(p)}$, $q \\equiv ${T(q)}$, $r \\equiv ${T(r)}$<br>แทนค่าในแต่ละตัวเลือก:<br>` +
        pick.map(f => `$${f[0]} \\equiv ${T(f[1](p, q, r))}$`).join("<br>") + `<br>ข้อที่มีค่าความจริงเป็น${want ? "จริง" : "เท็จ"}คือ $${good[0][0]}$`;
      return Object.assign({ q: `กำหนดให้ $p, q, r$ เป็นประพจน์ ถ้าประพจน์ $${ct}$ มีค่าความจริงเป็น<b>${cv}</b> แล้วข้อใดต่อไปนี้มีค่าความจริงเป็น<b>${want ? "จริง" : "เท็จ"}</b>`, sol }, o);
    },
  });

  /* 3 ---------- ฟังก์ชันประกอบและฟังก์ชันผกผัน ---------- */
  add({
    id: "m-compose", topic: "ฟังก์ชัน", gen(R) {
      const a = R.pick([2, 3, 4, 5, -2, -3]), b = R.int(-6, 6), c = R.int(-5, 5), k = R.int(-3, 3), t = R.int(-4, 5);
      const mm = a * t + b; // f^{-1}(mm) = t
      const fk = a * k + b, gfk = fk * fk + c;
      const ans = gfk + t;
      const fofg = a * (k * k + c) + b;
      const sol = `$f(${k}) = ${a}(${k}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${fk}$ ดังนั้น $(g\\circ f)(${k}) = g(${fk}) = (${fk})^2${c ? (c < 0 ? " - " : " + ") + Math.abs(c) : ""} = ${gfk}$<br>` +
        `หา $f^{-1}(${mm})$: ให้ $f(x) = ${mm}$ จะได้ $${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${mm}$ ได้ $x = ${t}$<br>` +
        `ดังนั้น $(g\\circ f)(${k}) + f^{-1}(${mm}) = ${gfk} + (${t}) = \\boldsymbol{${ans}}$`;
      const o = X.numOpts(ans, [fofg + t, gfk - t, gfk + a * mm + b, ans + 2, ans - 2]);
      return Object.assign({ q: `กำหนดให้ $f(x) = ${polyTex([a, b])}$ และ $g(x) = ${polyTex([1, 0, c])}$ ค่าของ $(g\\circ f)(${k}) + f^{-1}(${mm})$ เท่ากับข้อใด`, sol }, o);
    },
  });

  /* 4 ---------- โดเมนและเรนจ์ของ sqrt(พหุนามกำลังสอง) ---------- */
  add({
    id: "m-domain", topic: "ฟังก์ชัน", gen(R) {
      const h = R.pick([-3, -2, -1, 1, 2, 3, 4]), kind = R.pick(["pos", "pos", "neg"]);
      const s = R.int(1, 3), k = kind === "pos" ? s * s : -s * s;
      const poly = polyTex([1, -2 * h, h * h + k]);
      const Dall = "\\mathbb{R}", Dout = `(-\\infty, ${h - s}]\\cup[${h + s}, \\infty)`, Din = `[${h - s}, ${h + s}]`, Dge = `[${h}, \\infty)`;
      const R0 = "[0, \\infty)", Rs = `[${s}, \\infty)`, Rk = `[${s * s}, \\infty)`, Rpos = "(0, \\infty)";
      const pair = (d, r) => `โดเมนคือ $${d}$ และเรนจ์คือ $${r}$`;
      let ans, wr, sol;
      if (kind === "pos") {
        ans = pair(Dall, Rs); wr = [pair(Dall, R0), pair(Dge, Rs), pair(Dall, Rk), pair(Dge, R0), pair(Dout, R0)];
        sol = `จัดรูป $${poly} = (x ${h > 0 ? "-" : "+"} ${Math.abs(h)})^2 + ${k}$ ซึ่งมีค่าอย่างน้อย $${k}$ เสมอ จึงไม่ติดลบสำหรับทุก $x$ → โดเมนคือ $\\mathbb{R}$<br>` +
          `ค่าต่ำสุดใต้รากคือ $${k}$ (เมื่อ $x = ${h}$) ดังนั้น $f(x) \\ge \\sqrt{${k}} = ${s}$ → เรนจ์คือ $[${s}, \\infty)$`;
      } else {
        ans = pair(Dout, R0); wr = [pair(Din, R0), pair(Dall, R0), pair(Dout, Rs), pair(Dall, Rs), pair(Din, Rs)];
        sol = `จัดรูป $${poly} = (x ${h > 0 ? "-" : "+"} ${Math.abs(h)})^2 - ${s * s}$ ต้องไม่ติดลบ: $|x - ${h}| \\ge ${s}$<br>` +
          `จึงได้ $x \\le ${h - s}$ หรือ $x \\ge ${h + s}$ → โดเมนคือ $${Dout}$<br>ที่ปลายช่วงค่าใต้รากเป็น $0$ และเพิ่มขึ้นได้ไม่จำกัด → เรนจ์คือ $[0, \\infty)$`;
      }
      const o = X.opts(R, ans, wr);
      return Object.assign({ q: `ให้ $f$ เป็นฟังก์ชันที่กำหนดโดย $f(x) = \\sqrt{${poly}}$ ข้อใดถูกต้องเกี่ยวกับโดเมนและเรนจ์ของ $f$`, sol }, o);
    },
  });

  /* 5 ---------- สมการเอกซ์โพเนนเชียล: ผลบวกคำตอบ ---------- */
  add({
    id: "m-expo", topic: "เอกซ์โพเนนเชียลและลอการิทึม", gen(R) {
      const [a, b] = R.pick([[2, 5], [2, 3], [3, 2], [5, 2], [3, 5], [5, 3], [2, 7]]);
      const mm = R.pick([1, 2]), k = R.pick([2, 3]);
      const bm_ = b ** mm, Ak = a ** k, Bk = b ** k;
      const L = `\\log_{${a}} ${b}`, Lr = `\\log_{${b}} ${a}`, co = mm === 1 ? "" : mm;
      const ans = `-${co}${L}`;
      const o = X.opts(R, m(ans), [m(`${co}${L}`), m(`-${co}${Lr}`), m(`${co}${Lr}`), m("0"), m(String(2 * k))]);
      const sol = `จัดรูป $\\dfrac{${a}^{x^2}}{${a}^{${k}}} = \\dfrac{${b}^{${k}}}{${b}^{${mm === 1 ? "" : mm}x}}$ จะได้ $${a}^{x^2-${k}} = ${b}^{${k}-${co}x}$<br>` +
        `ใส่ $\\log_{${a}}$ ทั้งสองข้าง: $x^2 - ${k} = (${k} - ${co}x)${L}$<br>` +
        `$x^2 + (${co}${L})x - ${k}(1 + ${L}) = 0$ ซึ่งมีค่าคงที่ติดลบ จึงมีสองคำตอบจริงเสมอ<br>` +
        `ผลบวกราก $= -\\dfrac{b}{a} = \\boldsymbol{-${co}${L}}$`;
      return Object.assign({ q: `กำหนดให้ $S$ เป็นเซตคำตอบที่เป็นจำนวนจริงทั้งหมดของสมการ $\\dfrac{${a}^{x^2}}{${Ak}} = \\dfrac{${Bk}}{${bm_}^{x}}$ ผลบวกของสมาชิกทั้งหมดของ $S$ เท่ากับข้อใด`, sol }, o);
    },
  });

  /* 6 ---------- อสมการลอการิทึม ฐานน้อยกว่า 1 ---------- */
  add({
    id: "m-loginq", topic: "เอกซ์โพเนนเชียลและลอการิทึม", gen(R) {
      const r1 = R.pick([F(1, 2), F(1, 3), F(2, 3), F(1, 4), F(3, 4), F(2, 5)]);
      const r2 = R.pick([F(1), F(3, 2), F(2), F(5, 4), F(4, 3)]);
      const p = r1.add(r2), qq = r1.mul(r2), lo = qq.div(p);
      A(lo.v < r1.v);
      const iv = (a, b) => m(`\\left(${a.tex()}, ${b.tex()}\\right)`);
      const ans = iv(lo, r1);
      const o = X.opts(R, ans, [iv(lo, F(1)), iv(F(0), r1), iv(r1, F(1)), iv(F(0), lo)]);
      const arg = `${p.coef()}x - ${qq.tex()}`;
      const sol = `เพราะ $0 < x < 1$ ฐานน้อยกว่า 1 อสมการจึงกลับทิศเมื่อถอด log: $0 < ${arg} < x^2$<br>` +
        `① $${arg} > 0 \\Rightarrow x > ${lo.tex()}$<br>` +
        `② $x^2 - ${p.coef()}x + ${qq.tex()} > 0 \\Rightarrow (x - ${r1.tex()})(x - ${r2.tex()}) > 0 \\Rightarrow x < ${r1.tex()}$ หรือ $x > ${r2.tex()}$<br>` +
        `รวมกับ $0 < x < 1$ ได้คำตอบ $${lo.tex()} < x < ${r1.tex()}$ คือ $\\boldsymbol{\\left(${lo.tex()}, ${r1.tex()}\\right)}$`;
      return Object.assign({ q: `เซตของจำนวนจริง $x$ ทั้งหมดที่ $0 < x < 1$ และสอดคล้องกับอสมการ $\\log_x\\left(${arg}\\right) > 2$ ตรงกับข้อใด`, sol }, o);
    },
  });

  /* 7 ---------- ตรีโกณ: มุมที่ตัดกันหมด ---------- */
  add({
    id: "m-trigsum", topic: "ฟังก์ชันตรีโกณมิติ", gen(R) {
      const ks = R.sample([1, 2, 4, 5, 7, 8], 2);
      const plus = k => R.pick([["\\sin", 18 - k], ["\\cos", 9 - k], ["\\sin", k]]);
      const minus = k => R.pick([["\\cos", 9 + k], ["\\sin", 18 + k], ["\\sin", 36 - k]]);
      const terms = [];
      for (const k of ks) {
        terms.push([1, ...plus(k)]);
        if (R.chance(0.5)) terms.push([1, ...minus(k)]); else terms.push([-1, ...plus(k)]);
      }
      const SPEC = [["\\sin\\frac{\\pi}{6}", F(1, 2)], ["\\cos\\frac{2\\pi}{3}", F(-1, 2)], ["\\tan\\frac{\\pi}{4}", F(1)], ["\\sin\\frac{3\\pi}{2}", F(-1)], ["\\cos\\frac{\\pi}{2}", F(0)], ["\\cos\\frac{5\\pi}{3}", F(1, 2)], ["\\sin\\frac{7\\pi}{6}", F(-1, 2)], ["\\cos 2\\pi", F(1)]];
      const sp = R.pick(SPEC);
      const all = R.shuffle([...terms.map(t => ({ t })), { sp }]);
      let tex = "", val = 0;
      all.forEach((x, i) => {
        if (x.sp) { tex += (i ? " + " : "") + x.sp[0]; val += x.sp[1].v; return; }
        const [sg, fn, k] = x.t; const ang = piTex(k, 18);
        tex += (i ? (sg > 0 ? " + " : " - ") : (sg > 0 ? "" : "-")) + `${fn}${ang.startsWith("\\frac") ? ang : "{" + ang + "}"}`;
        val += sg * (fn === "\\sin" ? Math.sin(k * Math.PI / 18) : Math.cos(k * Math.PI / 18));
      });
      A(Math.abs(val - sp[1].v) < 1e-9, "trig check");
      const list = [F(-1), F(-1, 2), F(0), F(1, 2), F(1)].map(f => m(f.tex()));
      const o = X.fixedOpts(list, m(sp[1].tex()));
      const deg = k => k * 10 + "^\\circ";
      const expl = terms.map(([sg, fn, k]) => {
        const base = ks.find(b => [18 - b, 9 - b, b, 9 + b, 18 + b, 36 - b].includes(k));
        const sgnv = (fn === "\\sin" ? Math.sin(k * Math.PI / 18) : Math.cos(k * Math.PI / 18)) * sg > 0 ? "+" : "-";
        return `$${sg < 0 ? "-" : ""}${fn}\\,${deg(k)} = ${sgnv}\\sin ${deg(base)}$`;
      }).join("<br>");
      const sol = `เปลี่ยนเป็นองศา ($\\frac{\\pi}{18} = 10^\\circ$) แล้วลดมุมให้เหลือมุมแหลม:<br>${expl}<br>` +
        `พจน์ $\\sin ${deg(ks[0])}$ และ $\\sin ${deg(ks[1])}$ หักล้างกันหมด เหลือเพียง $${sp[0]} = \\boldsymbol{${sp[1].tex()}}$`;
      return Object.assign({ q: `ค่าของ $${tex}$ ตรงกับข้อใดต่อไปนี้`, sol }, o);
    },
  });

  /* 8 ---------- จำนวนเชิงซ้อน: บริเวณในระนาบ (ตัวเลือกเป็นรูป) ---------- */
  function region(h, k, r, axis, cmp, c, view) {
    const P = new Plot({ x: view.x, y: view.y, w: 190, h: 190, pad: [14, 14, 14, 14], xs: 1, ys: 1, ticks: false, axisLabels: ["X", "Y"] });
    P.axes();
    const id = "rg" + (X._uid = (X._uid || 0) + 1);
    const [x0, x1] = view.x, [y0, y1] = view.y;
    let hx0 = x0, hx1 = x1, hy0 = y0, hy1 = y1;
    if (axis === "re") { if (cmp === "<") hx1 = c; else hx0 = c; } else { if (cmp === "<") hy1 = c; else hy0 = c; }
    P.add(`<clipPath id="${id}"><rect x="${P.sx(hx0)}" y="${P.sy(hy1)}" width="${P.sx(hx1) - P.sx(hx0)}" height="${P.sy(hy0) - P.sy(hy1)}"/></clipPath>`);
    const rp = P.sx(h + r) - P.sx(h);
    P.add(`<g clip-path="url(#${id})">${S.circle(P.sx(h), P.sy(k), rp, "fa nos")}</g>`);
    P.add(S.circle(P.sx(h), P.sy(k), rp, "ac dsh nf"));
    if (axis === "re") P.add(S.line(P.sx(c), P.Y1, P.sx(c), P.Y0, "am dsh")).add(S.text(P.sx(c) + 4, P.sy(0) + 10, String(c), { c: "xs", a: "start" }));
    else P.add(S.line(P.X0, P.sy(c), P.X1, P.sy(c), "am dsh")).add(S.text(P.sx(0) - 4, P.sy(c) - 7, String(c), { c: "xs", a: "end" }));
    P.pt(h, k, `(${h}, ${k})`, { dx: 5, dy: 10 });
    return P.toString();
  }
  add({
    id: "m-cregion", topic: "จำนวนเชิงซ้อน", figChoices: true, gen(R) {
      const h = R.pick([-2, -1, 1, 2, 3]), k = R.pick([-2, -1, 1, 2, 3]), r = R.pick([2, 3]);
      A(h !== k && h !== -k);
      const axis = R.pick(["re", "im"]), cmp = R.pick(["<", ">"]);
      const c = (axis === "re" ? h : k) + R.pick([-1, 1]) * R.int(1, r - 1);
      A(c !== 0);
      const span = r + 2;
      const view = { x: [Math.min(h - span, -1), Math.max(h + span, 1)], y: [Math.min(k - span, -1), Math.max(k + span, 1)] };
      const w = Math.max(view.x[1] - view.x[0], view.y[1] - view.y[0]);
      view.x = [view.x[0], view.x[0] + w]; view.y = [view.y[0], view.y[0] + w];
      const flip = cmp === "<" ? ">" : "<";
      const cand = [
        [region(h, k, r, axis, cmp, c, view), true],
        [region(h, k, r, axis, flip, c, view), false],
        [region(-h, -k, r, axis, cmp, axis === "re" ? -c : -c, { x: [-view.x[1], -view.x[0]], y: [-view.y[1], -view.y[0]] }), false],
        [region(k, h, r, axis === "re" ? "im" : "re", cmp, c, { x: view.y, y: view.x }), false],
        [region(h, k, r, axis === "re" ? "im" : "re", cmp, c, view), false],
      ];
      const sh = R.shuffle(cand);
      const zt = `z ${h > 0 ? "-" : "+"} ${Math.abs(h)} ${k > 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}i`;
      const cond = `${axis === "re" ? "\\operatorname{Re}(z)" : "\\operatorname{Im}(z)"} ${cmp} ${c}`;
      const sol = `$|${zt}| < ${r}$ คือ $|z - (${h} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}i)| < ${r}$ → จุดภายในวงกลมจุดศูนย์กลาง $(${h}, ${k})$ รัศมี $${r}$ (ไม่รวมเส้นรอบวง จึงเป็นเส้นประ)<br>` +
        `$${cond}$ คือบริเวณ${axis === "re" ? (cmp === "<" ? "ทางซ้ายของเส้นตั้ง" : "ทางขวาของเส้นตั้ง") + ` $x = ${c}$` : (cmp === "<" ? "ใต้เส้นนอน" : "เหนือเส้นนอน") + ` $y = ${c}$`}<br>` +
        `คำตอบคือส่วนที่ซ้อนทับของทั้งสองเงื่อนไข`;
      return { q: `กราฟแสดงจำนวนเชิงซ้อน $z$ ทั้งหมดในระนาบเชิงซ้อนที่สอดคล้องกับ $${cond}$ และ $|${zt}| < ${r}$ ตรงกับข้อใดต่อไปนี้`, choices: sh.map(x => x[0]), answer: sh.findIndex(x => x[1]), sol, solFig: cand[0][0] };
    },
  });

  /* 9 ---------- จำนวนเชิงซ้อน: รากของหนึ่ง ---------- */
  add({
    id: "m-croot", topic: "จำนวนเชิงซ้อน", gen(R) {
      const n = R.pick([3, 4, 5, 6, 8, 10, 12]);
      const ang = piTex(2, n);
      const pool = [
        { t: "$z\\cdot\\bar z = 1$", ok: true, why: "$|z| = 1$ จึงได้ $z\\bar z = |z|^2 = 1$ ✓" },
        { t: "$z + \\dfrac{1}{z}$ เป็นจำนวนจริง", ok: true, why: `$\\dfrac1z = \\bar z$ จึงได้ $z + \\dfrac1z = 2\\cos ${ang}$ เป็นจำนวนจริง ✓` },
        { t: "$z - \\dfrac{1}{z}$ เป็นจำนวนจริง", ok: false, why: `$z - \\dfrac1z = 2i\\sin ${ang} \\ne$ จำนวนจริง ✗` },
        { t: `$z^{${n - 1}} = \\bar z$`, ok: true, why: `$z^{${n}} = 1$ จึงได้ $z^{${n - 1}} = z^{-1} = \\bar z$ ✓` },
      ];
      const M = R.pick([n * 2, n + 2, 2 * n - 1, 3 * n, n + n / 2].filter(Number.isInteger));
      pool.push({ t: `$z$ เป็นรากที่ $${M}$ ของ $1$`, ok: M % n === 0, why: `$z^{${M}} = \\cos\\frac{${2 * M}\\pi}{${n}} + i\\sin\\frac{${2 * M}\\pi}{${n}}$ ${M % n === 0 ? "$= 1$ ✓" : "$\\ne 1$ ✗"}` });
      const kk = R.int(2, n);
      const okNeg = (2 * kk) % n === 0 && ((2 * kk) / n) % 2 === 1;
      pool.push({ t: `$z^{${kk}} = -1$`, ok: okNeg, why: `$z^{${kk}}$ มีอาร์กิวเมนต์ $\\frac{${2 * kk}\\pi}{${n}}$ ${okNeg ? "ซึ่งเท่ากับ $\\pi$ (บวกพหุคูณของ $2\\pi$) ✓" : "ซึ่งไม่ใช่ $\\pi$ (บวกพหุคูณของ $2\\pi$) ✗"}` });
      const COMBOS = [["ก"], ["ก", "ข"], ["ก", "ค"], ["ข", "ค"], ["ก", "ข", "ค"]];
      const LAB = ["ก", "ข", "ค"];
      let st, key;
      for (let t = 0; t < 30; t++) {
        st = R.sample(pool, 3);
        key = LAB.filter((_, i) => st[i].ok).join("");
        if (COMBOS.some(c => c.join("") === key)) break; key = null;
      }
      A(key);
      const txt = c => c.length === 3 ? "ข้อความ ก) ข) และ ค) ถูกต้อง" : `มีเพียงข้อความ ${c.map(x => x + ")").join(" และ ")} เท่านั้นที่ถูกต้อง`;
      const list = COMBOS.map(txt);
      const o = X.fixedOpts(list, txt(COMBOS.find(c => c.join("") === key)));
      const sol = `$z = \\cos${ang} + i\\sin${ang}$ มี $|z| = 1$ และ $z^{${n}} = 1$<br>` + st.map((s, i) => `${LAB[i]}) ${s.why}`).join("<br>");
      return Object.assign({ q: `กำหนดให้ $z = \\cos\\left(${ang}\\right) + i\\sin\\left(${ang}\\right)$ พิจารณาข้อความต่อไปนี้<br>` + st.map((s, i) => `${LAB[i]}) ${s.t}`).join("<br>") + "<br>ข้อใดต่อไปนี้ถูกต้อง", sol }, o);
    },
  });

  /* 10 ---------- ดีเทอร์มิแนนต์ ---------- */
  add({
    id: "m-det", topic: "เมทริกซ์", gen(R) {
      let a, b, c, d;
      do { a = R.int(1, 4); b = R.int(-3, 4); c = R.int(-3, 5); d = R.int(1, 6); } while (a * d - b * c === 0 || Math.abs(a * d - b * c) > 6);
      const e = R.pick([1, 2, -1, 3]), k = R.pick([2, 3, -2]);
      const dA = (a * d - b * c) * e;
      const Am = bm([[a, b, 0], [c, d, 0], [0, 0, e]]);
      const ans = F(k ** 3, dA);
      const variant = R.chance(0.5);
      const qtxt = variant
        ? `ให้ $A = ${Am}$ และให้ $B$ เป็นเมทริกซ์ขนาด $3\\times 3$ ที่ทำให้ $AB = ${k}I_3$ เมื่อ $I_3$ เป็นเมทริกซ์เอกลักษณ์ แล้ว $\\det(B)$ มีค่าเท่ากับข้อใด`
        : `ให้ $A = ${Am}$ ค่าของ $\\det\\left(${k}A^{-1}\\right)$ เท่ากับข้อใด`;
      const step = variant
        ? `$\\det(AB) = \\det(${k}I_3)$ → $\\det A \\cdot \\det B = (${k})^3 = ${k ** 3}$`
        : `$\\det(${k}A^{-1}) = (${k})^3 \\det(A^{-1}) = \\dfrac{${k ** 3}}{\\det A}$`;
      const sol = `กระจายตามแถวที่ 3: $\\det A = ${e}\\cdot\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = ${e}(${a * d} - (${b * c})) = ${dA}$<br>` +
        `${step}<br>ดังนั้นคำตอบคือ $\\dfrac{${k ** 3}}{${dA}} = \\boldsymbol{${ans.tex()}}$ (ระวัง: สเกลาร์ $${k}$ ต้องยกกำลัง 3 ตามขนาดเมทริกซ์)`;
      const o = X.fracOpts(ans, [F(k, dA), F(-(k ** 3), dA), F(k * k, dA), F(dA, k ** 3), F(k ** 3 * dA)]);
      return Object.assign({ q: qtxt, sol }, o);
    },
  });

  /* 11 ---------- ภาคตัดกรวย: ระบุชนิดจากสมการทั่วไป ---------- */
  add({
    id: "m-conic", topic: "เรขาคณิตวิเคราะห์", gen(R) {
      const type = R.pick(["circle", "eX", "eY", "hX", "hY", "pR", "pL", "pU", "pD"]);
      const h = R.int(-3, 3), k = R.int(-3, 3);
      let a = R.int(1, 3), b = R.int(1, 3), r = R.int(2, 4), cc = R.pick([1, 2]);
      if (type === "eX") { a = R.int(2, 4); b = R.int(1, a - 1); }
      if (type === "eY") { b = R.int(2, 4); a = R.int(1, b - 1); }
      let co, std; // co = [A(x^2), C(y^2), D(x), E(y), F]
      const X2 = shift(h, "x"), Y2 = shift(k, "y");
      if (type === "circle") { co = [1, 1, -2 * h, -2 * k, h * h + k * k - r * r]; std = `${X2}^2 + ${Y2}^2 = ${r * r}`; }
      else if (type === "eX" || type === "eY") { co = [b * b, a * a, -2 * h * b * b, -2 * k * a * a, b * b * h * h + a * a * k * k - a * a * b * b]; std = `\\dfrac{${X2}^2}{${a * a}} + \\dfrac{${Y2}^2}{${b * b}} = 1`; }
      else if (type === "hX") { co = [b * b, -a * a, -2 * h * b * b, 2 * k * a * a, b * b * h * h - a * a * k * k - a * a * b * b]; std = `\\dfrac{${X2}^2}{${a * a}} - \\dfrac{${Y2}^2}{${b * b}} = 1`; }
      else if (type === "hY") { co = [-b * b, a * a, 2 * h * b * b, -2 * k * a * a, -b * b * h * h + a * a * k * k - a * a * b * b]; std = `\\dfrac{${Y2}^2}{${a * a}} - \\dfrac{${X2}^2}{${b * b}} = 1`; }
      else if (type === "pR" || type === "pL") { const s = type === "pR" ? 1 : -1; co = [0, 1, -4 * s * cc, -2 * k, k * k + 4 * s * cc * h]; std = `${Y2}^2 = ${4 * s * cc}${X2}`; }
      else { const s = type === "pU" ? 1 : -1; co = [1, 0, -2 * h, -4 * s * cc, h * h + 4 * s * cc * k]; std = `${X2}^2 = ${4 * s * cc}${Y2}`; }
      const gg = co.reduce((g0, v) => X.gcd(g0, v), 0); co = co.map(v => v / gg);
      if (co[0] < 0 || (co[0] === 0 && co[1] < 0)) co = co.map(v => -v);
      // general form text
      const termsT = [[co[0], "x^2"], [co[1], "y^2"], [co[2], "x"], [co[3], "y"], [co[4], ""]];
      let eq = "";
      for (const [v, s] of termsT) { if (!v) continue; const av = Math.abs(v); const body = (av === 1 && s ? "" : av) + s; eq += eq ? (v < 0 ? " - " : " + ") + body : (v < 0 ? "-" : "") + body; }
      eq += " = 0";
      const NAMES = {
        circle: `วงกลมที่มีรัศมี ${r} หน่วย`, eX: "วงรีที่มีแกนเอกขนานกับแกน $X$", eY: "วงรีที่มีแกนเอกขนานกับแกน $Y$",
        hX: "ไฮเพอร์โบลาที่มีแกนตามขวางขนานกับแกน $X$", hY: "ไฮเพอร์โบลาที่มีแกนตามขวางขนานกับแกน $Y$",
        pR: "พาราโบลาที่เปิดทางขวา", pL: "พาราโบลาที่เปิดทางซ้าย", pU: "พาราโบลาที่เปิดขึ้น (หงาย)", pD: "พาราโบลาที่เปิดลง (คว่ำ)",
      };
      const wrongNames = Object.keys(NAMES).filter(t => t !== type).map(t => NAMES[t]);
      if (type === "circle") wrongNames.push(`วงกลมที่มีรัศมี ${r * r} หน่วย`);
      const o = X.opts(R, NAMES[type], wrongNames);
      // figure
      const ext = type.startsWith("p") ? 5 : Math.max(a, b, r) + 2;
      const P = new Plot({ x: [h - ext, h + ext], y: [k - ext, k + ext], w: 230, h: 230, xs: 1, ys: 1, tx: 2, ty: 2, pad: [14, 14, 22, 26] });
      P.axes();
      const pts = [], N = 120;
      if (type === "circle") for (let i = 0; i <= N; i++) { const t = 2 * Math.PI * i / N; pts.push([h + r * Math.cos(t), k + r * Math.sin(t)]); }
      if (type[0] === "e") for (let i = 0; i <= N; i++) { const t = 2 * Math.PI * i / N; pts.push([h + a * Math.cos(t), k + b * Math.sin(t)]); }
      if (pts.length) P.pl(pts);
      if (type[0] === "h") {
        for (const sgn of [1, -1]) {
          const br = [];
          for (let i = -N / 2; i <= N / 2; i++) { const t = 2.4 * i / (N / 2); br.push(type === "hX" ? [h + sgn * a * Math.cosh(t), k + b * Math.sinh(t)] : [h + b * Math.sinh(t), k + sgn * a * Math.cosh(t)]); }
          P.fn(() => NaN); P.add(`<g clip-path="url(#${P.clipId()})">${S.poly(br.map(([x, y]) => [P.sx(x), P.sy(y)]), "ac thk nf", false)}</g>`);
        }
      }
      if (type[0] === "p") {
        const s = type === "pR" || type === "pU" ? 1 : -1; const br = [];
        for (let i = -N / 2; i <= N / 2; i++) { const t = 6 * i / (N / 2); br.push(type === "pR" || type === "pL" ? [h + s * t * t / (4 * cc), k + t] : [h + t, k + s * t * t / (4 * cc)]); }
        P.add(`<g clip-path="url(#${P.clipId()})">${S.poly(br.map(([x, y]) => [P.sx(x), P.sy(y)]), "ac thk nf", false)}</g>`);
      }
      P.pt(h, k, type[0] === "p" ? "จุดยอด" : "ศูนย์กลาง", { c: "fs" });
      const sol = `จัดกำลังสองสมบูรณ์จากสมการ $${eq}$ จะได้รูปมาตรฐาน<br>$$${std}$$` +
        `ดังนั้นกราฟคือ<b>${NAMES[type]}</b> ${type[0] === "p" ? "จุดยอด" : "จุดศูนย์กลาง"}อยู่ที่ $(${h}, ${k})$`;
      return Object.assign({ q: `ข้อใดต่อไปนี้เป็นกราฟของสมการ $${eq}$`, sol, solFig: P.toString() }, o);
    },
  });

  /* 12 ---------- การเลื่อนกราฟ g(x) = f(x+a) + b (มีรูป) ---------- */
  add({
    id: "m-shift", topic: "ฟังก์ชัน", gen(R) {
      const r1 = R.int(-2, 0), r2 = r1 + R.int(2, 3), r3 = r2 + R.int(2, 3);
      const sgn = R.sign();
      const raw = x => sgn * (x - r1) * (x - r2) * (x - r3);
      let mx = 0; for (let x = r1 - 0.4; x <= r3 + 0.4; x += 0.05) mx = Math.max(mx, Math.abs(raw(x)));
      const sc = [1, 1 / 2, 1 / 4, 1 / 8, 1 / 16].find(s => mx * s <= 5.5) || 1 / 32;
      const f = x => sc * raw(x);
      const a = R.pick([-3, -2, -1, 1, 2, 3]), b = R.pick([-2, -1, 1, 2, 3]);
      const lo = r1 - 0.45, hi = r3 + 0.45;
      const yr = [Math.floor(Math.min(f(lo), f(hi), -mx * sc)) - 1, Math.ceil(Math.max(f(lo), f(hi), mx * sc)) + 1];
      const mk = (fun, l, h, pts, name) => {
        const xr = [Math.min(Math.floor(l) - 1, -1), Math.max(Math.ceil(h) + 1, 1)];
        const yy = [Math.min(yr[0] + Math.min(b, 0), -1), Math.max(yr[1] + Math.max(b, 0), 1)];
        const P = new Plot({ x: xr, y: yy, w: 250, h: 230, xs: 1, ys: 1, tx: 2, ty: 2, pad: [14, 16, 20, 24], axisLabels: ["X", "Y"] });
        P.axes().fn(fun, "ac thk", l, h);
        for (const [x, y] of pts) P.pt(x, y);
        P.add(S.text(P.sx(h) + 2, P.sy(fun(h)) + (fun(h) > 0 ? 10 : -10), name, { i: true, a: "start" }));
        return P.toString();
      };
      const fig = `<div class="figrow">${mk(f, lo, hi, [[r1, 0], [r2, 0], [r3, 0]], "f")}${mk(x => f(x + a) + b, lo - a, hi - a, [[r1 - a, b], [r2 - a, b], [r3 - a, b]], "g")}</div>`;
      const ans = 2 * a + 3 * b;
      const o = X.numOpts(ans, [-2 * a + 3 * b, 2 * a - 3 * b, -2 * a - 3 * b, 3 * a + 2 * b]);
      const sol = `$g(x) = f(x + a) + b$ คือการเลื่อนกราฟ $f$ ไปทาง${a > 0 ? "ซ้าย" : "ขวา"} $|a|$ หน่วย และเลื่อน${b > 0 ? "ขึ้น" : "ลง"} $|b|$ หน่วย<br>` +
        `เทียบจุดตัดแกน $X$ ของ $f$ ที่ $(${r1}, 0)$ กับจุดที่สอดคล้องบนกราฟ $g$ คือ $(${r1 - a}, ${b})$<br>` +
        `จาก $g(${r1 - a}) = f(${r1 - a} + a) + b = f(${r1}) + b$ ได้ $a = ${a}$ และ $b = ${b}$<br>ดังนั้น $2a + 3b = ${2 * a} + (${3 * b}) = \\boldsymbol{${ans}}$`;
      return Object.assign({ q: `ให้ $f$ และ $g$ เป็นฟังก์ชันที่มีกราฟดังรูป (จุดที่ทำเครื่องหมายไว้อยู่บนเส้นตาราง)`, fig, q2: `ถ้า $a$ และ $b$ เป็นจำนวนเต็มที่ทำให้ $g(x) = f(x + a) + b$ สำหรับทุก $x \\in D_g$ แล้วข้อใดเป็นค่าของ $2a + 3b$`, sol }, o);
    },
  });

  /* 13 ---------- ลำดับและอนุกรม ---------- */
  add({
    id: "m-series", topic: "ลำดับและอนุกรม", gen(R) {
      if (R.chance(0.55)) {
        const a1 = R.int(-8, 12), d = R.pick([-3, -2, 2, 3, 4, 5]), mI = R.int(2, 5), nI = mI + R.int(3, 7), k = R.int(10, 20);
        const am = a1 + (mI - 1) * d, an = a1 + (nI - 1) * d, Sk = k * (2 * a1 + (k - 1) * d) / 2;
        const sol = `$a_{${nI}} - a_{${mI}} = (${nI} - ${mI})d$ → $${an} - (${am}) = ${nI - mI}d$ → $d = ${d}$<br>` +
          `$a_1 = a_{${mI}} - ${mI - 1}d = ${a1}$<br>$S_{${k}} = \\dfrac{${k}}{2}\\left[2(${a1}) + ${k - 1}(${d})\\right] = \\boldsymbol{${Sk}}$`;
        const o = X.numOpts(Sk, [Sk - (a1 + (k - 1) * d), Sk + a1 + k * d, k * (a1 + (k - 1) * d), (k * (2 * a1 + k * d)) / 2]);
        return Object.assign({ q: `ลำดับเลขคณิตลำดับหนึ่งมี $a_{${mI}} = ${am}$ และ $a_{${nI}} = ${an}$ ผลบวก $${k}$ พจน์แรกของลำดับนี้เท่ากับข้อใด`, sol }, o);
      }
      const r = R.pick([2, 3, -2]), a1 = R.pick([1, 2, 3, -1]), n = R.int(5, 7);
      const a2 = a1 * r, a4 = a1 * r ** 3, Sn = a1 * (r ** n - 1) / (r - 1);
      const sol = `$\\dfrac{a_4}{a_2} = r^2 = \\dfrac{${a4}}{${a2}} = ${r * r}$ และจากเครื่องหมายของพจน์ ได้ $r = ${r}$, $a_1 = ${a1}$<br>` +
        `$S_{${n}} = \\dfrac{a_1(r^{${n}} - 1)}{r - 1} = \\dfrac{${a1}((${r})^{${n}} - 1)}{${r - 1}} = \\boldsymbol{${Sn}}$`;
      A(r > 0 || a2 * a4 > 0);
      const o = X.numOpts(Sn, [a1 * (r ** (n + 1) - 1) / (r - 1), a1 * (r ** (n - 1) - 1) / (r - 1), a1 * r ** n, Sn + a1]);
      return Object.assign({ q: `ลำดับเรขาคณิตลำดับหนึ่งมีพจน์ที่ 2 เท่ากับ $${a2}$ และพจน์ที่ 4 เท่ากับ $${a4}$ โดยอัตราส่วนร่วมเป็น${r > 0 ? "บวก" : "ลบ"} ผลบวก $${n}$ พจน์แรกเท่ากับข้อใด`, sol }, o);
    },
  });

  /* 14 ---------- ความน่าจะเป็น: เลือกคณะกรรมการ ---------- */
  add({
    id: "m-prob", topic: "ความน่าจะเป็น", gen(R) {
      const b = R.int(3, 6), w = R.int(2, 5), k = R.pick([3, 3, 4]);
      const tot = C(b + w, k);
      const v = R.pick(["least1", "exact2", "both"]);
      let fav, txt, sol;
      if (v === "least1") { fav = tot - C(b, k); txt = "มีผู้หญิงอย่างน้อย 1 คน"; sol = `ใช้ส่วนเติมเต็ม: ไม่มีผู้หญิงเลย $= \\binom{${b}}{${k}} = ${C(b, k)}$ วิธี<br>จำนวนที่ต้องการ $= ${tot} - ${C(b, k)} = ${fav}$`; }
      else if (v === "exact2") { fav = C(w, 2) * C(b, k - 2); txt = "มีผู้หญิงพอดี 2 คน"; sol = `เลือกหญิง 2 คนและชาย $${k - 2}$ คน: $\\binom{${w}}{2}\\binom{${b}}{${k - 2}} = ${C(w, 2)}\\times${C(b, k - 2)} = ${fav}$ วิธี`; }
      else { fav = tot - C(b, k) - C(w, k); txt = "มีทั้งผู้ชายและผู้หญิง"; sol = `ส่วนเติมเต็มคือ ชายล้วน $\\binom{${b}}{${k}} = ${C(b, k)}$ หรือหญิงล้วน $\\binom{${w}}{${k}} = ${C(w, k)}$<br>จำนวนที่ต้องการ $= ${tot} - ${C(b, k)} - ${C(w, k)} = ${fav}$`; }
      A(fav > 0 && fav < tot);
      const ans = F(fav, tot);
      sol = `จำนวนวิธีเลือกทั้งหมด $\\binom{${b + w}}{${k}} = ${tot}$<br>` + sol + `<br>ความน่าจะเป็น $= \\dfrac{${fav}}{${tot}} = \\boldsymbol{${ans.tex()}}$`;
      const o = X.fracOpts(ans, [F(tot - fav, tot), F(C(b, k), tot), F(fav, tot + fav), F(fav * 6, X.C(b + w, k) * 6 * k), F(w, b + w)].filter(f => f.v > 0 && f.v < 1));
      return Object.assign({ q: `ห้องเรียนหนึ่งมีนักเรียนชาย $${b}$ คน และนักเรียนหญิง $${w}$ คน สุ่มเลือกนักเรียน $${k}$ คนเป็นคณะกรรมการ ความน่าจะเป็นที่คณะกรรมการ${txt}เท่ากับข้อใด`, sol }, o);
    },
  });

  /* 15 ---------- สถิติ: แปลงข้อมูล y = ax + b ---------- */
  add({
    id: "m-stat-tf", topic: "สถิติ", gen(R) {
      const mu = R.int(8, 30), sd = R.int(2, 6), a = R.pick([2, 3, -2, 4]), b = R.int(-10, 10) || 5, n = R.int(20, 60);
      const nm = a * mu + b, nv = a * a * sd * sd;
      const pr = (x, y) => `ค่าเฉลี่ย $${x}$ และความแปรปรวน $${y}$`;
      const ans = pr(nm, nv);
      const o = X.opts(R, ans, [pr(nm, a * sd * sd), pr(nm, nv + b), pr(a * mu, nv), pr(nm, Math.abs(a) * sd), pr(a * mu + b * n, nv)]);
      const sol = `เมื่อ $y_i = ${a}x_i ${b < 0 ? "-" : "+"} ${Math.abs(b)}$:<br>ค่าเฉลี่ยใหม่ $\\bar y = ${a}\\bar x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a}(${mu}) ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${nm}$<br>` +
        `การบวกค่าคงที่ไม่เปลี่ยนการกระจาย ส่วนการคูณด้วย $a$ ทำให้ความแปรปรวนคูณด้วย $a^2$: $s_y^2 = (${a})^2(${sd})^2 = ${nv}$<br>ตอบ <b>${ans}</b>`;
      return Object.assign({ q: `ข้อมูลชุดหนึ่งมี $${n}$ ค่า มีค่าเฉลี่ยเลขคณิตเท่ากับ $${mu}$ และส่วนเบี่ยงเบนมาตรฐานเท่ากับ $${sd}$ ถ้านำข้อมูลแต่ละค่ามาคูณด้วย $${a}$ แล้ว${b < 0 ? "ลบด้วย" : "บวกด้วย"} $${Math.abs(b)}$ ข้อมูลชุดใหม่มีค่าเฉลี่ยเลขคณิตและความแปรปรวนเท่าใด`, sol }, o);
    },
  });

  /* 16 ---------- สถิติ: แผนภูมิแท่งความถี่ (มีรูป) ---------- */
  add({
    id: "m-stat-bar", topic: "สถิติ", gen(R) {
      const xs = [1, 2, 3, 4, 5, 6].map(v => v + R.pick([0, 0, 4]) * 0);
      const base = R.pick([[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [0, 1, 2, 3, 4]]);
      const fr = base.map(() => R.int(1, 8));
      const N = fr.reduce((s, x) => s + x, 0); A(N >= 10 && N <= 30);
      const mx = Math.max(...fr); A(fr.filter(f => f === mx).length === 1);
      const sum = base.reduce((s, x, i) => s + x * fr[i], 0);
      const mean = sum / N;
      const sorted = []; base.forEach((x, i) => { for (let j = 0; j < fr[i]; j++) sorted.push(x); });
      const med = N % 2 ? sorted[(N - 1) / 2] : (sorted[N / 2 - 1] + sorted[N / 2]) / 2;
      const mode = base[fr.indexOf(mx)];
      const ask = R.pick(["mean", "mm"]);
      const P = new Plot({ x: [base[0] - 0.8, base[4] + 0.8], y: [0, mx + 1], w: 300, h: 210, xs: 1, ys: 1, tx: 1, ty: 1, frame: true, grid: true, pad: [12, 12, 40, 44], axisLabels: ["จำนวนหนังสือที่อ่าน (เล่ม)", "จำนวนนักเรียน (คน)"] });
      P.axes();
      base.forEach((x, i) => P.add(S.rect(P.sx(x - 0.3), P.sy(fr[i]), P.sx(x + 0.3) - P.sx(x - 0.3), P.sy(0) - P.sy(fr[i]), "ac fa")));
      void xs;
      let ans, o, sol;
      const tbl = `ผลรวม $\\sum f_ix_i = ${base.map((x, i) => `${x}(${fr[i]})`).join(" + ")} = ${sum}$, $N = ${N}$`;
      if (ask === "mean") {
        ans = mean; o = X.numOpts(ans, [sum / 5, med, (base[0] + base[4]) / 2 + 0.5, mean + 0.5, mean - 0.5], v => X.fmt(v, 2));
        sol = `${tbl}<br>ค่าเฉลี่ยเลขคณิต $= \\dfrac{${sum}}{${N}} \\approx \\boldsymbol{${X.fmt(mean, 2)}}$`;
      } else {
        ans = med + mode; o = X.numOpts(ans, [med + mx, mean + mode, med * 2, ans + 1, ans - 1], v => X.num(v, 1));
        sol = `ฐานนิยม = ค่าที่มีความถี่สูงสุด ($${mx}$ คน) คือ $${mode}$<br>มีข้อมูล $${N}$ ตัว มัธยฐานอยู่ตำแหน่งที่ $\\frac{${N}+1}{2} = ${X.num((N + 1) / 2, 1)}$ นับสะสมจากแท่งซ้ายได้มัธยฐาน $= ${X.num(med, 1)}$<br>ผลบวก $= ${X.num(med, 1)} + ${mode} = \\boldsymbol{${X.num(ans, 1)}}$`;
      }
      return Object.assign({ q: `แผนภูมิแท่งแสดงจำนวนหนังสือที่นักเรียนห้องหนึ่งอ่านในเดือนที่ผ่านมา`, fig: P.toString(), q2: ask === "mean" ? `ค่าเฉลี่ยเลขคณิตของจำนวนหนังสือที่นักเรียนอ่าน (ทศนิยม 2 ตำแหน่ง) เท่ากับข้อใด` : `ผลบวกของมัธยฐานและฐานนิยมของข้อมูลชุดนี้เท่ากับข้อใด`, sol }, o);
    },
  });

  /* 17 ---------- เวกเตอร์ ---------- */
  add({
    id: "m-vector", topic: "เวกเตอร์", gen(R) {
      const u = R.int(2, 6), v = R.int(2, 6);
      const dot = R.int(-u * v + 1, u * v - 1);
      const dif2 = u * u + v * v - 2 * dot, sum2 = u * u + v * v + 2 * dot;
      A(dif2 > 0 && sum2 > 0);
      const ask2 = R.chance(0.5);
      let ans, wr, q, sol;
      if (!ask2) {
        ans = sum2; wr = [dif2, u * u + v * v, sum2 + 2 * dot, (u + v) ** 2, 2 * u * u + 2 * v * v + dif2];
        q = `กำหนดให้ $\\vec u$ และ $\\vec v$ เป็นเวกเตอร์ซึ่ง $|\\vec u| = ${u}$, $|\\vec v| = ${v}$ และ $|\\vec u - \\vec v| = ${sqrtTex(dif2)}$ แล้ว $|\\vec u + \\vec v|$ เท่ากับข้อใด`;
        sol = `$|\\vec u - \\vec v|^2 = |\\vec u|^2 + |\\vec v|^2 - 2\\vec u\\cdot\\vec v$ → $${dif2} = ${u * u} + ${v * v} - 2\\vec u\\cdot\\vec v$ → $\\vec u\\cdot\\vec v = ${dot}$<br>` +
          `$|\\vec u + \\vec v|^2 = ${u * u} + ${v * v} + 2(${dot}) = ${sum2}$ ดังนั้น $|\\vec u + \\vec v| = \\boldsymbol{${sqrtTex(sum2)}}$`;
      } else {
        const N2 = 4 * u * u + v * v - 4 * dot; A(N2 > 0);
        ans = N2; wr = [4 * u * u + v * v + 4 * dot, 4 * u * u + v * v - 2 * dot, 2 * u * u + v * v - 4 * dot, sum2, N2 + 4];
        q = `กำหนดให้ $|\\vec u| = ${u}$, $|\\vec v| = ${v}$ และ $|\\vec u + \\vec v| = ${sqrtTex(sum2)}$ แล้ว $|2\\vec u - \\vec v|$ เท่ากับข้อใด`;
        sol = `จาก $|\\vec u + \\vec v|^2 = ${u * u} + ${v * v} + 2\\vec u\\cdot\\vec v = ${sum2}$ ได้ $\\vec u\\cdot\\vec v = ${dot}$<br>` +
          `$|2\\vec u - \\vec v|^2 = 4|\\vec u|^2 + |\\vec v|^2 - 4\\vec u\\cdot\\vec v = ${4 * u * u} + ${v * v} - 4(${dot}) = ${N2}$ → $\\boldsymbol{${sqrtTex(N2)}}$`;
      }
      const vals = [...new Set([ans, ...wr].filter(x => x > 0))];
      A(vals.length >= 5);
      const items = vals.slice(0, 5).sort((a, b) => a - b);
      return { q, sol, choices: items.map(x => m(sqrtTex(x))), answer: items.indexOf(ans) };
    },
  });

  /* 18 ---------- ฟังก์ชันรายได้ / ค่าสูงสุด ---------- */
  add({
    id: "m-revenue", topic: "ฟังก์ชัน", gen(R) {
      const d = R.pick([2, 4, 5, 10]), p0 = R.pick([20, 25, 30, 40, 50]), xs = p0 + R.int(1, 8);
      const q0 = d * (2 * xs - p0); // makes vertex at xs
      const rev = x => x * (q0 - d * (x - p0));
      const variant = R.chance(0.5);
      const qt = `ร้านขนมแห่งหนึ่งพบว่า ถ้าขายขนมชิ้นละ $${p0}$ บาท จะขายได้วันละ $${q0}$ ชิ้น และทุก ๆ หนึ่งบาทที่ขึ้นราคา จะขายได้น้อยลง $${d}$ ชิ้น ให้ $f(x)$ แทนรายได้ต่อวันเมื่อขายราคา $x$ บาทต่อชิ้น`;
      const c1 = q0 + d * p0;
      if (variant) {
        const ans = rev(xs);
        const o = X.numOpts(ans, [rev(p0), rev(xs + 2), xs * q0, rev(xs) + d * 10], v => X.fmt(v, 0));
        const sol = `จำนวนที่ขายได้ $= ${q0} - ${d}(x - ${p0}) = ${c1} - ${d}x$ ดังนั้น $f(x) = x(${c1} - ${d}x) = ${c1}x - ${d}x^2$<br>` +
          `เป็นพาราโบลาคว่ำ ค่าสูงสุดที่ $x = \\dfrac{${c1}}{2(${d})} = ${xs}$ บาท<br>$f(${xs}) = ${xs}(${c1} - ${d * xs}) = ${xs}(${c1 - d * xs}) = \\boldsymbol{${X.fmt(ans, 0)}}$ บาท`;
        return Object.assign({ q: qt + ` รายได้ต่อวันสูงสุดที่เป็นไปได้เท่ากับกี่บาท`, sol }, o);
      }
      const ans = m(`f(x) = ${c1}x - ${d}x^2`);
      const o = X.opts(R, ans, [m(`f(x) = ${q0}x - ${d}x^2`), m(`f(x) = ${c1} - ${d}x`), m(`f(x) = ${c1}x + ${d}x^2`), m(`f(x) = ${p0}x + ${d}x^2`), m(`f(x) = ${q0 * p0} - ${d * p0}x`)]);
      const sol = `ถ้าราคาเป็น $x$ บาท ขึ้นราคาไป $x - ${p0}$ บาท ขายได้ $${q0} - ${d}(x - ${p0}) = ${c1} - ${d}x$ ชิ้น<br>รายได้ = ราคา × จำนวน → $f(x) = x(${c1} - ${d}x) = \\boldsymbol{${c1}x - ${d}x^2}$`;
      return Object.assign({ q: qt + ` จะได้ว่า $f(x)$ มีค่าเท่ากับข้อใด`, sol }, o);
    },
  });

  /* 19 ---------- ดอกเบี้ยทบต้น / ค่ารายงวด ---------- */
  add({
    id: "m-interest", topic: "คณิตศาสตร์การเงิน", gen(R) {
      if (R.chance(0.5)) {
        const P = R.pick([10000, 20000, 50000, 100000]), r = R.pick([2, 4, 6]), n = R.pick([3, 4, 5]);
        const i = r / 200, N = 2 * n, pw = X.round((1 + i) ** N, 4);
        const ans = P * pw;
        const o = X.numOpts(ans, [P * (1 + r / 100 * n), P * X.round((1 + r / 100) ** n, 4), P * X.round((1 + i) ** n, 4), P * X.round((1 + r / 100) ** N, 4)], v => X.fmt(v, 0));
        const sol = `ทบต้นทุก 6 เดือน → อัตราต่องวด $= \\frac{${r}\\%}{2} = ${X.num(r / 2)}\\%$ จำนวนงวด $= 2\\times ${n} = ${N}$<br>` +
          `เงินรวม $= ${X.fmt(P, 0)}(1 + ${X.num(i, 3)})^{${N}} = ${X.fmt(P, 0)}(${pw}) = \\boldsymbol{${X.fmt(ans, 0)}}$ บาท`;
        return Object.assign({ q: `ฝากเงิน $${X.fmt(P, 0)}$ บาท ในบัญชีที่ให้ดอกเบี้ย $${r}\\%$ ต่อปี โดยคิดดอกเบี้ยแบบทบต้นทุก 6 เดือน เมื่อครบ $${n}$ ปี จะมีเงินรวมประมาณกี่บาท (กำหนด $(${X.num(1 + i, 3)})^{${N}} \\approx ${pw}$)`, sol }, o);
      }
      const Am = R.pick([1000, 2000, 5000]), r = R.pick([2, 3, 4, 5]), n = R.pick([5, 6, 8, 10]);
      const i = r / 100, pw = X.round((1 + i) ** n, 4);
      const ans = Am * (pw - 1) / i;
      const o = X.numOpts(ans, [Am * n, Am * n * (1 + i), Am * pw * n, Am * (pw - 1) / i * (1 + i)], v => X.fmt(v, 0));
      const sol = `ฝากปลายปีทุกปี เป็นค่ารายงวดแบบสามัญ: เงินรวม $= A\\cdot\\dfrac{(1+i)^n - 1}{i}$<br>` +
        `$= ${X.fmt(Am, 0)}\\cdot\\dfrac{${pw} - 1}{${X.num(i)}} = \\boldsymbol{${X.fmt(ans, 0)}}$ บาท`;
      return Object.assign({ q: `นายเอฝากเงินปีละ $${X.fmt(Am, 0)}$ บาท ทุกสิ้นปีเป็นเวลา $${n}$ ปี ในบัญชีที่ให้ดอกเบี้ย $${r}\\%$ ต่อปี ทบต้นทุกปี เมื่อฝากครบงวดสุดท้าย จะมีเงินรวมประมาณกี่บาท (กำหนด $(${X.num(1 + i)})^{${n}} \\approx ${pw}$)`, sol }, o);
    },
  });

  /* 20 ---------- แคลคูลัส: พื้นที่ใต้กราฟ (มีรูป) ---------- */
  add({
    id: "m-area", topic: "แคลคูลัส", gen(R) {
      const k = R.pick([2, 3, 4, 6]), up = R.chance(0.5);
      const f = x => (up ? -1 : 1) * x * (x - k);
      const ans = F(k ** 3, 6);
      const P = new Plot({ x: [-1, k + 1], y: up ? [-2, Math.ceil(k * k / 4) + 1] : [-Math.ceil(k * k / 4) - 1, 2], w: 260, h: 200, xs: 1, ys: 1, tx: 1, ty: Math.max(1, Math.round(k * k / 8)), pad: [14, 16, 20, 26] });
      P.axes();
      const pts = [[0, 0]]; for (let i = 0; i <= 60; i++) { const x = k * i / 60; pts.push([x, f(x)]); } pts.push([k, 0]);
      P.pl(pts, "fa nos", true);
      P.fn(f, "ac thk", -0.8, k + 0.8);
      const eq = up ? `y = ${k}x - x^2` : `y = x^2 - ${k}x`;
      P.add(S.text(P.sx(k + 0.6), P.sy(f(k + 0.6)) + (up ? 12 : -12), eq.replace(/\^2/g, "²"), { c: "sm", a: "end", i: true }));
      const o = X.fracOpts(ans, [F(k ** 3, 3), F(k ** 3, 2), F(k * k, 2), F(k ** 3, 12), F(-(k ** 3), 6)].filter(f2 => f2.v > 0));
      const sol = `กราฟตัดแกน $X$ ที่ $x = 0$ และ $x = ${k}$<br>` +
        `พื้นที่ $= \\left|\\displaystyle\\int_0^{${k}} (${up ? `${k}x - x^2` : `x^2 - ${k}x`})\\,dx\\right| = \\left|\\left[${up ? `\\frac{${k}x^2}{2} - \\frac{x^3}{3}` : `\\frac{x^3}{3} - \\frac{${k}x^2}{2}`}\\right]_0^{${k}}\\right| = \\left|${F(k ** 3, 3).tex()} - ${F(k ** 3, 2).tex()}\\right| = \\boldsymbol{${ans.tex()}}$ ตารางหน่วย`;
      return Object.assign({ q: `พื้นที่ของบริเวณที่แรเงา ซึ่งปิดล้อมด้วยเส้นโค้ง $${eq}$ และแกน $X$ เท่ากับกี่ตารางหน่วย`, fig: P.toString(), sol }, o);
    },
  });

  /* 21 ---------- แคลคูลัส: เส้นสัมผัส ---------- */
  add({
    id: "m-tangent", topic: "แคลคูลัส", gen(R) {
      const b = R.int(-3, 3), c = R.int(-5, 5), t = R.pick([-2, -1, 1, 2]);
      const f = x => x ** 3 + b * x * x + c, df = x => 3 * x * x + 2 * b * x;
      const slope = df(t), y0 = f(t), yint = y0 - slope * t;
      const o = X.numOpts(yint, [y0 + slope * t, y0, slope, -yint === yint ? yint + 3 : -yint]);
      const sol = `$f'(x) = 3x^2 ${b < 0 ? "-" : "+"} ${Math.abs(2 * b)}x$ → ความชันที่ $x = ${t}$ คือ $f'(${t}) = ${slope}$ และจุดสัมผัสคือ $(${t}, ${y0})$<br>` +
        `เส้นสัมผัส: $y - (${y0}) = ${slope}(x - (${t}))$ แทน $x = 0$ ได้ $y = ${y0} - (${slope})(${t}) = \\boldsymbol{${yint}}$`;
      return Object.assign({ q: `เส้นสัมผัสเส้นโค้ง $y = ${polyTex([1, b, 0, c])}$ ที่จุดซึ่ง $x = ${t}$ ตัดแกน $Y$ ที่จุด $(0, k)$ ค่าของ $k$ เท่ากับข้อใด`, sol }, o);
    },
  });

  /* 22 ---------- โจทย์ปัญหาอัตรา (แนวข้อ วิ่งในวันอากาศร้อน) ---------- */
  add({
    id: "m-rate", topic: "โจทย์ปัญหา", gen(R) {
      const x = R.pick([4, 5, 6, 8]), d = R.pick([1, 2]);
      const g0 = (x + d) / X.gcd(x + d, d);
      const N = g0 * R.int(1, 3); A(N >= 4 && N <= 15);
      const T = N * x, D = N * d / (x + d), extra = N * d;
      const o = X.numOpts(extra, [T * d / (x + d), extra / 2, D * x, extra + 5], v => X.num(v));
      const sol = `ปกติวิ่งได้ $\\dfrac{${T}}{x}$ กม. วันอากาศร้อนได้ $\\dfrac{${T}}{x + ${d}}$ กม.<br>` +
        `$\\dfrac{${T}}{x} - \\dfrac{${T}}{x + ${d}} = ${X.num(D)}$ ลองแทน/แก้สมการได้ $x = ${x}$ → ระยะปกติ $= ${N}$ กม.<br>` +
        `วันอากาศร้อนต้องใช้เวลา $${N}\\times${x + d} = ${N * (x + d)}$ นาที เพิ่มขึ้น $${N * (x + d)} - ${T} = \\boldsymbol{${extra}}$ นาที`;
      return Object.assign({ q: `ลูกเนวิ่งเป็นประจำวันละ $${T}$ นาที โดยปกติวิ่งด้วยอัตราคงที่ $x$ นาทีต่อกิโลเมตร วันหนึ่งอากาศร้อนกว่าปกติ ลูกเนวิ่งช้าลงเป็น $x + ${d}$ นาทีต่อกิโลเมตร พบว่าในเวลา $${T}$ นาทีเท่าเดิมวิ่งได้ระยะทางลดลง $${X.num(D)}$ กิโลเมตร หากต้องการวิ่งให้ได้ระยะทางเท่าที่เคยวิ่งได้ประจำ จะต้องใช้เวลาเพิ่มขึ้นกี่นาที`, sol }, o);
    },
  });

  /* 23 ---------- กฎของโคไซน์ (มีรูป) ---------- */
  add({
    id: "m-cosine", topic: "ฟังก์ชันตรีโกณมิติ", gen(R) {
      const ang = R.pick([60, 120]), a = R.int(3, 8), b = R.int(3, 8);
      A(a !== b);
      const c2 = a * a + b * b - (ang === 60 ? 1 : -1) * a * b;
      const ans = c2;
      const wr = [a * a + b * b + (ang === 60 ? 1 : -1) * a * b, a * a + b * b, a * a + b * b - 2 * a * b * (ang === 60 ? 1 : -1), (a + b) ** 2 - a * b, c2 + 1];
      const vals = [...new Set([ans, ...wr].filter(x => x > 0))].slice(0, 5).sort((p, q) => p - q);
      A(vals.length === 5 && vals.includes(ans));
      // figure: C at origin, CB along x of length a, CA at angle
      const sc = 150 / Math.max(a, b, Math.sqrt(c2));
      const Cx = ang === 60 ? 40 : 150, Cy = 150;
      const Bx = Cx + a * sc, By = Cy, Ax = Cx + b * sc * Math.cos(ang * Math.PI / 180), Ay = Cy - b * sc * Math.sin(ang * Math.PI / 180);
      const minX = Math.min(Cx, Ax) - 20, W = Math.max(Bx, Ax) - minX + 30;
      let s = `<g transform="translate(${20 - minX} 0)">` + S.poly([[Cx, Cy], [Bx, By], [Ax, Ay]], "ln fa") + S.arc(Cx, Cy, 20, 0, ang, "am nf") +
        S.text(Cx + 28 * Math.cos(ang / 2 * Math.PI / 180), Cy - 28 * Math.sin(ang / 2 * Math.PI / 180), ang + "°", { c: "sm" }) +
        S.text(Cx - 8, Cy + 12, "C", { i: true }) + S.text(Bx + 8, By + 12, "B", { i: true }) + S.text(Ax, Ay - 10, "A", { i: true }) +
        S.text((Cx + Bx) / 2, Cy + 14, String(a), { c: "sm" }) + S.text((Cx + Ax) / 2 - 12, (Cy + Ay) / 2, String(b), { c: "sm", a: "end" }) +
        S.text((Ax + Bx) / 2 + 10, (Ay + By) / 2 - 4, "?", { c: "sm hl", a: "start" }) + "</g>";
      const fig = S.svg(W + 20, 175, s, "รูปสามเหลี่ยม ABC");
      const sol = `กฎของโคไซน์: $AB^2 = ${a}^2 + ${b}^2 - 2(${a})(${b})\\cos ${ang}^\\circ$<br>` +
        `$\\cos ${ang}^\\circ = ${ang === 60 ? "\\frac12" : "-\\frac12"}$ จึงได้ $AB^2 = ${a * a + b * b} ${ang === 60 ? "-" : "+"} ${a * b} = ${c2}$ → $AB = \\boldsymbol{${sqrtTex(c2)}}$`;
      return { q: `สามเหลี่ยม $ABC$ มี $BC = ${a}$ หน่วย, $CA = ${b}$ หน่วย และมุม $C = ${ang}^\\circ$ ดังรูป ความยาวด้าน $AB$ เท่ากับข้อใด`, fig, sol, choices: vals.map(v => m(sqrtTex(v))), answer: vals.indexOf(ans) };
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
