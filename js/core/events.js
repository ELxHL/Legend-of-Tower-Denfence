// Event Bus trung tâm.
// Moi he thong (gameplay, UI, editor) giao tiep qua day de tranh phu thuoc vong.
export class EventBus {
  constructor() {
    this._map = new Map();
  }

  on(ev, fn) {
    if (!this._map.has(ev)) this._map.set(ev, new Set());
    this._map.get(ev).add(fn);
    return () => this.off(ev, fn); // tra ve ham huy lang nghe
  }

  off(ev, fn) {
    const s = this._map.get(ev);
    if (s) s.delete(fn);
  }

  once(ev, fn) {
    const off = this.on(ev, (data) => { off(); fn(data); });
    return off;
  }

  emit(ev, data) {
    const s = this._map.get(ev);
    if (!s) return;
    for (const fn of [...s]) {
      try { fn(data); }
      catch (err) { console.error('[EventBus] loi trong listener "' + ev + '":', err); }
    }
  }

  clear() { this._map.clear(); }
}
