// Work board storage — lives in THIS browser only (IndexedDB). No server, no sign-in.
// Two stores: "projects" (the work items) and "files" (the actual file bytes, as Blobs).
const Store = (() => {
  const DB_NAME = "kanokchan-work", VERSION = 1;
  let dbp;

  function open() {
    if (!dbp) dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "id" });
        if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }

  // Run fn(stores...) inside one transaction and resolve when it commits.
  async function tx(names, mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(names, mode);
      let out;
      t.oncomplete = () => resolve(out);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error || new Error("Storage error"));
      out = fn(...names.map(n => t.objectStore(n)));
    });
  }
  const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

  async function listProjects() {
    const db = await open();
    const all = await reqP(db.transaction("projects").objectStore("projects").getAll());
    return all.sort((a, b) => (a.status === "done") - (b.status === "done")
      || (a.due_at || 9e15) - (b.due_at || 9e15) || b.updated_at - a.updated_at);
  }

  async function saveProject(p) {
    const now = Date.now();
    const rec = { files: [], created_at: now, ...p, id: p.id || uid(), updated_at: now };
    await tx(["projects"], "readwrite", s => s.put(rec));
    return rec;
  }

  async function addFile(projectId, file) {
    const id = uid();
    await tx(["projects", "files"], "readwrite", (ps, fs) => {
      fs.put({ id, blob: file });
      const r = ps.get(projectId);
      r.onsuccess = () => {
        const p = r.result; if (!p) return;
        p.files.push({ id, name: file.name, type: file.type || "", size: file.size, added_at: Date.now() });
        p.updated_at = Date.now();
        ps.put(p);
      };
    });
    return id;
  }

  async function getFile(id) {
    const db = await open();
    const row = await reqP(db.transaction("files").objectStore("files").get(id));
    return row ? row.blob : null;
  }

  async function deleteFile(projectId, fileId) {
    await tx(["projects", "files"], "readwrite", (ps, fs) => {
      fs.delete(fileId);
      const r = ps.get(projectId);
      r.onsuccess = () => {
        const p = r.result; if (!p) return;
        p.files = p.files.filter(f => f.id !== fileId); p.updated_at = Date.now();
        ps.put(p);
      };
    });
  }

  async function deleteProject(id) {
    await tx(["projects", "files"], "readwrite", (ps, fs) => {
      const r = ps.get(id);
      r.onsuccess = () => {
        const p = r.result; if (!p) return;
        p.files.forEach(f => fs.delete(f.id));
        ps.delete(id);
      };
    });
  }

  /* ---------- backup: everything (including files) in one .json file ---------- */
  const toDataUrl = blob => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej(fr.error); fr.readAsDataURL(blob); });

  async function exportAll() {
    const projects = await listProjects(), files = {};
    for (const p of projects) for (const f of p.files) {
      const b = await getFile(f.id); if (b) files[f.id] = await toDataUrl(b);
    }
    return new Blob([JSON.stringify({ app: "kanokchan-work", version: 1, exported_at: Date.now(), projects, files })], { type: "application/json" });
  }

  async function importAll(file) {
    const data = JSON.parse(await file.text());
    if (!data || data.app !== "kanokchan-work" || !Array.isArray(data.projects)) throw new Error("ไม่ใช่ไฟล์สำรองของ Work board");
    const blobs = {};
    for (const [id, url] of Object.entries(data.files || {})) blobs[id] = await (await fetch(url)).blob();
    await tx(["projects", "files"], "readwrite", (ps, fs) => {
      for (const p of data.projects) {
        p.files = (p.files || []).filter(f => blobs[f.id]);
        ps.put(p);
        p.files.forEach(f => fs.put({ id: f.id, blob: blobs[f.id] }));
      }
    });
    return data.projects.length;
  }

  // Ask the browser not to clear this data when disk space runs low.
  function persist() { try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch {} }

  return { listProjects, saveProject, addFile, getFile, deleteFile, deleteProject, exportAll, importAll, persist };
})();
