/* ฟิสิกส์ (แนว A-Level ฟิสิกส์ / PAT2-ENT เดิม) — every generator invents its own numbers each time. */
(function (g) {
  "use strict";
  const X = g.EXAM, { S, Plot, F, m } = X;
  const add = (o) => X.add(Object.assign({ subj: "phys" }, o));
  const A = X.assert, n1 = v => X.num(v, 1), n2 = v => X.num(v, 2), f1 = v => X.fmt(v, 1), f2 = v => X.fmt(v, 2);
  const deg = d => `${d}^\\circ`;
  const SIN = { 37: 0.6, 53: 0.8, 30: 0.5 }, COS = { 37: 0.8, 53: 0.6 };

  // "P_1 > P_2 = P_3" from values; wrong orderings for distractors
  function ordering(vals, names) {
    const idx = [0, 1, 2].sort((a, b) => vals[b] - vals[a] || a - b);
    let s = names[idx[0]];
    for (let i = 1; i < 3; i++) {
      const eq = Math.abs(vals[idx[i]] - vals[idx[i - 1]]) <= 1e-9 * Math.max(1, Math.abs(vals[idx[i]]));
      s += (eq ? " = " : " > ") + names[idx[i]];
    }
    return s;
  }
  function orderOpts(R, vals, names) {
    const ans = m(ordering(vals, names));
    const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const wr = [];
    for (const p of perms) wr.push(m(`${names[p[0]]} > ${names[p[1]]} > ${names[p[2]]}`));
    for (const p of perms) if (p[1] < p[2]) wr.push(m(`${names[p[0]]} > ${names[p[1]]} = ${names[p[2]]}`));
    return X.opts(R, ans, wr.filter(w => w !== ans));
  }

  /* 1 ---------- การเคลื่อนที่แนวตรง: ความเร่งคงตัว ---------- */
  add({
    id: "p-kin1", topic: "การเคลื่อนที่แนวตรง", gen(R) {
      const a = R.pick([0.5, 0.7, 0.9, 1.1, 1.3, 1.5]), t = R.pick([4, 5, 6, 8, 10]), v = R.pick([1, 2, 3, 4]);
      const u = v + a * t, s = (u + v) / 2 * t;
      if (R.chance(0.6)) {
        const o = X.numOpts(a, [a - 0.2, a + 0.2, a - 0.4, a + 0.4, a + 0.6], n1, { step: 0.2 });
        const sol = `ใช้ $s = \\dfrac{u+v}{2}t$ → $${n1(s)} = \\dfrac{u + ${v}}{2}(${t})$ ได้ $u = ${n1(u)}$ เมตรต่อวินาที<br>` +
          `ขนาดความเร่ง $|a| = \\dfrac{|v - u|}{t} = \\dfrac{${n1(u)} - ${v}}{${t}} = \\boldsymbol{${n1(a)}}$ เมตรต่อวินาที²`;
        return Object.assign({ q: `วัตถุเคลื่อนที่ในแนวตรงไปข้างหน้าเป็นเวลา $${t}$ วินาที ได้ระยะทาง $${n1(s)}$ เมตร และขณะนั้นอัตราเร็วมีค่า $${v}$ เมตรต่อวินาที โดยตลอดช่วงการเคลื่อนที่นี้ วัตถุเคลื่อนที่ช้าลงด้วยความเร่งคงตัว ขนาดความเร่งของวัตถุมีค่ากี่เมตรต่อวินาที²`, sol }, o);
      }
      const a2 = R.pick([1.5, 2, 2.5, 3, 4, 4.5]), t1 = R.pick([2, 3, 4]), t2 = R.pick([1, 2, 3]);
      const vmax = a2 * t1, d = 0.5 * a2 * t1 * t1 + vmax * t2;
      const o = X.numOpts(d, [0.5 * a2 * t1 * t1, vmax * (t1 + t2), 0.5 * a2 * (t1 + t2) ** 2, vmax * t2], n1);
      const sol = `ช่วงเร่ง: $s_1 = \\frac12 a t^2 = \\frac12(${n1(a2)})(${t1})^2 = ${n1(0.5 * a2 * t1 * t1)}$ ม. และความเร็วปลายช่วง $v = at = ${n1(vmax)}$ ม./วินาที<br>` +
        `ช่วงความเร็วคงตัว: $s_2 = vt = ${n1(vmax)}\\times${t2} = ${n1(vmax * t2)}$ ม.<br>รวม $= \\boldsymbol{${n1(d)}}$ เมตร`;
      return Object.assign({ q: `อนุภาคหนึ่งเคลื่อนที่ในแนวตรงจากหยุดนิ่งด้วยความเร่งคงตัว $${n1(a2)}$ เมตรต่อวินาที² เป็นเวลา $${t1}$ วินาที หลังจากนั้นเคลื่อนที่ด้วยความเร็วคงตัวอีก $${t2}$ วินาที ระยะทางทั้งหมดที่อนุภาคเคลื่อนที่ได้เป็นกี่เมตร`, sol }, o);
    },
  });

  /* 2 ---------- โพรเจกไทล์แนวระดับ (มีรูป) ---------- */
  add({
    id: "p-proj-h", topic: "การเคลื่อนที่แบบโพรเจกไทล์", gen(R) {
      const t = R.pick([1, 1.5, 2, 2.5, 3]), h = 4.9 * t * t, v = R.pick([6, 8, 10, 12.3, 14, 15]);
      const x = v * t;
      const o = X.numOpts(x, [x / 2, v * Math.sqrt(h / 9.8), x * Math.SQRT2, h, x + v], n1);
      let s = S.rect(70, 60, 70, 120, "ln fg") + S.ground(140, 350, 180) + S.circle(140, 54, 6, "ln fa");
      s += S.arrow(148, 54, 198, 54, "am", 9) + S.text(180, 42, "v", { i: true, c: "sm" });
      const pts = []; for (let i = 0; i <= 30; i++) { const xx = 140 + 180 * i / 30; pts.push([xx, 54 + 126 * (i / 30) ** 2]); }
      s += S.poly(pts, "ac dsh nf", false) + S.dim(56, 54, 56, 180, `${n1(h)} m`, { off: 26 });
      s += S.dim(140, 196, 320, 196, "?", { off: 0 });
      const fig = S.svg(360, 212, s, "ก้อนหินถูกปาในแนวระดับจากหน้าผา");
      const sol = `แนวดิ่ง (เริ่มจากความเร็วแนวดิ่ง 0): $h = \\frac12 gt^2$ → $${n1(h)} = 4.9t^2$ → $t = ${n1(t)}$ วินาที<br>` +
        `แนวระดับ (ความเร็วคงตัว): $x = vt = ${n1(v)}\\times${n1(t)} = \\boldsymbol{${n1(x)}}$ เมตร`;
      return Object.assign({ q: `ปาก้อนหินออกไปในแนวระดับด้วยอัตราเร็ว $${n1(v)}$ เมตรต่อวินาที จากจุดที่อยู่สูงจากพื้น $${n1(h)}$ เมตร ดังรูป หากไม่พิจารณาแรงต้านของอากาศ ก้อนหินตกกระทบพื้นห่างจากจุดปาในแนวระดับกี่เมตร (กำหนด $g = 9.8$ เมตรต่อวินาที²)`, fig, sol }, o);
    },
  });

  /* 3 ---------- กราฟ v^2 กับ x (มีรูป) ---------- */
  add({
    id: "p-v2x", topic: "การเคลื่อนที่แนวตรง", gen(R) {
      const v0 = R.pick([4, 6, 8, 10]), a = R.pick([0.5, 1, 1.5, 2]), L = R.pick([10, 16, 20, 25]), T = R.pick([4, 6, 8, 10]);
      const A0 = v0 * v0, B = A0 + 2 * a * L;
      const s = v0 * T + 0.5 * a * T * T;
      const v1 = Math.sqrt(B);
      const o = X.numOpts(s, [v1 * T, 0.5 * a * T * T, v0 * T + a * T * T, (v0 + v1) / 2 * T], n1);
      const P = new Plot({ x: [0, L * 1.25], y: [0, B * 1.2], w: 290, h: 210, ticks: false, grid: false, pad: [20, 40, 26, 40], axisLabels: ["x (m)", "v² (m²/s²)"] });
      P.axes();
      P.add(S.dash(P.sx(0), P.sy(B), P.sx(L), P.sy(B))).add(S.dash(P.sx(L), P.sy(0), P.sx(L), P.sy(B)));
      P.pl([[0, A0], [L, B]], "rd thk");
      P.add(S.text(P.sx(0) - 6, P.sy(A0), String(A0), { c: "sm", a: "end" })).add(S.text(P.sx(0) - 6, P.sy(B), n1(B), { c: "sm", a: "end" })).add(S.text(P.sx(L), P.sy(0) + 13, String(L), { c: "sm" }));
      const sol = `จาก $v^2 = u^2 + 2as$ กราฟ $v^2$–$x$ เป็นเส้นตรง จุดตัดแกนตั้งคือ $u^2 = ${A0}$ → $u = ${v0}$ เมตรต่อวินาที<br>` +
        `ความชัน $= 2a = \\dfrac{${n1(B)} - ${A0}}{${L}} = ${n1(2 * a)}$ → $a = ${n1(a)}$ เมตรต่อวินาที²<br>` +
        `$s = ut + \\frac12at^2 = ${v0}(${T}) + \\frac12(${n1(a)})(${T})^2 = \\boldsymbol{${n1(s)}}$ เมตร`;
      return Object.assign({ q: `วัตถุหนึ่งเคลื่อนที่แนวตรงด้วยความเร่งคงตัวซึ่งมีทิศทางเดียวกับความเร็ว กราฟแสดงความสัมพันธ์ระหว่างกำลังสองของอัตราเร็ว ($v^2$) และตำแหน่ง ($x$) เป็นดังรูป`, fig: P.toString(), q2: `หลังจากวัตถุเคลื่อนที่ผ่านตำแหน่ง $x = 0$ เป็นเวลา $${T}$ วินาที ขนาดของการกระจัดของวัตถุมีค่ากี่เมตร`, sol }, o);
    },
  });

  /* incline figure */
  function incline(th, opt = {}) {
    const base = th === 37 ? 230 : 130, hgt = base * Math.tan(th * Math.PI / 180);
    const x0 = 20, y0 = 20 + hgt, x1 = x0 + base;
    let s = S.poly([[x0, y0], [x1, y0], [x0, y0 - hgt]], "ln fg") + S.arc(x1, y0, 30, 180 - th, 180, "am nf") +
      S.text(x1 - 44 * Math.cos(th / 2 * Math.PI / 180), y0 - 44 * Math.sin(th / 2 * Math.PI / 180) + 2, th + "°", { c: "sm" });
    const px = x0 + base * 0.42, py = y0 - hgt * 0.58; // point on slope
    s += `<g transform="translate(${px} ${py}) rotate(${th})">${S.rect(-20, -30, 40, 30, "ln fa", 3)}${S.text(0, -15, opt.label || "m", { c: "sm", i: !opt.label })}`;
    if (opt.fbd) {
      s += S.arrow(0, -15, 0, -78, "ac", 8) + S.text(10, -76, "N", { i: true, c: "sm", a: "start" });
      s += S.arrow(0, -15, -64, -15, "am", 8) + S.text(-62, -27, "f", { i: true, c: "sm" });
    }
    s += "</g>";
    if (opt.fbd) {
      s += S.arrow(px + 15 * Math.sin(th * Math.PI / 180), py - 15 * Math.cos(th * Math.PI / 180), px + 15 * Math.sin(th * Math.PI / 180), py - 15 * Math.cos(th * Math.PI / 180) + 66, "rd", 8) +
        S.text(px + 15 * Math.sin(th * Math.PI / 180) + 8, py + 46, "mg", { i: true, c: "sm", a: "start" });
    }
    return S.svg(x1 + 20, y0 + 14, s, "วัตถุบนพื้นเอียง");
  }

  /* 4 ---------- พื้นเอียงมีแรงเสียดทาน (มีรูป) ---------- */
  add({
    id: "p-incline", topic: "แรงและกฎการเคลื่อนที่", gen(R) {
      const th = R.pick([37, 53]);
      const mu = th === 37 ? R.pick([0.25, 0.5]) : R.pick([0.5, 0.75, 1.0]);
      const mass = R.pick([0.5, 1, 2, 4]), t = R.pick([1.5, 2, 2.5, 3]);
      const a = 9.8 * (SIN[th] - mu * COS[th]);
      const v = a * t;
      const o = X.numOpts(v, [9.8 * SIN[th] * t, a * t / 2, 9.8 * (COS[th] - mu * SIN[th]) * t, 9.8 * (SIN[th] + mu * COS[th]) * t], f2);
      const sol = `ตามแนวพื้นเอียง: $mg\\sin${deg(th)} - \\mu_k mg\\cos${deg(th)} = ma$ (มวลตัดกันได้)<br>` +
        `$a = 9.8(${SIN[th]} - ${mu}\\times${COS[th]}) = ${f2(a)}$ เมตรต่อวินาที²<br>$v = at = ${f2(a)}\\times${n1(t)} = \\boldsymbol{${f2(v)}}$ เมตรต่อวินาที`;
      return Object.assign({ q: `วัตถุมวล $${n1(mass)}$ กิโลกรัม เริ่มเคลื่อนที่จากหยุดนิ่งด้วยความเร่งคงตัวลงมาตามแนวพื้นเอียงซึ่งทำมุม $${th}$ องศากับแนวระดับ ดังรูป กำหนดให้สัมประสิทธิ์ความเสียดทานจลน์ระหว่างวัตถุและพื้นเอียงมีค่า $${mu}$ หลังจากเคลื่อนที่เป็นเวลา $${n1(t)}$ วินาที อัตราเร็วของวัตถุจะมีค่ากี่เมตรต่อวินาที (กำหนด $g = 9.8$ เมตรต่อวินาที², $\\sin 37^\\circ = 0.6$, $\\cos 37^\\circ = 0.8$)`, fig: incline(th), sol, solFig: incline(th, { fbd: true }) }, o);
    },
  });

  /* 5 ---------- กราฟแรง-ตำแหน่ง งานและพลังงาน (มีรูป) ---------- */
  add({
    id: "p-fx", topic: "งานและพลังงาน", gen(R) {
      const xs = [0, 2, 4, 5, 6, 8];
      let Fs;
      for (let t = 0; t < 50; t++) { Fs = xs.map(() => R.pick([0, 2, 3, 4, 5, 6])); Fs[0] = R.pick([0, 0, 2]); if (new Set(Fs).size >= 3) break; }
      let W = 0; for (let i = 0; i < xs.length - 1; i++) W += (Fs[i] + Fs[i + 1]) / 2 * (xs[i + 1] - xs[i]);
      const mass = R.pick([1, 2]);
      const cands = []; for (let v = 1; v <= 20; v++) { const K0 = mass * v * v / 2 - W; if (K0 >= 1 && K0 <= 30 && Number.isInteger(K0 * 2)) cands.push([v, K0]); }
      A(cands.length);
      const [v, K0] = R.pick(cands);
      const o = X.numOpts(v, [Math.sqrt(2 * W / mass), Math.sqrt(2 * K0 / mass), Math.sqrt(2 * (W - K0) / mass), v + 2, v - 1].filter(Number.isFinite), n1, { posOnly: true });
      const P = new Plot({ x: [0, 8], y: [0, 7], w: 300, h: 220, frame: true, xs: 1, ys: 1, tx: 1, ty: 1, pad: [10, 12, 42, 46], axisLabels: ["x (m)", "F (N)"] });
      P.axes(); P.pl(xs.map((x, i) => [x, Fs[i]]), "ln thk");
      const parts = xs.slice(0, -1).map((x, i) => `\\tfrac{${Fs[i]}+${Fs[i + 1]}}{2}(${xs[i + 1] - x})`).join(" + ");
      const sol = `งานของแรง = พื้นที่ใต้กราฟ $F$–$x$ $= ${parts} = ${n1(W)}$ จูล<br>` +
        `ทฤษฎีงาน–พลังงาน: $E_{k,\\text{ปลาย}} = ${n1(K0)} + ${n1(W)} = ${n1(K0 + W)}$ จูล<br>$\\frac12(${mass})v^2 = ${n1(K0 + W)}$ → $v = \\boldsymbol{${n1(v)}}$ เมตรต่อวินาที`;
      return Object.assign({ q: `แรงไม่คงตัวกระทำต่อวัตถุมวล $${mass}$ กิโลกรัม ให้เคลื่อนที่ไปตามแนวแรงเป็นเส้นตรงจากตำแหน่ง $x = 0$ ถึง $x = 8$ เมตร ดังรูป`, fig: P.toString(), q2: `ถ้า ณ ตำแหน่ง $x = 0$ วัตถุมีพลังงานจลน์เท่ากับ $${n1(K0)}$ จูล อัตราเร็วของวัตถุขณะอยู่ที่ตำแหน่ง $x = 8$ เมตร จะมีค่ากี่เมตรต่อวินาที`, sol }, o);
    },
  });

  /* 6 ---------- สมดุลการหมุน: ไม้เมตร (มีรูป) ---------- */
  add({
    id: "p-torque", topic: "สมดุลกล", gen(R) {
      let M, p, x1, m1, xu, mu;
      for (let t = 0; t < 200; t++) {
        M = R.pick([0.1, 0.2, 0.3, 0.4]); p = R.pick([30, 40, 60, 70]);
        x1 = R.pick([0, 10, 20, 80, 90, 100].filter(x => Math.abs(x - p) >= 20)); m1 = R.pick([0.1, 0.2, 0.3, 0.5]);
        xu = R.pick([0, 10, 20, 80, 90, 100].filter(x => x !== x1 && Math.abs(x - p) >= 20));
        mu = -(M * (50 - p) + m1 * (x1 - p)) / (xu - p);
        if (mu > 0.04 && mu <= 2 && Math.abs(mu * 100 - Math.round(mu * 100)) < 1e-6) break; mu = null;
      }
      A(mu);
      const o = X.numOpts(mu, [mu + 0.1, mu - 0.1, -(m1 * (x1 - p)) / (xu - p), mu + 0.2, mu * 2], f2, { posOnly: true, step: 0.1 });
      const sc = 3.1, X0 = 25, Y = 60, px = c => X0 + c * sc;
      let s = S.rect(X0, Y - 5, 100 * sc, 10, "ln fb", 2);
      for (let c = 0; c <= 100; c += 10) s += S.line(px(c), Y + 5, px(c), Y + 9, "mu") + (c % 20 === 0 ? S.text(px(c), Y + 18, String(c), { c: "xs" }) : "");
      s += S.poly([[px(p), Y - 5], [px(p) - 9, Y - 22], [px(p) + 9, Y - 22]], "ln fs") + S.line(px(p) - 16, Y - 22, px(p) + 16, Y - 22, "ln thk");
      const hang = (c, lab) => S.line(px(c), Y + 5, px(c), Y + 42, "ln") + S.rect(px(c) - 22, Y + 42, 44, 26, "ln fa", 3) + S.text(px(c), Y + 55, lab, { c: "sm", html: true });
      s += hang(x1, `${n2(m1)} kg`) + hang(xu, "?");
      s += S.text(px(100) + 8, Y + 18, "cm", { c: "xs", a: "start" });
      const fig = S.svg(360, 140, s, "ไม้เมตรแขวนวัตถุ");
      const side = c => (c > p ? "ตามเข็ม" : "ทวนเข็ม");
      const sol = `ให้จุดหมุนอยู่ที่ $${p}$ cm น้ำหนักไม้ ($${n1(M)}g$) กระทำที่ $50$ cm แขนโมเมนต์ $${Math.abs(50 - p)}$ cm (${side(50)})<br>` +
        `วัตถุ $${n2(m1)}$ kg แขนโมเมนต์ $${Math.abs(x1 - p)}$ cm (${side(x1)}), วัตถุที่ต้องหา แขนโมเมนต์ $${Math.abs(xu - p)}$ cm (${side(xu)})<br>` +
        `$\\Sigma M_{\\text{ทวน}} = \\Sigma M_{\\text{ตาม}}$ (ตัด $g$ ออก) → $m = \\boldsymbol{${f2(mu)}}$ กิโลกรัม`;
      return Object.assign({ q: `ไม้เมตรสม่ำเสมอมวล $${n1(M)}$ กิโลกรัม ถูกตรึงจุดหมุนที่ตำแหน่ง $${p}$ เซนติเมตร และแขวนวัตถุมวล $${n2(m1)}$ กิโลกรัม ที่ตำแหน่ง $${x1}$ เซนติเมตร ดังรูป ถ้าไม่ต้องการให้ไม้เมตรนี้หมุน จะต้องแขวนวัตถุมวลกี่กิโลกรัมที่ตำแหน่ง $${xu}$ เซนติเมตร`, fig, sol }, o);
    },
  });

  /* 7 ---------- การชน: พลังงานจลน์ที่เปลี่ยนไป ---------- */
  add({
    id: "p-collide", topic: "โมเมนตัมและการชน", gen(R) {
      let mA, mB, vA, vA2, vB;
      for (let t = 0; t < 100; t++) {
        mA = R.pick([1, 2]); mB = R.pick([2, 3, 4, 5]); vA = R.pick([3, 4, 5, 6]); vA2 = R.pick([0.5, 1, 1.5, 2]);
        vB = mA * (vA + vA2) / mB;
        const dK = 0.5 * mA * vA2 ** 2 + 0.5 * mB * vB ** 2 - 0.5 * mA * vA ** 2;
        if (Math.abs(vB * 4 - Math.round(vB * 4)) < 1e-9 && dK <= 1e-9) break; vB = null;
      }
      A(vB);
      const Ki = 0.5 * mA * vA ** 2, Kf = 0.5 * mA * vA2 ** 2 + 0.5 * mB * vB ** 2, dK = Kf - Ki;
      const wrongVB = mA * (vA - vA2) / mB, Kf2 = 0.5 * mA * vA2 ** 2 + 0.5 * mB * wrongVB ** 2;
      const T = v => Math.abs(v) < 1e-9 ? "ไม่มีการเปลี่ยนแปลง" : (v > 0 ? "เพิ่มขึ้น" : "ลดลง") + ` $${f2(Math.abs(v))}$ จูล`;
      const ans = T(dK);
      const wr = [T(-dK), T(Kf2 - Ki), T(-(Kf2 - Ki)), "ไม่มีการเปลี่ยนแปลง", T(dK * 2), T(-dK / 2)];
      const o = X.opts(R, ans, wr.filter(w => w !== ans));
      const sol = `ให้ทิศขวาเป็นบวก: $p_\\text{ก่อน} = p_\\text{หลัง}$ → $${mA}(${vA}) = ${mA}(-${vA2}) + ${mB}v_B$ → $v_B = ${f2(vB)}$ เมตรต่อวินาที<br>` +
        `$E_k$ ก่อนชน $= \\frac12(${mA})(${vA})^2 = ${f2(Ki)}$ J, หลังชน $= \\frac12(${mA})(${vA2})^2 + \\frac12(${mB})(${f2(vB)})^2 = ${f2(Kf)}$ J<br>` +
        `พลังงานจลน์ของระบบ<b>${T(dK).replace(/\$/g, "")}</b>${Math.abs(dK) > 1e-9 ? " (การชนไม่ยืดหยุ่น)" : " (การชนแบบยืดหยุ่น)"}`;
      return Object.assign({ q: `วัตถุ A มวล $${mA}$ กิโลกรัม เคลื่อนที่ไปทางขวาด้วยความเร็ว $${vA}$ เมตรต่อวินาที เข้าชนในแนวตรงกับวัตถุ B มวล $${mB}$ กิโลกรัม ซึ่งอยู่นิ่ง หลังการชนพบว่าวัตถุ A กระดอนกลับไปทางซ้ายด้วยความเร็ว $${n1(vA2)}$ เมตรต่อวินาที พลังงานจลน์ของระบบเปลี่ยนแปลงอย่างไร`, sol }, o);
    },
  });

  /* 8 ---------- แรงเสียดทานสถิต/จลน์ (มีรูป) ---------- */
  add({
    id: "p-friction", topic: "แรงและกฎการเคลื่อนที่", gen(R) {
      const mg_ = R.pick([0.5, 1, 2]), Fv = R.pick([0.5, 1.1, 1.5, 2, 3]), ms = R.pick([0.3, 0.4, 0.5]), mk = ms - 0.1;
      const g = 9.8, N = mg_ * g + Fv, fsMax = ms * N, push = 2 * Fv;
      const moves = push > fsMax;
      const a = moves ? (push - mk * N) / mg_ : 0;
      const o = X.numOpts(a, [0, (push - mk * mg_ * g) / mg_, (push - ms * N) / mg_, push / mg_, (push - mk * N) / mg_ + 0.5].map(v => Math.max(v, 0)), f2, { step: 0.4, min: 0 });
      let s = S.ground(30, 290, 150) + S.rect(120, 90, 80, 60, "ln fb", 4) + S.text(160, 120, `${n1(mg_)} kg`, { c: "sm" });
      s += S.arrow(160, 30, 160, 88, "rd", 10) + S.text(172, 40, "F", { b: true, a: "start" });
      s += S.arrow(202, 120, 275, 120, "rd", 10) + S.text(262, 106, "2F", { b: true });
      const fig = S.svg(310, 165, s, "กล่องถูกแรงกระทำ");
      const sol = `แรงแนวฉาก $N = mg + F = ${n1(mg_)}(9.8) + ${n1(Fv)} = ${f2(N)}$ นิวตัน<br>` +
        `แรงเสียดทานสถิตสูงสุด $f_{s,\\max} = ${ms}\\times${f2(N)} = ${f2(fsMax)}$ นิวตัน เทียบกับแรงดึง $2F = ${n1(push)}$ นิวตัน<br>` +
        (moves ? `$2F > f_{s,\\max}$ กล่องจึงเคลื่อนที่ ใช้แรงเสียดทานจลน์ $f_k = ${n1(mk)}\\times${f2(N)} = ${f2(mk * N)}$ N<br>$a = \\dfrac{${n1(push)} - ${f2(mk * N)}}{${n1(mg_)}} = \\boldsymbol{${f2(a)}}$ เมตรต่อวินาที²`
          : `$2F \\le f_{s,\\max}$ กล่องจึง<b>ไม่เคลื่อนที่</b> ความเร่ง $= \\boldsymbol{0}$`);
      return Object.assign({ q: `กล่องใบหนึ่งมีมวล $${n1(mg_)}$ กิโลกรัม วางอยู่บนพื้นราบและมีแรงกระทำดังภาพ กำหนดให้แรง $F$ มีขนาด $${n1(Fv)}$ นิวตัน สัมประสิทธิ์ความเสียดทานสถิตและจลน์ระหว่างกล่องกับพื้นเท่ากับ $${ms}$ และ $${n1(mk)}$ ตามลำดับ และ $g = 9.8$ นิวตันต่อกิโลกรัม ความเร่งของกล่องมีขนาดกี่เมตรต่อวินาที²`, fig, sol }, o);
    },
  });

  /* 9 ---------- สนามโน้มถ่วงของดาวเคราะห์ ---------- */
  add({
    id: "p-gravity", topic: "แรงโน้มถ่วง", gen(R) {
      const [k, n] = R.pick([[75, 5], [18, 3], [8, 2], [12, 2], [27, 3], [50, 5], [4, 4], [2, 2], [9, 2], [45, 3]]);
      const ans = F(k, n * n);
      const T = f => m((f.d === 1 ? (f.n === 1 ? "" : f.n) : f.tex()) + "g");
      const w = [F(k, n), F(k * n * n), F(n * n, k), F(k, n ** 3), F(k * n)];
      const seen = new Set([T(ans)]); const wr = [];
      for (const f of w) { const t = T(f); if (!seen.has(t)) { seen.add(t); wr.push([f.v, t]); } }
      const items = [[ans.v, T(ans)], ...wr.slice(0, 4)].sort((a, b) => a[0] - b[0]);
      const sol = `$g = \\dfrac{GM}{R^2}$ ดังนั้น $g' = \\dfrac{G(${k}M)}{(${n}R)^2} = \\dfrac{${k}}{${n * n}}\\cdot\\dfrac{GM}{R^2} = \\boldsymbol{${T(ans).replace(/\$/g, "")}}$`;
      return { q: `โลกมวล $M$ รัศมี $R$ มีขนาดสนามโน้มถ่วงที่ผิวเท่ากับ $g$ ถ้าดาวเคราะห์ดวงหนึ่งมีมวล $${k}M$ และรัศมี $${n}R$ ขนาดสนามโน้มถ่วงที่ผิวของดาวเคราะห์ดวงนี้มีค่าเท่าใด`, sol, choices: items.map(i => i[1]), answer: items.findIndex(i => i[1] === T(ans)) };
    },
  });

  /* 10 ---------- การเคลื่อนที่แบบวงกลม ---------- */
  add({
    id: "p-circle", topic: "การเคลื่อนที่แบบวงกลม", gen(R) {
      if (R.chance(0.5)) {
        const ans = m("4\\pi^2N^2L");
        const o = X.opts(R, ans, [m("0"), m("2\\pi NL"), m("\\dfrac{2\\pi}{N}L"), m("\\dfrac{4\\pi^2}{N^2}L"), m("4\\pi^2NL^2")]);
        const sol = `ความเร็วเชิงมุม $\\omega = 2\\pi f = 2\\pi N$ (เพราะ $N$ รอบใน 1 วินาที)<br>` +
          `ความเร่งสู่ศูนย์กลาง $a_c = \\omega^2 r = (2\\pi N)^2L = \\boldsymbol{4\\pi^2N^2L}$ (แม้อัตราเร็วคงที่ แต่ทิศเปลี่ยน จึงมีความเร่ง ≠ 0)`;
        return Object.assign({ q: `ลูกตุ้มผูกด้วยเชือกเบายาว $L$ แล้วแกว่งให้ลูกตุ้มเคลื่อนที่เป็นวงกลมแนวราบแบบสม่ำเสมอด้วยอัตราเร็วคงที่ พบว่าเคลื่อนที่ได้ $N$ รอบ ในเวลา $1$ วินาที ขนาดความเร่งของลูกตุ้มเป็นเท่าใด`, sol }, o);
      }
      const [v, mu] = R.pick([[10, 0.5], [12, 0.4], [14, 0.5], [16, 0.8], [20, 0.8], [12, 0.6], [15, 0.5]]);
      const r = v * v / (10 * mu);
      const o = X.numOpts(v, [Math.sqrt(mu * r), Math.sqrt(10 * r), Math.sqrt(2 * mu * 10 * r), v * 3.6 / 1, v / 2], n1);
      const sol = `แรงเสียดทานสถิตทำหน้าที่เป็นแรงสู่ศูนย์กลาง: $\\dfrac{mv^2}{r} \\le \\mu_s mg$<br>$v_{\\max} = \\sqrt{\\mu_s g r} = \\sqrt{${mu}(10)(${n1(r)})} = \\sqrt{${v * v}} = \\boldsymbol{${v}}$ เมตรต่อวินาที (มวลรถไม่มีผล)`;
      return Object.assign({ q: `รถยนต์มวล $1{,}200$ กิโลกรัม เลี้ยวโค้งบนถนนราบซึ่งมีรัศมีความโค้ง $${n1(r)}$ เมตร ถ้าสัมประสิทธิ์ความเสียดทานสถิตระหว่างยางกับถนนเท่ากับ $${mu}$ อัตราเร็วสูงสุดที่รถเลี้ยวได้โดยไม่ไถลออกนอกโค้งเป็นกี่เมตรต่อวินาที (กำหนด $g = 10$ เมตรต่อวินาที²)`, sol }, o);
    },
  });

  /* 11 ---------- สปริงแล้วไถลบนพื้นฝืด (มีรูป) ---------- */
  add({
    id: "p-spring", topic: "งานและพลังงาน", gen(R) {
      const k = R.pick([100, 200, 400, 800]), x = R.pick([0.1, 0.2, 0.3]), mass = R.pick([0.5, 1, 2]), mu = R.pick([0.2, 0.25, 0.4, 0.5]);
      const E = 0.5 * k * x * x, s = E / (mu * mass * 10);
      A(s >= 0.2 && s <= 40);
      const o = X.numOpts(s, [k * x * x / (mu * mass * 10), k * x / (2 * mu * mass * 10), E / (mass * 10), s / 2], f2, { posOnly: true });
      let fg = S.wall(20, 40, 110, -1) + S.spring(20, 92, 100, 7, 6) + S.rect(100, 74, 36, 36, "ln fa", 3) + S.text(118, 92, "m", { i: true });
      fg += S.line(20, 110, 180, 110, "ln") + S.text(100, 125, "พื้นลื่น", { c: "xs" });
      fg += S.line(180, 110, 340, 110, "am thk"); for (let xx = 184; xx < 340; xx += 8) fg += S.line(xx, 112, xx - 5, 118, "am");
      fg += S.text(260, 130, "พื้นฝืด μk", { c: "xs" }) + S.dash(180, 30, 180, 110, "mu") + S.text(180, 22, "ตำแหน่งสมดุล", { c: "xs" }) + S.dim(118, 52, 180, 52, `x = ${n1(x)} m`, { off: -10 });
      const fig = S.svg(350, 140, fg, "สปริงดันวัตถุไปบนพื้นฝืด");
      const sol = `พลังงานศักย์ยืดหยุ่น $\\frac12kx^2 = \\frac12(${k})(${n1(x)})^2 = ${f2(E)}$ J กลายเป็นพลังงานจลน์ที่ตำแหน่งสมดุล<br>` +
        `บนพื้นฝืด งานของแรงเสียดทานทำให้หยุด: $\\mu_k mgs = ${f2(E)}$ → $s = \\dfrac{${f2(E)}}{${mu}(${n1(mass)})(10)} = \\boldsymbol{${f2(s)}}$ เมตร`;
      return Object.assign({ q: `ดันวัตถุมวล $${n1(mass)}$ กิโลกรัม ซึ่งอยู่บนพื้นลื่นและติดกับปลายสปริงที่มีค่าคงตัวสปริง $${k}$ นิวตันต่อเมตร ทำให้สปริงหดเป็นระยะ $${n1(x)}$ เมตร แล้วปล่อย วัตถุหลุดจากสปริงที่ตำแหน่งสมดุลแล้วเคลื่อนที่ต่อไปบนพื้นฝืดที่มีสัมประสิทธิ์ความเสียดทานจลน์ $${mu}$ ดังรูป วัตถุเคลื่อนที่บนพื้นฝืดได้ระยะทางกี่เมตรก่อนหยุดนิ่ง ($g = 10$ เมตรต่อวินาที²)`, fig, sol }, o);
    },
  });

  /* 12 ---------- กำลังไฟฟ้าในวงจรผสม (มีรูป) ---------- */
  add({
    id: "p-power-rank", topic: "ไฟฟ้ากระแส", gen(R) {
      const R1 = R.pick([100, 200, 300]), R2 = R.pick([100, 200, 300, 600]), R3 = R.pick([100, 200, 300, 600]);
      const I = 1, I2 = I * R3 / (R2 + R3), I3 = I * R2 / (R2 + R3);
      const P = [I * I * R1, I2 * I2 * R2, I3 * I3 * R3];
      const o = orderOpts(R, P, ["P_1", "P_2", "P_3"]);
      let s = S.line(20, 40, 50, 40) + S.resistor(50, 40, 130, 40, "<tspan font-style='italic'>R</tspan>₁");
      s += S.line(130, 40, 150, 40) + S.resistor(150, 40, 230, 40, "<tspan font-style='italic'>R</tspan>₂") + S.line(150, 40, 150, 84) + S.line(230, 40, 230, 84);
      s += S.resistor(150, 84, 230, 84, "<tspan font-style='italic'>R</tspan>₃", { side: 1 }) + S.line(230, 40, 260, 40) + S.dot(150, 40) + S.dot(230, 40);
      const fig = S.svg(280, 120, s, "วงจรตัวต้านทาน R1 อนุกรมกับ R2 ขนาน R3");
      const sol = `ให้กระแสรวม $I$ ไหลผ่าน $R_1$ ทั้งหมด แล้วแยกเข้า $R_2$ และ $R_3$ ในอัตราส่วนผกผันกับความต้านทาน<br>` +
        `$I_2 = \\dfrac{${R3}}{${R2 + R3}}I$, $I_3 = \\dfrac{${R2}}{${R2 + R3}}I$<br>` +
        `$P = I^2R$: $P_1 = ${n1(P[0])}I^2$, $P_2 = ${n1(P[1])}I^2$, $P_3 = ${n1(P[2])}I^2$ (หน่วย W เมื่อ $I$ เป็นแอมแปร์)<br>ดังนั้น $\\boldsymbol{${ordering(P, ["P_1", "P_2", "P_3"])}}$`;
      return Object.assign({ q: `ตัวต้านทาน $R_1$ ขนาด $${R1}$ โอห์ม $R_2$ ขนาด $${R2}$ โอห์ม และ $R_3$ ขนาด $${R3}$ โอห์ม ต่อกันดังรูป เมื่อต่อปลายทั้งสองข้างของส่วนของวงจรนี้กับถ่านไฟฉาย พบว่ากำลังไฟฟ้าของ $R_1$, $R_2$ และ $R_3$ มีค่า $P_1$, $P_2$ และ $P_3$ ตามลำดับ จงเรียงลำดับค่ากำลังไฟฟ้าจากมากไปน้อย`, fig, sol }, o);
    },
  });

  /* 13 ---------- วงจรมีความต้านทานภายใน (มีรูป) ---------- */
  add({
    id: "p-emf", topic: "ไฟฟ้ากระแส", gen(R) {
      const [R1, R2] = R.pick([[3, 6], [4, 12], [6, 12], [6, 6], [10, 15], [2, 2], [20, 30], [12, 4]]);
      const Rp = R1 * R2 / (R1 + R2), I = R.pick([0.5, 1, 1.5, 2]), r = R.pick([0.5, 1, 2]);
      const E = I * (Rp + r);
      const variant = R.pick(["I1", "V"]);
      let ans, wr, ask, tail;
      if (variant === "I1") { ans = I * R2 / (R1 + R2); wr = [I * R1 / (R1 + R2), I, E / R1, I / 2]; ask = `กระแสไฟฟ้าที่ผ่านตัวต้านทาน $${R1}\\,\\Omega$ มีค่ากี่แอมแปร์`; tail = `$I_{${R1}\\Omega} = \\dfrac{V}{${R1}} = \\dfrac{${f2(I * Rp)}}{${R1}} = \\boldsymbol{${f2(ans)}}$ แอมแปร์`; }
      else { ans = I * Rp; wr = [E, I * r, E - I * Rp + I * r, E * Rp / (Rp + 2 * r)]; ask = `ความต่างศักย์ระหว่างขั้วแบตเตอรี่ขณะใช้งานมีค่ากี่โวลต์`; tail = `ความต่างศักย์ที่ขั้ว $V = E - Ir = ${f2(E)} - ${f2(I)}(${r}) = \\boldsymbol{${f2(ans)}}$ โวลต์`; }
      const o = X.numOpts(ans, wr, f2, { posOnly: true });
      let s = S.battery(40, 40, 160, "<tspan font-style='italic'>E</tspan>, <tspan font-style='italic'>r</tspan>") + S.line(40, 40, 100, 40) + S.circle(118, 40, 14, "ln fg") + S.text(118, 41, "A", { b: true }) + S.line(132, 40, 260, 40);
      s += S.line(40, 160, 260, 160) + S.resistor(190, 40, 190, 160, `${R1} Ω`, { side: -1 }) + S.resistor(260, 40, 260, 160, `${R2} Ω`, { side: 1 });
      s += S.dot(190, 40) + S.dot(190, 160);
      const fig = S.svg(310, 190, s, "วงจรแบตเตอรี่กับตัวต้านทานขนาน");
      const sol = `ตัวต้านทานต่อขนาน: $R_p = \\dfrac{${R1}\\times${R2}}{${R1}+${R2}} = ${n2(Rp)}\\,\\Omega$<br>` +
        `กระแสรวม $I = \\dfrac{E}{R_p + r} = \\dfrac{${f2(E)}}{${n2(Rp)} + ${r}} = ${f2(I)}$ A (คือค่าที่แอมมิเตอร์อ่านได้)<br>` +
        `ความต่างศักย์คร่อมชุดขนาน $V = IR_p = ${f2(I * Rp)}$ V<br>` + tail;
      return Object.assign({ q: `แบตเตอรี่มีแรงเคลื่อนไฟฟ้า $${f2(E)}$ โวลต์ และความต้านทานภายใน $${r}$ โอห์ม ต่อกับตัวต้านทาน $${R1}$ โอห์ม และ $${R2}$ โอห์ม ซึ่งต่อขนานกันดังรูป ${ask}`, fig, sol }, o);
    },
  });

  /* 14 ---------- การเหนี่ยวนำ: ขดลวดสี่เหลี่ยมสองวง (มีรูป) ---------- */
  add({
    id: "p-faraday", topic: "แม่เหล็กไฟฟ้า", gen(R) {
      const a = R.pick([3, 4]), b = a + R.pick([1, 2]), B1 = R.pick([50, 60, 80, 90]), B2 = R.pick([10, 20, 30]), dt = R.pick([0.1, 0.2]);
      const where = R.pick(["ring", "inner", "all"]);
      const rate = (B1 - B2) * 1e-6 / dt; // T/s
      const Asmall = a * a * 1e-4, Abig = b * b * 1e-4;
      let e1, e2;
      if (where === "ring") { e1 = 0; e2 = (Abig - Asmall) * rate; }
      else if (where === "inner") { e1 = Asmall * rate; e2 = Asmall * rate; }
      else { e1 = Asmall * rate; e2 = Abig * rate; }
      const uv = v => X.num(v * 1e6, 2);
      const pr = (p, q) => m(`${uv(p)}`) + " และ " + m(`${uv(q)}`);
      const ans = pr(e1, e2);
      const all = [[0, (Abig - Asmall) * rate], [0, Abig * rate], [Asmall * rate, (Abig - Asmall) * rate], [Asmall * rate, Asmall * rate], [Asmall * rate, Abig * rate], [(Abig - Asmall) * rate, 0]];
      const o = X.opts(R, ans, all.map(([p, q]) => pr(p, q)).filter(t => t !== ans));
      const sc = 22, c = 150, ha = a * sc / 2, hb = b * sc / 2;
      let s = S.arrow(c - hb - 30, c, c + hb + 40, c, "ln", 8) + S.arrow(c, c + hb + 26, c, c - hb - 36, "ln", 8) + S.text(c + hb + 44, c + 2, "x", { i: true, a: "start" }) + S.text(c + 8, c - hb - 40, "y", { i: true, a: "start" });
      s += S.rect(c - hb, c - hb, 2 * hb, 2 * hb, "ac thk nf") + S.rect(c - ha, c - ha, 2 * ha, 2 * ha, "am thk nf");
      const crosses = [];
      for (let x = c - hb + 7; x < c + hb; x += 13) for (let y = c - hb + 7; y < c + hb; y += 13) {
        const inInner = Math.abs(x - c) < ha - 3 && Math.abs(y - c) < ha - 3, inRing = !inInner && Math.abs(x - c) < hb - 3 && Math.abs(y - c) < hb - 3 && (Math.abs(x - c) > ha + 3 || Math.abs(y - c) > ha + 3);
        if ((where === "ring" && inRing) || (where === "inner" && inInner) || (where === "all" && (inInner || inRing))) crosses.push([x, y]);
      }
      for (const [x, y] of crosses) s += S.text(x, y, "×", { c: "xs mu2" });
      s += S.text(c + hb + 6, c - hb - 6, `${b} cm`, { c: "xs", a: "start" }) + S.text(c - ha + 2, c - ha - 7, `${a} cm`, { c: "xs", a: "start" });
      const fig = S.svg(300, 300, s, "ขดลวดสี่เหลี่ยมสองวงในสนามแม่เหล็ก");
      const wtxt = { ring: "เฉพาะพื้นที่ระหว่างขดลวดทั้งสอง", inner: "เฉพาะพื้นที่ภายในขดลวดวงเล็ก", all: "ทั่วทั้งพื้นที่ภายในขดลวดวงใหญ่" }[where];
      const sol = `$\\mathcal{E} = \\dfrac{\\Delta\\Phi}{\\Delta t} = A_{\\text{มีสนาม}}\\dfrac{\\Delta B}{\\Delta t}$ โดย $\\dfrac{\\Delta B}{\\Delta t} = \\dfrac{(${B1} - ${B2})\\times10^{-6}}{${dt}} = ${X.sci(rate, 2)}$ T/s<br>` +
        `สนามอยู่${wtxt}: ขดเล็กมีพื้นที่ที่มีสนาม $${where === "ring" ? "0" : `${a * a}\\text{ cm}^2`}$, ขดใหญ่มี $${where === "ring" ? `${b * b} - ${a * a} = ${b * b - a * a}` : where === "inner" ? a * a : b * b}\\text{ cm}^2$<br>` +
        `ได้ $\\mathcal{E}_{\\text{เล็ก}} = ${uv(e1)}\\,\\mu\\text{V}$ และ $\\mathcal{E}_{\\text{ใหญ่}} = ${uv(e2)}\\,\\mu\\text{V}$`;
      return Object.assign({ q: `เส้นลวดขดเป็นรูปสี่เหลี่ยมจัตุรัสสองวง มีความยาวด้าน $${a}$ และ $${b}$ เซนติเมตร วางซ้อนกันอยู่ในระนาบ $xy$ โดยมีจุดศูนย์กลางร่วมกัน ดังรูป สนามแม่เหล็กสม่ำเสมอพุ่งผ่าน${wtxt}ในทิศพุ่งเข้าตั้งฉากระนาบ $xy$ โดยขนาดสนามแม่เหล็กลดลงจาก $${B1}$ ไมโครเทสลา เป็น $${B2}$ ไมโครเทสลา ในเวลา $${dt}$ วินาที อีเอ็มเอฟเหนี่ยวนำในขดลวดวงเล็กและขดลวดวงใหญ่มีค่ากี่ไมโครโวลต์ ตามลำดับ`, fig, sol }, o);
    },
  });

  /* 15 ---------- มอดุลัสของยัง: เปรียบเทียบความเค้น ---------- */
  add({
    id: "p-young", topic: "สมบัติเชิงกลของสาร", gen(R) {
      const Ys = R.sample([0.7, 1.0, 1.2, 1.75, 2.0, 1.4, 0.8], 3), dL = Ys.map(() => R.pick([0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5]));
      const sig = Ys.map((y, i) => X.round(y * dL[i], 6));
      const o = orderOpts(R, sig, ["\\sigma_A", "\\sigma_B", "\\sigma_C"]);
      const row = (n, i) => `<tr><td>${n}</td><td>$${X.sci(Ys[i] * 1e11, 3)}$</td><td>$${n1(dL[i])}$</td></tr>`;
      const tbl = `<table class="qt"><tr><th>ชนิดโลหะ</th><th>ค่ามอดุลัสของยัง (N/m²)</th><th>ระยะยืด (mm)</th></tr>${row("A", 0)}${row("B", 1)}${row("C", 2)}</table>`;
      const sol = `$Y = \\dfrac{\\sigma}{\\varepsilon} = \\dfrac{\\sigma L}{\\Delta L}$ → $\\sigma = \\dfrac{Y\\Delta L}{L}$ เส้นลวดยาวเท่ากัน จึงเทียบ $Y\\Delta L$<br>` +
        `A: $${Ys[0]}\\times${dL[0]} = ${X.num(sig[0], 3)}$, B: $${Ys[1]}\\times${dL[1]} = ${X.num(sig[1], 3)}$, C: $${Ys[2]}\\times${dL[2]} = ${X.num(sig[2], 3)}$ (หน่วย $10^{11}\\times$mm/L)<br>ดังนั้น $\\boldsymbol{${ordering(sig, ["\\sigma_A", "\\sigma_B", "\\sigma_C"])}}$`;
      return Object.assign({ q: `เส้นลวดสามเส้นมีพื้นที่หน้าตัดและความยาวเท่ากัน ทำจากโลหะ A B และ C ตามลำดับ เมื่อออกแรงดึงลวดทั้งสามเส้นให้ยืดออก โดยระยะยืดและค่ามอดุลัสของยังของโลหะทั้งสามชนิดแสดงดังตาราง${tbl}ข้อใดเปรียบเทียบค่าความเค้น ($\\sigma$) ในลวดทั้งสามเส้นขณะถูกดึงได้ถูกต้อง`, sol }, o);
    },
  });

  /* 16 ---------- การลอย: ความหนาแน่น (มีรูป) ---------- */
  add({
    id: "p-float", topic: "กลศาสตร์ของไหล", gen(R) {
      const h = R.pick([10, 12, 15, 20]), frac = R.pick([0.4, 0.5, 0.6, 0.75, 0.8]), rl = R.pick([1000, 800, 1200]);
      const d = h * frac; A(Number.isInteger(d * 2));
      const rb = rl * frac;
      const o = X.numOpts(rb, [rl * (1 - frac), rl / frac, rl * (h - d) / d, rb + 100], v => X.fmt(v, 0));
      let s = S.line(40, 30, 40, 190) + S.line(40, 190, 280, 190) + S.line(280, 190, 280, 30) + S.rect(41, 80, 238, 109, "fa nos");
      s += S.line(41, 80, 279, 80, "ac");
      const bh = 7 * h, top = 80 - bh * (1 - frac);
      s += S.rect(130, top, 60, bh, "ln fb", 2) + S.dim(206, top, 206, top + bh, `${h} cm`, { off: -16 }) + S.dim(112, 80, 112, top + bh, `${n1(d)} cm`, { off: 20 });
      s += S.text(240, 170, `ρ = ${X.fmt(rl, 0).replace("{,}", ",")} kg/m³`, { c: "xs" });
      const fig = S.svg(320, 205, s, "แท่งไม้ลอยในของเหลว");
      const sol = `วัตถุลอยนิ่ง: น้ำหนัก = แรงลอยตัว → $\\rho_b(Ah)g = \\rho_\\ell(Ad)g$<br>$\\rho_b = \\rho_\\ell\\dfrac{d}{h} = ${X.fmt(rl, 0)}\\times\\dfrac{${n1(d)}}{${h}} = \\boldsymbol{${X.fmt(rb, 0)}}$ กิโลกรัมต่อลูกบาศก์เมตร`;
      return Object.assign({ q: `แท่งวัตถุทรงสี่เหลี่ยมสม่ำเสมอสูง $${h}$ เซนติเมตร ลอยนิ่งในแนวดิ่งในของเหลวที่มีความหนาแน่น $${X.fmt(rl, 0)}$ กิโลกรัมต่อลูกบาศก์เมตร โดยจมอยู่ในของเหลวลึก $${n1(d)}$ เซนติเมตร ดังรูป ความหนาแน่นของวัตถุเป็นกี่กิโลกรัมต่อลูกบาศก์เมตร`, fig, sol }, o);
    },
  });

  /* 17 ---------- สมการความต่อเนื่อง ---------- */
  add({
    id: "p-continuity", topic: "กลศาสตร์ของไหล", gen(R) {
      const A1 = R.pick([4.0, 5.0, 5.5, 6.0, 8.0]), V = R.pick([2000, 2500, 3000, 4000]), t = R.pick([40, 50, 80, 100]), A2 = R.pick([0.5, 0.8, 1.0, 1.25]);
      const Q = V / t, v2 = Q / A2, v1 = Q / A1;
      const o = X.numOpts(v2, [v1, Q, Q * A2, v1 * A1 / A2 / 2], n1);
      const sol = `อัตราการไหล $Q = \\dfrac{V}{t} = \\dfrac{${V}}{${t}} = ${n1(Q)}$ ลูกบาศก์เซนติเมตรต่อวินาที (เท่ากันทุกหน้าตัด)<br>` +
        `$Q = A_2v_2$ → $v_2 = \\dfrac{${n1(Q)}}{${n2(A2)}} = \\boldsymbol{${n1(v2)}}$ เซนติเมตรต่อวินาที`;
      return Object.assign({ q: `เมื่อใช้สายยางพื้นที่หน้าตัด $${n2(A1)}$ ตารางเซนติเมตร ฉีดน้ำใส่ภาชนะปริมาตร $${X.fmt(V, 0)}$ ลูกบาศก์เซนติเมตร ต้องใช้เวลา $${n1(t)}$ วินาที น้ำจึงเต็มภาชนะ ถ้านำหัวฉีดที่มีพื้นที่หน้าตัด $${n2(A2)}$ ตารางเซนติเมตร ไปติดที่ปลายสายยาง (พิจารณาการไหลเป็นแบบของไหลอุดมคติ) อัตราเร็วของน้ำที่พุ่งออกจากหัวฉีดมีค่ากี่เซนติเมตรต่อวินาที`, sol }, o);
    },
  });

  /* 18 ---------- สมดุลความร้อน ---------- */
  add({
    id: "p-calor", topic: "ความร้อนและแก๊ส", gen(R) {
      let m1, c1, T1, m2, c2, T2, Tf;
      for (let t = 0; t < 200; t++) {
        m1 = R.pick([200, 300, 400, 500]); c1 = R.pick([0.25, 0.4, 0.5, 0.9]); T1 = R.pick([80, 90, 100, 120]);
        m2 = R.pick([100, 200, 250, 400]); c2 = R.pick([0.3, 0.5, 1, 2.5]); T2 = R.pick([20, 24, 25, 30]);
        Tf = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2);
        if (Math.abs(Tf * 10 - Math.round(Tf * 10)) < 1e-9) break; Tf = null;
      }
      A(Tf);
      const o = X.numOpts(Tf, [(T1 + T2) / 2, (m1 * T1 + m2 * T2) / (m1 + m2), (c1 * T1 + c2 * T2) / (c1 + c2), Tf + 8, Tf - 8].filter(v => Math.abs(v - Tf) > 0.05), n1, { step: 4 });
      const sol = `ความร้อนที่โลหะให้ = ความร้อนที่ของเหลวรับ: $m_1c_1(${T1} - T) = m_2c_2(T - ${T2})$<br>` +
        `$${m1}(${c1})(${T1} - T) = ${m2}(${c2})(T - ${T2})$ → $${n1(m1 * c1)}(${T1} - T) = ${n1(m2 * c2)}(T - ${T2})$<br>$T = \\dfrac{${n1(m1 * c1 * T1)} + ${n1(m2 * c2 * T2)}}{${n1(m1 * c1 + m2 * c2)}} = \\boldsymbol{${n1(Tf)}}$ องศาเซลเซียส`;
      return Object.assign({ q: `นำโลหะมวล $${m1}$ กรัม ที่มีอุณหภูมิ $${n1(T1)}$ องศาเซลเซียส ผสมกับของเหลวมวล $${m2}$ กรัม ที่มีอุณหภูมิ $${n1(T2)}$ องศาเซลเซียส ในภาชนะปิดโดยไม่มีการถ่ายเทความร้อนกับภายนอก กำหนดให้ความจุความร้อนจำเพาะของโลหะและของเหลวมีค่า $${c1}$ และ $${c2}$ จูลต่อกรัม องศาเซลเซียส ตามลำดับ เมื่อเข้าสู่สมดุลความร้อน อุณหภูมิของผสมเป็นกี่องศาเซลเซียส`, sol }, o);
    },
  });

  /* 19 ---------- กฎข้อที่หนึ่งของเทอร์โมไดนามิกส์ ---------- */
  add({
    id: "p-thermo", topic: "ความร้อนและแก๊ส", gen(R) {
      const P = R.pick([100, 150, 200]), V1 = R.pick([0.5, 0.7, 1.0]), dV = R.pick([0.2, 0.3, 0.4, 0.5]), V2 = V1 + dV;
      const W = P * dV, Q = X.round(W + R.pick([-0.5, 10, 20, 25, 40, -10]), 1); A(Q > 0);
      const dU = Q - W;
      const T = v => Math.abs(v) < 1e-9 ? "ไม่เปลี่ยนแปลง" : (v > 0 ? "เพิ่มขึ้น" : "ลดลง") + ` $${n1(Math.abs(v))}$ กิโลจูล`;
      const ans = T(dU);
      const o = X.opts(R, ans, [T(Q + W), T(-(Q + W)), T(-dU), "ไม่เปลี่ยนแปลง", T(W), T(dU + W)].filter(t => t !== ans));
      const sol = `งานที่แก๊สทำ (ความดันคงที่) $W = P\\Delta V = ${P}\\times10^3 \\times ${n1(dV)} = ${n1(W)}$ กิโลจูล<br>` +
        `$\\Delta U = Q - W = ${n1(Q)} - ${n1(W)} = ${n1(dU)}$ กิโลจูล → <b>${ans.replace(/\$/g, "")}</b>`;
      return Object.assign({ q: `แก๊สอุดมคติอุณหภูมิ $300$ เคลวิน ปริมาตร $${n1(V1)}$ ลูกบาศก์เมตร และความดัน $${P}$ กิโลพาสคัล ได้รับความร้อน $${n1(Q)}$ กิโลจูล ส่งผลให้แก๊สขยายตัวภายใต้สภาวะความดันคงที่จนปริมาตรของแก๊สเพิ่มขึ้นเป็น $${n1(V2)}$ ลูกบาศก์เมตร พลังงานภายในของแก๊สอุดมคติเปลี่ยนแปลงอย่างไร`, sol }, o);
    },
  });

  /* 20 ---------- คลื่นนิ่งบนเส้นเชือก (มีรูป) ---------- */
  add({
    id: "p-standing", topic: "คลื่นกล", gen(R) {
      const n = R.int(2, 5), L = R.pick([0.6, 0.8, 1.2, 1.5, 2.0]), f = R.pick([50, 60, 80, 100, 120]);
      const lam = 2 * L / n, v = f * lam;
      const o = X.numOpts(v, [f * L / n, f * 2 * L, f * L * n / 2, f * lam / 2, v * 2], n1, { posOnly: true });
      const x0 = 30, x1 = 330, y = 60, amp = 24;
      let s = S.wall(x0, 30, 90, -1) + S.wall(x1, 30, 90, 1);
      for (const sg of [1, -1]) { const pts = []; for (let i = 0; i <= 120; i++) { const t = i / 120; pts.push([x0 + (x1 - x0) * t, y - sg * amp * Math.sin(n * Math.PI * t)]); } s += S.poly(pts, sg > 0 ? "ac thk nf" : "ac dsh nf", false); }
      s += S.dim(x0, 110, x1, 110, `${n1(L)} m`, { off: 0 });
      const fig = S.svg(360, 125, s, "คลื่นนิ่งบนเส้นเชือก");
      const sol = `จากรูปมี $${n}$ ลูป (ระยะ 1 ลูป $= \\frac{\\lambda}{2}$) → $${n}\\cdot\\dfrac{\\lambda}{2} = ${n1(L)}$ → $\\lambda = ${X.num(lam, 3)}$ เมตร<br>$v = f\\lambda = ${f}\\times${X.num(lam, 3)} = \\boldsymbol{${n1(v)}}$ เมตรต่อวินาที`;
      return Object.assign({ q: `เส้นเชือกยาว $${n1(L)}$ เมตร ตรึงปลายทั้งสองข้าง เมื่อทำให้สั่นด้วยความถี่ $${f}$ เฮิรตซ์ เกิดคลื่นนิ่งดังรูป อัตราเร็วของคลื่นในเส้นเชือกมีค่ากี่เมตรต่อวินาที`, fig, sol }, o);
    },
  });

  /* 21 ---------- การสั่นพ้องในท่อปลายปิด ---------- */
  add({
    id: "p-pipe", topic: "เสียง", gen(R) {
      const f = R.pick([400, 500, 512, 640, 680]), v = R.pick([340, 344, 346, 350]);
      const lam = v / f, L1 = lam / 4, L2 = 3 * lam / 4;
      const Lc = X.round(L1 * 100, 1), L2c = X.round(L2 * 100, 1);
      const vv = f * 2 * (L2c - Lc) / 100;
      const o = X.numOpts(vv, [f * (L2c - Lc) / 100, f * 4 * Lc / 100, f * L2c / 100, vv + 10], v => X.fmt(v, 0));
      const sol = `ตำแหน่งสั่นพ้องสองครั้งที่อยู่ติดกันห่างกันครึ่งความยาวคลื่น: $\\dfrac{\\lambda}{2} = ${n1(L2c)} - ${n1(Lc)} = ${n1(L2c - Lc)}$ cm → $\\lambda = ${n1(2 * (L2c - Lc))}$ cm<br>` +
        `$v = f\\lambda = ${f}\\times${X.num(2 * (L2c - Lc) / 100, 3)} = \\boldsymbol{${X.fmt(vv, 0)}}$ เมตรต่อวินาที (วิธีนี้ไม่ต้องสนใจค่าแก้ปลายท่อ)`;
      return Object.assign({ q: `ในการทดลองหาอัตราเร็วเสียงด้วยหลอดเรโซแนนซ์ซึ่งปลายด้านหนึ่งปิดด้วยผิวน้ำ ใช้ส้อมเสียงความถี่ $${f}$ เฮิรตซ์ พบการสั่นพ้องครั้งแรกเมื่อลำอากาศยาว $${n1(Lc)}$ เซนติเมตร และครั้งที่สองเมื่อยาว $${n1(L2c)}$ เซนติเมตร อัตราเร็วเสียงในอากาศขณะนั้นมีค่าประมาณกี่เมตรต่อวินาที`, sol }, o);
    },
  });

  /* 22 ---------- เลนส์นูน (รูปทางเดินแสงในเฉลย) ---------- */
  add({
    id: "p-lens", topic: "แสงเชิงรังสี", gen(R) {
      const f = R.pick([10, 12, 15, 20]), u = f * R.pick([1.5, 2.5, 3, 4, 0.5]);
      const v = u * f / (u - f), mg_ = v / u;
      const desc = (vv, mm) => vv > 0 ? `ภาพจริงหัวกลับ อยู่ห่างเลนส์ $${n1(vv)}$ cm ขนาด $${X.num(Math.abs(mm), 2)}$ เท่าของวัตถุ` : `ภาพเสมือนหัวตั้ง อยู่ห่างเลนส์ $${n1(-vv)}$ cm ขนาด $${X.num(Math.abs(mm), 2)}$ เท่าของวัตถุ`;
      const ans = desc(v, mg_);
      const vb = u * f / (u + f);
      const wr = [desc(-v, mg_), desc(v, 1 / mg_), desc(vb, vb / u), desc(-vb, vb / u), desc(v * 2, mg_ * 2)];
      const o = X.opts(R, ans, wr.filter(w => w !== ans));
      // ray diagram
      const span = Math.max(u, Math.abs(v), 2 * f) * 1.15, sc = 160 / span, cx = 190, cy = 95, ho = 30;
      const px = d => cx + d * sc;
      let s = S.line(10, cy, 370, cy, "mu") + S.line(cx, 20, cx, 170, "ac thk") + S.poly([[cx, 16], [cx - 6, 26], [cx + 6, 26]], "ac fa") + S.poly([[cx, 174], [cx - 6, 164], [cx + 6, 164]], "ac fa");
      for (const d of [-f, f, -2 * f, 2 * f]) s += S.dot(px(d), cy, 2.5) + S.text(px(d), cy + 12, (Math.abs(d) === f ? "F" : "2F"), { c: "xs" });
      s += S.arrow(px(-u), cy, px(-u), cy - ho, "am", 8);
      const hi = -mg_ * ho; // image height (screen up positive)
      s += S.arrow(px(v), cy, px(v), cy - hi, v > 0 ? "rd" : "rd dsh", 8);
      // ray 1: parallel then through F
      const yTop = cy - ho;
      s += S.line(px(-u), yTop, cx, yTop, "ln");
      const slope1 = (cy - yTop) / (px(f) - cx);
      s += S.line(cx, yTop, 370, yTop + slope1 * (370 - cx), "ln");
      // ray 2: through centre
      const slope2 = (cy - yTop) / (cx - px(-u));
      s += S.line(px(-u), yTop, 370, yTop + slope2 * (370 - px(-u)), "ln");
      if (v < 0) { s += S.line(cx, yTop, px(v), cy - hi, "mu dsh") + S.line(px(-u), yTop, px(v), cy - hi, "mu dsh"); }
      const cid = "lc" + (X._uid = (X._uid || 0) + 1);
      const solFig = S.svg(380, 190, `<clipPath id="${cid}"><rect x="0" y="0" width="380" height="190"/></clipPath><g clip-path="url(#${cid})">${s}</g>`, "แผนภาพรังสีของเลนส์นูน");
      const sol = `$\\dfrac1f = \\dfrac1u + \\dfrac1v$ → $\\dfrac1{${f}} = \\dfrac1{${n1(u)}} + \\dfrac1v$ → $v = ${n1(v)}$ cm ${v > 0 ? "(บวก = ภาพจริง อยู่หลังเลนส์ หัวกลับ)" : "(ลบ = ภาพเสมือน อยู่ฝั่งเดียวกับวัตถุ หัวตั้ง)"}<br>` +
        `กำลังขยาย $|m| = \\left|\\dfrac{v}{u}\\right| = ${X.num(Math.abs(mg_), 2)}$`;
      return Object.assign({ q: `วางวัตถุไว้หน้าเลนส์นูนซึ่งมีความยาวโฟกัส $${f}$ เซนติเมตร ที่ระยะ $${n1(u)}$ เซนติเมตร ข้อใดบรรยายภาพที่เกิดขึ้นได้ถูกต้อง`, sol, solFig }, o);
    },
  });

  /* 23 ---------- สนามไฟฟ้าเป็นศูนย์ (มีรูป) ---------- */
  add({
    id: "p-efield0", topic: "ไฟฟ้าสถิต", gen(R) {
      const [q1, q2] = R.pick([[1, 4], [4, 1], [1, 9], [9, 1], [4, 9], [9, 4], [1, 16]]);
      const d = R.pick([30, 60, 90, 120]);
      const same = R.chance(0.6);
      let x;
      if (same) x = d * Math.sqrt(q1) / (Math.sqrt(q1) + Math.sqrt(q2));
      else { const s1 = Math.sqrt(q1), s2 = Math.sqrt(q2); x = s1 < s2 ? -d * s1 / (s2 - s1) : d * s1 / (s1 - s2); }
      const xs = v => (v < 0 ? `ห่างจาก A ไปทางซ้าย $${n1(-v)}$ cm` : v > d ? `ห่างจาก B ไปทางขวา $${n1(v - d)}$ cm` : `ระหว่างประจุ ห่างจาก A $${n1(v)}$ cm`);
      const s1 = Math.sqrt(q1), s2 = Math.sqrt(q2);
      const alt = [d * s1 / (s1 + s2), d * s2 / (s1 + s2), s1 < s2 ? -d * s1 / (s2 - s1) : d * s1 / (s1 - s2), d * q1 / (q1 + q2), d + d * s2 / Math.abs(s1 - s2), d / 2];
      const ans = xs(x);
      const o = X.opts(R, ans, alt.map(xs).filter(t => t !== ans));
      const sg2 = same ? "+" : "−", Q = k => (k === 1 ? "" : k) + "q";
      let s = S.line(20, 60, 340, 60, "mu") + S.circle(110, 60, 15, "ln fa") + S.text(110, 61, `+${Q(q1)}`, { c: "xs b" }) + S.circle(250, 60, 15, same ? "ln fa" : "ln fb") + S.text(250, 61, `${sg2}${Q(q2)}`, { c: "xs b" });
      s += S.text(110, 32, "A", { b: true }) + S.text(250, 32, "B", { b: true }) + S.dim(110, 96, 250, 96, `${d} cm`, { off: 0 });
      const fig = S.svg(360, 115, s, "ประจุสองตัวบนเส้นตรง");
      const where = same ? "ระหว่างประจุ (ประจุชนิดเดียวกัน สนามจากสองประจุมีทิศตรงข้ามกันเฉพาะช่วงระหว่างกลาง)" : "นอกช่วงระหว่างประจุ ด้านที่ใกล้ประจุขนาดเล็กกว่า (ประจุต่างชนิด)";
      const sol = `จุดที่สนามเป็นศูนย์อยู่${where}<br>` +
        `$\\dfrac{k(${Q(q1)})}{r_A^2} = \\dfrac{k(${Q(q2)})}{r_B^2}$ → $\\dfrac{r_A}{r_B} = \\sqrt{\\dfrac{${q1}}{${q2}}} = ${F(Math.round(s1), Math.round(s2)).tex()}$<br>` +
        `แก้สมการตามระยะ ได้จุดนั้นอยู่<b>${ans.replace(/\$/g, "")}</b>`;
      return Object.assign({ q: `ประจุไฟฟ้า $+${Q(q1)}$ และ $${sg2 === "+" ? "+" : "-"}${Q(q2)}$ วางอยู่ที่จุด A และ B ซึ่งห่างกัน $${d}$ เซนติเมตร ดังรูป จุดที่สนามไฟฟ้าลัพธ์เป็นศูนย์อยู่ที่ใด (ไม่นับจุดที่อยู่ไกลอนันต์)`, fig, sol }, o);
    },
  });

  /* 24 ---------- อนุภาคประจุในสนามแม่เหล็ก ---------- */
  add({
    id: "p-bfield", topic: "แม่เหล็กไฟฟ้า", gen(R) {
      const mode = R.pick(["v", "K", "p"]);
      const P1 = { name: "โปรตอน", m: 1, q: 1 }, cand = [{ name: "อนุภาคแอลฟา", m: 4, q: 2 }, { name: "ดิวเทอรอน", m: 2, q: 1 }, { name: "ไอออน $\\text{He}^{+}$", m: 4, q: 1 }];
      const P2 = R.pick(cand);
      const r = p => mode === "v" ? p.m / p.q : mode === "K" ? Math.sqrt(p.m) / p.q : 1 / p.q;
      const ratio = r(P2) / r(P1);
      const asF = v => { for (let d = 1; d <= 4; d++) { if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return F(Math.round(v * d), d).tex(); } return v === Math.SQRT2 ? "\\sqrt2" : Math.abs(v - Math.SQRT1_2) < 1e-9 ? "\\frac{1}{\\sqrt2}" : X.num(v, 3); };
      const vals = [1 / 4, 1 / 2, Math.SQRT1_2, 1, Math.SQRT2, 2, 4];
      const ansT = m(asF(ratio));
      const wr = vals.filter(v => Math.abs(v - ratio) > 1e-9).map(v => [v, m(asF(v))]);
      const pickW = R.sample(wr, 4); const items = [[ratio, ansT], ...pickW].sort((a, b) => a[0] - b[0]);
      const mtxt = { v: "อัตราเร็วเท่ากัน", K: "พลังงานจลน์เท่ากัน", p: "โมเมนตัมเท่ากัน" }[mode];
      const why = { v: "$r = \\dfrac{mv}{qB} \\propto \\dfrac{m}{q}$", K: "$p = \\sqrt{2mE_k}$ จึงได้ $r = \\dfrac{\\sqrt{2mE_k}}{qB} \\propto \\dfrac{\\sqrt m}{q}$", p: "$r = \\dfrac{p}{qB} \\propto \\dfrac{1}{q}$" }[mode];
      const sol = `${why}<br>${P2.name}: $m = ${P2.m}m_p$, $q = ${P2.q}e$ ดังนั้น $\\dfrac{r_2}{r_1} = \\boldsymbol{${asF(ratio)}}$`;
      return { q: `โปรตอนและ${P2.name} เคลื่อนที่เข้าไปในบริเวณที่มีสนามแม่เหล็กสม่ำเสมอในทิศตั้งฉากกับสนาม โดยทั้งสองมี<b>${mtxt}</b> อัตราส่วนรัศมีการเคลื่อนที่ของ${P2.name}ต่อรัศมีของโปรตอนเป็นเท่าใด (ให้มวลดิวเทอรอน $\\approx 2m_p$ และมวลแอลฟา $\\approx 4m_p$)`, sol, choices: items.map(i => i[1]), answer: items.findIndex(i => i[1] === ansT) };
    },
  });

  /* 25 ---------- ปรากฏการณ์โฟโตอิเล็กทริก ---------- */
  add({
    id: "p-photo", topic: "ฟิสิกส์อะตอม", gen(R) {
      const [lam, E] = R.pick([[248, 5.0], [310, 4.0], [200, 6.2], [400, 3.1], [496, 2.5], [413, 3.0], [354, 3.5]]);
      const W = R.pick([1.8, 2.0, 2.3, 2.5, 3.0].filter(w => w < E - 0.3));
      const Vs = E - W;
      const o = X.numOpts(Vs, [E, W, E + W, Vs / 2, Vs + 0.5], n1, { posOnly: true, step: 0.3 });
      const sol = `พลังงานโฟตอน $E = \\dfrac{hc}{\\lambda} \\approx \\dfrac{1240\\text{ eV·nm}}{${lam}\\text{ nm}} = ${n1(E)}$ eV<br>` +
        `$E_{k,\\max} = E - W = ${n1(E)} - ${n1(W)} = ${n1(Vs)}$ eV → ศักย์หยุดยั้ง $V_s = \\dfrac{E_{k,\\max}}{e} = \\boldsymbol{${n1(Vs)}}$ โวลต์`;
      return Object.assign({ q: `ฉายแสงความยาวคลื่น $${lam}$ นาโนเมตร ไปยังผิวโลหะที่มีฟังก์ชันงาน $${n1(W)}$ อิเล็กตรอนโวลต์ ศักย์หยุดยั้งของโฟโตอิเล็กตรอนมีค่ากี่โวลต์ (กำหนด $hc \\approx 1240$ อิเล็กตรอนโวลต์·นาโนเมตร)`, sol }, o);
    },
  });

  /* 26 ---------- ครึ่งชีวิต (มีรูป) ---------- */
  add({
    id: "p-halflife", topic: "ฟิสิกส์นิวเคลียร์", gen(R) {
      const T = R.pick([2, 3, 4, 5, 6]), A0 = R.pick([800, 1600, 640, 1200]), k = R.int(3, 5);
      const tq = T * k, ans = A0 / 2 ** k;
      const o = X.numOpts(ans, [A0 / 2 ** (k - 1), A0 / 2 ** (k + 1), A0 / (2 * k), A0 - A0 / 2 ** k], v => X.num(v, 1), { posOnly: true });
      const P = new Plot({ x: [0, 2 * T], y: [0, A0 * 1.1], w: 300, h: 210, frame: true, xs: T / 2, ys: A0 / 8, tx: T / 2, ty: A0 / 4, pad: [10, 12, 42, 52], axisLabels: ["เวลา (วัน)", "กัมมันตภาพ (Bq)"] });
      P.axes().fn(t => A0 * 2 ** (-t / T), "ac thk", 0, 2 * T);
      P.pt(T, A0 / 2).pt(2 * T, A0 / 4);
      P.add(S.dash(P.sx(0), P.sy(A0 / 2), P.sx(T), P.sy(A0 / 2))).add(S.dash(P.sx(T), P.sy(0), P.sx(T), P.sy(A0 / 2)));
      const sol = `จากกราฟ กัมมันตภาพลดจาก $${A0}$ เหลือ $${A0 / 2}$ Bq ใช้เวลา $${T}$ วัน → ครึ่งชีวิต $T_{1/2} = ${T}$ วัน<br>` +
        `เวลา $${tq}$ วัน $= ${k}$ ครึ่งชีวิต → $A = ${A0}\\left(\\tfrac12\\right)^{${k}} = \\boldsymbol{${X.num(ans, 1)}}$ Bq`;
      return Object.assign({ q: `กราฟแสดงกัมมันตภาพของสารกัมมันตรังสีชนิดหนึ่งเทียบกับเวลา`, fig: P.toString(), q2: `เมื่อเวลาผ่านไป $${tq}$ วัน นับจากเวลาเริ่มต้น กัมมันตภาพของสารนี้จะเหลือกี่เบคเคอเรล`, sol }, o);
    },
  });

  /* 27 ---------- โพรเจกไทล์มุมเอียง ---------- */
  add({
    id: "p-proj-a", topic: "การเคลื่อนที่แบบโพรเจกไทล์", gen(R) {
      const th = R.pick([37, 53]), u = R.pick([10, 15, 20, 25, 30]);
      const ux = u * COS[th], uy = u * SIN[th];
      const ask = R.pick(["H", "R", "T"]);
      const H = uy * uy / 20, Rg = 2 * ux * uy / 10, Tt = 2 * uy / 10;
      const ans = ask === "H" ? H : ask === "R" ? Rg : Tt;
      const wr = ask === "H" ? [ux * ux / 20, uy * uy / 10, u * u / 20, H * 2] : ask === "R" ? [ux * uy / 10, Rg * 2, u * u / 10, uy * uy / 10] : [uy / 10, ux * 2 / 10, u / 10 * 2, Tt + 1];
      const o = X.numOpts(ans, wr, n1, { posOnly: true });
      const txt = { H: "ความสูงสูงสุดที่วัตถุขึ้นไปได้มีค่ากี่เมตร", R: "วัตถุตกถึงพื้นระดับเดิมห่างจากจุดยิงกี่เมตร", T: "วัตถุอยู่ในอากาศนานกี่วินาที" }[ask];
      let s = S.ground(15, 345, 150); const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([30 + 290 * t, 150 - 110 * 4 * t * (1 - t)]); }
      s += S.poly(pts, "ac dsh nf", false) + S.arrow(30, 150, 30 + 70 * COS[th], 150 - 70 * SIN[th], "rd", 9) + S.arc(30, 150, 26, 0, th, "am nf") + S.text(70, 140, th + "°", { c: "xs" }) + S.text(30 + 70 * COS[th] + 6, 150 - 70 * SIN[th] - 4, `u = ${u} m/s`, { c: "xs", a: "start" });
      const fig = S.svg(360, 168, s, "การยิงวัตถุทำมุมกับแนวระดับ");
      const sol = `แยกความเร็ว: $u_x = ${u}\\cos${deg(th)} = ${n1(ux)}$ m/s, $u_y = ${u}\\sin${deg(th)} = ${n1(uy)}$ m/s<br>` +
        (ask === "H" ? `ที่จุดสูงสุด $v_y = 0$: $H = \\dfrac{u_y^2}{2g} = \\dfrac{${n1(uy)}^2}{20} = \\boldsymbol{${n1(H)}}$ เมตร`
          : ask === "T" ? `เวลาขึ้น $= \\dfrac{u_y}{g} = ${n1(uy / 10)}$ s เวลาทั้งหมด $= 2\\times${n1(uy / 10)} = \\boldsymbol{${n1(Tt)}}$ วินาที`
            : `เวลาทั้งหมด $t = \\dfrac{2u_y}{g} = ${n1(Tt)}$ s → $R = u_xt = ${n1(ux)}\\times${n1(Tt)} = \\boldsymbol{${n1(Rg)}}$ เมตร`);
      return Object.assign({ q: `ยิงวัตถุจากพื้นราบด้วยอัตราเร็ว $${u}$ เมตรต่อวินาที ในทิศทำมุม $${th}$ องศากับแนวระดับ ดังรูป ${txt} (กำหนด $g = 10$ เมตรต่อวินาที², $\\sin 37^\\circ = 0.6$, $\\cos 37^\\circ = 0.8$)`, fig, sol }, o);
    },
  });

  /* 28 ---------- เครื่องแอดวูด (มีรูป) ---------- */
  add({
    id: "p-atwood", topic: "แรงและกฎการเคลื่อนที่", gen(R) {
      const [m1, m2] = R.pick([[2, 5], [3, 4], [1, 6], [5, 2], [4, 3], [6, 8], [3, 11]]);
      const g = 9.8, a = Math.abs(m2 - m1) * g / (m1 + m2), T = 2 * m1 * m2 * g / (m1 + m2);
      const ask = R.chance(0.5) ? "a" : "T";
      const ans = ask === "a" ? a : T;
      const wr = ask === "a" ? [Math.abs(m2 - m1) * g / Math.max(m1, m2), g, (m1 + m2) * g / Math.abs(m2 - m1) / 10, a / 2] : [Math.max(m1, m2) * g, Math.min(m1, m2) * g, (m1 + m2) * g / 2, T / 2];
      const o = X.numOpts(ans, wr, n1, { posOnly: true });
      let s = S.line(80, 14, 200, 14, "ln thk") + S.line(140, 14, 140, 40) + S.circle(140, 50, 18, "ln fg") + S.dot(140, 50, 2.5);
      const L1 = 60 + m1 * 6, L2 = 60 + m2 * 6;
      s += S.line(122, 50, 122, 50 + L1) + S.line(158, 50, 158, 50 + L2);
      s += S.rect(104, 50 + L1, 36, 30, "ln fa", 3) + S.text(122, 65 + L1, `${m1} kg`, { c: "xs" });
      s += S.rect(140, 50 + L2, 36, 30, "ln fb", 3) + S.text(158, 65 + L2, `${m2} kg`, { c: "xs" });
      const fig = S.svg(280, 90 + Math.max(L1, L2) + 10, s, "เครื่องแอดวูด");
      const sol = `ทั้งระบบ: $a = \\dfrac{(m_\\text{หนัก} - m_\\text{เบา})g}{m_1 + m_2} = \\dfrac{${Math.abs(m2 - m1)}(9.8)}{${m1 + m2}} = ${n1(a)}$ m/s²<br>` +
        `ก้อน $${Math.min(m1, m2)}$ kg: $T - ${Math.min(m1, m2)}g = ${Math.min(m1, m2)}a$ → $T = ${Math.min(m1, m2)}(9.8 + ${n1(a)}) = ${n1(T)}$ N<br>ตอบ $\\boldsymbol{${n1(ans)}}$ ${ask === "a" ? "เมตรต่อวินาที²" : "นิวตัน"}`;
      return Object.assign({ q: `วัตถุมวล $${m1}$ กิโลกรัม และ $${m2}$ กิโลกรัม ผูกติดกับปลายเชือกเบาที่คล้องผ่านรอกลื่นซึ่งไม่มีมวล ดังรูป เมื่อปล่อยให้ระบบเคลื่อนที่ ${ask === "a" ? "ขนาดความเร่งของวัตถุมีค่ากี่เมตรต่อวินาที²" : "แรงตึงเชือกมีค่ากี่นิวตัน"} (กำหนด $g = 9.8$ เมตรต่อวินาที²)`, fig, sol }, o);
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
