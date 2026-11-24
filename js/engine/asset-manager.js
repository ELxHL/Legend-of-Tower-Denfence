// ============================================================
// ASSET MANAGER - Quan ly tai nguyen anh tap trung.
// Dang ky mot lan, tai mot lan, su dung nhieu noi.
// Ho tro: anh trong repo (src), anh nguoi dung nhap (blob tu IndexedDB).
// Loi tai anh duoc xu ly an toan: tra ve null, game dung placeholder.
// ============================================================
export class AssetManager {
  constructor(events) {
    this.events = events || null;
    this.defs = new Map();    // id -> def
    this.images = new Map();  // id -> { def, img, ok, error, url }
  }

  registerDef(def) {
    if (!def || !def.id) return;
    this.defs.set(def.id, def);
  }

  registerDefs(list) { (list || []).forEach((d) => this.registerDef(d)); }

  // Goi khi nap lai du an (xoa registry hien tai)
  reset() {
    for (const e of this.images.values()) {
      if (e.url) { try { URL.revokeObjectURL(e.url); } catch (err) { /* bo qua */ } }
    }
    this.defs.clear();
    this.images.clear();
  }

  async loadAll() {
    const jobs = [];
    for (const def of this.defs.values()) jobs.push(this._loadOne(def));
    await Promise.all(jobs);
  }

  async _loadOne(def) {
    if (this.images.has(def.id)) return this.images.get(def.id);
    const entry = { def, img: null, ok: false, error: null, url: null };
    try {
      let src = def.src || null;
      if (!src && def.blob) {
        entry.url = URL.createObjectURL(def.blob);
        src = entry.url;
      }
      if (!src) throw new Error('Thiếu nguồn ảnh (src/blob)');
      entry.img = await this._loadImage(src);
      entry.ok = true;
    } catch (err) {
      entry.error = (err && err.message) || 'Lỗi tải ảnh';
      console.warn('[Asset] ' + def.id + ': ' + entry.error);
      if (this.events) this.events.emit('asset:error', { id: def.id, error: entry.error });
    }
    this.images.set(def.id, entry);
    if (this.events) this.events.emit('asset:loaded', { id: def.id, ok: entry.ok });
    return entry;
  }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Không tải được ảnh: ' + src));
      img.src = src;
    });
  }

  get(id) {
    const e = this.images.get(id);
    return (e && e.ok) ? e.img : null;
  }

  status(id) {
    const e = this.images.get(id);
    if (!e) return 'missing';
    return e.ok ? 'ok' : 'error';
  }

  meta(id) {
    const e = this.images.get(id);
    return e ? (e.def.meta || null) : null;
  }

  list() { return [...this.defs.keys()]; }
  has(id) { return this.images.has(id); }

  remove(id) {
    const e = this.images.get(id);
    if (e && e.url) { try { URL.revokeObjectURL(e.url); } catch (err) { /* bo qua */ } }
    this.images.delete(id);
    this.defs.delete(id);
  }
}
