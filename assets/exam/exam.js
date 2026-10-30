/* /exam page: subject picker, practice mode (one question at a time) and mock-exam mode. */
(function () {
  "use strict";
  const X = window.EXAM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const SUBJECTS = [
    { id: "math", name: "คณิตศาสตร์", sub: "A-Level คณิตศาสตร์ประยุกต์ 1", min: 3.6, icon: "∑" },
    { id: "phys", name: "ฟิสิกส์", sub: "A-Level ฟิสิกส์ (แนว PAT2 / ENT เดิม)", min: 3.6, icon: "⚛" },
    { id: "tpat3", name: "TPAT3", sub: "ความถนัดวิทยาศาสตร์ เทคโนโลยี วิศวกรรม", min: 2.4, icon: "⚙" },
    { id: "tgat", name: "TGAT", sub: "อังกฤษ · การคิดอย่างมีเหตุผล · สมรรถนะการทำงาน", min: 1.6, icon: "◎" },
  ];

  /* ---------- storage (per-viewer convenience only) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("exam." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("exam." + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* ---------- maths rendering ---------- */
  function tex(html) {
    if (!html) return "";
    const render = (src, display) => {
      try { return window.katex.renderToString(src, { displayMode: display, throwOnError: false, strict: false, output: "html" }); }
      catch { return src; }
    };
    return html
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => render(s, true))
      .replace(/\$([^$]+?)\$/g, (_, s) => render(s, false));
  }

  /* ---------- state ---------- */
  const st = {
    subj: store.get("subj", "math"),
    mode: "practice",
    topic: "",
    pq: null, pAnswered: false,
    paper: [], picks: [], submitted: false, seed: 0, n: 15,
    timer: null, deadline: 0,
  };
  const defsOf = (subj, topic) => X.bank.filter(d => d.subj === subj && (!topic || d.topic === topic));
  const newSeed = () => (Math.random() * 2 ** 32) >>> 0;
  const code = s => s.toString(36).toUpperCase().padStart(7, "0");

  /* ---------- subjects ---------- */
  function drawSubjects() {
    const box = $("#subjects"); box.textContent = "";
    for (const s of SUBJECTS) {
      const n = defsOf(s.id).length, topics = new Set(defsOf(s.id).map(d => d.topic)).size;
      const b = document.createElement("button");
      b.type = "button"; b.className = "subj" + (s.id === st.subj ? " on" : ""); b.dataset.s = s.id;
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", s.id === st.subj);
      b.innerHTML = `<span class="ic" aria-hidden="true">${s.icon}</span><span class="nm">${s.name}</span><span class="sb">${s.sub}</span><span class="ct mono">${n} แนวโจทย์ · ${topics} หัวข้อ</span>`;
      b.addEventListener("click", () => { if (st.subj === s.id) return; st.subj = s.id; st.topic = ""; store.set("subj", s.id); drawSubjects(); drawTopics(); refresh(); });
      box.append(b);
    }
  }
  function drawTopics() {
    const sel = $("#topic"); sel.textContent = "";
    const topics = [...new Set(defsOf(st.subj).map(d => d.topic))];
    const add = (v, t) => { const o = document.createElement("option"); o.value = v; o.textContent = t; sel.append(o); };
    add("", "ทุกหัวข้อ (สุ่มรวม)");
    for (const t of topics) add(t, `${t} (${defsOf(st.subj, t).length})`);
    sel.value = st.topic;
  }

  /* ---------- one question ---------- */
  function qHTML(q, idx, o = {}) {
    const figs = q.choices.some(c => c.includes("<svg"));
    const choices = q.choices.map((c, i) =>
      `<li><button type="button" class="opt" data-q="${idx}" data-i="${i}" aria-pressed="false"><span class="no">${i + 1}</span><span class="ct">${tex(c)}</span></button></li>`).join("");
    return `<article class="q" id="${o.practice ? "pq" : "q"}-${idx}" data-idx="${idx}">
      <header class="q-h"><span class="qn">ข้อที่ ${idx + 1}</span><span class="pill">${q.topic}</span>${o.practice ? `<span class="spacer"></span><a class="qcode mono" href="#q/${q.id}/${q.seed}" title="ลิงก์ถาวรของโจทย์ข้อนี้">#${code(q.seed)}</a>` : ""}</header>
      <div class="q-body">${tex(q.q)}</div>
      ${q.fig ? `<div class="q-fig">${q.fig}</div>` : ""}
      ${q.q2 ? `<div class="q-body">${tex(q.q2)}</div>` : ""}
      <ol class="ch${figs ? " figs" : ""}">${choices}</ol>
      <div class="sol" hidden>
        <h4>เฉลย <b>ข้อ ${q.answer + 1}</b></h4>
        <div class="sol-body">${tex(q.sol)}</div>
        ${q.solFig ? `<div class="q-fig">${q.solFig}</div>` : ""}
      </div>
    </article>`;
  }
  function markQuestion(art, q, pick) {
    $$(".opt", art).forEach((b, i) => {
      b.classList.toggle("right", i === q.answer);
      b.classList.toggle("wrong", i === pick && pick !== q.answer);
      b.disabled = true;
    });
    $(".sol", art).hidden = false;
  }

  /* ---------- practice ---------- */
  function stats() { return store.get("stat." + st.subj, { done: 0, right: 0 }); }
  function drawStat() {
    const s = stats();
    $("#stat").innerHTML = st.mode === "practice" ? (s.done ? `ทำแล้ว <b>${s.done}</b> ข้อ · ถูก <b>${s.right}</b> (${Math.round(100 * s.right / s.done)}%) <button type="button" class="link" id="stat-reset">ล้าง</button>` : "ยังไม่ได้เริ่มทำ") : "";
    const r = $("#stat-reset"); if (r) r.addEventListener("click", () => { store.set("stat." + st.subj, { done: 0, right: 0 }); drawStat(); });
  }
  function newPractice(def, seed) {
    const defs = defsOf(st.subj, st.topic);
    if (!def) {
      const last = st.pq && st.pq.id;
      const pool = defs.length > 1 ? defs.filter(d => d.id !== last) : defs;
      def = pool[Math.floor(Math.random() * pool.length)];
    }
    st.pq = X.make(def, seed ?? newSeed());
    st.pAnswered = false;
    const box = $("#pq");
    box.innerHTML = qHTML(st.pq, 0, { practice: true });
    $(".qn", box).textContent = SUBJECTS.find(s => s.id === st.subj).name;
    $$(".opt", box).forEach(b => b.addEventListener("click", () => answerPractice(+b.dataset.i)));
    $("#btn-reveal").disabled = false;
    history.replaceState(null, "", `#q/${st.pq.id}/${st.pq.seed}`);
  }
  function answerPractice(i) {
    if (st.pAnswered) return;
    st.pAnswered = true;
    const art = $("#pq-0");
    markQuestion(art, st.pq, i);
    const s = stats(); s.done++; if (i === st.pq.answer) s.right++; store.set("stat." + st.subj, s); drawStat();
    const ok = i === st.pq.answer;
    const badge = document.createElement("p"); badge.className = "verdict " + (ok ? "ok" : "no");
    badge.textContent = ok ? "ถูกต้อง เยี่ยมมาก!" : `ยังไม่ถูก — คำตอบที่ถูกคือข้อ ${st.pq.answer + 1}`;
    $(".sol", art).before(badge);
    $("#btn-reveal").disabled = true;
    $("#btn-next").focus({ preventScroll: true });
  }

  /* ---------- exam ---------- */
  function buildPaper(seed, n) {
    const R = X.rng(seed);
    const defs = defsOf(st.subj, st.topic);
    const out = []; let pool = [];
    while (out.length < n) {
      if (!pool.length) pool = R.shuffle(defs);
      out.push(X.make(pool.pop(), (R.next() * 2 ** 32) >>> 0));
    }
    return out;
  }
  function newExam(seed) {
    stopTimer();
    st.seed = seed ?? newSeed();
    st.n = +$("#count").value;
    st.paper = buildPaper(st.seed, st.n);
    st.picks = new Array(st.n).fill(-1);
    st.submitted = false;
    const subj = SUBJECTS.find(s => s.id === st.subj);
    $("#paper-title").textContent = `${subj.name}${st.topic ? " · " + st.topic : ""} — ${st.n} ข้อ`;
    $("#paper-code").textContent = `ชุด #${code(st.seed)}`;
    $("#paper").innerHTML = st.paper.map((q, i) => qHTML(q, i)).join("");
    $$("#paper .opt").forEach(b => b.addEventListener("click", () => pickExam(+b.dataset.q, +b.dataset.i)));
    drawSheet();
    $("#result").hidden = true;
    $("#btn-submit").disabled = $("#btn-submit2").disabled = false;
    if ($("#timed").checked) startTimer(Math.round(subj.min * st.n * 60)); else $("#timer").hidden = true;
    const ti = st.topic ? [...new Set(defsOf(st.subj).map(d => d.topic))].indexOf(st.topic) + 1 : 0;
    history.replaceState(null, "", `#exam/${st.subj}/${ti}/${st.n}/${st.seed}`);
  }
  function pickExam(qi, i) {
    if (st.submitted) return;
    st.picks[qi] = st.picks[qi] === i ? -1 : i;
    $$(`#q-${qi} .opt`).forEach((b, j) => { b.classList.toggle("picked", j === st.picks[qi]); b.setAttribute("aria-pressed", j === st.picks[qi]); });
    drawSheet();
  }
  function drawSheet() {
    const ol = $("#sheet"); ol.textContent = "";
    st.paper.forEach((q, i) => {
      const li = document.createElement("li");
      const a = document.createElement("a"); a.href = "#"; a.dataset.q = i;
      a.textContent = i + 1;
      const p = st.picks[i];
      a.className = st.submitted ? (p === q.answer ? "ok" : "no") : p >= 0 ? "on" : "";
      a.title = p >= 0 ? `ตอบข้อ ${p + 1}` : "ยังไม่ตอบ";
      a.addEventListener("click", e => { e.preventDefault(); $(`#q-${i}`).scrollIntoView({ behavior: "smooth", block: "start" }); });
      li.append(a); ol.append(li);
    });
    const done = st.picks.filter(p => p >= 0).length;
    $("#answered").textContent = `ตอบแล้ว ${done}/${st.n}`;
  }
  function submitExam(auto = false) {
    if (st.submitted) return;
    const blank = st.picks.filter(p => p < 0).length;
    if (!auto && blank && !confirmBlank(blank)) return;
    st.submitted = true; stopTimer();
    let right = 0;
    st.paper.forEach((q, i) => { if (st.picks[i] === q.answer) right++; markQuestion($(`#q-${i}`), q, st.picks[i]); });
    const pct = Math.round(100 * right / st.n);
    const byTopic = {};
    st.paper.forEach((q, i) => { const t = (byTopic[q.topic] ||= { n: 0, r: 0 }); t.n++; if (st.picks[i] === q.answer) t.r++; });
    const weak = Object.entries(byTopic).filter(([, t]) => t.r / t.n < 0.5).map(([k]) => k);
    const res = $("#result");
    res.innerHTML = `<div class="score"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="17" class="arc" style="stroke-dasharray:${(pct / 100 * 106.8).toFixed(1)} 106.8"/></svg><b>${right}<small>/${st.n}</small></b></div>
      <div><h3>${auto ? "หมดเวลา — ระบบส่งคำตอบให้แล้ว" : "ส่งคำตอบแล้ว"}</h3>
      <p>ได้ ${right} จาก ${st.n} ข้อ (${pct}%) ${pct >= 80 ? "ยอดเยี่ยม!" : pct >= 60 ? "ดีมาก ทบทวนข้อที่ผิดอีกนิด" : "ลองอ่านเฉลยข้อที่ผิด แล้วฝึกหัวข้อนั้นเพิ่ม"}</p>
      ${weak.length ? `<p class="muted small">หัวข้อที่ควรทบทวน: ${weak.join(", ")}</p>` : ""}
      <p class="muted small">เลื่อนลงเพื่อดูเฉลยละเอียดทุกข้อ · ตารางด้านล่างแสดงข้อถูก (เขียว) และผิด (แดง)</p></div>`;
    res.hidden = false;
    drawSheet();
    $("#btn-submit").disabled = $("#btn-submit2").disabled = true;
    res.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function confirmBlank(n) { // inline confirm instead of a blocking dialog
    const btn = $("#btn-submit");
    if (btn.dataset.armed) { delete btn.dataset.armed; btn.textContent = "ส่งคำตอบ"; return true; }
    btn.dataset.armed = "1"; btn.textContent = `ยังไม่ตอบ ${n} ข้อ — กดอีกครั้งเพื่อส่ง`;
    setTimeout(() => { delete btn.dataset.armed; btn.textContent = "ส่งคำตอบ"; }, 4000);
    btn.scrollIntoView({ block: "nearest" });
    return false;
  }
  function startTimer(sec) {
    st.deadline = Date.now() + sec * 1000;
    const t = $("#timer"); t.hidden = false;
    const tick = () => {
      const left = Math.max(0, Math.round((st.deadline - Date.now()) / 1000));
      t.textContent = `⏱ ${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
      t.classList.toggle("low", left < 120);
      if (!left) { stopTimer(); submitExam(true); }
    };
    tick(); st.timer = setInterval(tick, 1000);
  }
  function stopTimer() { clearInterval(st.timer); st.timer = null; }

  /* ---------- mode switching ---------- */
  function setMode(m) {
    st.mode = m;
    $$("#mode button").forEach(b => { const on = b.dataset.v === m; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    $$(".exam-only").forEach(e => (e.hidden = m !== "exam"));
    $("#practice").hidden = m !== "practice"; $("#exam").hidden = m !== "exam";
    if (m !== "exam") stopTimer();
    refresh();
  }
  function refresh() { drawStat(); if (st.mode === "practice") newPractice(); else newExam(); }

  /* ---------- printing ---------- */
  function doPrint() {
    const dlg = $("#print-dlg");
    dlg.showModal();
    dlg.addEventListener("close", function once() {
      dlg.removeEventListener("close", once);
      if (dlg.returnValue !== "print") return;
      document.body.classList.toggle("print-sol", $("#print-sol").checked);
      document.body.classList.toggle("print-mark", $("#print-mark").checked);
      setTimeout(() => window.print(), 50);
    });
  }

  /* ---------- wire up ---------- */
  $$("#mode button").forEach(b => b.addEventListener("click", () => setMode(b.dataset.v)));
  $("#topic").addEventListener("change", e => { st.topic = e.target.value; refresh(); });
  $("#count").addEventListener("change", () => newExam());
  $("#timed").addEventListener("change", () => { if (!$("#timed").checked) { stopTimer(); $("#timer").hidden = true; } else if (!st.submitted) startTimer(Math.round(SUBJECTS.find(s => s.id === st.subj).min * st.n * 60)); });
  $("#btn-next").addEventListener("click", () => newPractice());
  $("#btn-same").addEventListener("click", () => newPractice(X.bank.find(d => d.id === st.pq.id)));
  $("#btn-reveal").addEventListener("click", () => { $(".sol", $("#pq-0")).hidden = false; $("#btn-reveal").disabled = true; st.pAnswered = true; $$("#pq-0 .opt").forEach((b, i) => { b.disabled = true; b.classList.toggle("right", i === st.pq.answer); }); });
  $("#btn-new").addEventListener("click", () => newExam());
  $("#btn-submit").addEventListener("click", () => submitExam());
  $("#btn-submit2").addEventListener("click", () => { $("#btn-submit").scrollIntoView({ block: "center" }); submitExam(); });
  $("#btn-print").addEventListener("click", doPrint);
  document.addEventListener("keydown", e => {
    if (st.mode !== "practice" || e.target.closest("input, select, textarea, dialog") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-5]$/.test(e.key)) { answerPractice(+e.key - 1); e.preventDefault(); }
    else if ((e.key === "Enter" && !e.target.closest("button, a")) || e.key === "ArrowRight") { newPractice(); e.preventDefault(); }
  });

  /* ---------- start (supports #q/<id>/<seed> and #exam/<subj>/<topicIdx>/<n>/<seed>) ---------- */
  drawSubjects();
  const h = location.hash.slice(1).split("/");
  if (h[0] === "q" && X.bank.some(d => d.id === h[1])) {
    const def = X.bank.find(d => d.id === h[1]);
    st.subj = def.subj; drawSubjects(); drawTopics(); drawStat(); newPractice(def, +h[2] >>> 0);
  } else if (h[0] === "exam" && SUBJECTS.some(s => s.id === h[1])) {
    st.subj = h[1]; drawSubjects(); drawTopics();
    const topics = [...new Set(defsOf(st.subj).map(d => d.topic))];
    st.topic = topics[(+h[2] || 0) - 1] || ""; $("#topic").value = st.topic;
    if ([...$("#count").options].some(o => o.value === h[3])) $("#count").value = h[3];
    st.mode = "exam";
    $$("#mode button").forEach(b => { const on = b.dataset.v === "exam"; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    $$(".exam-only").forEach(e => (e.hidden = false)); $("#practice").hidden = true; $("#exam").hidden = false;
    drawStat(); newExam(+h[4] >>> 0);
  } else { drawTopics(); refresh(); }
})();
