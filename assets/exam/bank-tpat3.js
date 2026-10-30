/* TPAT3 ความถนัดทางวิทยาศาสตร์ เทคโนโลยี วิศวกรรมศาสตร์ — generated items with figures. */
(function (g) {
  "use strict";
  const X = g.EXAM, { S, F, m } = X;
  const add = (o) => X.add(Object.assign({ subj: "tpat3" }, o));
  const A = X.assert, n1 = v => X.num(v, 1), n2 = v => X.num(v, 2);

  /* 1 ---------- พื้นที่แรเงา (มีรูป) ---------- */
  add({
    id: "t-shade", topic: "เรขาคณิตและพื้นที่", gen(R) {
      const kind = R.pick(["sqInCircle", "circleInSq", "quarter", "lens", "ring"]);
      const r = R.pick([2, 3, 4, 5]);
      const piT = (a, b, sgn = -1) => m(`${a === 1 ? "" : a}\\pi ${sgn < 0 ? "-" : "+"} ${b}`);
      const bpiT = (b, a) => m(`${b} - ${a === 1 ? "" : a}\\pi`);
      let ans, wr, fig, sol, q;
      const W = 220, c = 110, sc = 80 / r;
      if (kind === "sqInCircle") {
        ans = piT(r * r, 2 * r * r); wr = [piT(r * r, r * r), piT(r * r, 4 * r * r), piT(4 * r * r, 2 * r * r), piT(2 * r * r, 2 * r * r), piT(r * r, 2 * r)];
        const a = r * sc / Math.SQRT2 * Math.SQRT2; // vertices on circle at 45°
        let s = S.circle(c, c, r * sc, "ln fd") + S.poly([[c, c - a], [c + a, c], [c, c + a], [c - a, c]], "ln bgf");
        s += S.line(c, c, c + r * sc, c, "am") + S.text(c + r * sc / 2, c - 9, `${r}`, { c: "sm" });
        fig = S.svg(W, W, s, "สี่เหลี่ยมจัตุรัสแนบในวงกลม");
        q = `สี่เหลี่ยมจัตุรัสแนบในวงกลมรัศมี $${r}$ หน่วย ดังรูป จงหาพื้นที่บริเวณที่แรเงา`;
        sol = `พื้นที่วงกลม $= \\pi(${r})^2 = ${r * r}\\pi$<br>สี่เหลี่ยมจัตุรัสมีเส้นทแยงมุมยาว $2r = ${2 * r}$ → พื้นที่ $= \\frac12 d^2 = \\frac12(${2 * r})^2 = ${2 * r * r}$<br>พื้นที่แรเงา $= \\boldsymbol{${r * r}\\pi - ${2 * r * r}}$ ตารางหน่วย`;
      } else if (kind === "circleInSq") {
        ans = bpiT(4 * r * r, r * r); wr = [bpiT(2 * r * r, r * r), bpiT(4 * r * r, 2 * r * r), bpiT(r * r, r * r), piT(r * r, 4 * r * r), bpiT(4 * r * r, 4 * r * r)];
        let s = S.rect(c - r * sc, c - r * sc, 2 * r * sc, 2 * r * sc, "ln fd") + S.circle(c, c, r * sc, "ln bgf") + S.dim(c - r * sc, c + r * sc + 14, c + r * sc, c + r * sc + 14, `${2 * r}`, { off: 0 });
        fig = S.svg(W, W + 14, s, "วงกลมแนบในสี่เหลี่ยมจัตุรัส");
        q = `วงกลมแนบในสี่เหลี่ยมจัตุรัสซึ่งยาวด้านละ $${2 * r}$ หน่วย ดังรูป จงหาพื้นที่บริเวณที่แรเงา`;
        sol = `พื้นที่สี่เหลี่ยม $= ${2 * r}^2 = ${4 * r * r}$ วงกลมมีรัศมี $${r}$ พื้นที่ $= ${r * r}\\pi$<br>พื้นที่แรเงา $= \\boldsymbol{${4 * r * r} - ${r * r}\\pi}$ ตารางหน่วย`;
      } else if (kind === "quarter") {
        const s4 = 2 * r; // side divisible by 2 for clean π coefficient
        const coef = F(s4 * s4, 4);
        ans = m(`${s4 * s4} - ${coef.eq(1) ? "" : coef.tex()}\\pi`); wr = [m(`${s4 * s4} - ${F(s4 * s4, 2).tex()}\\pi`), m(`${coef.tex()}\\pi`), m(`${s4 * s4} - ${s4}\\pi`), m(`${coef.tex()}\\pi - ${s4}`), m(`${2 * s4 * s4} - ${coef.tex()}\\pi`)];
        const L = 2 * r * sc / 1.0 * 0.95, x0 = (W - L) / 2, y0 = (W - L) / 2;
        let s = S.rect(x0, y0, L, L, "ln fd") + `<path d="M${x0} ${y0 + L} L${x0} ${y0} A${L} ${L} 0 0 1 ${x0 + L} ${y0 + L} Z" class="ln bgf"/>` + S.dim(x0, y0 + L + 14, x0 + L, y0 + L + 14, `${s4}`, { off: 0 });
        fig = S.svg(W, W + 14, s, "ส่วนหนึ่งในสี่ของวงกลมในสี่เหลี่ยมจัตุรัส");
        q = `รูปสี่เหลี่ยมจัตุรัสยาวด้านละ $${s4}$ หน่วย มีส่วนโค้งหนึ่งในสี่ของวงกลมที่มีจุดศูนย์กลางอยู่ที่มุมล่างซ้ายและรัศมีเท่ากับด้านของสี่เหลี่ยม ดังรูป จงหาพื้นที่บริเวณที่แรเงา`;
        sol = `พื้นที่สี่เหลี่ยม $= ${s4 * s4}$ ส่วนที่ไม่แรเงาคือหนึ่งในสี่วงกลม $= \\frac14\\pi(${s4})^2 = ${coef.tex()}\\pi$<br>พื้นที่แรเงา $= \\boldsymbol{${s4 * s4} - ${coef.tex()}\\pi}$ ตารางหน่วย`;
      } else if (kind === "lens") {
        const s4 = 2 * r, q1 = F(s4 * s4, 2);
        ans = m(`${q1.tex()}\\pi - ${s4 * s4}`); wr = [m(`${F(s4 * s4, 4).tex()}\\pi - ${s4 * s4}`), m(`${s4 * s4} - ${F(s4 * s4, 4).tex()}\\pi`), m(`${q1.tex()}\\pi - ${F(s4 * s4, 2).tex()}`), m(`${s4 * s4}\\pi - ${s4 * s4}`), m(`${q1.tex()}\\pi`)];
        const L = 2 * r * sc * 0.95, x0 = (W - L) / 2, y0 = (W - L) / 2;
        let s = S.rect(x0, y0, L, L, "ln nf") + `<path d="M${x0} ${y0 + L} A${L} ${L} 0 0 1 ${x0 + L} ${y0} A${L} ${L} 0 0 1 ${x0} ${y0 + L} Z" class="ln fd"/>` + S.dim(x0, y0 + L + 14, x0 + L, y0 + L + 14, `${s4}`, { off: 0 });
        fig = S.svg(W, W + 14, s, "รูปใบไม้ในสี่เหลี่ยมจัตุรัส");
        q = `รูปสี่เหลี่ยมจัตุรัสยาวด้านละ $${s4}$ หน่วย วาดส่วนโค้งหนึ่งในสี่ของวงกลมรัศมี $${s4}$ หน่วย จากมุมตรงข้ามสองมุม ดังรูป จงหาพื้นที่บริเวณที่แรเงา (รูปใบไม้)`;
        sol = `พื้นที่หนึ่งในสี่วงกลมแต่ละอัน $= \\frac14\\pi(${s4})^2 = ${F(s4 * s4, 4).tex()}\\pi$ สองอันรวมกันนับส่วนใบไม้ซ้ำสองครั้ง<br>` +
          `ใบไม้ $= 2\\left(${F(s4 * s4, 4).tex()}\\pi\\right) - ${s4 * s4} = \\boldsymbol{${q1.tex()}\\pi - ${s4 * s4}}$ ตารางหน่วย`;
      } else {
        const r2 = r + R.pick([1, 2]);
        const pk = k => m((k === 1 ? "" : k) + "\\pi");
        ans = pk(r2 * r2 - r * r); wr = [pk((r2 - r) ** 2), pk(r2 * r2 + r * r), pk(2 * (r2 - r) + 1), pk(r2 * r2), pk(2 * (r2 * r2 - r * r))];
        const sc2 = 90 / r2;
        let s = S.circle(c, c, r2 * sc2, "ln fd") + S.circle(c, c, r * sc2, "ln bgf") + S.line(c, c, c + r * sc2, c, "am") + S.line(c, c, c, c - r2 * sc2, "am") + S.text(c + r * sc2 / 2, c + 10, `${r}`, { c: "sm" }) + S.text(c + 8, c - r2 * sc2 / 2, `${r2}`, { c: "sm", a: "start" });
        fig = S.svg(W, W, s, "วงแหวน");
        q = `วงกลมสองวงมีจุดศูนย์กลางร่วมกัน รัศมี $${r}$ และ $${r2}$ หน่วย ดังรูป จงหาพื้นที่ของวงแหวนที่แรเงา`;
        sol = `พื้นที่วงแหวน $= \\pi(${r2}^2 - ${r}^2) = \\boldsymbol{${r2 * r2 - r * r}\\pi}$ ตารางหน่วย`;
      }
      const o = X.opts(R, ans, wr.filter(w => w !== ans));
      return Object.assign({ q, fig, sol }, o);
    },
  });

  /* table / grid drawing for number puzzles */
  const gridSvg = (cells, cols, hl = -1) => {
    const cw = 52, rows = Math.ceil(cells.length / cols);
    let s = "";
    cells.forEach((v, i) => { const x = (i % cols) * cw + 2, y = Math.floor(i / cols) * cw + 2; s += S.rect(x, y, cw, cw, i === hl ? "ln fb" : "ln nf") + S.text(x + cw / 2, y + cw / 2 + 1, String(v), { b: true }); });
    return S.svg(cols * cw + 4, rows * cw + 4, s, "ตารางตัวเลข");
  };

  /* 2 ---------- ตารางตัวเลข ---------- */
  add({
    id: "t-grid", topic: "แบบรูปและความสัมพันธ์", gen(R) {
      const type = R.pick(["magic", "prod", "sq"]);
      let cells, hide, rule;
      if (type === "magic") {
        let a, b, d, e, Ssum;
        for (let t = 0; t < 200; t++) {
          a = R.int(2, 15); b = R.int(2, 15); d = R.int(2, 15); e = R.int(2, 15); Ssum = R.int(24, 36);
          const c = Ssum - a - b, f = Ssum - d - e, g2 = Ssum - a - d, h = Ssum - b - e, i = a + b + d + e - Ssum;
          cells = [a, b, c, d, e, f, g2, h, i];
          if (cells.every(v => v >= 1 && v <= 20)) break; cells = null;
        }
        A(cells);
        hide = R.int(0, 8); rule = `ผลบวกของตัวเลขในทุกแถวและทุกหลักเท่ากับ $${Ssum}$`;
      } else if (type === "prod") {
        cells = []; for (let r = 0; r < 3; r++) { const a = R.int(2, 9), b = R.int(2, 9); cells.push(a, b, a * b); }
        hide = R.pick([2, 5, 8, 4, 7]); rule = "ตัวเลขหลักที่สาม = ตัวเลขหลักที่หนึ่ง × หลักที่สอง ในแต่ละแถว";
      } else {
        cells = []; for (let r = 0; r < 3; r++) { const a = R.int(2, 9), b = R.int(1, a * a - 1); cells.push(a, b, a * a - b); }
        hide = R.pick([2, 5, 8, 4, 7, 1]); rule = "ตัวเลขหลักที่สาม = (หลักที่หนึ่ง)² − หลักที่สอง ในแต่ละแถว";
      }
      const ans = cells[hide];
      const shown = cells.map((v, i) => (i === hide ? "?" : v));
      const o = X.numOpts(ans, [ans + 5, ans - 5, ans + 10, ans - 3, ans + 2], v => String(v), { posOnly: true });
      return Object.assign({ q: `ตัวเลขในตำแหน่งสัญลักษณ์ ? ตรงกับข้อใดต่อไปนี้`, fig: gridSvg(shown, 3, hide), sol: `ความสัมพันธ์: ${rule}<br>ดังนั้นตัวเลขที่หายไปคือ $\\boldsymbol{${ans}}$`, solFig: gridSvg(cells, 3, hide) }, o);
    },
  });

  /* balance scale drawing */
  const SHAPES = ["dot", "circle", "tri", "sq"];
  const shapeSvg = (k, x, y, r = 8) => k === "dot" ? S.circle(x, y, r, "ln fs") : k === "circle" ? S.circle(x, y, r, "ln nf") : k === "tri" ? S.poly([[x, y - r], [x - r * 1.05, y + r * 0.8], [x + r * 1.05, y + r * 0.8]], "ln nf") : S.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7, "ln nf");
  const pan = (items, x0, y0) => { // box 54x50 with up to three items
    const pos = { 1: [[27, 32]], 2: [[15, 36], [39, 36]], 3: [[14, 37], [40, 37], [27, 17]] }[items.length];
    return S.rect(x0, y0, 54, 50, "ln nf") + items.map((k, i) => shapeSvg(k, x0 + pos[i][0], y0 + pos[i][1])).join("");
  };
  const scale = (L, Rr, ox = 0) => S.rect(ox + 4, 52, 150, 5, "ln fg") + pan(L, ox + 8, 2) + pan(Rr, ox + 96, 2) + S.poly([[ox + 79, 58], [ox + 72, 70], [ox + 86, 70]], "ln nf");
  const scaleSvg = (L, Rr) => S.svg(158, 74, scale(L, Rr), "ตาชั่ง");

  /* 3 ---------- ตาชั่งสมดุล (ตัวเลือกเป็นรูป) ---------- */
  add({
    id: "t-balance", topic: "ตรรกะเชิงปริมาณ", figChoices: true, gen(R) {
      const w = {}; const vals = R.sample([1, 2, 3, 4, 5, 6], 4); SHAPES.forEach((k, i) => (w[k] = vals[i]));
      const msets = [];
      const rec = (start, cur) => { if (cur.length) msets.push(cur.slice()); if (cur.length === 3) return; for (let i = start; i < 4; i++) { cur.push(SHAPES[i]); rec(i, cur); cur.pop(); } };
      rec(0, []);
      const W = ms => ms.reduce((s, k) => s + w[k], 0);
      const vec = (L, Rr) => SHAPES.map(k => L.filter(x => x === k).length - Rr.filter(x => x === k).length);
      const disjoint = (L, Rr) => !L.some(k => Rr.includes(k));
      const bal = [], unbal = [];
      for (const L of msets) for (const Rr of msets) {
        if (!disjoint(L, Rr) || L.length > 3 || Rr.length > 3) continue;
        (W(L) === W(Rr) ? bal : unbal).push([L, Rr]);
      }
      const rank = rows => { const M = rows.map(r => r.slice()); let rk = 0; for (let c = 0; c < 4 && rk < M.length; c++) { let p = M.findIndex((r, i) => i >= rk && Math.abs(r[c]) > 1e-9); if (p < 0) continue; [M[rk], M[p]] = [M[p], M[rk]]; for (let i = 0; i < M.length; i++) if (i !== rk) { const f = M[i][c] / M[rk][c]; for (let j = 0; j < 4; j++) M[i][j] -= f * M[rk][j]; } rk++; } return rk; };
      let clues;
      for (let t = 0; t < 200; t++) { clues = R.sample(bal, 3); if (rank(clues.map(([L, Rr]) => vec(L, Rr))) === 3 && clues.every(([L, Rr]) => L.length + Rr.length <= 5)) break; clues = null; }
      A(clues);
      const key = ([L, Rr]) => L.join() + "|" + Rr.join();
      const used = new Set(clues.map(key));
      const good = R.shuffle(bal.filter(p => !used.has(key(p)) && !used.has(key([p[1], p[0]])) && p[0].length + p[1].length >= 3));
      A(good.length);
      const bads = R.sample(unbal.filter(([L, Rr]) => Math.abs(W(L) - W(Rr)) <= 3 && L.length + Rr.length >= 3), 4);
      A(bads.length === 4);
      const items = R.shuffle([[good[0], true], ...bads.map(b => [b, false])]);
      const fig = S.svg(640, 76, clues.map(([L, Rr], i) => `<g transform="translate(${i * 162} 0)">${scale(L, Rr)}</g>`).join(""), "ตาชั่งสามอันที่สมดุล");
      const g0 = Object.values(w).reduce((a, b) => X.gcd(a, b));
      const nm = { dot: "●", circle: "○", tri: "△", sq: "□" };
      const sol = `จากตาชั่งสามอันแก้ระบบสมการได้อัตราส่วนน้ำหนัก ${SHAPES.map(k => `${nm[k]} = ${w[k] / g0}`).join(", ")} หน่วย<br>` +
        `ตรวจทุกตัวเลือก: ` + items.map(([[L, Rr]], i) => `ข้อ ${i + 1}: ซ้าย ${W(L) / g0} / ขวา ${W(Rr) / g0}`).join(" · ") + `<br>ข้อที่ซ้ายเท่ากับขวาคือคำตอบ`;
      return { q: `หากวัตถุที่อยู่บนคานทั้งสามอันต่อไปนี้อยู่ในภาวะสมดุล`, fig, q2: "ข้อใดต่อไปนี้ถูกต้อง (คานอยู่ในภาวะสมดุล)", choices: items.map(([[L, Rr]]) => scaleSvg(L, Rr)), answer: items.findIndex(x => x[1]), sol };
    },
  });

  /* 4 ---------- อนุกรมตัวอักษร ---------- */
  add({
    id: "t-letters", topic: "แบบรูปและความสัมพันธ์", gen(R) {
      const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const k = R.pick([2, 3]), mode = R.pick(["const", "grow"]), step0 = R.int(k + 1, k + 2);
      const starts = [R.int(0, 3)]; let gap = step0;
      for (let i = 1; i < 4; i++) { starts.push(starts[i - 1] + gap); if (mode === "grow") gap++; }
      A(starts[3] + k <= 26);
      const grp = s => ABC.slice(s, s + k);
      const ans = grp(starts[3]);
      const rev = s => ABC.slice(s, s + k).split("").reverse().join("");
      const wr = [grp(starts[3] - 1), grp(starts[3] + 1), rev(starts[3]), grp(starts[3] + 2), grp(starts[3] - 2)].filter(w => w.length === k);
      const o = X.opts(R, m(ans), wr.map(w => m(w)), { fixed: l => l.sort() });
      const sol = `ตำแหน่งตัวแรกของแต่ละกลุ่ม: ${starts.slice(0, 3).map(s => `${ABC[s]} (${s + 1})`).join(", ")} → เพิ่มขึ้นทีละ ${mode === "const" ? step0 : `${step0}, ${step0 + 1}, …`} ตำแหน่ง<br>กลุ่มถัดไปจึงเริ่มที่ ${ABC[starts[3]]} (${starts[3] + 1}) คือ $\\boldsymbol{${ans}}$`;
      return Object.assign({ q: `ตัวอักษรในตำแหน่งสัญลักษณ์ ? ตรงกับข้อใดต่อไปนี้<div class="seq">${starts.slice(0, 3).map(s => `<span>${grp(s)}</span>`).join("")}<span>?</span></div>`, sol }, o);
    },
  });

  /* 5 ---------- ความน่าจะเป็นลูกเต๋า ---------- */
  add({
    id: "t-dice", topic: "ความน่าจะเป็น", gen(R) {
      const ev = R.pick([
        () => { const k = R.pick([12, 15, 18, 20, 24]); return [`ผลคูณของแต้มมีค่าอย่างน้อย $${k}$`, (a, b) => a * b >= k]; },
        () => { const k = R.int(4, 10); return [`ผลบวกของแต้มเท่ากับ $${k}$`, (a, b) => a + b === k]; },
        () => { const k = R.int(1, 3); return [`ผลต่างของแต้มเท่ากับ $${k}$`, (a, b) => Math.abs(a - b) === k]; },
        () => [`ผลบวกของแต้มเป็นจำนวนเฉพาะ`, (a, b) => [2, 3, 5, 7, 11].includes(a + b)],
        () => { const k = R.pick([3, 4]); return [`แต้มที่มากกว่ามีค่าอย่างน้อย $${k + 1}$ และแต้มทั้งสองไม่เท่ากัน`, (a, b) => a !== b && Math.max(a, b) > k]; },
      ])();
      const [txt, fn] = ev;
      let cnt = 0; const list = [];
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (fn(a, b)) { cnt++; list.push(`(${a},${b})`); }
      A(cnt >= 2 && cnt <= 30);
      const ans = F(cnt, 36);
      const o = X.fracOpts(ans, [F(cnt + 1, 36), F(cnt - 1, 36), F(cnt, 21), F(cnt + 2, 36), F(36 - cnt, 36)].filter(f => f.v > 0 && f.v < 1));
      const sol = `ทอดลูกเต๋า 2 ครั้ง มีผลลัพธ์ทั้งหมด $6\\times6 = 36$ แบบ (นับลำดับ)<br>เหตุการณ์ที่ต้องการ: ${list.join(", ")} รวม $${cnt}$ แบบ<br>ความน่าจะเป็น $= \\dfrac{${cnt}}{36} = \\boldsymbol{${ans.tex()}}$`;
      return Object.assign({ q: `ถ้าทอดลูกเต๋า 1 ลูก 2 ครั้ง จงหาความน่าจะเป็นที่${txt}`, sol }, o);
    },
  });

  /* 6 ---------- วางแผนเวลา ---------- */
  add({
    id: "t-time", topic: "การวางแผนและเวลา", gen(R) {
      const dep = R.int(6 * 12, 11 * 12) * 5, before = R.pick([30, 40, 45, 60]), delay = R.pick([15, 30, 45, 60, 0]), drive = R.pick([40, 50, 60, 75]), walk = R.pick([15, 20, 25]);
      const leave = dep + delay - before - drive - walk;
      const hm = t => { const h = Math.floor(t / 60), mm = t % 60; return `${String(h).padStart(2, "0")}.${String(mm).padStart(2, "0")} น.`; };
      const o = X.numOpts(leave, [leave - delay, leave + walk, leave - before, leave + 15, leave - 10].filter(v => v !== leave), hm, { raw: true });
      const city = R.pick(["ขอนแก่น", "เชียงใหม่", "ภูเก็ต", "อุดรธานี", "หาดใหญ่"]);
      const sol = `เวลาเครื่องบินออกจริง = ${hm(dep)} + $${delay}$ นาที = ${hm(dep + delay)}<br>ต้องถึงประตูทางออกก่อน $${before}$ นาที → ${hm(dep + delay - before)}<br>` +
        `ย้อนเวลาเดินในสนามบิน $${walk}$ นาที และเวลาเดินทาง $${drive}$ นาที → ต้องออกจากบ้าน<b>ไม่เกิน ${hm(leave)}</b>`;
      return Object.assign({ q: `จอยวางแผนเดินทางไปเที่ยว${city}ด้วยเครื่องบิน โดยเลือกรอบเวลาที่เครื่องบินออกตอน ${hm(dep)} และต้องถึงประตูทางออกเครื่องบิน (Gate) ก่อนเวลาเครื่องบินออกอย่างน้อย $${before}$ นาที ${delay ? `แต่ก่อนวันเดินทางสายการบินแจ้งว่าเครื่องบินจะล่าช้ากว่ากำหนด $${delay}$ นาที ` : ""}ถ้าจอยใช้เวลาเดินทางจากบ้านจนถึงสนามบิน $${drive}$ นาที และคาดการณ์ว่าจะใช้เวลาในการเดินถึงประตูทางออกเครื่องบินอีก $${walk}$ นาที จอยจะต้องออกจากบ้านอย่างช้าที่สุดเวลาใด จึงจะไม่ตกเครื่อง`, sol }, o);
    },
  });

  /* 7 ---------- ตารางคะแนนกรรมการ (หาเกณฑ์จากตัวอย่าง) ---------- */
  add({
    id: "t-judges", topic: "การวิเคราะห์ข้อมูล", gen(R) {
      const sc = () => [0, 1, 2, 3, 4].map(() => R.pick([5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]));
      const mid = a => { const s = a.slice().sort((x, y) => x - y); return (s[1] + s[2] + s[3]) / 3; };
      const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
      const rows = [sc(), sc(), sc()];
      A(rows.every(r => Math.abs(mid(r) - avg(r)) > 0.05 && new Set(r).size >= 3));
      const ans = mid(rows[2]);
      const s3 = rows[2].slice().sort((a, b) => a - b);
      const o = X.numOpts(ans, [avg(rows[2]), s3[2], (s3[1] + s3[2] + s3[3] + s3[4]) / 4, (s3[0] + s3[1] + s3[2] + s3[3]) / 4].filter(v => Math.abs(v - ans) > 0.004), n2, { step: 0.25 });
      const names = R.sample(["หนูนิด", "หนูน้อย", "หนูหน่อย", "น้องเอ", "น้องบี", "น้องซี"], 3);
      const tr = (n, r, show) => `<tr><th>${n}</th>${r.map(v => `<td>${v.toFixed(2)}</td>`).join("")}<td>${show}</td></tr>`;
      const tbl = `<table class="qt"><tr><th></th>${[1, 2, 3, 4, 5].map(i => `<th>กรรมการ ${i}</th>`).join("")}<th>คะแนนที่ได้</th></tr>${tr(names[0], rows[0], mid(rows[0]).toFixed(2))}${tr(names[1], rows[1], mid(rows[1]).toFixed(2))}${tr(names[2], rows[2], "?")}</table>`;
      const sol = `สังเกตจากตัวอย่าง: ${names[0]} ได้ $${mid(rows[0]).toFixed(2)}$ ซึ่ง<b>ไม่ใช่</b>ค่าเฉลี่ยของทั้ง 5 คน ($${avg(rows[0]).toFixed(2)}$) แต่เป็นค่าเฉลี่ยหลังตัดคะแนนสูงสุดและต่ำสุดออก<br>` +
        `${names[2]}: เรียงคะแนน $${s3.join(", ")}$ ตัด $${s3[0]}$ และ $${s3[4]}$ ออก → $\\dfrac{${s3[1]} + ${s3[2]} + ${s3[3]}}{3} = \\boldsymbol{${n2(ans)}}$`;
      return Object.assign({ q: `การแข่งขันกีฬาพากระโดดน้ำ มีคะแนนจากกรรมการ 5 คน คิดเป็นคะแนนของนักกีฬาได้ดังตาราง${tbl}${names[2]}ได้คะแนนตรงกับข้อใดต่อไปนี้ (ทศนิยม 2 ตำแหน่ง)`, sol }, o);
    },
  });

  /* 8 ---------- การอ่านค่าไม้บรรทัด (มีรูป) ---------- */
  add({
    id: "t-ruler", topic: "การวัดและเลขนัยสำคัญ", gen(R) {
      const st = R.pick([0, 1, 2]), len = R.int(31, 69) / 10 + R.pick([0.02, 0.03, 0.04, 0.06, 0.07]);
      const end = st + len;
      const L2 = X.round(len, 2);
      const ans = `$${L2.toFixed(2)}$ cm`;
      const wr = [`$${L2.toFixed(1)}$ cm`, `$${L2.toFixed(3)}$ cm`, `$${X.round(end, 2).toFixed(2)}$ cm`, `$${Math.round(L2)}$ cm`, `$${(Math.floor(L2 * 10) / 10).toFixed(1)}$ cm`];
      const o = X.opts(R, ans, wr.filter(w => w !== ans));
      const sc = 40, x0 = 20;
      let s = S.rect(x0 - 8, 70, 10 * sc + 16, 46, "ln fg", 3);
      for (let i = 0; i <= 100; i++) { const x = x0 + i * sc / 10, h = i % 10 === 0 ? 16 : i % 5 === 0 ? 11 : 7; s += S.line(x, 70, x, 70 + h, i % 10 === 0 ? "ln" : "mu"); if (i % 10 === 0) s += S.text(x, 98, String(i / 10), { c: "xs" }); }
      s += S.text(x0 + 10 * sc + 2, 110, "cm", { c: "xs", a: "end" });
      s += S.rect(x0 + st * sc, 38, len * sc, 28, "ac fa", 2) + S.line(x0 + st * sc, 34, x0 + st * sc, 70, "am dsh") + S.line(x0 + end * sc, 34, x0 + end * sc, 70, "am dsh");
      const fig = S.svg(10 * sc + 40, 122, s, "วัดความยาวด้วยไม้บรรทัด");
      const sol = `ไม้บรรทัดมีสเกลละเอียดที่สุด $0.1$ cm (1 มิลลิเมตร) จึงอ่านได้ถึงสเกลละเอียดสุด แล้ว<b>ประมาณเพิ่มอีก 1 ตำแหน่ง</b> → บันทึกทศนิยม 2 ตำแหน่ง<br>` +
        `ปลายซ้ายอยู่ที่ $${st}.00$ cm ปลายขวาประมาณ $${X.round(end, 2).toFixed(2)}$ cm → ความยาว $= ${X.round(end, 2).toFixed(2)} - ${st}.00 = \\boldsymbol{${L2.toFixed(2)}}$ cm`;
      return Object.assign({ q: `นักเรียนวัดความยาวแท่งโลหะด้วยไม้บรรทัดดังรูป ควรรายงานผลการวัดความยาวตามข้อใดจึงจะถูกต้องตามหลักเลขนัยสำคัญ`, fig, sol }, o);
    },
  });

  /* 9 ---------- โจทย์เดินทางสวนกัน ---------- */
  add({
    id: "t-meet", topic: "โจทย์ปัญหาเชิงวิศวกรรม", gen(R) {
      let D, va, vb, t0, tB;
      for (let t = 0; t < 200; t++) {
        va = R.pick([60, 80, 90, 100, 120]); vb = R.pick([60, 70, 80, 90]); t0 = R.pick([0.5, 1, 1.5]); D = R.pick([500, 560, 600, 680, 700, 750]);
        tB = (D - va * t0) / (va + vb);
        if (tB > 0 && Number.isInteger(vb * tB)) break; tB = null;
      }
      A(tB);
      const ans = vb * tB;
      const tHalf = D / (va + vb);
      const o = X.numOpts(ans, [D - ans, vb * tHalf, D / 2, ans + va * t0, ans - vb * t0], v => X.fmt(v, 0), { posOnly: true });
      const tm = t0 === 0.5 ? "30 นาที" : t0 === 1 ? "1 ชั่วโมง" : "1 ชั่วโมง 30 นาที";
      const sol = `ช่วงแรก ${tm} นาย ก ขับไปก่อน $${va}\\times${t0} = ${va * t0}$ กม. เหลือระยะห่าง $${D - va * t0}$ กม.<br>` +
        `จากนั้นทั้งสองวิ่งเข้าหากัน อัตราเร็วสัมพัทธ์ $${va + vb}$ กม./ชม. → ใช้เวลา $\\dfrac{${D - va * t0}}{${va + vb}} = ${n2(tB)}$ ชม.<br>` +
        `นาย ข ขับได้ $${vb}\\times${n2(tB)} = \\boldsymbol{${X.fmt(ans, 0)}}$ กม. จากเชียงใหม่`;
      return Object.assign({ q: `กรุงเทพฯ และเชียงใหม่อยู่ห่างกันประมาณ $${D}$ กิโลเมตร นาย ก เริ่มขับรถจากกรุงเทพฯ ไปเชียงใหม่ และนาย ข เริ่มขับรถจากเชียงใหม่ไปกรุงเทพฯ ใช้ถนนเส้นเดียวกัน โดยนาย ข ออกรถหลังนาย ก ${tm} นาย ก ขับรถด้วยความเร็วเฉลี่ย $${va}$ กิโลเมตรต่อชั่วโมง และนาย ข ขับด้วยความเร็วเฉลี่ย $${vb}$ กิโลเมตรต่อชั่วโมง นาย ก สวนทางกับนาย ข ที่ระยะเท่าใดจากเชียงใหม่ (กิโลเมตร)`, sol }, o);
    },
  });

  /* pulley system drawing: n strands hold the lower block (block and tackle) */
  function pulleys(n, W) {
    const D = 28, x = k => 50 + D * k, ty = 52, by = 150, odd = n % 2 === 1;
    const right = x(n) + 50;
    let s = S.rect(20, 8, right - 20, 10, "ln fb");
    const tops = [], bots = [];
    for (let k = odd ? 0 : 1; k < n; k += 2) tops.push((x(k) + x(k + 1)) / 2);
    for (let k = odd ? 1 : 0; k < n - 1; k += 2) bots.push((x(k) + x(k + 1)) / 2);
    for (let k = 0; k < n; k++) s += S.line(x(k), ty, x(k), by, "ac thk");
    if (!odd) s += S.line(x(0), 18, x(0), ty, "ac thk"); // rope anchored to the ceiling
    for (const cx of tops) s += S.line(cx, 18, cx, ty) + S.circle(cx, ty, 14, "ln fg") + S.dot(cx, ty, 2);
    for (const cx of bots) s += S.circle(cx, by, 14, "ln fg") + S.dot(cx, by, 2);
    const bl = Math.min(x(0), ...bots) - 6, br = Math.max(x(n - 1), ...bots) + 6;
    s += S.rect(bl, by + 14, br - bl, 7, "ln fb");
    if (odd) s += S.dot(x(0), by + 14, 2.5);
    for (const cx of bots) s += S.line(cx, by, cx, by + 14);
    s += S.line(x(n), ty, x(n), 178, "ac thk") + S.arrow(x(n), 178, x(n), 206, "rd", 10) + S.text(x(n) + 12, 198, "F", { b: true, i: true, a: "start" });
    const bm = (bl + br) / 2;
    s += S.line(bm, by + 21, bm, by + 32) + S.rect(bm - 34, by + 32, 68, 32, "ln fa", 3) + S.text(bm, by + 48, `${W} N`, { c: "sm b" });
    return S.svg(right, 222, s, `ระบบรอกที่มีเชือก ${n} เส้นรับน้ำหนัก`);
  }

  /* 10 ---------- ระบบรอก (มีรูป) ---------- */
  add({
    id: "t-pulley", topic: "เครื่องกลอย่างง่าย", gen(R) {
      const n = R.pick([2, 3, 4, 5]), W = R.pick([120, 200, 240, 300, 360, 600]);
      const eff = R.chance(0.4) ? R.pick([50, 60, 75, 80]) : 100;
      const Fv = W / n / (eff / 100);
      const o = X.numOpts(Fv, [W / n, W / (n - 1), W / (n + 1), W * eff / 100 / n, W / 2].filter(v => Math.abs(v - Fv) > 0.05), v => X.num(v, 1), { posOnly: true });
      const sol = `นับเส้นเชือกที่พยุงรอกตัวล่าง (รับน้ำหนักวัตถุ) ได้ $${n}$ เส้น → การได้เปรียบเชิงกลตามทฤษฎี $= ${n}$<br>` +
        (eff === 100 ? `รอกลื่นไม่มีแรงเสียดทาน: $F = \\dfrac{W}{${n}} = \\dfrac{${W}}{${n}} = \\boldsymbol{${X.num(Fv, 1)}}$ N`
          : `ประสิทธิภาพ $${eff}\\%$ → การได้เปรียบเชิงกลจริง $= ${n}\\times${eff / 100} = ${X.num(n * eff / 100, 2)}$<br>$F = \\dfrac{${W}}{${X.num(n * eff / 100, 2)}} = \\boldsymbol{${X.num(Fv, 1)}}$ N`);
      return Object.assign({ q: `แรง $F$ ที่ใช้ดึงน้ำหนัก $${W}$ N ขึ้นด้วยความเร็วคงตัว ด้วยระบบรอกดังรูป ${eff === 100 ? "โดยรอกและเชือกมีมวลน้อยมากและไม่มีแรงเสียดทาน" : `ถ้าระบบรอกนี้มีประสิทธิภาพ $${eff}\\%$`} ตรงกับข้อใด`, fig: pulleys(n, W), sol }, o);
    },
  });

  /* gear drawing */
  const gear = (cx, cy, r, teeth, rot = 0) => {
    let d = ""; const N = teeth * 4;
    for (let i = 0; i <= N; i++) { const a = rot + (i / N) * 2 * Math.PI, rr = (i % 4 < 2) ? r + 5 : r - 1; d += (i ? " L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); }
    return S.path(d + " Z", "ln fg") + S.circle(cx, cy, 4, "ln fs");
  };

  /* 11 ---------- เฟือง (มีรูป) ---------- */
  add({
    id: "t-gears", topic: "เครื่องกลอย่างง่าย", gen(R) {
      const k = R.pick([3, 4]);
      const T = []; for (let i = 0; i < k; i++) T.push(R.pick([12, 16, 20, 24, 30, 36, 40]));
      const rpm = R.pick([60, 90, 120, 180, 240]), cw = R.chance(0.5);
      const out = rpm * T[0] / T[k - 1];
      A(Number.isInteger(out * 2));
      const dirLast = (k % 2 === 1) === cw; // odd count: same direction
      const D = b => (b ? "ตามเข็มนาฬิกา" : "ทวนเข็มนาฬิกา");
      const ans = `$${X.num(out, 1)}$ รอบต่อนาที ${D(dirLast)}`;
      const wr = [`$${X.num(out, 1)}$ รอบต่อนาที ${D(!dirLast)}`, `$${X.num(rpm * T[k - 1] / T[0], 1)}$ รอบต่อนาที ${D(dirLast)}`, `$${X.num(rpm * T[k - 1] / T[0], 1)}$ รอบต่อนาที ${D(!dirLast)}`, `$${rpm}$ รอบต่อนาที ${D(dirLast)}`, `$${X.num(rpm * T[0] / T[1], 1)}$ รอบต่อนาที ${D(!dirLast)}`];
      const o = X.opts(R, ans, wr.filter(w => w !== ans));
      let x = 10, s = ""; const L = "ABCD";
      T.forEach((t, i) => { const r = t * 1.6; x += r + 6; s += gear(x, 80, r, t, i * 0.13) + S.text(x, 80 - r - 16, `${L[i]} (${t} ฟัน)`, { c: "xs b" }); x += r + 4; });
      const r0 = T[0] * 1.6 + 6;
      s += S.arc(16 + r0, 80, r0 + 10, cw ? 330 : 210, cw ? 210 : 330, "rd thk nf") + S.text(16 + r0, 80 + r0 + 26, `${rpm} rpm ${cw ? "↻" : "↺"}`, { c: "xs b" });
      const fig = S.svg(Math.max(x + 10, 200), 80 + T[0] * 1.6 + 48, s, "ระบบเฟือง");
      const sol = `เฟืองที่ขบกันมีจำนวนฟันที่เคลื่อนผ่านจุดสัมผัสเท่ากัน: $N_1T_1 = N_2T_2$ → เฟืองตัวกลางไม่มีผลต่อรอบของเฟืองตัวสุดท้าย<br>` +
        `$N_${L[k - 1]} = ${rpm}\\times\\dfrac{${T[0]}}{${T[k - 1]}} = ${X.num(out, 1)}$ รอบต่อนาที<br>เฟืองที่ขบกันหมุนสลับทิศ: มี $${k}$ ตัว เฟือง ${L[k - 1]} จึงหมุน${D(dirLast)}`;
      return Object.assign({ q: `ระบบเฟือง ${k} ตัวขบกันดังรูป ถ้าเฟือง A หมุน${D(cw)}ด้วยอัตรา $${rpm}$ รอบต่อนาที เฟือง ${L[k - 1]} จะหมุนด้วยอัตราและทิศทางใด`, fig, sol }, o);
    },
  });

  /* isometric cubes */
  function iso(H, o = {}) {
    const c = 19, sN = 11, e = 22, ox = 120, oy = 58;
    const P = (x, y, z) => [ox + (x - y) * c, oy + (x + y) * sN - z * e];
    let s = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let z = 0; z < H[j][i]; z++) {
      s += S.poly([P(i, j, z + 1), P(i + 1, j, z + 1), P(i + 1, j + 1, z + 1), P(i, j + 1, z + 1)], "ln ftop");
      s += S.poly([P(i, j + 1, z), P(i + 1, j + 1, z), P(i + 1, j + 1, z + 1), P(i, j + 1, z + 1)], "ln fleft");
      s += S.poly([P(i + 1, j, z), P(i + 1, j + 1, z), P(i + 1, j + 1, z + 1), P(i + 1, j, z + 1)], "ln fright");
    }
    if (o.arrow) { const [ax, ay] = P(1.5, 3.9, 0); s += S.arrow(ax - 16, ay + 18, ax + 6, ay - 4, "rd", 9) + S.text(ax - 30, ay + 26, "ด้านหน้า", { c: "xs b" }); }
    return S.svg(240, 200, s, "รูปลูกบาศก์ซ้อนกัน");
  }
  const viewSvg = cols => {
    const u = 20, h = 3; let s = "";
    cols.forEach((n, i) => { for (let z = 0; z < n; z++) s += S.rect(6 + i * u, 6 + (h - 1 - z) * u, u, u, "ln fa"); });
    s += S.line(2, 6 + h * u, 10 + cols.length * u, 6 + h * u, "mu");
    return S.svg(cols.length * u + 12, h * u + 10, s, "ภาพฉาย");
  };

  /* 12 ---------- ภาพฉายด้านหน้าของลูกบาศก์ (ตัวเลือกเป็นรูป) ---------- */
  add({
    id: "t-iso", topic: "มิติสัมพันธ์", figChoices: true, gen(R) {
      const H = [0, 1, 2].map(() => [0, 1, 2].map(() => R.pick([0, 1, 1, 2, 2, 3])));
      H[2][0] = Math.max(H[2][0], 1);
      const total = H.flat().reduce((a, b) => a + b, 0); A(total >= 7);
      const front = [0, 1, 2].map(i => Math.max(H[0][i], H[1][i], H[2][i]));
      const side = [2, 1, 0].map(j => Math.max(...H[j])); // seen from the right: nearest row is j=2 on the left
      const row2 = [0, 1, 2].map(i => H[2][i]);
      const mir = front.slice().reverse();
      const plus = front.map((v, i) => (i === 1 ? Math.min(3, v + 1) : v));
      const minus = front.map((v, i) => (i === 0 && v > 1 ? v - 1 : i === 2 && v > 1 ? v - 1 : v));
      const K = a => a.join(",");
      const pool = [side, row2, mir, plus, minus, [front[1], front[0], front[2]]].filter(v => K(v) !== K(front) && v.some(x => x > 0));
      const uniq = []; for (const v of pool) if (!uniq.some(u => K(u) === K(v))) uniq.push(v);
      A(uniq.length >= 4);
      const items = R.shuffle([[front, true], ...uniq.slice(0, 4).map(v => [v, false])]);
      const tbl = `<table class="qt sm"><tr><th></th><th>ซ้าย</th><th>กลาง</th><th>ขวา</th></tr>${["หลัง", "กลาง", "หน้า"].map((n, j) => `<tr><th>${n}</th>${H[j].map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}</table>`;
      const sol = `จำนวนลูกบาศก์ที่ซ้อนในแต่ละช่อง (มองจากด้านบน):${tbl}ภาพด้านหน้าคือความสูงสูงสุดของแต่ละหลัก (ซ้าย→ขวา) = $${front.join(", ")}$`;
      return { q: `จากรูปลูกบาศก์ขนาดเท่ากันวางซ้อนกันบนพื้นราบ (ไม่มีลูกบาศก์ลอยอยู่) ถ้ามองจากทิศของลูกศร "ด้านหน้า" จะเห็นภาพตรงกับข้อใด`, fig: iso(H, { arrow: true }), choices: items.map(([v]) => viewSvg(v)), answer: items.findIndex(x => x[1]), sol, solFig: viewSvg(front) };
    },
  });

  /* 13 ---------- อ่านแผนภูมิแท่ง (มีรูป) ---------- */
  add({
    id: "t-bars", topic: "การวิเคราะห์ข้อมูล", gen(R) {
      const names = ["A", "B", "C", "D"];
      const y1 = names.map(() => R.pick([20, 25, 40, 50, 60, 80])), pct = names.map(() => R.pick([-25, -20, 10, 20, 25, 50, 75]));
      const y2 = y1.map((v, i) => v * (1 + pct[i] / 100)); A(y2.every(v => Number.isInteger(v) && v <= 120));
      const best = pct.indexOf(Math.max(...pct)); A(pct.filter(p => p === pct[best]).length === 1);
      const absBest = y2.map((v, i) => v - y1[i]); const ab = absBest.indexOf(Math.max(...absBest));
      const ask = R.chance(0.5) ? "pct" : "which";
      const P = new X.Plot({ x: [0, 4], y: [0, 120], w: 330, h: 220, frame: true, grid: true, xs: 4, ys: 20, ty: 20, tx: 10, ticks: true, pad: [24, 12, 40, 46], axisLabels: ["สินค้า", "ยอดขาย (พันชิ้น)"] });
      P.axes();
      names.forEach((n, i) => {
        P.add(S.rect(P.sx(i + 0.18), P.sy(y1[i]), P.sx(i + 0.48) - P.sx(i + 0.18), P.sy(0) - P.sy(y1[i]), "ln fg"));
        P.add(S.rect(P.sx(i + 0.52), P.sy(y2[i]), P.sx(i + 0.82) - P.sx(i + 0.52), P.sy(0) - P.sy(y2[i]), "ln fa"));
        P.add(S.text(P.sx(i + 0.5), P.sy(0) + 12, n, { c: "sm b" }));
      });
      P.add(S.rect(P.X0 + 6, P.Y1 - 18, 10, 10, "ln fg") + S.text(P.X0 + 20, P.Y1 - 13, "ปี 2567", { c: "xs", a: "start" }) + S.rect(P.X0 + 80, P.Y1 - 18, 10, 10, "ln fa") + S.text(P.X0 + 94, P.Y1 - 13, "ปี 2568", { c: "xs", a: "start" }));
      let o, sol, q2;
      if (ask === "pct") {
        const i = R.int(0, 3);
        o = X.numOpts(pct[i], [-pct[i], (y2[i] - y1[i]), pct[i] / (1 + pct[i] / 100), pct[i] + 10].map(v => Math.round(v)), v => (v > 0 ? "+" : "") + v + "\\%", { step: 5 });
        q2 = `ยอดขายสินค้า ${names[i]} ในปี 2568 เปลี่ยนแปลงจากปี 2567 ร้อยละเท่าใด`;
        sol = `สินค้า ${names[i]}: ปี 2567 = $${y1[i]}$ ปี 2568 = $${y2[i]}$ พันชิ้น<br>ร้อยละการเปลี่ยนแปลง $= \\dfrac{${y2[i]} - ${y1[i]}}{${y1[i]}}\\times100 = \\boldsymbol{${pct[i] > 0 ? "+" : ""}${pct[i]}\\%}$`;
      } else {
        A(ab !== best);
        o = X.fixedOpts(["สินค้า A", "สินค้า B", "สินค้า C", "สินค้า D", "สินค้าทุกชนิดเพิ่มขึ้นในอัตราเท่ากัน"], "สินค้า " + names[best]);
        q2 = `สินค้าชนิดใดมียอดขาย<b>เพิ่มขึ้นคิดเป็นร้อยละ</b>มากที่สุด`;
        sol = `คำนวณร้อยละการเปลี่ยนแปลง: ${names.map((n, i) => `${n}: $\\frac{${y2[i] - y1[i]}}{${y1[i]}} = ${pct[i]}\\%$`).join(", ")}<br>มากที่สุดคือ<b>สินค้า ${names[best]}</b> (ระวัง: สินค้า ${names[ab]} เพิ่มขึ้นมากที่สุดเมื่อดูจำนวนชิ้น แต่ไม่ใช่ร้อยละ)`;
      }
      return Object.assign({ q: `แผนภูมิแท่งแสดงยอดขายสินค้า 4 ชนิดในปี 2567 และ 2568`, fig: P.toString(), q2, sol }, o);
    },
  });

  /* 14 ---------- คานสมดุล (มีรูป) ---------- */
  add({
    id: "t-lever", topic: "เครื่องกลอย่างง่าย", gen(R) {
      let mL, dL, mR, dR, dA, mA;
      for (let t = 0; t < 200; t++) {
        mL = R.pick([6, 8, 10, 12, 15]); dL = R.pick([1, 2]); mR = R.pick([1, 2, 3]); dR = R.pick([1, 2]); dA = dR + R.pick([1, 2]);
        mA = (mL * dL - mR * dR) / dA;
        if (mA > 0 && Number.isInteger(mA * 2)) break; mA = null;
      }
      A(mA);
      const o = X.numOpts(mA, [(mL * dL) / dA, (mL * dL + mR * dR) / dA, mA + 1, mA - 0.5, (mL - mR) / 2], v => X.num(v, 1), { posOnly: true, step: 0.5 });
      const sc = 70, px = 150, Y = 70, X0 = px - dL * sc, X1 = px + dA * sc;
      let s = S.line(X0 - 10, Y, X1 + 10, Y, "ln thk") + S.poly([[px, Y + 2], [px - 14, Y + 26], [px + 14, Y + 26]], "ln fs") + S.rect(px - 50, Y + 26, 100, 8, "ln fb");
      const wt = (x, lab) => S.rect(x - 18, Y - 30, 36, 28, "ln fa", 6) + S.text(x, Y - 16, lab, { c: "xs b" });
      s += wt(X0, `${mL} kg`) + wt(px + dR * sc, `${mR} kg`) + wt(X1, "A");
      s += S.dim(X0, Y + 50, px, Y + 50, `${dL} m`, { off: 0 }) + S.dim(px, Y + 50, px + dR * sc, Y + 50, `${dR} m`, { off: 0 }) + S.dim(px + dR * sc, Y + 50, X1, Y + 50, `${dA - dR} m`, { off: 0 });
      const fig = S.svg(X1 + 40, 140, s, "คานบนจุดหมุน");
      const sol = `โมเมนต์ทวนเข็ม = โมเมนต์ตามเข็ม (รอบจุดหมุน): $${mL}g(${dL}) = ${mR}g(${dR}) + Ag(${dA})$<br>$${mL * dL} = ${mR * dR} + ${dA}A$ → $A = \\boldsymbol{${X.num(mA, 1)}}$ กิโลกรัม`;
      return Object.assign({ q: `คานแข็งเบาอยู่บนจุดหมุนที่ไม่มีแรงเสียดทาน ดังรูป ด้านซ้ายแขวนมวล $${mL}$ กิโลกรัม ห่างจากจุดหมุน $${dL}$ เมตร ด้านขวาแขวนมวล $${mR}$ กิโลกรัม ห่างจากจุดหมุน $${dR}$ เมตร และที่ปลายขวาสุดแขวนมวล $A$ ห่างจากจุดหมุน $${dA}$ เมตร ต้องใช้มวล $A$ เท่าใดจึงทำให้คานอยู่ในสภาวะสมดุลสถิต (แนวระดับ)`, fig, sol }, o);
    },
  });

  /* 15 ---------- แปลงหน่วยและอัตรา ---------- */
  add({
    id: "t-units", topic: "โจทย์ปัญหาเชิงวิศวกรรม", gen(R) {
      const kmh = R.pick([36, 54, 72, 90, 108]), t = R.pick([10, 15, 20, 30, 45]);
      const ms = kmh / 3.6, d = ms * t;
      const variant = R.chance(0.5);
      if (variant) {
        const o = X.numOpts(d, [kmh * t, kmh * t / 60, d * 3.6 / 1, d / 2], v => X.fmt(v, 0), { posOnly: true });
        const sol = `แปลงหน่วย: $${kmh}$ กม./ชม. $= ${kmh}\\times\\dfrac{1000}{3600} = ${X.num(ms)}$ เมตรต่อวินาที<br>ระยะทาง $= ${X.num(ms)}\\times${t} = \\boldsymbol{${X.fmt(d, 0)}}$ เมตร`;
        return Object.assign({ q: `รถยนต์คันหนึ่งแล่นด้วยอัตราเร็วคงที่ $${kmh}$ กิโลเมตรต่อชั่วโมง เป็นเวลา $${t}$ วินาที จะได้ระยะทางกี่เมตร`, sol }, o);
      }
      const L = R.pick([2, 2.5, 4, 5]), Wd = R.pick([1.5, 2, 3]), H = R.pick([1, 1.2, 1.5]), q = R.pick([10, 12, 20, 25]);
      const V = L * Wd * H * 1000, tt = V / q / 60;
      const o = X.numOpts(tt, [V / q, tt * 60, V / q / 3600, tt / 2], v => X.num(v, 1), { posOnly: true });
      const sol = `ปริมาตรถัง $= ${L}\\times${Wd}\\times${H} = ${X.num(L * Wd * H, 2)}$ m³ $= ${X.fmt(V, 0)}$ ลิตร<br>เวลา $= \\dfrac{${X.fmt(V, 0)}}{${q}} = ${X.fmt(V / q, 0)}$ วินาที $= \\boldsymbol{${X.num(tt, 1)}}$ นาที`;
      return Object.assign({ q: `ถังเก็บน้ำทรงสี่เหลี่ยมมุมฉากกว้าง $${Wd}$ เมตร ยาว $${L}$ เมตร สูง $${H}$ เมตร ใช้ปั๊มที่สูบน้ำได้ $${q}$ ลิตรต่อวินาที เติมน้ำจากถังเปล่าจนเต็ม ต้องใช้เวลากี่นาที`, sol }, o);
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
