/* Speech coach — "say it" check for kanokchan.dev/english
   1. The browser's speech recognition (Chrome / Edge / Safari) turns your voice into the words it heard
      (several guesses, with a confidence).
   2. Each guess is turned into sounds (phonemes) with the CMU Pronouncing Dictionary
      (Carnegie Mellon University, BSD licence — see CMUDICT-LICENSE.txt), and lined up sound-by-sound against
      the dictionary pronunciation of the target word.
   3. The alignment shows which vowel / consonant was swapped, dropped or added, and gives a 0–100 % score.
   It is an estimate: the recognizer only reports real words, so it can't hear sounds between words. */
window.SpeechCoach = (() => {
  "use strict";

  /* ---------- phoneme tables ---------- */
  const PH = "AA AE AH AO AW AY EH ER EY IH IY OW OY UH UW B CH D DH F G HH JH K L M N NG P R S SH T TH V W Y Z ZH".split(" ");
  const CH = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DEC = {}; PH.forEach((p, i) => DEC[CH[i]] = p);
  const VOWELS = new Set(PH.slice(0, 15));
  const IPA = { AA: "ɑ", AE: "æ", AH: "ʌ", AO: "ɔ", AW: "aʊ", AY: "aɪ", EH: "ɛ", ER: "ɝ", EY: "eɪ", IH: "ɪ", IY: "i", OW: "oʊ", OY: "ɔɪ",
    UH: "ʊ", UW: "u", B: "b", CH: "tʃ", D: "d", DH: "ð", F: "f", G: "ɡ", HH: "h", JH: "dʒ", K: "k", L: "l", M: "m", N: "n", NG: "ŋ",
    P: "p", R: "r", S: "s", SH: "ʃ", T: "t", TH: "θ", V: "v", W: "w", Y: "j", Z: "z", ZH: "ʒ" };
  // Thai hints: how to make each sound
  const HINT = {
    AA: "อา อ้าปากกว้าง เช่น hot", AE: "แอ อ้าปากกว้าง ปากแบะ เช่น cat", AH: "อะ สั้น ๆ ปากไม่กว้าง เช่น cup", AH0: "เออะ เบา ๆ ไม่เน้น เช่น about",
    AO: "ออ เช่น thought", AW: "อาว เช่น now", AY: "อาย เช่น my", EH: "เอะ เช่น bed", ER: "เออร์ ม้วนลิ้นนิด ๆ เช่น bird", ER0: "เออร์ เบา ๆ เช่น teacher",
    EY: "เอ-อี (เอย์) เช่น day", IH: "อิ สั้น ๆ เช่น sit", IY: "อี ยาว ฉีกยิ้ม เช่น see", OW: "โอ-อุ (โอว) เช่น go", OY: "ออย เช่น boy",
    UH: "อุ สั้น เช่น book", UW: "อู ยาว ห่อปาก เช่น food",
    B: "บ", CH: "ช มีลม (ทช) เช่น chair", D: "ด", DH: "ด แบบปลายลิ้นแตะฟันบน เสียงก้อง เช่น this", F: "ฟ ฟันบนแตะริมฝีปากล่าง",
    G: "ก แบบก้องในคอ เช่น go", HH: "ฮ", JH: "จ แบบก้อง เช่น job", K: "ค", L: "ล ปลายลิ้นแตะเหงือก", M: "ม", N: "น", NG: "ง",
    P: "พ", R: "ร ม้วนลิ้น ไม่รัว ลิ้นไม่แตะเพดาน", S: "ซ เสียงลมฟู่", SH: "ช ห่อปาก มีลม เช่น she", T: "ท",
    TH: "ธ ลิ้นแตะฟัน มีลมผ่าน เช่น think", V: "ฟ แบบก้อง ฟันบนแตะริมฝีปากล่าง เช่น very", W: "ว ห่อปาก", Y: "ย",
    Z: "ซ แบบก้อง (เสียงผึ้ง) เช่น zoo", ZH: "ฌ แบบก้อง เช่น vision" };

  const decode = s => { const out = []; for (let i = 0; i < s.length; i++) { const p = DEC[s[i]]; const d = /\d/.test(s[i + 1] || "") ? s[++i] : ""; out.push(p + d); } return out; };
  const base = p => p.replace(/\d/, "");
  const isV = p => VOWELS.has(base(p));
  const ipaOf = p => { const b = base(p); if (b === "AH" && p.endsWith("0")) return "ə"; if (b === "ER" && p.endsWith("0")) return "ɚ"; return IPA[b] || b; };
  const hintOf = p => HINT[(base(p) === "AH" || base(p) === "ER") && p.endsWith("0") ? base(p) + "0" : base(p)] || "";

  // slash IPA with ˈ before the stressed syllable (only for words with 2+ syllables)
  const ONSET = new Set("SK ST SP PL PR BL BR TR DR KL KR GL GR FL FR THR SHR SL SM SN SW TW KW DW".split(" "));
  function ipaString(ph) {
    const parts = ph.map(ipaOf), nV = ph.filter(isV).length;
    const si = nV > 1 ? ph.findIndex(p => /1$/.test(p)) : -1;
    if (si >= 0) {
      let j = si - 1; while (j >= 0 && !isV(ph[j])) j--;          // previous vowel (or -1 = start of word)
      let k;
      if (j < 0) k = 0;
      else { const run = si - j - 1; k = run >= 2 && ONSET.has(base(ph[si - 2]) + base(ph[si - 1])) ? si - 2 : run >= 1 ? si - 1 : si; }
      parts.splice(k, 0, "ˈ");
    }
    return "/" + parts.join("") + "/";
  }

  /* ---------- pronunciation dictionary (loaded on first use, ~270 KB) ---------- */
  let DICT = null, dictP = null;
  function loadDict() {
    if (dictP) return dictP;
    dictP = fetch("/assets/english/pron.txt").then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(t => {
      DICT = new Map();
      t.split("\n").forEach(line => { if (!line || line[0] === "#") return; const sp = line.indexOf(" "); DICT.set(line.slice(0, sp), line.slice(sp + 1).split("|").map(decode)); });
      return DICT;
    }).catch(e => { dictP = null; throw e; });
    return dictP;
  }

  /* ---------- numbers the recognizer writes as digits ("1" → "one") ---------- */
  const ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
  const TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
  function numWords(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
    if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWords(n % 100) : "");
    if (n < 1e6) return numWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numWords(n % 1000) : "");
    return String(n);
  }
  const tokens = t => t.toLowerCase().replace(/[’`]/g, "'").replace(/\d+/g, d => " " + numWords(+d) + " ")
    .replace(/[^a-z' ]+/g, " ").split(/\s+/).filter(Boolean);

  /* ---------- alignment ---------- */
  const near = {};
  const pair = (a, b, c) => { near[a + ">" + b] = near[b + ">" + a] = c; };
  [["IH", "IY"], ["UH", "UW"], ["AH", "AA"], ["AE", "EH"], ["AA", "AO"], ["AH", "UH"], ["EH", "EY"], ["OW", "AO"], ["AH", "ER"], ["IH", "EH"], ["AE", "AA"], ["AE", "AH"]].forEach(([a, b]) => pair(a, b, 0.45));
  [["P", "B"], ["T", "D"], ["K", "G"], ["F", "V"], ["S", "Z"], ["SH", "ZH"], ["CH", "JH"], ["TH", "DH"]].forEach(([a, b]) => pair(a, b, 0.4));
  [["L", "R"], ["TH", "T"], ["TH", "S"], ["TH", "F"], ["DH", "D"], ["DH", "Z"], ["V", "W"], ["V", "B"], ["N", "NG"], ["N", "M"], ["SH", "S"], ["CH", "SH"], ["JH", "ZH"], ["Y", "JH"], ["N", "L"]].forEach(([a, b]) => pair(a, b, 0.5));
  function subCost(a, b) {
    const A = base(a), B = base(b);
    if (A === B) return 0;
    if (near[A + ">" + B] != null) return near[A + ">" + B];
    const va = VOWELS.has(A), vb = VOWELS.has(B);
    return va && vb ? 0.7 : !va && !vb ? 0.9 : 1.3;
  }
  // weighted edit distance with the list of steps (match / sub / del = missing sound / ins = extra sound)
  function align(exp, got) {
    const n = exp.length, m = got.length, D = [], B = [];
    for (let i = 0; i <= n; i++) { D.push(new Float64Array(m + 1)); B.push(new Uint8Array(m + 1)); }
    for (let i = 1; i <= n; i++) { D[i][0] = i; B[i][0] = 2; }
    for (let j = 1; j <= m; j++) { D[0][j] = j; B[0][j] = 3; }
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
      const s = D[i - 1][j - 1] + subCost(exp[i - 1], got[j - 1]), d = D[i - 1][j] + 1, ins = D[i][j - 1] + 1;
      if (s <= d && s <= ins) { D[i][j] = s; B[i][j] = 1; } else if (d <= ins) { D[i][j] = d; B[i][j] = 2; } else { D[i][j] = ins; B[i][j] = 3; }
    }
    const steps = []; let i = n, j = m;
    while (i > 0 || j > 0) {
      const b = B[i][j];
      if (b === 1) { steps.push({ t: subCost(exp[i - 1], got[j - 1]) === 0 ? "ok" : "sub", e: exp[i - 1], g: got[j - 1], i: i - 1 }); i--; j--; }
      else if (b === 2) { steps.push({ t: "del", e: exp[i - 1], i: i - 1 }); i--; }
      else { steps.push({ t: "ins", g: got[j - 1], i: i }); j--; }
    }
    steps.reverse();
    return { cost: D[n][m], sim: Math.max(0, 1 - D[n][m] / Math.max(1, n)), steps };
  }
  function letterSim(a, b) {
    const n = a.length, m = b.length, D = Array.from({ length: n + 1 }, (_, i) => [i, ...Array(m).fill(0)]);
    for (let j = 1; j <= m; j++) D[0][j] = j;
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return Math.max(0, 1 - D[n][m] / Math.max(n, m, 1));
  }

  /* ---------- score one recognition result ---------- */
  // expected: array of phone arrays (dictionary variants); alts: [{t: transcript, c: confidence}]
  function evaluate(word, expected, alts) {
    const WEIGHT = [1, 0.93, 0.87, 0.82, 0.78];
    let best = null;
    alts.slice(0, 5).forEach((alt, ai) => {
      const tk = tokens(alt.t); if (!tk.length) return;
      // try the whole phrase and every 1–2 word window (people sometimes say "a cup")
      const windows = [tk];
      for (let i = 0; i < tk.length; i++) { windows.push([tk[i]]); if (tk[i + 1]) windows.push([tk[i], tk[i + 1]]); }
      windows.forEach(win => {
        const text = win.join(" ");
        let cands = [[]], known = true;
        win.forEach(w => {
          const v = DICT && DICT.get(w);
          if (!v) { known = false; return; }
          const next = []; cands.forEach(c => v.slice(0, 2).forEach(p => next.push(c.concat(p)))); cands = next.slice(0, 6);
        });
        let r;
        if (known && expected.length) {
          r = null;
          expected.forEach((ex, ei) => cands.forEach(g => { const a = align(ex, g); if (!r || a.sim > r.sim) { r = a; r.ei = ei; } }));
        } else r = { sim: letterSim(word.toLowerCase(), text), steps: null, ei: 0 };
        const conf = ai === 0 ? (alt.c > 0 ? alt.c : 0.85) : 0.5;
        const exactWord = text === word.toLowerCase();
        const score = (r.sim >= 0.999 || exactWord ? 88 + 12 * conf : r.sim * 86) * WEIGHT[ai];
        const cand = { score, sim: r.sim, steps: r.steps, ei: r.ei, heard: text, alt: ai, conf: alt.c || 0 };
        if (!best || cand.score > best.score + 0.01 || (Math.abs(cand.score - best.score) < 0.01 && text.split(" ").length < best.heard.split(" ").length)) best = cand;
      });
    });
    if (!best) return null;
    // feedback comes from what the recognizer heard first (alt 0), lined up against the target
    let top = null;
    const tk0 = tokens(alts[0].t);
    if (tk0.length && DICT && expected.length) {
      const wins = [tk0]; tk0.forEach(t => wins.push([t]));
      wins.forEach(win => {
        let g = []; let ok = true;
        win.forEach(w => { const v = DICT.get(w); if (!v) ok = false; else g = g.concat(v[0]); });
        if (!ok) return;
        expected.forEach((ex, ei) => { const a = align(ex, g); if (!top || a.sim > top.sim) { top = a; top.ei = ei; top.heard = win.join(" "); } });
      });
    }
    best.feedback = top || (best.steps ? best : null);
    best.score = Math.round(Math.max(0, Math.min(100, best.score)));
    return best;
  }

  /* ---------- feedback text (Thai) ---------- */
  function notes(fb, expPhones) {
    if (!fb || !fb.steps) return [];
    const out = [], last = expPhones.length - 1;
    fb.steps.forEach(s => {
      const kind = p => isV(p) ? "สระ" : "พยัญชนะ";
      if (s.t === "sub") out.push({ cls: "bad", text: `${kind(s.e)} /${ipaOf(s.e)}/ — ระบบได้ยินเป็น /${ipaOf(s.g)}/ ลองออกเสียง /${ipaOf(s.e)}/ ให้เป็น “${hintOf(s.e)}”` });
      else if (s.t === "del") out.push({ cls: "miss", text: `ลืมออกเสียง${kind(s.e)} /${ipaOf(s.e)}/${s.i === last && !isV(s.e) ? " ท้ายคำ — คนไทยมักกลืนเสียงท้าย ลองปล่อยเสียงให้ได้ยินชัด ๆ" : ` (${hintOf(s.e)})`}` });
      else if (s.t === "ins") out.push({ cls: "extra", text: `มีเสียง /${ipaOf(s.g)}/ เกินเข้ามา` });
    });
    return out;
  }

  return { decode, ipaOf, ipaString, isV, hintOf, loadDict, evaluate, notes, tokens };
})();
