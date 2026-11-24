// ============================================================
// LƯU TRỮ — IndexedDB: cấu hình người dùng, ảnh (Blob), tiến trình trận.
// Nếu IndexedDB không khả dụng thì dùng bộ nhớ tạm trong phiên.
// ============================================================
const DB_NAME = 'cao-son-td';
const DB_VERSION = 1;

function asPromise(rq) {
  return new Promise((resolve, reject) => {
    rq.onsuccess = () => resolve(rq.result);
    rq.onerror = () => reject(rq.error);
  });
}

export class SaveManager {
  constructor() {
    this.db = null;
    this.notice = '';
    this.mem = { config: new Map(), assets: new Map(), progress: new Map() };
  }

  async open() {
    if (typeof indexedDB === 'undefined') {
      this.notice = 'Trình duyệt không hỗ trợ IndexedDB — dữ liệu chỉ tồn tại trong phiên hiện tại.';
      return;
    }
    try {
      this.db = await new Promise((resolve, reject) => {
        const open = indexedDB.open(DB_NAME, DB_VERSION);
        open.onupgradeneeded = () => {
          const db = open.result;
          if (!db.objectStoreNames.contains('config')) db.createObjectStore('config');
          if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress');
        };
        open.onsuccess = () => resolve(open.result);
        open.onerror = () => reject(open.error || new Error('Không mở được IndexedDB'));
      });
    } catch (e) {
      console.warn('[Save] IndexedDB mở thất bại, dùng bộ nhớ tạm:', e);
      this.notice = 'IndexedDB không khả dụng — dữ liệu chỉ tồn tại trong phiên hiện tại.';
    }
  }

  _store(name, mode) {
    return this.db.transaction(name, mode || 'readonly').objectStore(name);
  }

  async getConfig() {
    if (!this.db) return this.mem.config.get('user') || null;
    const v = await asPromise(this._store('config').get('user'));
    return v || null;
  }

  async saveConfig(cfg) {
    if (!this.db) { this.mem.config.set('user', cfg); return; }
    await asPromise(this._store('config', 'readwrite').put(cfg, 'user'));
  }

  async listAssets() {
    if (!this.db) return [...this.mem.assets.values()];
    return (await asPromise(this._store('assets').getAll())) || [];
  }

  async putAsset(id, meta, blob) {
    const rec = { id, meta: meta || {}, blob };
    if (!this.db) { this.mem.assets.set(id, rec); return; }
    await asPromise(this._store('assets', 'readwrite').put(rec));
  }

  async getAsset(id) {
    if (!this.db) return this.mem.assets.get(id) || null;
    return (await asPromise(this._store('assets').get(id))) || null;
  }

  async deleteAsset(id) {
    if (!this.db) { this.mem.assets.delete(id); return; }
    await asPromise(this._store('assets', 'readwrite').delete(id));
  }

  async getProgress() {
    if (!this.db) return this.mem.progress.get('main') || null;
    return (await asPromise(this._store('progress').get('main'))) || null;
  }

  async saveProgress(snap) {
    if (!this.db) { this.mem.progress.set('main', snap); return; }
    await asPromise(this._store('progress', 'readwrite').put(snap, 'main'));
  }

  async clearProgress() {
    if (!this.db) { this.mem.progress.delete('main'); return; }
    await asPromise(this._store('progress', 'readwrite').delete('main'));
  }

  async wipeAll() {
    this.mem.config.clear();
    this.mem.assets.clear();
    this.mem.progress.clear();
    if (!this.db) return;
    await asPromise(this._store('config', 'readwrite').clear());
    await asPromise(this._store('assets', 'readwrite').clear());
    await asPromise(this._store('progress', 'readwrite').clear());
  }

  async storageInfo() {
    let text = this.db ? 'IndexedDB: khả dụng' : 'Bộ nhớ tạm (không lưu lâu dài)';
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        text += ' — đang dùng ' + (est.usage / 1048576).toFixed(1) + ' MB';
      }
    } catch (e) { /* bỏ qua */ }
    return text;
  }
}
