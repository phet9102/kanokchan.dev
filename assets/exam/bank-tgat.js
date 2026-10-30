/* TGAT — TGAT1 English, TGAT2 critical & logical thinking, TGAT3 future workforce competencies. */
(function (g) {
  "use strict";
  const X = g.EXAM, { S, F, m } = X;
  const add = (o) => X.add(Object.assign({ subj: "tgat" }, o));
  const A = X.assert;

  /* 1 ---------- อนุกรมตัวเลข ---------- */
  add({
    id: "g-series", topic: "TGAT2 ความสามารถทางตัวเลข", gen(R) {
      const type = R.pick(["d2", "geo", "alt", "fib", "sq", "lin"]);
      let seq = [], rule, nxt;
      if (type === "d2") { let a = R.int(1, 12), d = R.int(1, 5); const k = R.int(1, 3); for (let i = 0; i < 6; i++) { seq.push(a); a += d; d += k; } rule = `ผลต่างระหว่างพจน์ที่ติดกันเพิ่มขึ้นทีละ ${k}`; }
      else if (type === "geo") { let a = R.int(1, 5); const r = R.pick([2, 3, -2]); for (let i = 0; i < 6; i++) { seq.push(a); a *= r; } rule = `คูณด้วย ${r} ทุกพจน์`; }
      else if (type === "alt") { let a = R.int(2, 15), b = R.int(20, 40); const da = R.int(2, 5), db = -R.int(1, 4); for (let i = 0; i < 6; i++) { if (i % 2 === 0) { seq.push(a); a += da; } else { seq.push(b); b += db; } } rule = `เป็นสองลำดับสลับกัน: ตำแหน่งคี่เพิ่มทีละ ${da}, ตำแหน่งคู่ลดทีละ ${-db}`; }
      else if (type === "fib") { let a = R.int(1, 5), b = R.int(2, 7); for (let i = 0; i < 6; i++) { seq.push(a); [a, b] = [b, a + b]; } rule = "แต่ละพจน์เท่ากับผลบวกของสองพจน์ก่อนหน้า"; }
      else if (type === "sq") { const c = R.int(-3, 4), s0 = R.int(1, 4); for (let i = 0; i < 6; i++) seq.push((s0 + i) ** 2 + c); rule = `พจน์ที่ n คือ (กำลังสองของจำนวนนับที่ต่อเนื่องกัน) ${c >= 0 ? "+ " + c : "− " + -c}`; }
      else { let a = R.int(1, 6); const k = R.pick([2, 3]), c = R.pick([-1, 1, 2]); for (let i = 0; i < 6; i++) { seq.push(a); a = a * k + c; } rule = `พจน์ถัดไป = พจน์ก่อนหน้า × ${k} ${c >= 0 ? "+ " + c : "− " + -c}`; }
      nxt = seq[5];
      const shown = seq.slice(0, 5);
      const o = X.numOpts(nxt, [nxt + 1, nxt - 1, nxt + 2, nxt - 2, seq[4] + (seq[4] - seq[3])], v => String(v));
      return Object.assign({ q: `จำนวนถัดไปของอนุกรม <span class="seq inl">${shown.join(", ")}, ?</span> คือข้อใด`, sol: `${rule}<br>ลำดับ: ${seq.slice(0, 5).join(", ")}, <b>${nxt}</b>` }, o);
    },
  });

  /* 2 ---------- รหัสตัวอักษร ---------- */
  add({
    id: "g-code", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const words = ["CAT", "DOG", "BIRD", "FISH", "LION", "BEAR", "COLD", "WARM", "BOOK", "PLAN", "GOLD", "TIME", "STAR", "MOON", "KITE"];
      const [w1, w2] = R.sample(words, 2);
      const type = R.pick(["shift", "alt", "rev"]);
      const k = R.pick([1, 2, 3, -1, -2]);
      const sh = (c, d) => ABC[(ABC.indexOf(c) + d + 26) % 26];
      const enc = w => type === "shift" ? w.split("").map(c => sh(c, k)).join("") : type === "alt" ? w.split("").map((c, i) => sh(c, i % 2 ? -1 : 1)).join("") : w.split("").reverse().map(c => sh(c, k)).join("");
      const ans = enc(w2);
      const wr = [w2.split("").map(c => sh(c, -k)).join(""), w2.split("").map(c => sh(c, k + 1)).join(""), w2.split("").reverse().join(""), ans.split("").reverse().join(""), w2.split("").map((c, i) => sh(c, i % 2 ? 1 : -1)).join(""), w2.split("").map(c => sh(c, k)).join("")];
      const o = X.opts(R, `<b class="mono">${ans}</b>`, wr.filter(x => x !== ans).map(x => `<b class="mono">${x}</b>`));
      const rule = type === "shift" ? `เลื่อนตัวอักษรแต่ละตัว${k > 0 ? "ไปข้างหน้า" : "ถอยหลัง"} ${Math.abs(k)} ตำแหน่ง` : type === "alt" ? "ตัวอักษรตำแหน่งคี่เลื่อนไปข้างหน้า 1 ตำแหน่ง ตำแหน่งคู่ถอยหลัง 1 ตำแหน่ง" : `กลับลำดับตัวอักษร แล้วเลื่อน${k > 0 ? "ไปข้างหน้า" : "ถอยหลัง"} ${Math.abs(k)} ตำแหน่ง`;
      return Object.assign({ q: `ถ้า <b class="mono">${w1}</b> เขียนเป็นรหัสได้ <b class="mono">${enc(w1)}</b> แล้ว <b class="mono">${w2}</b> จะเขียนเป็นรหัสได้ตามข้อใด`, sol: `กฎของรหัส: ${rule}<br>${w2} → <b class="mono">${ans}</b>` }, o);
    },
  });

  /* 3 ---------- ตรรกะ: ข้อสรุป (มีแผนภาพในเฉลย) ---------- */
  const NOUNS = ["นักดนตรี", "นักกีฬา", "คนที่ชอบกาแฟ", "นักเขียน", "วิศวกร", "คนที่ตื่นเช้า", "คนที่ใส่แว่น", "คนที่เลี้ยงแมว", "นักวิ่ง", "คนที่ชอบอ่านหนังสือ", "ช่างภาพ", "คนที่พูดได้สามภาษา"];
  function vennFig(kind, a, b, c) {
    let s = "";
    const T = (x, y, t) => S.text(x, y, t, { c: "xs b" });
    if (kind === "chain") s = S.circle(150, 90, 80, "ln fc") + S.circle(140, 100, 52, "ln fb") + S.circle(130, 110, 26, "ln fa") + T(150, 22, c) + T(140, 58, b) + T(130, 110, a);
    else if (kind === "inNo") s = S.circle(100, 95, 70, "ln fb") + S.circle(90, 105, 32, "ln fa") + S.circle(240, 95, 50, "ln fc") + T(100, 36, b) + T(90, 105, a) + T(240, 95, c);
    else if (kind === "someAll") s = S.circle(190, 95, 75, "ln fc") + S.circle(190, 100, 40, "ln fb") + S.circle(110, 95, 55, "ln fa") + T(220, 40, c) + T(195, 100, b) + T(90, 95, a);
    else if (kind === "notIn") s = S.circle(130, 95, 70, "ln fb") + S.circle(115, 105, 32, "ln fa") + S.circle(225, 95, 55, "ln fc") + T(120, 38, b) + T(115, 105, a) + T(250, 95, c);
    else s = S.circle(90, 95, 55, "ln fa") + S.circle(240, 95, 55, "ln fb") + S.circle(140, 95, 45, "ln fc") + T(70, 95, a) + T(255, 95, b) + T(150, 60, c);
    return S.svg(320, 185, s, "แผนภาพแสดงความสัมพันธ์ของกลุ่ม");
  }
  add({
    id: "g-syllogism", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const [a, b, c] = R.sample(NOUNS, 3);
      const P = R.pick([
        { pr: [`${a}ทุกคนเป็น${b}`, `${b}ทุกคนเป็น${c}`], ok: `${a}ทุกคนเป็น${c}`, bad: [`${c}ทุกคนเป็น${a}`, `${c}บางคนไม่เป็น${b}`, `ไม่มี${a}คนใดเป็น${c}`, `${b}ทุกคนเป็น${a}`, `${c}ทุกคนเป็น${b}`], fig: "chain", why: `วงของ${a}อยู่ในวงของ${b} ซึ่งอยู่ในวงของ${c}อีกที จึงสรุปได้แน่นอนว่า${a}ทุกคนเป็น${c} ส่วนข้อสรุปในทิศกลับ (${c}ทุกคนเป็น…) ไม่จำเป็นต้องจริง` },
        { pr: [`${a}ทุกคนเป็น${b}`, `ไม่มี${b}คนใดเป็น${c}`], ok: `ไม่มี${a}คนใดเป็น${c}`, bad: [`${c}บางคนเป็น${a}`, `${c}ทุกคนเป็น${a}`, `${b}บางคนเป็น${c}`, `${a}บางคนเป็น${c}`, `${c}ทุกคนเป็น${b}`], fig: "inNo", why: `${a}อยู่ภายในวง${b} และวง${b}ไม่ซ้อนกับวง${c}เลย ดังนั้น${a}ไม่มีทางเป็น${c}` },
        { pr: [`${a}บางคนเป็น${b}`, `${b}ทุกคนเป็น${c}`], ok: `${a}บางคนเป็น${c}`, bad: [`${a}ทุกคนเป็น${c}`, `${c}ทุกคนเป็น${a}`, `ไม่มี${a}คนใดเป็น${c}`, `${a}ทุกคนเป็น${b}`, `${c}ทุกคนเป็น${b}`], fig: "someAll", why: `ส่วนของ${a}ที่เป็น${b} อยู่ในวง${c}ด้วย จึงมี${a}อย่างน้อยบางคนเป็น${c} แต่ไม่จำเป็นต้องทุกคน` },
        { pr: [`${a}ทุกคนเป็น${b}`, `${c}บางคนไม่เป็น${b}`], ok: `${c}บางคนไม่เป็น${a}`, bad: [`${c}ทุกคนไม่เป็น${a}`, `${a}บางคนเป็น${c}`, `${b}ทุกคนเป็น${a}`, `${a}บางคนไม่เป็น${b}`, `ไม่มี${a}คนใดเป็น${c}`], fig: "notIn", why: `${c}คนที่ไม่ได้อยู่ในวง${b} ย่อมไม่อยู่ในวง${a} (เพราะ${a}อยู่ในวง${b}ทั้งหมด) จึงสรุปได้ว่า${c}บางคนไม่เป็น${a}` },
        { pr: [`ไม่มี${a}คนใดเป็น${b}`, `${c}บางคนเป็น${a}`], ok: `${c}บางคนไม่เป็น${b}`, bad: [`${c}ทุกคนไม่เป็น${b}`, `${c}บางคนเป็น${b}`, `${a}ทุกคนเป็น${c}`, `ไม่มี${c}คนใดเป็น${b}`, `${b}บางคนเป็น${a}`], fig: "noSome", why: `${c}ที่เป็น${a} ไม่มีทางเป็น${b} จึงมี${c}อย่างน้อยบางคนไม่เป็น${b} (ส่วน${c}คนอื่นอาจเป็น${b}หรือไม่ก็ได้)` },
      ]);
      const o = X.opts(R, P.ok, P.bad);
      return Object.assign({ q: `กำหนดข้อความต่อไปนี้ให้เป็นจริง<br>1) ${P.pr[0]}<br>2) ${P.pr[1]}<br>ข้อสรุปใดต่อไปนี้<b>ถูกต้องแน่นอน</b>`, sol: P.why, solFig: vennFig(P.fig, a, b, c) }, o);
    },
  });

  /* brute-force helpers for ordering puzzles */
  const perms = arr => arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [x, ...p]));
  const PEOPLE = ["เอ", "บี", "ซี", "ดี", "อี", "เอฟ", "จี", "แพร", "ต้น", "ฝน", "มิว", "บอส"];

  /* 4 ---------- เรียงลำดับความสูง ---------- */
  add({
    id: "g-order", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const names = R.sample(PEOPLE, 5);
      const truth = R.shuffle(names); // index 0 = tallest
      const rank = n => truth.indexOf(n);
      const pool = [];
      for (const x of names) for (const y of names) if (x !== y && rank(x) < rank(y)) pool.push({ t: `${x}สูงกว่า${y}`, f: p => p.indexOf(x) < p.indexOf(y) });
      for (const x of names) for (const y of names) if (x !== y && rank(y) - rank(x) === 1) pool.push({ t: `${x}สูงกว่า${y}เป็นลำดับถัดกันพอดี`, f: p => p.indexOf(y) - p.indexOf(x) === 1 });
      pool.push({ t: `${truth[4]}เตี้ยที่สุด`, f: p => p[4] === truth[4] });
      pool.push({ t: `${truth[0]}ไม่ใช่คนที่เตี้ยที่สุด`, f: p => p[4] !== truth[0] });
      const all = perms(names);
      let clues = [], cand = all;
      for (const c of R.shuffle(pool)) { const nc = cand.filter(c.f); if (nc.length < cand.length) { clues.push(c); cand = nc; } if (cand.length === 1) break; }
      A(cand.length === 1 && clues.length <= 6);
      // drop redundant clues
      for (let i = clues.length - 1; i >= 0; i--) { const rest = clues.filter((_, j) => j !== i); if (all.filter(p => rest.every(c => c.f(p))).length === 1) clues = rest; }
      const pos = R.int(1, 3);
      const ask = truth[pos];
      const o = X.fixedOpts(names.slice().sort(), ask);
      const ordTxt = ["สูงที่สุด", "สูงเป็นอันดับ 2", "สูงเป็นอันดับ 3", "สูงเป็นอันดับ 4", "เตี้ยที่สุด"];
      return Object.assign({ q: `เพื่อน 5 คน ได้แก่ ${names.join(" ")} มีความสูงไม่เท่ากัน และทราบข้อมูลดังนี้<br>` + R.shuffle(clues).map((c, i) => `${i + 1}) ${c.t}`).join("<br>") + `<br>ใคร<b>${ordTxt[pos]}</b>`, sol: `ไล่เงื่อนไขทีละข้อจะได้ลำดับเดียวที่เป็นไปได้ (สูง → เตี้ย):<br><b>${truth.join(" > ")}</b><br>ดังนั้นคนที่${ordTxt[pos]} คือ <b>${ask}</b>` }, o);
    },
  });

  /* 5 ---------- การนั่งเรียงแถว ---------- */
  add({
    id: "g-seat", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const names = R.sample(PEOPLE, 5);
      const truth = R.shuffle(names); // seat 0 = leftmost
      const at = n => truth.indexOf(n);
      const pool = [];
      for (const x of names) for (const y of names) if (x < y && Math.abs(at(x) - at(y)) === 1) pool.push({ t: `${x}นั่งติดกับ${y}`, f: p => Math.abs(p.indexOf(x) - p.indexOf(y)) === 1 });
      for (const x of names) for (const y of names) if (x !== y && at(x) < at(y) && Math.abs(at(x) - at(y)) > 1) pool.push({ t: `${x}นั่งอยู่ทางซ้ายของ${y} (ไม่จำเป็นต้องติดกัน)`, f: p => p.indexOf(x) < p.indexOf(y) });
      for (const x of names) if (at(x) === 0 || at(x) === 4) pool.push({ t: `${x}นั่งริมสุด${at(x) === 0 ? "ทางซ้าย" : "ทางขวา"}`, f: p => p.indexOf(x) === at(x) });
      for (const x of names) if (at(x) !== 0 && at(x) !== 4) pool.push({ t: `${x}ไม่ได้นั่งริม`, f: p => p.indexOf(x) !== 0 && p.indexOf(x) !== 4 });
      for (const x of names) for (const y of names) if (x < y && Math.abs(at(x) - at(y)) > 1) pool.push({ t: `${x}และ${y}ไม่ได้นั่งติดกัน`, f: p => Math.abs(p.indexOf(x) - p.indexOf(y)) > 1 });
      const all = perms(names);
      let clues = [], cand = all;
      for (const c of R.shuffle(pool)) { const nc = cand.filter(c.f); if (nc.length < cand.length) { clues.push(c); cand = nc; } if (cand.length === 1) break; }
      A(cand.length === 1);
      for (let i = clues.length - 1; i >= 0; i--) { const rest = clues.filter((_, j) => j !== i); if (all.filter(p => rest.every(c => c.f(p))).length === 1) clues = rest; }
      A(clues.length <= 6);
      const seat = R.pick([1, 2, 3]);
      const o = X.fixedOpts(names.slice().sort(), truth[seat]);
      const seatTxt = ["ที่ 1 (ซ้ายสุด)", "ที่ 2 จากซ้าย", "ตรงกลาง", "ที่ 4 จากซ้าย", "ขวาสุด"];
      let fs = ""; truth.forEach((n, i) => { fs += S.rect(10 + i * 62, 20, 54, 40, i === seat ? "ln fb" : "ln fa", 6) + S.text(37 + i * 62, 40, n, { c: "sm b" }) + S.text(37 + i * 62, 72, String(i + 1), { c: "xs" }); });
      return Object.assign({ q: `${names.join(" ")} นั่งเก้าอี้เรียงเป็นแถวหน้ากระดานหันหน้าไปทางเดียวกัน 5 ตัว คนละ 1 ตัว โดย<br>` + R.shuffle(clues).map((c, i) => `${i + 1}) ${c.t}`).join("<br>") + `<br>ใครนั่งเก้าอี้ตัว<b>${seatTxt[seat]}</b>`, sol: `ทดลองวางตามเงื่อนไขที่บังคับมากที่สุดก่อน (เช่น คนนั่งริม หรือคู่ที่นั่งติดกัน) จะได้การจัดที่นั่งแบบเดียว ดังรูป<br>คำตอบคือ <b>${truth[seat]}</b>`, solFig: S.svg(330, 84, fs, "การจัดที่นั่ง") }, o);
    },
  });

  /* 6 ---------- มุมระหว่างเข็มนาฬิกา ---------- */
  add({
    id: "g-clock", topic: "TGAT2 ความสามารถทางมิติสัมพันธ์", gen(R) {
      const h = R.int(1, 11), mm = R.pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
      let ang = Math.abs(30 * h - 5.5 * mm); if (ang > 180) ang = 360 - ang;
      const o = X.numOpts(ang, [Math.abs(30 * h - 6 * mm) > 180 ? 360 - Math.abs(30 * h - 6 * mm) : Math.abs(30 * h - 6 * mm), 360 - ang, ang + 15, ang - 7.5, ang + 30].filter(v => v >= 0 && v !== ang), v => X.num(v, 1) + "^\\circ", { step: 7.5 });
      const c = 80, r = 62;
      let s = S.circle(c, c, r, "ln fg"); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += S.line(c + 54 * Math.sin(a), c - 54 * Math.cos(a), c + 61 * Math.sin(a), c - 61 * Math.cos(a), "ln") + S.text(c + 44 * Math.sin(a), c - 44 * Math.cos(a), String(i || 12), { c: "xs" }); }
      const ha = (30 * h + 0.5 * mm) * Math.PI / 180, ma = 6 * mm * Math.PI / 180;
      s += S.line(c, c, c + 30 * Math.sin(ha), c - 30 * Math.cos(ha), "ln thk") + S.line(c, c, c + 50 * Math.sin(ma), c - 50 * Math.cos(ma), "ac thk") + S.dot(c, c, 3.5);
      const sol = `เข็มนาทีเดิน $6^\\circ$ ต่อนาที → อยู่ที่ $6(${mm}) = ${6 * mm}^\\circ$<br>เข็มชั่วโมงเดิน $30^\\circ$ ต่อชั่วโมง และ $0.5^\\circ$ ต่อนาที → อยู่ที่ $30(${h}) + 0.5(${mm}) = ${X.num(30 * h + 0.5 * mm, 1)}^\\circ$<br>` +
        `มุมระหว่างเข็ม $= |${X.num(30 * h + 0.5 * mm, 1)} - ${6 * mm}|$ ${Math.abs(30 * h - 5.5 * mm) > 180 ? "และเลือกมุมที่เล็กกว่า (ลบออกจาก 360°)" : ""} $= \\boldsymbol{${X.num(ang, 1)}^\\circ}$`;
      return Object.assign({ q: `เวลา ${h}.${String(mm).padStart(2, "0")} น. มุมที่เล็กกว่าระหว่างเข็มชั่วโมงและเข็มนาทีของนาฬิกาแบบเข็มมีขนาดกี่องศา`, sol, solFig: S.svg(160, 160, s, "หน้าปัดนาฬิกา") }, o);
    },
  });

  /* 7 ---------- ปฏิทิน ---------- */
  add({
    id: "g-calendar", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
      const MON = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const leap = R.chance(0.3), ML = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const m1 = R.int(0, 8), d1 = R.int(1, 20), m2 = R.int(m1 + 1, Math.min(11, m1 + 4)), d2 = R.int(1, ML[m2]);
      const doy = (mm, dd) => ML.slice(0, mm).reduce((s, x) => s + x, 0) + dd;
      const diff = doy(m2, d2) - doy(m1, d1), w1 = R.int(0, 6), w2 = (w1 + diff) % 7;
      const o = X.opts(R, `วัน${DAYS[w2]}`, [1, 2, 3, 4, 5, 6].map(k => `วัน${DAYS[(w2 + k) % 7]}`));
      const sol = `นับจำนวนวันจาก ${d1} ${MON[m1]} ถึง ${d2} ${MON[m2]}: ${MON.slice(m1, m2).map((n, i) => `${n} ${ML[m1 + i]} วัน`).join(", ")} → ห่างกัน $${diff}$ วัน<br>` +
        `$${diff} = 7\\times${Math.floor(diff / 7)} + ${diff % 7}$ จึงเลื่อนจากวัน${DAYS[w1]}ไป $${diff % 7}$ วัน → <b>วัน${DAYS[w2]}</b>`;
      return Object.assign({ q: `ในปีหนึ่งซึ่ง${leap ? "เป็น" : "ไม่เป็น"}ปีอธิกสุรทิน (เดือนกุมภาพันธ์มี ${ML[1]} วัน) ถ้าวันที่ ${d1} ${MON[m1]} ตรงกับวัน${DAYS[w1]} แล้ววันที่ ${d2} ${MON[m2]} ของปีเดียวกันตรงกับวันใด`, sol }, o);
    },
  });

  /* 8 ---------- ส่วนลดซ้อน / กำไร ---------- */
  add({
    id: "g-percent", topic: "TGAT2 ความสามารถทางตัวเลข", gen(R) {
      if (R.chance(0.5)) {
        const P = R.pick([800, 1000, 1200, 1500, 2000, 2400]), a = R.pick([10, 20, 25, 30]), b = R.pick([10, 15, 20]);
        const fin = P * (1 - a / 100) * (1 - b / 100), eq = 100 - fin / P * 100;
        const o = X.numOpts(eq, [a + b, a + b + a * b / 100, a * b / 100, Math.max(a, b)], v => X.num(v, 1) + "\\%");
        const sol = `ราคาหลังลดครั้งแรก $= ${P}\\times${(1 - a / 100).toFixed(2)} = ${X.num(P * (1 - a / 100))}$ บาท หลังลดครั้งที่สอง $= ${X.num(P * (1 - a / 100))}\\times${(1 - b / 100).toFixed(2)} = ${X.num(fin)}$ บาท<br>` +
          `ลดไปทั้งหมด $\\dfrac{${P} - ${X.num(fin)}}{${P}}\\times100 = \\boldsymbol{${X.num(eq, 1)}\\%}$ (ไม่ใช่ $${a + b}\\%$ เพราะส่วนลดที่สองคิดจากราคาที่ลดแล้ว)`;
        return Object.assign({ q: `ร้านค้าติดป้ายราคาสินค้า $${P}$ บาท ลดราคา $${a}\\%$ และสมาชิกได้รับส่วนลดเพิ่มอีก $${b}\\%$ จากราคาที่ลดแล้ว สมาชิกจะได้ส่วนลดรวมเทียบกับราคาป้ายคิดเป็นร้อยละเท่าใด`, sol }, o);
      }
      const cost = R.pick([400, 500, 800, 1000]), up = R.pick([40, 50, 60, 80]), dis = R.pick([10, 20, 25]);
      const tag = cost * (1 + up / 100), sell = tag * (1 - dis / 100), pr = (sell - cost) / cost * 100;
      const o = X.numOpts(pr, [up - dis, (sell - cost) / tag * 100, up, dis], v => X.num(v, 1) + "\\%");
      const sol = `ราคาป้าย $= ${cost}\\times${1 + up / 100} = ${X.num(tag)}$ บาท ขายจริง $= ${X.num(tag)}\\times${1 - dis / 100} = ${X.num(sell)}$ บาท<br>กำไร $= \\dfrac{${X.num(sell)} - ${cost}}{${cost}}\\times100 = \\boldsymbol{${X.num(pr, 1)}\\%}$ ของต้นทุน`;
      return Object.assign({ q: `แม่ค้าซื้อกระเป๋ามาใบละ $${cost}$ บาท ติดราคาป้ายไว้สูงกว่าทุน $${up}\\%$ แล้วลดราคาให้ลูกค้า $${dis}\\%$ จากราคาป้าย แม่ค้าได้กำไรกี่เปอร์เซ็นต์ของต้นทุน`, sol }, o);
    },
  });

  /* cube net folding */
  const NETS = [
    [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]], [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]],
    [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]],
  ];
  function foldNet(cells) {
    const key = (x, y) => x + "," + y, set = new Set(cells.map(([x, y]) => key(x, y)));
    const neg = v => v.map(a => -a);
    const frame = { [key(...cells[0])]: { n: [0, 0, -1], e: [1, 0, 0], s: [0, 1, 0] } };
    const q = [cells[0]];
    while (q.length) {
      const [x, y] = q.shift(), f = frame[key(x, y)];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = key(x + dx, y + dy); if (!set.has(k) || frame[k]) continue;
        let nf;
        if (dx === 1) nf = { n: f.e, e: neg(f.n), s: f.s };
        else if (dx === -1) nf = { n: neg(f.e), e: f.n, s: f.s };
        else if (dy === 1) nf = { n: f.s, e: f.e, s: neg(f.n) };
        else nf = { n: neg(f.s), e: f.e, s: f.n };
        frame[k] = nf; q.push([x + dx, y + dy]);
      }
    }
    return cells.map(([x, y]) => frame[key(x, y)].n.join(","));
  }

  /* 9 ---------- รูปคลี่ลูกบาศก์ (มีรูป) ---------- */
  add({
    id: "g-net", topic: "TGAT2 ความสามารถทางมิติสัมพันธ์", gen(R) {
      let cells = R.pick(NETS).map(c => c.slice());
      const rot = R.int(0, 3), flip = R.chance(0.5);
      for (let i = 0; i < rot; i++) cells = cells.map(([x, y]) => [-y, x]);
      if (flip) cells = cells.map(([x, y]) => [-x, y]);
      const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1]));
      cells = cells.map(([x, y]) => [x - mx, y - my]);
      const normals = foldNet(cells);
      A(new Set(normals).size === 6);
      const labels = R.shuffle(["A", "B", "C", "D", "E", "F"]);
      const i0 = R.int(0, 5);
      const opp = normals.findIndex(n => n === normals[i0].split(",").map(v => String(-Number(v) || 0)).join(","));
      A(opp >= 0);
      const others = labels.filter((_, i) => i !== i0);
      const o = X.fixedOpts(others.slice().sort().map(l => `หน้า ${l}`), `หน้า ${labels[opp]}`);
      const u = 44, W = (Math.max(...cells.map(c => c[0])) + 1) * u + 8, H = (Math.max(...cells.map(c => c[1])) + 1) * u + 8;
      const draw = hl => S.svg(W, H, cells.map(([x, y], i) => S.rect(4 + x * u, 4 + y * u, u, u, i === hl[0] ? "ln fb" : i === hl[1] ? "ln fa" : "ln nf") + S.text(4 + x * u + u / 2, 4 + y * u + u / 2 + 1, labels[i], { b: true })).join(""), "รูปคลี่ของลูกบาศก์");
      const sol = `เมื่อพับรูปคลี่เป็นลูกบาศก์ หน้าที่อยู่ตรงข้ามกันจะ<b>ไม่ติดกันในรูปคลี่</b> เช่น ช่องที่เรียงเป็นแนวตรงจะเว้นกัน 1 ช่อง<br>ลองพับรอบหน้า ${labels[i0]} จะได้ว่าหน้าที่อยู่ตรงข้ามคือ <b>หน้า ${labels[opp]}</b>`;
      return Object.assign({ q: `เมื่อพับรูปคลี่ต่อไปนี้ให้เป็นลูกบาศก์ หน้าใดจะอยู่<b>ตรงข้าม</b>กับหน้า ${labels[i0]}`, fig: draw([-1, -1]), sol, solFig: draw([i0, opp]) }, o);
    },
  });

  /* 10 ---------- การหมุนกับการพลิก (ตัวเลือกเป็นรูป) ---------- */
  const POLY = [[[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2], [3, 1]], [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1]], [[1, 0], [0, 1], [1, 1], [1, 2], [2, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [2, 3]], [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [2, 1]]];
  const norm = c => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
  const keyC = c => norm(c).map(p => p.join(",")).join(";");
  const rotC = c => c.map(([x, y]) => [-y, x]), mirC = c => c.map(([x, y]) => [-x, y]);
  const polySvg = (c, accent) => { c = norm(c); const u = 18, W = 4 * u + 8; return S.svg(W, W, c.map(([x, y]) => S.rect(4 + x * u, 4 + y * u, u, u, accent ? "ln fb" : "ln fa")).join(""), "รูปบล็อก"); };
  add({
    id: "g-rotate", topic: "TGAT2 ความสามารถทางมิติสัมพันธ์", figChoices: true, gen(R) {
      const base = R.pick(POLY);
      const rots = [base]; for (let i = 0; i < 3; i++) rots.push(rotC(rots[i]));
      const mirs = rots.map(mirC);
      const rk = new Set(rots.map(keyC));
      A(!mirs.some(c => rk.has(keyC(c))));
      const k = R.int(1, 3);
      const correct = rots[k];
      const wrong = []; const seen = new Set([keyC(correct)]);
      for (const c of R.shuffle(mirs)) if (!seen.has(keyC(c))) { seen.add(keyC(c)); wrong.push(c); }
      A(wrong.length >= 4);
      const items = R.shuffle([[correct, true], ...wrong.slice(0, 4).map(c => [c, false])]);
      const turn = [0, 90, 180, 270][k];
      return { q: `รูปใดต่อไปนี้ได้จากการ<b>หมุน</b>รูปต้นแบบบนระนาบเท่านั้น (ห้ามพลิกหรือส่องกระจก)`, fig: polySvg(base, true), choices: items.map(([c]) => polySvg(c)), answer: items.findIndex(x => x[1]), sol: `รูปที่ถูกต้องได้จากการหมุนรูปต้นแบบ $${turn}^\\circ$ ตามเข็มนาฬิกา ส่วนตัวเลือกอื่นเป็นภาพสะท้อน (พลิก) ของรูปต้นแบบ ซึ่งหมุนอย่างไรก็ไม่ทับรูปเดิม`, solFig: polySvg(correct, true) };
    },
  });

  /* 11 ---------- ข้อมูลเพียงพอหรือไม่ ---------- */
  add({
    id: "g-suff", topic: "TGAT2 ความสามารถทางเหตุผล", gen(R) {
      const a = R.int(8, 40), b = R.int(5, 40); A(a !== b);
      const S_ = [
        { t: `อายุของ ก และ ข รวมกันเป็น ${a + b} ปี`, f: (x, y) => x + y === a + b },
        { t: `ก อายุมากกว่า ข อยู่ ${a - b} ปี`, f: (x, y) => x - y === a - b, ok: a > b },
        { t: `ข อายุมากกว่า ก อยู่ ${b - a} ปี`, f: (x, y) => y - x === b - a, ok: b > a },
        { t: `อีก ${R.int(2, 9)} ปีข้างหน้า ก จะมีอายุ AGE ปี`, f: null, plus: true },
        { t: `ก อายุมากกว่า ข`, f: (x, y) => x > y, ok: a > b },
        { t: `ข อายุ ${b} ปี`, f: (x, y) => y === b },
        { t: `${a % 2 ? "ก อายุเป็นจำนวนคี่" : "ก อายุเป็นจำนวนคู่"}`, f: (x) => x % 2 === a % 2 },
        { t: `ห้าปีก่อน ก อายุเป็น ${(a - 5) / (b - 5)} เท่าของ ข`, f: (x, y) => (x - 5) === ((a - 5) / (b - 5)) * (y - 5), ok: b > 5 && Number.isInteger((a - 5) / (b - 5)) && (a - 5) / (b - 5) > 1 },
      ].filter(s => s.ok !== false);
      for (const s of S_) if (s.plus) { const k = Number(s.t.match(/อีก (\d+)/)[1]); s.t = s.t.replace("AGE", a + k); s.f = (x) => x + k === a + k; }
      const [s1, s2] = R.sample(S_, 2);
      const dom = []; for (let x = 1; x <= 80; x++) for (let y = 1; y <= 80; y++) dom.push([x, y]);
      const det = f => new Set(dom.filter(([x, y]) => f(x, y)).map(p => p[0])).size === 1;
      const d1 = det(s1.f), d2 = det(s2.f), d12 = det((x, y) => s1.f(x, y) && s2.f(x, y));
      const L = ["ข้อมูล (1) เพียงข้อเดียวเพียงพอ แต่ข้อมูล (2) ไม่เพียงพอ", "ข้อมูล (2) เพียงข้อเดียวเพียงพอ แต่ข้อมูล (1) ไม่เพียงพอ", "ต้องใช้ข้อมูลทั้ง (1) และ (2) ร่วมกันจึงจะเพียงพอ", "ข้อมูล (1) หรือ (2) ข้อใดข้อหนึ่งก็เพียงพอ", "ข้อมูลทั้ง (1) และ (2) รวมกันก็ยังไม่เพียงพอ"];
      const idx = d1 && d2 ? 3 : d1 ? 0 : d2 ? 1 : d12 ? 2 : 4;
      const why = (d, s) => d ? `“${s.t}” หาอายุ ก ได้ค่าเดียว` : `“${s.t}” อย่างเดียวยังมีอายุ ก ได้หลายค่า`;
      const sol = `(1) ${why(d1, s1)}<br>(2) ${why(d2, s2)}<br>${!d1 && !d2 ? (d12 ? "แต่เมื่อใช้ร่วมกัน แก้สมการได้อายุ ก ค่าเดียว" : "ถึงใช้ร่วมกันก็ยังมีหลายค่า") : ""}<br>ตอบ <b>${L[idx]}</b>`;
      return Object.assign({ q: `ต้องการทราบว่า <b>ก อายุกี่ปี</b> (อายุเป็นจำนวนเต็มบวก) โดยมีข้อมูลดังนี้<br>(1) ${s1.t}<br>(2) ${s2.t}<br>ข้อใดถูกต้อง`, sol }, X.fixedOpts(L, L[idx]));
    },
  });

  /* 12 ---------- งานร่วมกัน ---------- */
  add({
    id: "g-work", topic: "TGAT2 ความสามารถทางตัวเลข", gen(R) {
      const [a, b] = R.pick([[6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [4, 12], [12, 6], [15, 10], [8, 24]]);
      const t = a * b / (a + b);
      const ask = R.chance(0.5);
      if (ask) {
        const o = X.numOpts(t, [(a + b) / 2, Math.abs(a - b), a * b / Math.abs(a - b), t + 1], v => X.num(v, 2), { posOnly: true });
        return Object.assign({ q: `ช่างคนที่หนึ่งทาสีบ้านหลังหนึ่งเสร็จใน $${a}$ วัน ช่างคนที่สองทาสีบ้านหลังเดียวกันเสร็จใน $${b}$ วัน ถ้าทั้งสองคนช่วยกันทาสีบ้านหลังนี้ จะเสร็จในกี่วัน`, sol: `ใน 1 วัน ช่างคนแรกทำได้ $\\frac1{${a}}$ ของงาน คนที่สองทำได้ $\\frac1{${b}}$ ของงาน<br>ช่วยกันวันละ $\\frac1{${a}} + \\frac1{${b}} = \\frac{${a + b}}{${a * b}}$ ของงาน → ใช้เวลา $\\frac{${a * b}}{${a + b}} = \\boldsymbol{${X.num(t, 2)}}$ วัน` }, o);
      }
      const d = R.int(1, Math.floor(t) || 1); const left = 1 - d * (1 / a + 1 / b), tb = left * b;
      A(left > 0);
      const o = X.numOpts(tb, [left * a, b - d, tb + 1, t], v => X.num(v, 2), { posOnly: true });
      return Object.assign({ q: `ช่างคนที่หนึ่งทำงานชิ้นหนึ่งเสร็จใน $${a}$ วัน ช่างคนที่สองทำเสร็จใน $${b}$ วัน ทั้งสองช่วยกันทำได้ $${d}$ วัน แล้วช่างคนที่หนึ่งลาออก ช่างคนที่สองต้องทำต่ออีกกี่วันงานจึงจะเสร็จ`, sol: `ช่วยกัน $${d}$ วัน ทำได้ $${d}\\left(\\frac1{${a}} + \\frac1{${b}}\\right) = ${F(d * (a + b), a * b).tex()}$ ของงาน เหลือ $${F(a * b - d * (a + b), a * b).tex()}$<br>ช่างคนที่สองทำวันละ $\\frac1{${b}}$ → ต้องใช้อีก $${F(a * b - d * (a + b), a * b).tex()}\\times${b} = \\boldsymbol{${X.num(tb, 2)}}$ วัน` }, o);
    },
  });

  /* 13 ---------- TGAT1 English (authored pool) ---------- */
  const ENG = [
    ["Situation: At a café.<br>A: Could I get a latte, please?<br>B: Sure. ________?<br>A: Medium, thanks.", "What size would you like", ["How much is it", "Where are you from", "Is it too hot", "What time is it"], "B ต้องถามขนาดแก้ว เพราะ A ตอบว่า Medium"],
    ["Situation: On the phone.<br>A: Hello, may I speak to Ms. Lee?<br>B: I'm afraid she's in a meeting. ________?<br>A: Yes, please tell her Tom called.", "Would you like to leave a message", ["Can you hear me now", "Who are you looking at", "Did she call you yesterday", "Shall I hang up"], "A ตอบว่า 'please tell her Tom called' แสดงว่า B เสนอรับฝากข้อความ"],
    ["The museum was so ________ that we had to wait almost an hour to get in.", "crowded", ["empty", "quiet", "expensive", "modern"], "ต้องรอเข้านานเพราะคนแน่น (crowded)"],
    ["She has been working here ________ 2020.", "since", ["for", "during", "from", "at"], "ใช้ since กับจุดเริ่มต้นของเวลา ใน present perfect continuous"],
    ["If I ________ more time, I would learn to play the guitar.", "had", ["have", "will have", "would have", "am having"], "Conditional type 2 (สมมติไม่จริงในปัจจุบัน): If + past simple, would + V1"],
    ["The new policy aims to ________ plastic waste by 50% within five years.", "reduce", ["increase", "produce", "collect", "replace"], "นโยบายลดขยะพลาสติก — reduce = ทำให้ลดลง"],
    ["A: I'm sorry I'm late. The traffic was terrible.<br>B: ________. We haven't started yet.", "Don't worry about it", ["That's a great idea", "I'm afraid not", "Congratulations", "Same to you"], "B ปลอบว่าไม่เป็นไร เพราะยังไม่ได้เริ่ม"],
    ["Neither the students nor the teacher ________ aware of the schedule change.", "was", ["were", "are", "have been", "being"], "Neither…nor… กริยาผันตามประธานตัวใกล้ (the teacher = เอกพจน์) → was"],
    ["Despite ________ hard, he failed the driving test.", "practising", ["practise", "he practised", "to practise", "practised"], "Despite ตามด้วยคำนามหรือ V-ing"],
    ["Read the notice: 'All visitors must sign in at the front desk.'<br>What does the notice mean?", "Visitors have to write their names at the reception before entering.", ["Visitors can enter without telling anyone.", "Only staff may use the front desk.", "Visitors must buy a ticket online.", "The front desk is closed today."], "sign in = ลงชื่อ, must = ต้อง"],
    ["The scientist's findings were ________ by several independent studies, so most experts now accept them.", "confirmed", ["ignored", "rejected", "hidden", "questioned"], "ผู้เชี่ยวชาญยอมรับ เพราะงานวิจัยอื่นยืนยัน (confirmed)"],
    ["A: Do you mind if I open the window?<br>B: ________ It's quite warm in here.", "Not at all, go ahead.", ["Yes, I do. Please do.", "No, you can't.", "I don't think so.", "Never mind."], "Do you mind…? ตอบอนุญาตด้วย Not at all / No, go ahead"],
    ["By the time we arrived at the station, the train ________.", "had already left", ["has already left", "already leaves", "was leaving already", "will have left"], "เหตุการณ์เกิดก่อนอีกเหตุการณ์ในอดีต → past perfect"],
    ["Which word is closest in meaning to 'reluctant' in: 'He was reluctant to share his password with anyone.'", "unwilling", ["excited", "careful", "ready", "proud"], "reluctant = ไม่เต็มใจ = unwilling"],
    ["The report, ________ was published last week, shows a rise in online shopping.", "which", ["who", "what", "where", "whom"], "relative pronoun ที่แทนสิ่งของใน non-defining clause → which"],
    ["Read: 'Tickets are non-refundable but can be exchanged for another date up to 24 hours before the show.'<br>Which statement is TRUE?", "You can change your ticket to a different date if you do it at least a day before.", ["You can get your money back at any time.", "Tickets cannot be changed at all.", "You can exchange tickets on the day of the show.", "Tickets are free for the next show."], "non-refundable = ไม่คืนเงิน แต่ exchange ได้ก่อน 24 ชม."],
    ["A: How long does it take to get to the airport from here?<br>B: ________", "About forty minutes by taxi.", ["It's very far away from me.", "I went there last week.", "Every ten minutes.", "Gate 12, I think."], "How long … take → ตอบเป็นระยะเวลา"],
    ["We need to ________ a decision by Friday, or we will lose the deal.", "make", ["do", "take part", "give up", "get on"], "collocation: make a decision"],
  ];
  add({
    id: "g-eng", topic: "TGAT1 การสื่อสารภาษาอังกฤษ", gen(R) {
      const [stem, ans, wr, why] = R.pick(ENG);
      const o = X.opts(R, ans, wr);
      return Object.assign({ q: `<div class="en">${stem}</div>${stem.includes("________") ? "เลือกคำ/ข้อความที่เหมาะสมที่สุดเติมในช่องว่าง" : ""}`, sol: `<span class="en"><b>${ans}</b></span> — ${why}` }, o);
    },
  });

  /* 14 ---------- TGAT3 สมรรถนะการทำงาน (authored pool) ---------- */
  const SJT = [
    ["คุณเป็นหัวหน้ากลุ่มทำโครงงาน สมาชิกคนหนึ่งส่งงานช้าหลายครั้งจนกระทบกำหนดส่งของทั้งกลุ่ม คุณควรทำอย่างไร", "คุยกับสมาชิกคนนั้นเป็นการส่วนตัวเพื่อถามสาเหตุ แล้วตกลงแบ่งงานและกำหนดเวลาที่ทำได้จริงร่วมกัน", ["ทำงานส่วนของเขาเองทั้งหมดเพื่อให้ทันกำหนด", "แจ้งครูให้ตัดคะแนนสมาชิกคนนั้นทันที", "ตำหนิเขาต่อหน้าสมาชิกคนอื่นเพื่อให้เป็นตัวอย่าง", "ปล่อยไว้ เพราะไม่อยากให้เสียความสัมพันธ์"], "การสื่อสารตรงไปตรงมาแบบให้เกียรติ หาต้นเหตุ และวางแผนร่วมกัน แก้ปัญหาได้ยั่งยืนทั้งงานและความสัมพันธ์"],
    ["คุณพบว่าข้อมูลในรายงานที่ส่งหัวหน้าไปแล้วมีตัวเลขผิดพลาดจุดหนึ่ง ซึ่งยังไม่มีใครสังเกต คุณควรทำอย่างไร", "แจ้งหัวหน้าทันทีพร้อมส่งฉบับแก้ไข และอธิบายสั้น ๆ ว่าผิดตรงไหน", ["รอดูว่าจะมีใครสังเกตหรือไม่ก่อน", "แก้ไฟล์ในเครื่องตัวเองแต่ไม่ต้องแจ้งใคร", "โทษว่าเป็นความผิดของข้อมูลจากฝ่ายอื่น", "ส่งรายงานฉบับใหม่ไปโดยไม่บอกว่ามีการแก้ไข"], "ความซื่อสัตย์และความรับผิดชอบต่อความถูกต้องของงาน เป็นหัวใจของการทำงานอย่างมืออาชีพ"],
    ["เพื่อนร่วมทีมเสนอแนวคิดที่คุณเห็นว่ามีจุดอ่อน ระหว่างการประชุม คุณควรทำอย่างไร", "ชื่นชมส่วนที่ดี แล้วตั้งคำถามหรือเสนอข้อมูลเพิ่มเติมเกี่ยวกับจุดอ่อนอย่างสุภาพ", ["เงียบไว้เพื่อไม่ให้เพื่อนเสียหน้า", "บอกตรง ๆ ว่าแนวคิดนี้ใช้ไม่ได้", "ไปเล่าให้เพื่อนคนอื่นฟังหลังประชุม", "เสนอแนวคิดของตัวเองแทนโดยไม่พูดถึงของเพื่อน"], "การให้ความเห็นเชิงสร้างสรรค์ช่วยให้ทีมได้ทางเลือกที่ดีที่สุด โดยรักษาบรรยากาศการทำงานร่วมกัน"],
    ["ในวันที่ต้องส่งงานสามชิ้นพร้อมกัน แต่คุณมีเวลาไม่พอทำให้ดีทั้งหมด คุณควรทำอย่างไร", "จัดลำดับความสำคัญตามผลกระทบและกำหนดส่ง แล้วแจ้งผู้เกี่ยวข้องล่วงหน้าหากงานใดต้องขอเลื่อน", ["ทำงานที่ง่ายที่สุดก่อนเสมอ", "ทำทุกชิ้นพร้อมกันแบบลวก ๆ ให้เสร็จ", "เลือกไม่ส่งงานที่ไม่ชอบ", "รอจนใกล้หมดเวลาแล้วค่อยตัดสินใจ"], "การบริหารเวลาที่ดีคือจัดลำดับความสำคัญและสื่อสารล่วงหน้า"],
    ["คุณได้รับมอบหมายให้ใช้โปรแกรมใหม่ที่ไม่เคยใช้มาก่อน และต้องใช้ในสัปดาห์หน้า คุณควรทำอย่างไร", "ศึกษาคู่มือหรือคลิปสอน ทดลองใช้กับงานตัวอย่าง และถามผู้ที่เคยใช้เมื่อติดปัญหา", ["ปฏิเสธงานเพราะไม่ถนัด", "รอให้มีคนมาสอนก่อนค่อยเริ่ม", "ใช้วิธีเดิมที่คุ้นเคยแทนโดยไม่บอกใคร", "ขอให้เพื่อนทำแทน"], "การเรียนรู้ด้วยตนเองและปรับตัวต่อเทคโนโลยีใหม่ เป็นสมรรถนะสำคัญของคนทำงานยุคใหม่"],
    ["ลูกค้าโทรมาต่อว่าด้วยอารมณ์รุนแรงเรื่องสินค้ามีปัญหา ซึ่งไม่ใช่ความผิดของคุณโดยตรง คุณควรทำอย่างไร", "รับฟังอย่างใจเย็น ขอโทษในความไม่สะดวก สรุปปัญหา และบอกขั้นตอนแก้ไขที่ชัดเจน", ["อธิบายว่าไม่ใช่ความผิดของคุณแล้ววางสาย", "ต่อว่ากลับเพราะลูกค้าไม่สุภาพ", "โอนสายไปแผนกอื่นทันทีโดยไม่ฟัง", "สัญญาว่าจะคืนเงินเต็มจำนวนทั้งที่ไม่มีอำนาจอนุมัติ"], "การจัดการอารมณ์และมุ่งแก้ปัญหาให้ผู้รับบริการ โดยไม่ให้สัญญาเกินอำนาจ"],
    ["คุณเห็นเพื่อนร่วมงานคัดลอกข้อมูลส่วนตัวของลูกค้าลงแฟลชไดรฟ์ส่วนตัว ซึ่งขัดกับนโยบายบริษัท คุณควรทำอย่างไร", "เตือนเพื่อนถึงนโยบายและความเสี่ยง และหากยังไม่แก้ไข ให้แจ้งผู้รับผิดชอบตามช่องทางของบริษัท", ["ทำเป็นไม่เห็นเพราะไม่ใช่เรื่องของตัวเอง", "โพสต์เรื่องนี้ลงโซเชียลมีเดีย", "ขอสำเนาข้อมูลไว้ด้วยเผื่อได้ใช้", "เผชิญหน้ากล่าวหาเพื่อนต่อหน้าทุกคน"], "การปกป้องข้อมูลส่วนบุคคลและจริยธรรมในการทำงาน ควรจัดการอย่างเหมาะสมตามขั้นตอน"],
    ["ทีมของคุณมีสมาชิกจากหลายวัฒนธรรม และเกิดความเข้าใจผิดเรื่องวิธีการสื่อสาร คุณควรทำอย่างไร", "ชวนทีมตกลงแนวทางการสื่อสารร่วมกัน เช่น ช่องทาง เวลาตอบกลับ และสรุปเป็นลายลักษณ์อักษร", ["ให้ทุกคนทำตามวิธีของคุณเพราะคุณเป็นคนส่วนใหญ่", "หลีกเลี่ยงการทำงานกับคนต่างวัฒนธรรม", "ปล่อยให้แต่ละคนสื่อสารตามสะดวก", "รายงานหัวหน้าว่าสมาชิกบางคนมีปัญหา"], "การเคารพความหลากหลายและสร้างข้อตกลงร่วม ลดความขัดแย้งในทีม"],
  ];
  add({
    id: "g-sjt", topic: "TGAT3 สมรรถนะการทำงาน", gen(R) {
      const [stem, ans, wr, why] = R.pick(SJT);
      const o = X.opts(R, ans, wr);
      return Object.assign({ q: stem + ` <span class="muted">(เลือกข้อที่เหมาะสมที่สุด)</span>`, sol: `<b>${ans}</b><br>${why}<br><span class="muted">หมายเหตุ: ข้อสอบจริงของ TGAT3 ให้คะแนนลดหลั่นตามความเหมาะสมของแต่ละตัวเลือก</span>` }, o);
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
