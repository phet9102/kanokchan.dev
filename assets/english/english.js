/* English cards — kanokchan.dev/english
   Random 3D word cards from the 5,000 most common words in spoken American English
   (Frequency List by Fabien Snauwaert & Guillaume Voisin, CC BY-NC-ND 4.0 — data kept unchanged in words.json:
   [lemma, part of speech, frequency, inflections]; the array order is the frequency rank).
   Progress is saved in this browser (localStorage "kc-eng"). */
(() => {
  "use strict";

  /* ---------- low-spec detection (same switches as the home page) ---------- */
  const root = document.documentElement;
  try {
    const f = localStorage.getItem("kc-lite"), g = JSON.parse(localStorage.getItem("kc-gpu") || "{}"), n = navigator;
    if (f ? f === "1" : (g.soft || (n.deviceMemory || 8) <= 4 || (n.hardwareConcurrency || 8) <= 4)) root.classList.add("lite");
  } catch (e) {}
  const LITE = () => root.classList.contains("lite");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;

  /* ---------- constants ---------- */
  const CORPUS = 6192659;                                    // words in the source corpus
  const LIMITS = [100, 250, 500, 1000, 1500, 2000, 3000, 5000];
  const POS = { n: ["คำนาม", "noun"], v: ["คำกริยา", "verb"], j: ["คำคุณศัพท์", "adjective"], r: ["คำกริยาวิเศษณ์", "adverb"],
    fw: ["คำไวยากรณ์", "function word"], u: ["คำอุทาน", "interjection"], m: ["ตัวเลข", "numeral"], K: ["ชื่อเฉพาะ", "proper noun"], abbr: ["คำย่อ", "abbreviation"] };
  const FILTERS = [["all", "ทั้งหมด"], ["n", "คำนาม"], ["v", "คำกริยา"], ["j", "คุณศัพท์"], ["r", "กริยาวิเศษณ์"], ["fw", "คำไวยากรณ์"], ["etc", "อื่น ๆ"]];
  const ETC = new Set(["u", "m", "K", "abbr"]);
  const TIERS = [[500, "แกนหลัก", 4, "t1"], [1500, "ใช้ทุกวัน", 3, "t2"], [3000, "ใช้บ่อย", 2, "t3"], [Infinity, "เพิ่มคลัง", 1, "t4"]];
  const ICON_MIC = '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  const ICON_SPEAK = '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';

  /* ---------- state ---------- */
  const $ = s => document.querySelector(s);
  const deck = $("#deck"), hint = $("#hint");
  let WORDS = [], LPRON = [], EXAMPLES = {};
  const S = { known: {}, learning: {}, pron: {}, mode: "see", limit: 3, pos: "all", hideKnown: true };
  try { Object.assign(S, JSON.parse(localStorage.getItem("kc-eng") || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem("kc-eng", JSON.stringify(S)); } catch (e) {} };

  let pool = [], poolAll = [], card = null, current = 0, recent = [], history = [], interacted = false, busy = false;

  /* ---------- helpers ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tierOf = rank => TIERS.find(t => rank <= t[0]);
  const fmt = n => n.toLocaleString("th-TH");
  const posOk = p => S.pos === "all" || (S.pos === "etc" ? ETC.has(p) : p === S.pos);

  function rebuildPool() {
    const lim = LIMITS[S.limit];
    poolAll = []; pool = [];
    for (let r = 1; r <= Math.min(lim, WORDS.length); r++) {
      if (!posOk(WORDS[r - 1][1])) continue;
      poolAll.push(r);
      if (S.mode === "review") { if (S.learning[r]) pool.push(r); }
      else if (!(S.hideKnown && S.known[r])) pool.push(r);
    }
    updateScore();
  }

  function updateScore() {
    const k = poolAll.reduce((a, r) => a + (S.known[r] ? 1 : 0), 0);
    $("#known-n").textContent = fmt(k);
    $("#pool-n").textContent = fmt(poolAll.length);
    $("#ring-fill").style.strokeDashoffset = String(97.4 * (1 - (poolAll.length ? k / poolAll.length : 0)));
    const ln = Object.keys(S.learning).length;
    $("#learn-n").textContent = ln ? fmt(ln) : "";
  }

  // random pick: avoid recent cards; in "see" mode words you're still learning come back ~30% of the time
  function pick() {
    if (!pool.length) return 0;
    const fresh = pool.filter(r => !recent.includes(r));
    const from = fresh.length ? fresh : pool;
    if (S.mode === "see") {
      const learn = from.filter(r => S.learning[r]);
      if (learn.length && Math.random() < 0.3) return learn[Math.floor(Math.random() * learn.length)];
    }
    return from[Math.floor(Math.random() * from.length)];
  }

  /* ---------- speech ---------- */
  const SPEECH = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voice = null;
  function chooseVoice() {
    if (!SPEECH) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => v.lang === "en-US" && /natural|google|samantha|aria|jenny/i.test(v.name)) || vs.find(v => v.lang === "en-US") || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  if (SPEECH) { chooseVoice(); speechSynthesis.addEventListener?.("voiceschanged", chooseVoice); }
  function speak(text, rate) {
    if (!SPEECH) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = rate || 0.9; if (voice) u.voice = voice;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------- card ---------- */
  function wordSize(w) {
    const L = w.length, base = deck.clientWidth / 330;
    const px = L <= 3 ? 84 : L <= 5 ? 70 : L <= 7 ? 58 : L <= 9 ? 48 : L <= 12 ? 38 : 30;
    return Math.round(px * base) + "px";
  }

  function makeCard(rank) {
    const [w, p, f, infl] = WORDS[rank - 1];
    const [lim, tierName, pips, tcls] = tierOf(rank);
    const pm = f / CORPUS * 1e6, every = Math.round(CORPUS / f);
    const meter = Math.max(4, Math.min(100, (Math.log(f) - Math.log(30)) / (Math.log(WORDS[0][2]) - Math.log(30)) * 100));
    const posTh = (POS[p] || [p, p])[0], posEn = (POS[p] || [p, p])[1];
    const forms = infl.split(/,\s*/).filter(Boolean);
    const q = encodeURIComponent(w);
    const listen = S.mode === "listen";
    const status = [S.known[rank] ? "รู้แล้ว" : S.learning[rank] ? `กำลังฝึก · พลาด ${S.learning[rank]} ครั้ง` : "",
      S.pron && S.pron[rank] != null ? `ออกเสียงได้ ${S.pron[rank]}%` : ""].filter(Boolean).join(" · ");
    const ipa = ipaOfRank(rank);
    const ex = EXAMPLES[rank];

    const el = document.createElement("article");
    el.className = "card " + tcls + (REDUCED ? "" : " enter");
    el.tabIndex = 0;
    el.setAttribute("aria-label", listen ? `การ์ดฟังแล้วสะกด อันดับ ${rank}` : `${w}, ${posTh}, อันดับ ${rank}. กดเพื่อพลิก`);
    const pipHtml = [1, 2, 3, 4].map(i => `<i class="${i <= pips ? "" : "off"}"></i>`).join("");
    const front = listen ? `
        <div class="f-top"><span class="rank">#${rank}</span><span class="tier"><span class="pips">${pipHtml}</span>${tierName}</span></div>
        <div class="listen">
          <button type="button" class="speak-big" data-speak aria-label="ฟังคำศัพท์">${ICON_SPEAK}</button>
          <form class="spell" data-spell autocomplete="off">
            <input type="text" size="1" inputmode="latin" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="พิมพ์คำที่ได้ยิน" aria-label="พิมพ์คำที่ได้ยิน">
            <button type="submit">ตรวจ</button>
          </form>
          <p class="msg" data-msg>${SPEECH ? "กดลำโพงเพื่อฟังอีกครั้ง" : "เบราว์เซอร์นี้ไม่มีเสียงอ่าน"}</p>
        </div>
        <div class="f-bottom"><div class="pos"><span>${posTh}</span><em>${posEn}</em></div></div>`
      : `
        <div class="f-top"><span class="rank">#${rank}<small>/ 5,000</small></span><span class="tier"><span class="pips">${pipHtml}</span>${tierName}</span></div>
        <div class="word">${esc(w)}</div>
        <div class="f-bottom">
          <div class="pos"><span>${posTh}</span><em>${posEn}</em></div>
          <div class="meter"><span>ได้ยินราว 1 ครั้งในทุก ${fmt(every)} คำที่พูด</span><span class="bar"><i></i></span></div>
          <div class="tap">${status || "แตะเพื่อพลิก"}</div>
        </div>`;
    el.innerHTML = `
      <span class="stamp s-yes" aria-hidden="true">รู้แล้ว</span><span class="stamp s-no" aria-hidden="true">ยังต้องฝึก</span>
      <div class="tilt"><div class="spin">
        <div class="face front"><div class="foil"></div><div class="glare"></div>${front}</div>
        <div class="face back"><div class="foil"></div><div class="glare"></div>
          <div class="b-head"><div class="b-word">${esc(w)}</div>
            <div class="b-btns">${SPEECH ? `<button type="button" class="speak" data-speak aria-label="ฟังเสียง ${esc(w)}" title="ฟังเสียง">${ICON_SPEAK}</button>` : ""}
            ${COACH_OK ? `<button type="button" class="speak mic" data-coach aria-label="ฝึกออกเสียง ${esc(w)}" title="ฝึกออกเสียง">${ICON_MIC}</button>` : ""}</div></div>
          <div class="b-pos">${ipa ? `<span class="ipa">${ipa}</span> · ` : ""}${posTh} · <em>${posEn}</em></div>
          <div class="b-body">
            <div class="ex" data-ex>${ex ? exampleHtml(w, infl, ex[0], ex[1]) : `<p class="ex-wait">${EXAMPLES_READY ? "กำลังหาประโยคตัวอย่าง…" : "กำลังโหลดประโยคตัวอย่าง…"}</p>`}</div>
            <div><h3>รูปที่เจอได้ในประโยค</h3><div class="forms">${(forms.length > 1 ? forms : [w]).map(x => `<span>${esc(x)}</span>`).join("")}</div></div>
          </div>
          <div class="b-links">
            <a class="main" href="https://dict.longdo.com/search/${q}" target="_blank" rel="noopener">ดูความหมายภาษาไทย</a>
            <a href="https://dictionary.cambridge.org/dictionary/english/${q}" target="_blank" rel="noopener">พจนานุกรม</a>
            <a href="https://youglish.com/pronounce/${q}/english/us" target="_blank" rel="noopener">ฟังจากคลิปจริง</a>
          </div>
        </div>
      </div></div>`;
    el.addEventListener("animationend", e => { if (e.animationName === "deal") el.classList.remove("enter"); });
    const wEl = el.querySelector(".word"); if (wEl) wEl.style.setProperty("--fs", wordSize(w));
    const bar = el.querySelector(".meter .bar i"); if (bar) bar.style.setProperty("--w", meter.toFixed(1) + "%");
    wire(el, rank);
    if (!ex) fillExample(el, rank);
    return el;
  }

  /* ---------- example sentences ----------
     Ranks 1–1000: our own sentences with Thai translation (examples.tsv).
     Others: example sentences from the free Dictionary API (dictionaryapi.dev, English only) + a Google Translate link. */
  let EXAMPLES_READY = false;
  const apiCache = {};
  function highlight(sentence, w, infl) {
    const forms = [w, ...infl.split(/,\s*/)].filter(Boolean).sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`\\b(${forms.join("|")})\\b`, "i");
    return esc(sentence).replace(re, "<mark>$1</mark>");
  }
  function exampleHtml(w, infl, en, th, more) {
    const tr = `https://translate.google.com/?sl=en&tl=th&op=translate&text=${encodeURIComponent(en)}`;
    return `<h3>ประโยคตัวอย่าง</h3>
      <p class="ex-en">${highlight(en, w, infl)}${SPEECH ? ` <button type="button" class="ex-say" data-say="${esc(en)}" aria-label="ฟังประโยค" title="ฟังประโยค">${ICON_SPEAK}</button>` : ""}</p>
      ${th ? `<p class="ex-th">${esc(th)}</p>` : `<p class="ex-th"><a href="${tr}" target="_blank" rel="noopener">แปลประโยคนี้เป็นไทย</a></p>`}
      ${more ? `<button type="button" class="ex-more" data-more>ประโยคอื่น ↻</button>` : ""}`;
  }
  async function apiExamples(w, infl) {
    if (apiCache[w]) return apiCache[w];
    const r = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w.toLowerCase()));
    if (!r.ok) return (apiCache[w] = []);
    const data = await r.json(), out = [];
    const forms = [w, ...infl.split(/,\s*/)].map(x => x.toLowerCase());
    (Array.isArray(data) ? data : []).forEach(e => (e.meanings || []).forEach(m => (m.definitions || []).forEach(d => {
      const x = (d.example || "").trim();
      if (x && x.length < 140 && forms.some(f => x.toLowerCase().includes(f)) && !out.includes(x)) out.push(x[0].toUpperCase() + x.slice(1));
    })));
    return (apiCache[w] = out);
  }
  async function fillExample(el, rank, step) {
    const box = el.querySelector("[data-ex]"); if (!box) return;
    if (!EXAMPLES_READY) return;                 // examples.tsv still loading — deal() refreshes the card's example later
    const [w, , , infl] = WORDS[rank - 1];
    let list = [];
    try { list = await apiExamples(w, infl); } catch (e) { list = null; }
    if (!box.isConnected) return;
    if (!list || !list.length) {
      box.innerHTML = `<h3>ประโยคตัวอย่าง</h3><p class="ex-th">${list ? "ยังไม่มีประโยคตัวอย่างของคำนี้" : "โหลดประโยคตัวอย่างไม่ได้ (ต้องต่ออินเทอร์เน็ต)"} — ดูเพิ่มได้ที่ <a href="https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(w)}" target="_blank" rel="noopener">Cambridge</a></p>`;
      return;
    }
    const i = ((box._i || 0) + (step || 0)) % list.length; box._i = i;
    box.innerHTML = exampleHtml(w, infl, list[i], "", list.length > 1);
  }

  function showEmpty() {
    const box = document.createElement("div"); box.className = "empty";
    box.innerHTML = S.mode === "review"
      ? `<b>ยังไม่มีคำที่ต้องทบทวน</b><p>ปัดการ์ดไปทางซ้ายในโหมด “ดูคำ” แล้วคำนั้นจะมารออยู่ที่นี่</p>`
      : `<b>รู้ครบทุกคำในชุดนี้แล้ว 🎉</b><p>ขยายช่วงอันดับคำด้านล่าง หรือเลือกชนิดคำอื่น เพื่อสุ่มต่อ</p>`;
    deck.append(box); card = box; current = 0;
    hint.hidden = true;
  }

  function deal(rank) {
    if (card) card.remove();
    if (!rank) rank = pick();
    if (!rank) { showEmpty(); return; }
    current = rank; recent.push(rank); if (recent.length > Math.min(40, Math.floor(pool.length / 2))) recent.shift();
    card = makeCard(rank); deck.append(card); hint.hidden = false;
    if (S.mode === "listen") {
      if (interacted) setTimeout(() => speak(WORDS[rank - 1][0]), 250);
      const inp = card.querySelector("input"); if (FINE && inp) setTimeout(() => inp.focus({ preventScroll: true }), 300);
    }
  }

  /* ---------- decisions ---------- */
  function decide(know) {
    if (!current || busy) return;
    busy = true; interacted = true;
    const rank = current;
    history.push({ rank, known: !!S.known[rank], learning: S.learning[rank] || 0 });
    if (history.length > 30) history.shift();
    if (know) { S.known[rank] = 1; delete S.learning[rank]; }
    else { delete S.known[rank]; S.learning[rank] = (S.learning[rank] || 0) + 1; }
    save(); rebuildPool(); $("#btn-undo").hidden = false;
    const el = card;
    const finish = () => { busy = false; deal(); };
    if (REDUCED) { el.remove(); card = null; finish(); return; }
    const dir = know ? 1 : -1, cur = el.style.transform || "";
    el.classList.remove("enter");
    el.style.transition = "transform .45s cubic-bezier(.4,0,.9,.6), opacity .45s";
    el.querySelector(know ? ".s-yes" : ".s-no").style.opacity = "1";
    requestAnimationFrame(() => {
      el.style.transform = `translate(${dir * 130}vw, -6vh) rotate(${dir * 28}deg)`;
      el.style.opacity = "0";
    });
    card = null;
    setTimeout(() => { el.remove(); }, 460);
    setTimeout(finish, 180);
  }

  function undo() {
    const h = history.pop(); if (!h) return;
    if (h.known) S.known[h.rank] = 1; else delete S.known[h.rank];
    if (h.learning) S.learning[h.rank] = h.learning; else delete S.learning[h.rank];
    save(); rebuildPool();
    deal(h.rank);
    $("#btn-undo").hidden = !history.length;
  }

  function flip() {
    if (!card || !card.classList.contains("card")) return;
    interacted = true;
    card.classList.toggle("flipped");
  }

  /* ---------- listen & spell ---------- */
  function check(el, rank, value) {
    const v = value.trim().toLowerCase().replace(/[’`]/g, "'");
    const [w, , , infl] = WORDS[rank - 1];
    const ok = v && [w, ...infl.split(/,\s*/)].some(x => x.toLowerCase() === v);
    const msg = el.querySelector("[data-msg]");
    if (ok) { msg.textContent = "ถูกต้อง! ✓ ปัดขวาได้เลย"; msg.style.color = "var(--yes)"; setTimeout(() => el.classList.add("flipped"), 500); }
    else {
      msg.textContent = v ? "ยังไม่ใช่ — ลองฟังอีกครั้ง หรือแตะการ์ดเพื่อดูเฉลย" : "พิมพ์คำที่ได้ยินก่อนนะ"; msg.style.color = "var(--no)";
      el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    }
  }

  /* ---------- pointer: drag to decide, tilt + foil, tap to flip ---------- */
  function wire(el, rank) {
    el.querySelectorAll("[data-speak]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); interacted = true; speak(WORDS[rank - 1][0]); }));
    el.querySelectorAll("[data-coach]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); openCoach(rank); }));
    el.addEventListener("click", e => {
      const say = e.target.closest("[data-say]"); if (say) { e.stopPropagation(); speak(say.dataset.say, 0.85); return; }
      if (e.target.closest("[data-more]")) { e.stopPropagation(); fillExample(el, rank, 1); }
    });
    const form = el.querySelector("[data-spell]");
    if (form) form.addEventListener("submit", e => { e.preventDefault(); interacted = true; check(el, rank, form.querySelector("input").value); });

    const tilt = el.querySelector(".tilt"), yes = el.querySelector(".s-yes"), no = el.querySelector(".s-no");
    let sx = 0, sy = 0, dx = 0, dy = 0, down = false, drag = false, id = null, t0 = 0, raf = 0;
    const interactive = t => t.closest("button, a, input, form");

    el.addEventListener("pointerdown", e => {
      if (busy || interactive(e.target) || (e.pointerType === "mouse" && e.button !== 0)) return;
      down = true; drag = false; sx = e.clientX; sy = e.clientY; dx = dy = 0; id = e.pointerId; t0 = performance.now();
      el.style.transition = "none";
    });
    el.addEventListener("pointermove", e => {
      if (down && e.pointerId === id) {
        dx = e.clientX - sx; dy = e.clientY - sy;
        if (!drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag = true; el.classList.add("dragging"); try { el.setPointerCapture(id); } catch (err) {} }
        if (drag) {
          el.style.transform = `translate(${dx}px, ${dy * 0.25}px) rotate(${dx * 0.05}deg)`;
          const k = Math.min(1, Math.abs(dx) / (deck.clientWidth * 0.3));
          yes.style.opacity = dx > 0 ? k : 0; no.style.opacity = dx < 0 ? k : 0;
        }
      }
      // tilt + foil follow the mouse (desktop only, not in lite mode)
      if (!FINE || LITE() || REDUCED || drag) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        const flipped = el.classList.contains("flipped");
        tilt.style.setProperty("--ry", ((x - 0.5) * 16) + "deg");
        tilt.style.setProperty("--rx", ((0.5 - y) * 14) + "deg");
        el.style.setProperty("--px", ((flipped ? 1 - x : x) * 100).toFixed(1) + "%");
        el.style.setProperty("--py", (y * 100).toFixed(1) + "%");
      });
    });
    const end = e => {
      if (!down || (e && e.pointerId !== id)) return;
      down = false; el.classList.remove("dragging");
      if (!drag) {
        el.style.transition = "";
        if (e && e.type === "pointerup" && Math.abs(dx) < 8 && Math.abs(dy) < 8) flip();
        return;
      }
      const v = Math.abs(dx) / Math.max(1, performance.now() - t0);        // px per ms
      if (Math.abs(dx) > deck.clientWidth * 0.3 || (v > 0.6 && Math.abs(dx) > 40)) { decide(dx > 0); return; }
      el.style.transition = "transform .45s cubic-bezier(.2,1.4,.4,1)"; el.style.transform = "";
      yes.style.opacity = no.style.opacity = 0;
      drag = false;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("pointerleave", () => { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });
    el.addEventListener("keydown", e => {
      if (e.target !== el) return;
      if (e.key === "Enter") { e.preventDefault(); flip(); }
    });
  }

  /* ---------- pronunciation coach (microphone) ---------- */
  const SC = window.SpeechCoach;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const COACH_OK = !!(SC && SR);
  const coach = $("#coach");
  const expectedOf = rank => (LPRON[rank - 1] || "").split("|").filter(Boolean).map(SC.decode);
  function ipaOfRank(rank) { if (!SC) return ""; const e = expectedOf(rank); return e.length ? SC.ipaString(e[0]) : ""; }
  let coachRank = 0, rec = null, listening = false, recTimer = 0;

  function openCoach(rank) {
    if (!rank) return;
    coachRank = rank; interacted = true;
    const [w] = WORDS[rank - 1];
    const exp = expectedOf(rank);
    $("#c-word").textContent = w;
    $("#c-ipa").textContent = exp.length ? SC.ipaString(exp[0]) : "";
    renderPhones(exp[0] || [], null);
    $("#c-result").hidden = true;
    $("#c-best").textContent = S.pron[rank] != null ? `ดีที่สุด ${S.pron[rank]}%` : "";
    setMic(false, COACH_OK ? "กดไมค์แล้วพูดคำนี้" : "เบราว์เซอร์นี้ยังฟังเสียงพูดไม่ได้ — ใช้ Chrome, Edge หรือ Safari");
    $("#c-mic").disabled = !COACH_OK;
    coach.hidden = false; requestAnimationFrame(() => coach.classList.add("on"));
    SC && SC.loadDict().catch(() => {});            // start downloading the sound dictionary now
    setTimeout(() => $("#c-mic").focus({ preventScroll: true }), 50);
  }
  function closeCoach() {
    stopRec(); coach.classList.remove("on");
    setTimeout(() => { coach.hidden = true; }, REDUCED ? 0 : 250);
    if (card && card.focus) card.focus({ preventScroll: true });
  }
  // phoneme chips: ok / bad (swapped) / miss (left out), stressed vowel underlined
  function renderPhones(phones, fb) {
    const st = {};
    if (fb && fb.steps) fb.steps.forEach(x => { if (x.t !== "ins") st[x.i] = x; });
    const extra = fb && fb.steps ? fb.steps.filter(x => x.t === "ins").length : 0;
    $("#c-phones").innerHTML = phones.map((p, i) => {
      const x = st[i], cls = !fb ? "" : !x || x.t === "ok" ? "ok" : x.t === "sub" ? "bad" : "miss";
      const tip = (SC.isV(p) ? "สระ " : "พยัญชนะ ") + "/" + SC.ipaOf(p) + "/ — " + SC.hintOf(p) + (x && x.t === "sub" ? ` · ได้ยินเป็น /${SC.ipaOf(x.g)}/` : x && x.t === "del" ? " · ไม่ได้ยินเสียงนี้" : "");
      return `<span class="ph ${SC.isV(p) ? "v" : "c"} ${cls}${/1$/.test(p) ? " stress" : ""}" title="${esc(tip)}"><b>${SC.ipaOf(p)}</b>${x && x.t === "sub" ? `<small>${SC.ipaOf(x.g)}</small>` : ""}</span>`;
    }).join("") + (extra ? `<span class="ph extra" title="มีเสียงเกินมา">+${extra}</span>` : "");
  }
  function setMic(on, text) {
    listening = on;
    $("#c-mic").classList.toggle("live", on);
    $("#c-mic-t").textContent = on ? "กำลังฟัง… พูดได้เลย" : "กดแล้วพูด";
    if (text != null) $("#c-status").textContent = text;
  }
  function stopRec() { clearTimeout(recTimer); if (rec) { try { rec.abort(); } catch (e) {} rec = null; } if (listening) setMic(false); }

  function startRec() {
    if (!COACH_OK || listening) { if (listening) stopRec(); return; }
    const rank = coachRank, [w] = WORDS[rank - 1];
    rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
    let got = false;
    rec.onresult = async e => {
      got = true;
      const alts = [...e.results[0]].map(a => ({ t: a.transcript, c: a.confidence }));
      setMic(false, "กำลังตรวจ…");
      try { await SC.loadDict(); } catch (err) { setMic(false, "โหลดข้อมูลเสียงไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่"); return; }
      showResult(rank, w, alts);
    };
    rec.onerror = e => {
      const msg = { "not-allowed": "ยังไม่ได้อนุญาตให้ใช้ไมโครโฟน — กดรูปกุญแจข้างแถบที่อยู่เว็บแล้วเปิด “ไมโครโฟน”",
        "service-not-allowed": "เบราว์เซอร์นี้ปิดการฟังเสียงพูดไว้ ลองใช้ Chrome หรือ Edge",
        "no-speech": "ไม่ได้ยินเสียง ลองพูดใกล้ไมค์อีกครั้ง", "audio-capture": "ไม่พบไมโครโฟนในเครื่องนี้",
        "network": "การฟังเสียงต้องต่ออินเทอร์เน็ต", "aborted": null }[e.error];
      if (msg !== null) setMic(false, msg || "ฟังไม่สำเร็จ ลองอีกครั้ง");
    };
    rec.onend = () => { clearTimeout(recTimer); if (listening && !got) setMic(false, "ไม่ได้ยินเสียง ลองพูดอีกครั้ง"); rec = null; };
    try { rec.start(); setMic(true, `พูดว่า “${w}”`); recTimer = setTimeout(() => { try { rec && rec.stop(); } catch (e) {} }, 7000); }
    catch (e) { setMic(false, "เริ่มฟังไม่ได้ ลองกดอีกครั้ง"); }
  }

  function showResult(rank, w, alts) {
    const exp = expectedOf(rank);
    const r = SC.evaluate(w, exp, alts);
    if (!r) { setMic(false, "ฟังไม่ออก ลองพูดอีกครั้งช้า ๆ"); return; }
    const fb = r.feedback, ei = fb && fb.ei != null ? fb.ei : 0;
    const phones = exp[ei] || exp[0] || [];
    const perfect = r.score >= 88 && (!fb || !fb.steps || fb.steps.every(x => x.t === "ok"));
    renderPhones(phones, perfect ? { steps: phones.map((p, i) => ({ t: "ok", i })) } : fb);
    $("#c-ipa").textContent = phones.length ? SC.ipaString(phones) : "";
    const pct = $("#c-pct"), ring = $("#c-ring-fill");
    pct.textContent = r.score + "%";
    ring.style.strokeDashoffset = String(113 * (1 - r.score / 100));
    $("#c-result").className = "c-result " + (r.score >= 85 ? "good" : r.score >= 60 ? "mid" : "low");
    const heard = (fb && fb.heard) || r.heard;
    $("#c-heard").innerHTML = `ระบบได้ยินว่า “<b>${esc(heard)}</b>”` + (alts.length > 1 ? ` <small>(ตัวเลือกอื่น: ${alts.slice(1, 4).map(a => esc(a.t)).join(", ")})</small>` : "");
    const list = perfect ? [{ cls: "ok", text: "ออกเสียงถูกทุกเสียง เยี่ยมมาก! ลองฟังเสียงต้นฉบับแล้วเทียบเสียงเน้นอีกที" }] : SC.notes(fb, phones);
    if (!list.length) list.push({ cls: "mid", text: r.score >= 60 ? "ใกล้แล้ว ลองพูดให้ชัดและช้าลงอีกนิด" : "ระบบได้ยินเป็นคำอื่น ลองฟังเสียงต้นฉบับแล้วพูดตาม" });
    $("#c-notes").innerHTML = list.slice(0, 5).map(n => `<li class="${n.cls}">${esc(n.text)}</li>`).join("");
    $("#c-result").hidden = false;
    setMic(false, r.score >= 85 ? "เยี่ยม! ลองอีกครั้งเพื่อทำคะแนนให้สูงขึ้นได้" : "ลองอีกครั้งได้เลย");
    if (S.pron[rank] == null || r.score > S.pron[rank]) { S.pron[rank] = r.score; save(); }
    $("#c-best").textContent = `ดีที่สุด ${S.pron[rank]}%`;
  }

  if (coach) {
    $("#c-mic").addEventListener("click", startRec);
    $("#c-x").addEventListener("click", closeCoach);
    coach.addEventListener("click", e => { if (e.target === coach) closeCoach(); });
    $("#c-listen").addEventListener("click", () => speak(WORDS[coachRank - 1][0]));
    $("#c-slow").addEventListener("click", () => speak(WORDS[coachRank - 1][0], 0.55));
  }
  const micBtn = $("#btn-mic");
  if (micBtn) { micBtn.addEventListener("click", () => openCoach(current)); if (!COACH_OK) micBtn.title = "ใช้ได้บน Chrome, Edge หรือ Safari"; }

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", e => {
    if (!coach.hidden) { if (e.key === "Escape") closeCoach(); return; }
    if (e.target.closest && e.target.closest("input, textarea, select") || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); decide(true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); decide(false); }
    else if (e.key === " " && !(e.target.closest && e.target.closest("button, a"))) { e.preventDefault(); flip(); }
    else if (e.key === "Backspace" || e.key === "z") { undo(); }
  });

  /* ---------- settings UI ---------- */
  function renderSettings() {
    document.querySelectorAll("#mode button").forEach(b => {
      b.setAttribute("aria-checked", String(b.dataset.v === S.mode));
      if (b.dataset.v === "listen" && !SPEECH) { b.disabled = true; b.title = "เบราว์เซอร์นี้ไม่มีเสียงอ่าน"; }
    });
    $("#range").value = S.limit; $("#range-v").textContent = fmt(LIMITS[S.limit]);
    $("#hide-known").checked = S.hideKnown; $("#hide-known").disabled = S.mode === "review";
    $("#pos").innerHTML = FILTERS.map(([v, label]) => {
      const n = WORDS.slice(0, LIMITS[S.limit]).filter(x => v === "all" || (v === "etc" ? ETC.has(x[1]) : x[1] === v)).length;
      return `<button type="button" data-v="${v}" aria-pressed="${v === S.pos}">${label}<small>${fmt(n)}</small></button>`;
    }).join("");
  }
  const changed = () => { save(); renderSettings(); rebuildPool(); recent = []; deal(); };
  $("#mode").addEventListener("click", e => { const b = e.target.closest("button"); if (!b || b.disabled) return; interacted = true; S.mode = b.dataset.v; changed(); });
  $("#pos").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S.pos = b.dataset.v; changed(); });
  $("#range").addEventListener("input", e => { $("#range-v").textContent = fmt(LIMITS[+e.target.value]); });
  $("#range").addEventListener("change", e => { S.limit = +e.target.value; changed(); });
  $("#hide-known").addEventListener("change", e => { S.hideKnown = e.target.checked; changed(); });
  $("#btn-yes").addEventListener("click", () => decide(true));
  $("#btn-no").addEventListener("click", () => decide(false));
  $("#btn-flip").addEventListener("click", flip);
  $("#btn-undo").addEventListener("click", undo);
  $("#btn-reset").addEventListener("click", () => {
    if (!confirm("ล้างคำที่รู้แล้วและคำที่กำลังฝึกทั้งหมดในเครื่องนี้?")) return;
    S.known = {}; S.learning = {}; history = []; $("#btn-undo").hidden = true; changed();
  });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => {
    const w = card && card.querySelector(".word"); if (w && current) w.style.setProperty("--fs", wordSize(WORDS[current - 1][0]));
  }, 150); });

  /* ---------- load the list ---------- */
  const loading = document.createElement("div"); loading.className = "empty"; loading.innerHTML = "<p>กำลังโหลดคำศัพท์…</p>";
  deck.append(loading); card = loading;
  const getJSON = u => fetch(u).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  getJSON("/assets/english/lemma-pron.json").then(d => { LPRON = d; }).catch(() => {});
  fetch("/assets/english/examples.tsv").then(r => r.ok ? r.text() : "").then(t => {
    t.split("\n").forEach(l => { const [r, en, th] = l.split("\t"); if (en) EXAMPLES[+r] = [en, th]; });
  }).catch(() => {}).finally(() => {
    EXAMPLES_READY = true;
    // refresh the example on the card that's already on the table
    if (card && current && card.querySelector("[data-ex]")) {
      const ex = EXAMPLES[current], [w, , , infl] = WORDS[current - 1] || [];
      if (ex && w) card.querySelector("[data-ex]").innerHTML = exampleHtml(w, infl, ex[0], ex[1]); else if (w) fillExample(card, current);
    }
  });
  getJSON("/assets/english/words.json").then(data => {
    WORDS = data;
    if (!["see", "listen", "review"].includes(S.mode) || (S.mode === "listen" && !SPEECH)) S.mode = "see";
    S.limit = Math.max(0, Math.min(LIMITS.length - 1, S.limit | 0));
    renderSettings(); rebuildPool(); deal();
  }).catch(() => {
    loading.innerHTML = "<b>โหลดรายการคำไม่สำเร็จ</b><p>ตรวจการเชื่อมต่ออินเทอร์เน็ต แล้วรีเฟรชหน้านี้</p>";
  });
})();
