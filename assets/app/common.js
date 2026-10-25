// Shared helpers for the app pages. Everything user-provided is inserted with textContent (never innerHTML).
const KC = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Tiny element builder: el("div", { class: "x", text: "hi" }, child1, child2)
  function el(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "text") n.textContent = v;
      else if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) n.append(k);
    return n;
  }

  function toast(msg, isErr = false) {
    let box = $(".toasts");
    if (!box) { box = el("div", { class: "toasts", role: "status", "aria-live": "polite" }); document.body.append(box); }
    const t = el("div", { class: "toast" + (isErr ? " err" : ""), text: msg });
    box.append(t);
    setTimeout(() => t.remove(), isErr ? 6000 : 3500);
  }

  const fmtDate = ms => new Date(ms).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  const fmtDateTime = ms => new Date(ms).toLocaleString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const fmtSize = b => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";

  async function busy(btn, fn) {
    btn.disabled = true;
    try { return await fn(); } finally { btn.disabled = false; }
  }

  return { $, $$, el, toast, fmtDate, fmtDateTime, fmtSize, busy };
})();
