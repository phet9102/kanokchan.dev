// Work board — no server, no sign-in. Everything is saved in this browser (see store.js).
(() => {
  const { $, $$, el, toast, fmtDate, fmtSize, busy } = KC;
  const STATUS = { todo: "ต้องทำ", doing: "กำลังทำ", done: "เสร็จแล้ว" };
  const isMedia = t => /^(image|video)\//.test(t || "");

  let projects = [], filter = "all", editing = null, pending = [];
  let urls = [];                                   // object URLs made for the current render (freed on re-render)
  const urlFor = async f => { const b = await Store.getFile(f.id); if (!b) return ""; const u = URL.createObjectURL(b); urls.push(u); return u; };

  async function load() {
    try { projects = await Store.listProjects(); }
    catch (e) { projects = []; toast("เปิดที่เก็บข้อมูลของเบราว์เซอร์ไม่ได้: " + e.message, true); }
    render();
  }

  function dueInfo(p) {
    if (!p.due_at) return null;
    const late = p.status !== "done" && p.due_at < Date.now();
    return el("span", { class: "pill" + (late ? " late" : ""), text: (late ? "เลยกำหนด · " : "ส่ง ") + fmtDate(p.due_at) });
  }

  async function removeProject(p) {
    if (!confirm(`ลบงาน "${p.title}" และไฟล์ทั้งหมดในงานนี้?\nลบแล้วกู้คืนไม่ได้`)) return false;
    try { await Store.deleteProject(p.id); toast("ลบงานแล้ว"); load(); return true; }
    catch (e) { toast(e.message, true); return false; }
  }

  function imgFailed(e) {
    const img = e.currentTarget;
    img.replaceWith(el("span", { class: "img-missing", text: "⚠ แสดงรูปนี้ไม่ได้\n" + img.alt }));
  }

  async function card(p) {
    const media = p.files.filter(f => isMedia(f.type));
    const gallery = await Promise.all(media.map(async f => {
      const src = await urlFor(f);
      return el("button", { type: "button", title: f.name, onclick: () => openLightbox(f, src) },
        f.type.startsWith("video/")
          ? el("video", { src, muted: true, preload: "metadata", playsinline: true })
          : el("img", { src, alt: f.name, loading: "lazy", onerror: imgFailed }));
    }));
    const fileRows = await Promise.all(p.files.map(async f => el("li", {},
      el("a", { href: await urlFor(f), download: f.name, text: (isMedia(f.type) ? "🖼 " : "📄 ") + f.name }),
      el("span", { class: "sz", text: fmtSize(f.size) }),
      el("button", {
        class: "rm", type: "button", title: "ลบไฟล์", "aria-label": "ลบไฟล์ " + f.name,
        onclick: async () => {
          if (!confirm(`ลบไฟล์ "${f.name}" ?`)) return;
          try { await Store.deleteFile(p.id, f.id); toast("ลบไฟล์แล้ว"); load(); } catch (e) { toast(e.message, true); }
        },
      }, "×"))));

    return el("article", { class: "card work" },
      el("div", { class: "meta" },
        el("span", { class: "pill " + p.status, text: STATUS[p.status] }),
        dueInfo(p),
        p.remind && p.status !== "done" && el("span", { class: "pill", text: "🔔 แจ้งเตือน" }),
      ),
      el("h3", { text: p.title }),
      p.description && el("p", { class: "desc", text: p.description }),
      gallery.length > 0 && el("div", { class: "gallery" }, gallery),
      fileRows.length > 0 && el("ul", { class: "files" }, fileRows),
      el("div", { class: "row" },
        el("span", { class: "muted small mono", text: "อัปเดต " + fmtDate(p.updated_at) }),
        el("span", { class: "spacer" }),
        p.status !== "done" && el("button", {
          class: "btn sm", type: "button",
          onclick: async () => {
            try { await Store.saveProject({ ...p, status: "done" }); toast("เยี่ยม! ทำเสร็จแล้ว 🎉"); load(); }
            catch (err) { toast(err.message, true); }
          },
        }, "✓ เสร็จ"),
        el("button", { class: "btn sm", type: "button", onclick: () => openEditor(p) }, "แก้ไข / เพิ่มไฟล์"),
        el("button", { class: "btn sm danger", type: "button", onclick: () => removeProject(p) }, "🗑 ลบงาน"),
      ),
    );
  }

  let renderSeq = 0;
  async function render() {
    const seq = ++renderSeq;
    const old = urls; urls = [];
    const list = projects.filter(p => filter === "all" || p.status === filter);
    const cards = await Promise.all(list.map(card));
    if (seq !== renderSeq) return;                 // a newer render started meanwhile
    $("#board").replaceChildren(...cards);
    old.forEach(u => URL.revokeObjectURL(u));
    const empty = $("#empty");
    empty.hidden = list.length > 0;
    empty.textContent = projects.length ? "ไม่มีงานในหมวดนี้" : "ยังไม่มีงาน — กด \"+ เพิ่มงานใหม่\" เพื่อเริ่ม";
  }

  $$("#filter button").forEach(b => b.addEventListener("click", () => {
    filter = b.dataset.f;
    $$("#filter button").forEach(x => x.classList.toggle("on", x === b));
    render();
  }));

  /* ---------- editor ---------- */
  const dlg = $("#editor"), form = $("#editor-form");
  const toDateInput = ms => { if (!ms) return ""; const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const fromDateInput = v => { if (!v) return null; const [y, m, d] = v.split("-").map(Number); return new Date(y, m - 1, d, 23, 59).getTime(); };

  function openEditor(p = null) {
    editing = p; pending = [];
    form.reset();
    $("#editor-title").textContent = p ? "แก้ไขงาน" : "เพิ่มงานใหม่";
    $("#btn-delete").hidden = !p;
    form.title.value = p ? p.title : "";
    form.description.value = p ? p.description : "";
    form.status.value = p ? p.status : "todo";
    form.due.value = p ? toDateInput(p.due_at) : "";
    form.remind.checked = p ? !!p.remind : true;
    renderPending();
    $("#progress").hidden = true;
    dlg.showModal();
  }
  $("#btn-new").addEventListener("click", () => openEditor());

  function renderPending() {
    $("#pending").replaceChildren(...pending.map((f, i) => el("li", {},
      el("a", { text: f.name }), el("span", { class: "sz", text: fmtSize(f.size) }),
      el("button", { class: "rm", type: "button", "aria-label": "เอาออก", onclick: () => { pending.splice(i, 1); renderPending(); } }, "×"))));
  }

  // iPhone photos (.heic) only display in Safari: convert to JPEG when this browser can decode them.
  const isHeic = f => /^image\/hei[cf]/.test(f.type) || /\.(heic|heif)$/i.test(f.name);
  async function toJpeg(f) {
    try {
      const bmp = await createImageBitmap(f);
      const cv = document.createElement("canvas");
      cv.width = bmp.width; cv.height = bmp.height;
      cv.getContext("2d").drawImage(bmp, 0, 0);
      const blob = await new Promise(r => cv.toBlob(r, "image/jpeg", 0.9));
      return blob ? new File([blob], f.name.replace(/\.(heic|heif)$/i, "") + ".jpg", { type: "image/jpeg" }) : f;
    } catch {
      toast(`"${f.name}" เป็นไฟล์ HEIC ที่เบราว์เซอร์นี้แปลงไม่ได้ — เก็บเป็นไฟล์ดาวน์โหลดแทน`, true);
      return f;
    }
  }
  const MAX = 200 * 1024 * 1024;
  async function addFiles(input) {
    for (let f of [...input]) {
      if (isHeic(f)) f = await toJpeg(f);
      if (f.size > MAX) { toast(`"${f.name}" ใหญ่เกิน 200 MB`, true); continue; }
      pending.push(f);
    }
    renderPending();
  }
  $("#file-input").addEventListener("change", async e => { await addFiles(e.target.files); e.target.value = ""; });
  const drop = $("#drop");
  ["dragenter", "dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => addFiles(e.dataTransfer.files));

  form.addEventListener("submit", e => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    busy($("#btn-save"), async () => {
      const title = form.title.value.trim();
      if (!title) { toast("ใส่ชื่องานก่อนนะ", true); return; }
      try {
        const saved = await Store.saveProject({
          ...(editing || {}),
          title, description: form.description.value.trim(), status: form.status.value,
          due_at: fromDateInput(form.due.value), remind: form.remind.checked,
        });
        if (pending.length) {
          const bar = $("#progress"), fill = bar.firstElementChild;
          bar.hidden = false;
          for (let i = 0; i < pending.length; i++) {
            await Store.addFile(saved.id, pending[i]);
            fill.style.width = ((i + 1) / pending.length) * 100 + "%";
          }
        }
        Store.persist();
        dlg.close();
        toast("บันทึกแล้ว");
        load();
      } catch (err) {
        toast(err.name === "QuotaExceededError" ? "พื้นที่เก็บในเบราว์เซอร์เต็ม — ลบไฟล์ใหญ่ ๆ ออกก่อน" : err.message, true);
        load();
      }
    });
  });

  $("#btn-delete").addEventListener("click", async () => {
    if (editing && await removeProject(editing)) dlg.close();
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox");
  function openLightbox(f, src) {
    const m = f.type.startsWith("video/")
      ? el("video", { src, controls: true, autoplay: true, playsinline: true })
      : el("img", { src, alt: f.name });
    $("#lb-media").replaceChildren(m);
    $("#lb-name").textContent = f.name;
    $("#lb-open").href = src;
    $("#lb-open").setAttribute("download", f.name);
    lb.showModal();
  }
  $("#lb-close").addEventListener("click", () => lb.close());
  lb.addEventListener("close", () => $("#lb-media").replaceChildren());
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });

  /* ---------- backup / restore ---------- */
  $("#btn-export").addEventListener("click", e => busy(e.currentTarget, async () => {
    try {
      const blob = await Store.exportAll();
      const a = el("a", { href: URL.createObjectURL(blob), download: `work-board-backup-${new Date().toISOString().slice(0, 10)}.json` });
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      toast("ดาวน์โหลดไฟล์สำรองแล้ว");
    } catch (err) { toast(err.message, true); }
  }));
  $("#import-input").addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    try { const n = await Store.importAll(f); toast(`กู้คืน ${n} งานแล้ว`); load(); }
    catch (err) { toast("กู้คืนไม่สำเร็จ: " + err.message, true); }
  });

  load();
})();
